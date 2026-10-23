// Read-only provider inspection. Never creates/changes plans or subscriptions.
// Run: node --env-file=.env.local scripts/inspect-paypal-plans.mjs
const mode = process.env.PAYPAL_ENV;
if (!["live", "sandbox"].includes(mode)) throw new Error("Invalid PayPal environment.");
const origin = mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
if (!clientId || !secret) throw new Error("PayPal credentials are unavailable.");
const tokenResponse = await fetch(`${origin}/v1/oauth2/token`, {
  method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: "grant_type=client_credentials", signal: AbortSignal.timeout(15000),
});
const token = await tokenResponse.json();
if (!tokenResponse.ok || !token.access_token) throw new Error(`PayPal authentication failed: HTTP ${tokenResponse.status}.`);
for (const interval of ["monthly", "yearly"]) {
  const id = process.env[interval === "monthly" ? "PAYPAL_PRO_MONTHLY_PLAN_ID" : "PAYPAL_PRO_YEARLY_PLAN_ID"]?.trim();
  if (!id || !/^P-[A-Z0-9]+$/.test(id)) { console.log(JSON.stringify({ mode, interval, configured: false })); continue; }
  const response = await fetch(`${origin}/v1/billing/plans/${id}`, { headers: { Authorization: `Bearer ${token.access_token}`, Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) { console.log(JSON.stringify({ mode, interval, id, httpStatus: response.status, verified: false })); continue; }
  const plan = await response.json();
  // Never print tokens, secrets, payer details or raw provider responses.
  console.log(JSON.stringify({ mode, interval, id, status: plan.status,
    cycles: plan.billing_cycles?.map(cycle => ({ tenure: cycle.tenure_type, frequency: cycle.frequency, price: cycle.pricing_scheme?.fixed_price, totalCycles: cycle.total_cycles })),
    setupFee: plan.payment_preferences?.setup_fee ?? null, taxes: plan.taxes ?? null,
  }));
}
