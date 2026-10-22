import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { adminClient } from "@/lib/supabase/server";
import { currentPayPalPlanIds } from "@/lib/paypal/plans";

export const pendingCheckoutCookie = "qraftt_paypal_checkout";
export const checkoutSecretHash = (secret: string) => createHash("sha256").update(secret).digest("hex");

export async function pendingCheckout() {
  const secret = (await cookies()).get(pendingCheckoutCookie)?.value;
  if (!secret || !/^[a-f0-9]{64}$/.test(secret)) return null;
  const { data, error } = await adminClient().from("pending_paypal_checkouts").select("*").eq("secret_hash", checkoutSecretHash(secret)).maybeSingle();
  if (error) {
    console.error("Pending checkout read failed.", { code: error.code });
    throw new Error("Pending checkout storage unavailable.");
  }
  return data && currentPayPalPlanIds(process.env).includes(data.provider_plan_id) ? data : null;
}

export async function prepareGuestCheckout(planId: string, interval: string) {
  const existing = await pendingCheckout();
  if (existing && existing.state === "open" && Date.parse(existing.expires_at) > Date.now()) {
    if (existing.provider_plan_id !== planId || existing.billing_interval !== interval) throw new Error("Finish or cancel your existing checkout before choosing another plan.");
    return existing;
  }
  const id = randomUUID();
  const secret = randomBytes(32).toString("hex");
  const { data, error } = await adminClient().from("pending_paypal_checkouts").insert({ id, secret_hash: checkoutSecretHash(secret), provider_plan_id: planId, billing_interval: interval }).select().single();
  if (error) {
    console.error("Pending checkout insert failed.", { code: error.code });
    throw new Error("Could not prepare checkout.");
  }
  (await cookies()).set(pendingCheckoutCookie, secret, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 7 * 86400 });
  return data;
}
