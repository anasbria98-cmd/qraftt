import { NextResponse } from "next/server";
import { currentPayPalPlanIds } from "@/lib/paypal/plans";
import { parsePayPalSubscriptionEvent } from "@/lib/paypal/events";
import { getBillingStore } from "@/lib/billing/server";
import { adminClient } from "@/lib/supabase/server";
import { cancelUnclaimedCheckout } from "@/lib/paypal/abandoned-checkout";
import {
  getPayPalClient,
  getPayPalWebhookId,
} from "@/lib/paypal/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const requiredHeaders = [
  "paypal-auth-algo",
  "paypal-cert-url",
  "paypal-transmission-id",
  "paypal-transmission-sig",
  "paypal-transmission-time",
] as const;

function getRequiredHeader(request: Request, name: (typeof requiredHeaders)[number]) {
  return request.headers.get(name)?.trim() || null;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 1_000_000) {
    return NextResponse.json({ error: "Webhook payload is too large." }, { status: 413 });
  }

  let event: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 1_000_000) return NextResponse.json({ error: "Webhook payload is too large." }, { status: 413 });
    const payload = JSON.parse(raw);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Invalid webhook payload.");
    }
    event = payload as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }

  const headers = Object.fromEntries(
    requiredHeaders.map((name) => [name, getRequiredHeader(request, name)]),
  ) as Record<(typeof requiredHeaders)[number], string | null>;
  if (Object.values(headers).some((value) => value === null)) {
    return NextResponse.json({ error: "Missing PayPal webhook headers." }, { status: 400 });
  }

  try {
    const verified = await getPayPalClient().verifyWebhookSignature({
      authAlgo: headers["paypal-auth-algo"]!,
      certUrl: headers["paypal-cert-url"]!,
      event,
      transmissionId: headers["paypal-transmission-id"]!,
      transmissionSignature: headers["paypal-transmission-sig"]!,
      transmissionTime: headers["paypal-transmission-time"]!,
      webhookId: getPayPalWebhookId(),
    });
    if (!verified) {
      return NextResponse.json({ error: "Invalid PayPal webhook signature." }, { status: 401 });
    }

    const subscriptionEvent = parsePayPalSubscriptionEvent(event);
    if (subscriptionEvent.state) {
      if (!subscriptionEvent.subscriptionId || !subscriptionEvent.eventId || typeof event.create_time !== "string" || !Number.isFinite(Date.parse(event.create_time))) {
        return NextResponse.json({ error: "Invalid subscription event." }, { status: 400 });
      }
      const db = getBillingStore();
      let stored = await db.subscription(subscriptionEvent.subscriptionId);
      if (!stored) {
        const { data: pending, error } = await adminClient().from("pending_paypal_checkouts").select("id,state,expires_at,claimed_by").in("provider_plan_id", currentPayPalPlanIds(process.env)).eq("subscription_id", subscriptionEvent.subscriptionId).maybeSingle();
        if (error) throw new Error("Pending checkout unavailable.");
        if (pending && !pending.claimed_by && (pending.state !== "open" || Date.parse(pending.expires_at) <= Date.now() || subscriptionEvent.state !== "activated")) await cancelUnclaimedCheckout(pending.id);
        // A claim may have won the row lock while this webhook was arriving.
        stored = await db.subscription(subscriptionEvent.subscriptionId);
      }
      if (stored) {
        const actual = await getPayPalClient().getSubscription(subscriptionEvent.subscriptionId);
        if (actual.planId !== stored.plan_id || actual.customerId !== stored.paypal_custom_id) throw new Error("Subscription mismatch.");
        await db.updateSubscription(actual.id,
          subscriptionEvent.state === "payment_failed" ? "PAYMENT_FAILED" : actual.status,
          actual.email, { id: subscriptionEvent.eventId, time: new Date(event.create_time).toISOString() }, actual.period);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook verification failed.", { errorType: error instanceof Error ? error.name : "Unknown" });
    return NextResponse.json(
      { error: "PayPal webhook verification is unavailable." },
      { status: 503 },
    );
  }
}
