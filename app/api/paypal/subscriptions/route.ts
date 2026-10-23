import { getPayPalClient, getProPlanId } from "@/lib/paypal/server";
import { isMissingPayPalSubscription, PayPalApiError } from "@/lib/paypal/client";
import { billingCustomer, getBillingStore, sameOrigin } from "@/lib/billing/server";
import { currentUser } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/server";
import { pendingCheckout, prepareGuestCheckout } from "@/lib/paypal/guest-checkout";
import { payPalEnvironment, validApprovalUrl } from "@/lib/paypal/environment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  let stage = "authenticate";
  try {
    const user = await currentUser();
    const { interval } = await request.json();
    if (interval !== "monthly" && interval !== "yearly") return Response.json({ error: "Invalid billing interval." }, { status: 400 });
    stage = "resolve_plan";
    const planId = getProPlanId(interval);
    stage = "read_pending_checkout";
    const existingPending = await pendingCheckout();
    stage = "prepare_checkout";
    const pending = !user?.email_confirmed_at || (existingPending && !existingPending.claimed_by && existingPending.state === "open") ? await prepareGuestCheckout(planId, interval) : null;
    const customerId = pending ? `checkout:${pending.id}` : await billingCustomer();
    const db = getBillingStore();
    if (!pending && (await db.entitlement(customerId)).pro) return Response.json({ error: "Pro is already active." }, { status: 409 });
    const origin = new URL(request.url).origin;
    if (pending?.subscription_id) {
      stage = "verify_existing_subscription";
      let actual;
      try {
        actual = await getPayPalClient().getSubscription(pending.subscription_id);
      } catch (error) {
        if (!isMissingPayPalSubscription(error)) throw error;
        // Do not silently create another subscription in this request.
        console.warn("Stale PayPal checkout is unavailable.", { paypalHttpStatus: 404 });
        const closed = await adminClient().from("pending_paypal_checkouts").update({ state: "cancelled" }).eq("id", pending.id).eq("state", "open").is("claimed_by", null).select("id").maybeSingle();
        if (closed.error || !closed.data) throw new Error("Could not close stale checkout.");
        return Response.json({ error: "PayPal no longer has this earlier Sandbox checkout. Its record was retained. Click Upgrade again to start a fresh checkout; no new subscription was created by this request." }, { status: 409, headers: { "Cache-Control": "no-store" } });
      }
      if (actual.customerId !== `checkout:${pending.id}` || actual.planId !== pending.provider_plan_id) throw new Error("Checkout mismatch.");
      if (["ACTIVE", "APPROVED"].includes(actual.status)) return Response.json({ id: actual.id, status: actual.status, approvalUrl: `${origin}/pricing?paypal=approved` }, { status: 201, headers: { "Cache-Control": "no-store" } });
      if (actual.status !== "APPROVAL_PENDING") {
        await adminClient().from("pending_paypal_checkouts").update({ state: "cancelled" }).eq("id", pending.id).is("claimed_by", null);
        return Response.json({ error: "The previous checkout is no longer active. Click Upgrade again to start a new checkout." }, { status: 409 });
      }
    }
    stage = "create_paypal_subscription";
    const subscription = await getPayPalClient().createSubscription({
      planId, customerId, interval,
      cancelUrl: `${origin}/pricing?paypal=cancelled`,
      returnUrl: `${origin}/pricing?paypal=approved`,
    });
    const approvalUrl = subscription.approvalUrl ? new URL(subscription.approvalUrl) : null;
    if (!approvalUrl || !validApprovalUrl(approvalUrl.href, payPalEnvironment(process.env.PAYPAL_ENV))) throw new Error("Invalid PayPal approval URL.");
    stage = "save_subscription";
    if (pending) {
      const { error } = await adminClient().from("pending_paypal_checkouts").update({ subscription_id: subscription.id }).eq("id", pending.id).eq("state", "open");
      if (error) throw new Error("Could not retain pending checkout.");
    } else await db.saveSubscription(subscription.id, customerId, planId, interval, subscription.status);
    return Response.json(subscription, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Never log credentials, tokens, request bodies, email, or browser proof.
    console.error("PayPal subscription setup failed.", {
      stage,
      errorType: error instanceof Error ? error.name : "Unknown",
      paypalHttpStatus: error instanceof PayPalApiError ? error.status : undefined,
      sandboxConfigured: process.env.PAYPAL_ENV === "sandbox",
      clientIdPresent: Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim()),
      clientSecretPresent: Boolean(process.env.PAYPAL_CLIENT_SECRET?.trim()),
    });
    return Response.json(
      { error: "PayPal subscription setup is unavailable. Please retry shortly or contact support@qraftt.com." },
      { status: 503 },
    );
  }
}
