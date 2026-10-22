import "server-only";
import { currentPayPalPlanIds } from "@/lib/paypal/plans";
import { adminClient } from "@/lib/supabase/server";
import { getPayPalClient } from "@/lib/paypal/server";
import { isMissingPayPalSubscription } from "@/lib/paypal/client";

export async function cancelUnclaimedCheckout(id: string) {
  const db = adminClient();
  // Conditional update serializes against the claim RPC row lock. Never cancel a claimed subscription.
  const { data, error } = await db.from("pending_paypal_checkouts").update({ state: "cancelling" }).eq("id", id).in("provider_plan_id", currentPayPalPlanIds(process.env)).is("claimed_by", null).select().maybeSingle();
  if (error) throw new Error("Could not lock abandoned checkout.");
  if (!data) return;
  if (data.subscription_id) {
    const paypal = getPayPalClient();
    let actual;
    try { actual = await paypal.getSubscription(data.subscription_id); }
    catch (error) {
      if (!isMissingPayPalSubscription(error)) throw error;
      // A missing remote checkout is already unavailable; retain the local audit record.
      console.info("Missing PayPal checkout closed during cleanup.", { paypalHttpStatus: 404 });
    }
    if (actual) {
      if (actual.customerId !== `checkout:${data.id}` || actual.planId !== data.provider_plan_id) throw new Error("Checkout mismatch.");
      if (["ACTIVE", "APPROVED", "SUSPENDED", "PAYMENT_FAILED"].includes(actual.status)) await paypal.cancelSubscription(actual.id);
    }
  }
  const result = await db.from("pending_paypal_checkouts").update({ state: "cancelled" }).eq("id", id).is("claimed_by", null);
  if (result.error) throw new Error("Could not retain cancellation.");
}
