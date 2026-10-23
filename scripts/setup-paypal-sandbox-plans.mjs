// Sandbox catalog setup only: never creates subscriptions, payments or webhooks.
if (process.env.PAYPAL_ENV !== "sandbox") throw new Error("Sandbox mode is required.");
const origin = "https://api-m.sandbox.paypal.com";
const client = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();
if (!client || !secret) throw new Error("Sandbox credentials are missing.");
const tokenResponse = await fetch(`${origin}/v1/oauth2/token`, {
  method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${client}:${secret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
  body: "grant_type=client_credentials", signal: AbortSignal.timeout(20000),
});
const token = await tokenResponse.json();
if (!tokenResponse.ok || !token.access_token) throw new Error(`Sandbox OAuth HTTP ${tokenResponse.status}`);
async function api(path, method = "GET", body, requestId) {
  const response = await fetch(`${origin}${path}`, { method,
    headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json", Prefer: "return=representation", ...(requestId ? { "PayPal-Request-Id": requestId } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Sandbox ${method} ${path} HTTP ${response.status}`);
  return response.json();
}
const desired = [{ interval: "monthly", unit: "MONTH", price: "4.99" }, { interval: "yearly", unit: "YEAR", price: "19.99" }];
function matches(plan, target) {
  const cycles = plan.billing_cycles ?? [];
  const cycle = cycles[0];
  return plan.status === "ACTIVE" && cycles.length === 1 && cycle.tenure_type === "REGULAR"
    && cycle.total_cycles === 0 && cycle.frequency?.interval_unit === target.unit
    && cycle.frequency?.interval_count === 1 && cycle.pricing_scheme?.fixed_price?.currency_code === "USD"
    && Number(cycle.pricing_scheme.fixed_price.value) === Number(target.price)
    && Number(plan.payment_preferences?.setup_fee?.value ?? 0) === 0
    && Number(plan.taxes?.percentage ?? 0) === 0;
}
let product;
for (const target of desired) {
  const name = `Qraftt Pro ${target.interval} USD ${target.price} Sandbox Review`;
  let plan;
  // Fully inspect matching catalog entries; never mutate an existing plan.
  for (let page = 1; page <= 20 && !plan; page++) {
    const catalog = await api(`/v1/billing/plans?page_size=20&page=${page}&total_required=true`);
    for (const candidate of catalog.plans ?? []) {
      if (candidate.name !== name) continue;
      const details = await api(`/v1/billing/plans/${candidate.id}`);
      if (matches(details, target)) { plan = details; break; }
    }
    if (!catalog.links?.some(link => link.rel === "next")) break;
  }
  if (!plan) {
    product ??= await api("/v1/catalogs/products", "POST", { name: "Qraftt Pro Sandbox Review", description: "Sandbox-only Qraftt Pro plan verification", type: "SERVICE", category: "SOFTWARE" }, "qraftt-sandbox-product-20261022-v1");
    plan = await api("/v1/billing/plans", "POST", {
      product_id: product.id, name, status: "ACTIVE",
      billing_cycles: [{ frequency: { interval_unit: target.unit, interval_count: 1 }, tenure_type: "REGULAR", sequence: 1, total_cycles: 0, pricing_scheme: { fixed_price: { value: target.price, currency_code: "USD" } } }],
      payment_preferences: { auto_bill_outstanding: true, setup_fee: { value: "0", currency_code: "USD" }, setup_fee_failure_action: "CANCEL", payment_failure_threshold: 3 },
    }, `qraftt-sandbox-${target.interval}-${target.price}-20261022-v1`);
  }
  const verified = await api(`/v1/billing/plans/${plan.id}`);
  if (!matches(verified, target)) throw new Error(`Sandbox ${target.interval} plan failed verification.`);
  console.log(JSON.stringify({ environment: "sandbox", interval: target.interval, id: verified.id, status: verified.status, price: verified.billing_cycles[0].pricing_scheme.fixed_price, frequency: verified.billing_cycles[0].frequency, setupFee: verified.payment_preferences?.setup_fee, verified: true }));
}
