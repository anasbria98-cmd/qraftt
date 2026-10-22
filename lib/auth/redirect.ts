export function safeReturnPath(value: unknown, fallback = "/dashboard") {
  return typeof value === "string" && ["/dashboard", "/account", "/pricing", "/reset-password", "/pricing?checkout=monthly", "/pricing?checkout=yearly", "/pricing?paypal=approved"].includes(value) ? value : fallback;
}

export function checkoutAuthReturnPath(value: unknown, pending: { state: string; claimed_by: string | null; subscription_id: string | null; expires_at: string } | null, now = Date.now()) {
  const next = safeReturnPath(value);
  // Navigation is not entitlement: confirmation still verifies PayPal and browser ownership.
  return next !== "/reset-password" && pending?.state === "open" && !pending.claimed_by && pending.subscription_id && Date.parse(pending.expires_at) > now
    ? "/pricing?paypal=approved" : next;
}
