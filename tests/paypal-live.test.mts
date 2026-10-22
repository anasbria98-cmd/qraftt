import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { PayPalSandboxClient } from "../lib/paypal/client.ts";
import { payPalEnvironment, validApprovalUrl } from "../lib/paypal/environment.ts";
import { currentPayPalPlanIds, resolveProPlanId } from "../lib/paypal/plans.ts";

test("Live rejects Sandbox overrides, yearly checkout and unknown environments", () => {
  const env = { PAYPAL_ENV: "live", PAYPAL_PRO_MONTHLY_PLAN_ID: "P-LIVE", PAYPAL_PRO_YEARLY_PLAN_ID: "P-OLD", PAYPAL_SANDBOX_TEST_PLAN_ID: "P-TEST", PAYPAL_SANDBOX_PRODUCTION_TEST: "true" };
  assert.equal(resolveProPlanId("monthly", env), "P-LIVE");
  assert.throws(() => resolveProPlanId("yearly", env));
  assert.deepEqual(currentPayPalPlanIds(env), ["P-LIVE"]);
  assert.deepEqual(currentPayPalPlanIds({ ...env, PAYPAL_ENV: "invalid" }), []);
  assert.throws(() => payPalEnvironment(undefined));
  assert.throws(() => payPalEnvironment("production"));
  assert.equal(validApprovalUrl("https://www.paypal.com/checkout", "live"), true);
  for (const url of ["https://www.sandbox.paypal.com/checkout", "https://www.paypal.com.evil.test/", "http://www.paypal.com/", "https://name:secret@www.paypal.com/"]) assert.equal(validApprovalUrl(url, "live"), false);
  assert.equal(validApprovalUrl("https://www.paypal.com/checkout", "sandbox"), false);
});

const plan = { status: "ACTIVE", billing_cycles: [{ tenure_type: "REGULAR", total_cycles: 0,
  frequency: { interval_unit: "MONTH", interval_count: 1 }, pricing_scheme: { fixed_price: { currency_code: "USD", value: "2.00" } } }] };

test("Live subscription creation checks the price and uses only Live endpoints", async () => {
  const urls: string[] = [];
  const client = new PayPalSandboxClient({ environment: "live", clientId: "live", clientSecret: "hidden", fetch: async (input) => {
    const url = String(input); urls.push(url);
    assert.ok(url.startsWith("https://api-m.paypal.com/"));
    return Response.json(url.endsWith("token") ? { access_token: "token" } : url.includes("/plans/") ? plan : { id: "I-LIVE", status: "APPROVAL_PENDING", links: [{ rel: "approve", href: "https://www.paypal.com/checkout" }] });
  } });
  await client.createSubscription({ planId: "P-LIVE", returnUrl: "https://www.qraftt.com/pricing?paypal=approved", cancelUrl: "https://www.qraftt.com/pricing?paypal=cancelled" });
  assert.ok(urls.some(url => url.endsWith("/plans/P-LIVE")));
  assert.ok(urls.at(-1)?.endsWith("/billing/subscriptions"));
});

test("Live fails closed before creating subscriptions for wrong prices, fees or trials", async () => {
  for (const invalid of [
    { ...plan, status: "INACTIVE" },
    { ...plan, payment_preferences: { setup_fee: { value: "1" } } },
    { ...plan, taxes: { percentage: "10" } },
    { ...plan, billing_cycles: [...plan.billing_cycles, plan.billing_cycles[0]] },
    { ...plan, billing_cycles: [{ ...plan.billing_cycles[0], pricing_scheme: { fixed_price: { currency_code: "USD", value: "1" } } }] },
  ]) {
    const client = new PayPalSandboxClient({ environment: "live", clientId: "live", clientSecret: "hidden", fetch: async input => {
      const url = String(input);
      assert.ok(!url.endsWith("/billing/subscriptions"));
      return Response.json(url.endsWith("token") ? { access_token: "token" } : invalid);
    } });
    await assert.rejects(client.createSubscription({ planId: "P-LIVE", returnUrl: "https://www.qraftt.com/pricing", cancelUrl: "https://www.qraftt.com/pricing" }));
  }
});

test("every entitlement, claim, cleanup and dashboard boundary isolates environment-specific plans", () => {
  for (const path of ["lib/billing/account-store.ts", "lib/paypal/guest-checkout.ts", "lib/paypal/abandoned-checkout.ts", "app/api/paypal/cleanup/route.ts", "app/api/paypal/webhook/route.ts", "lib/account/dashboard.ts"]) {
    assert.match(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"), /currentPayPalPlanIds\(process.env\)/);
  }
});
