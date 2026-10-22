import { getPayPalClient, getProPlanId } from "@/lib/paypal/server";
import { billingCustomer, getBillingStore, sameOrigin } from "@/lib/billing/server";
import { adminClient, currentUser } from "@/lib/supabase/server";
import { pendingCheckout } from "@/lib/paypal/guest-checkout";
import { cancelUnclaimedCheckout } from "@/lib/paypal/abandoned-checkout";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    const observedAt = new Date().toISOString();
    const body = await request.json();
    const pending = await pendingCheckout();
    const id = body.id ?? pending?.subscription_id;
    if (typeof id !== "string" || !/^I-[A-Z0-9]+$/.test(id)) return Response.json({ error: "Invalid subscription." }, { status: 400 });
    if (pending && pending.subscription_id === id && !pending.claimed_by) {
      if (pending.state !== "open" || Date.parse(pending.expires_at) <= Date.now()) {
        await cancelUnclaimedCheckout(pending.id);
        return Response.json({ error: "This unclaimed checkout has expired or was cancelled. Start a new checkout. If you lost this browser session, contact support@qraftt.com; never start another payment to recover it." }, { status: 410 });
      }
      const actual = await getPayPalClient().getSubscription(id);
      if (actual.customerId !== `checkout:${pending.id}` || actual.planId !== pending.provider_plan_id) throw new Error("Checkout mismatch.");
      if (actual.status !== "ACTIVE") return Response.json({ id, pro: false, status: actual.status, error: actual.status === "APPROVAL_PENDING" || actual.status === "APPROVED" ? "PayPal approval is not active yet. Retry verification shortly." : "This subscription is not active. Contact support if needed." }, { status: 409 });
      const user = await currentUser();
      if (!user?.email_confirmed_at || Date.parse(user.last_sign_in_at ?? "") < Date.parse(pending.created_at) || !user.last_sign_in_at) {
        return Response.json({ login: true, approved: true, error: "PayPal approval verified. Sign up or log in now to link Pro to your account in this browser." }, { status: 401, headers: { "Cache-Control": "no-store" } });
      }
      const { error } = await adminClient().rpc("qraftt_claim_paypal_checkout", { p_checkout: pending.id, p_secret_hash: pending.secret_hash, p_user: user.id, p_status: actual.status.toLowerCase(), p_observed_at: observedAt, p_period_start: actual.period.start ?? null, p_period_end: actual.period.end ?? null });
      if (error) return Response.json({ error: "Could not link this checkout. It may already be claimed, expired, or your account may already have Pro. Contact support; do not pay again." }, { status: 409 });
      return Response.json({ id, ...await getBillingStore().entitlement(user.id) }, { headers: { "Cache-Control": "no-store" } });
    }
    if (!(await currentUser())?.email_confirmed_at) return Response.json({ error: "No account-linked subscription or browser checkout proof found. Contact support if you already approved payment." }, { status: 404 });
    const customer = await billingCustomer();
    const db = getBillingStore();
    const stored = await db.subscription(id);
    if (customer.startsWith("guest:") || !stored || stored.customer_id !== customer) return Response.json({ error: "Subscription not found." }, { status: 404 });
    const subscription = await getPayPalClient().getSubscription(id);
    if (subscription.customerId !== stored.paypal_custom_id || subscription.planId !== stored.plan_id || (!stored.paypal_custom_id.startsWith("checkout:") && subscription.planId !== getProPlanId(stored.interval as "monthly" | "yearly"))) throw new Error("Subscription mismatch.");
    await db.updateSubscription(id, subscription.status, subscription.email, undefined, subscription.period, observedAt);
    return Response.json({ id: subscription.id, ...await db.entitlement(customer) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not verify PayPal approval. Please retry verification; do not pay again." }, { status: 503 });
  }
}
