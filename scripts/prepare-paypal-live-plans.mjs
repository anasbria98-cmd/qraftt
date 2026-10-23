// Explicit preparation only. No subscriptions, payments, webhooks or env changes.
// node --env-file=.env.local scripts/prepare-paypal-live-plans.mjs --prepare-live-plans
if (process.env.PAYPAL_ENV !== "live" || !process.argv.includes("--prepare-live-plans")) throw new Error("Explicit Live catalog preparation is required.");
const origin = "https://api-m.paypal.com";
const legacyId = "P-8G5554222G795842XNLLK43Y";
const client = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
if (!client || !secret) throw new Error("Live app credentials are missing.");
const auth = await fetch(`${origin}/v1/oauth2/token`, {
  method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${client}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: "grant_type=client_credentials", signal: AbortSignal.timeout(20000),
});
const token = await auth.json();
if (!auth.ok || !token.access_token) throw new Error(`Live OAuth failed: HTTP ${auth.status}`);
async function api(path, method = "GET", body, requestId) {
  // Hard boundary: no API calls capable of touching existing plans or agreements.
  if (!/^\/v1\/billing\/plans(?:\?|\/P-[A-Z0-9]+$|$)/.test(path)
    || !["GET", "POST"].includes(method) || (method === "POST" && path !== "/v1/billing/plans")) throw new Error("Catalog-only operation required.");
  const response = await fetch(`${origin}${path}`, {
    method, headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json", Prefer: "return=representation", ...(requestId ? { "PayPal-Request-Id": requestId } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Live catalog ${method} failed: HTTP ${response.status}`);
  return response.json();
}
function matches(plan, unit, price) {
  const cycles = plan.billing_cycles ?? [], cycle = cycles[0];
  return plan.status === "ACTIVE" && cycles.length === 1 && cycle.tenure_type === "REGULAR"
    && cycle.total_cycles === 0 && cycle.frequency?.interval_unit === unit && cycle.frequency?.interval_count === 1
    && cycle.pricing_scheme?.fixed_price?.currency_code === "USD" && Number(cycle.pricing_scheme.fixed_price.value) === Number(price)
    && Number(plan.payment_preferences?.setup_fee?.value ?? 0) === 0 && Number(plan.taxes?.percentage ?? 0) === 0;
}
const legacy = await api(`/v1/billing/plans/${legacyId}`);
if (!matches(legacy, "MONTH", "2.00") || !legacy.product_id) throw new Error("Legacy plan no longer matches the verified baseline; stop for review.");
for (const target of [{ interval: "monthly", unit: "MONTH", price: "4.99" }, { interval: "yearly", unit: "YEAR", price: "19.99" }]) {
  const name = `Qraftt Pro ${target.interval} USD ${target.price} Live`;
  let plan;
  for (let page = 1; page <= 50 && !plan; page++) {
    const catalog = await api(`/v1/billing/plans?page_size=20&page=${page}&total_required=true`);
    for (const entry of catalog.plans ?? []) {
      if (entry.name !== name) continue;
      const candidate = await api(`/v1/billing/plans/${entry.id}`);
      if (candidate.product_id === legacy.product_id && matches(candidate, target.unit, target.price)) { plan = candidate; break; }
    }
    if (!(catalog.links ?? []).some(link => link.rel === "next")) break;
  }
  if (!plan) plan = await api("/v1/billing/plans", "POST", {
    product_id: legacy.product_id, name, status: "ACTIVE",
    billing_cycles: [{ tenure_type: "REGULAR", sequence: 1, total_cycles: 0, frequency: { interval_unit: target.unit, interval_count: 1 }, pricing_scheme: { fixed_price: { currency_code: "USD", value: target.price } } }],
    payment_preferences: { auto_bill_outstanding: true, setup_fee: { currency_code: "USD", value: "0" }, setup_fee_failure_action: "CANCEL", payment_failure_threshold: 3 },
  }, `qraftt-live-${target.interval}-${target.price}-20261023-v1`);
  const verified = await api(`/v1/billing/plans/${plan.id}`);
  if (verified.product_id !== legacy.product_id || !matches(verified, target.unit, target.price)) throw new Error("Created plan failed read-back verification.");
  console.log(JSON.stringify({ environment: "live", interval: target.interval, id: verified.id, status: verified.status, price: verified.billing_cycles[0].pricing_scheme.fixed_price, frequency: verified.billing_cycles[0].frequency, setupFee: verified.payment_preferences?.setup_fee, verified: true }));
}
const after = await api(`/v1/billing/plans/${legacyId}`);
if (JSON.stringify(after) !== JSON.stringify(legacy)) throw new Error("Legacy plan metadata changed; review before proceeding.");
console.log(JSON.stringify({ legacyPlanId: legacyId, legacyUnchanged: true, legacyPrice: "USD 2.00/month", checkoutConfigurationChanged: false }));
