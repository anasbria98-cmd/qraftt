import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { safeReturnPath } from "../lib/auth/redirect.ts";
import { PayPalSandboxClient, PayPalApiError, isMissingPayPalSubscription } from "../lib/paypal/client.ts";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("only subscription lookup 404 is a stale checkout, never OAuth, credentials or outages", async () => {
  for (const status of [401, 403, 429, 500, 503]) assert.equal(isMissingPayPalSubscription(new PayPalApiError("PayPal Sandbox subscription verification failed.", status)), false);
  assert.equal(isMissingPayPalSubscription(new PayPalApiError("PayPal Sandbox OAuth failed.", 404)), false);
  assert.equal(isMissingPayPalSubscription(new Error("network error")), false);
  let calls = 0;
  const client = new PayPalSandboxClient({ clientId: "test", clientSecret: "secret", fetch: async () => ++calls === 1 ? Response.json({access_token: "test"}) : Response.json({name: "RESOURCE_NOT_FOUND"}, {status:404}) });
  await assert.rejects(client.getSubscription("I-STALE"), error => isMissingPayPalSubscription(error));
  const route = source("app/api/paypal/subscriptions/route.ts");
  assert.match(route, /status: 410/);
  assert.doesNotMatch(route, /getPayPalClient|createSubscription/);
});

test("guest checkout storage is private, expiring, single-claim and transactionally grants entitlement", () => {
  const sql = source("supabase/migrations/202610180002_guest_checkout.sql");
  assert.match(sql, /enable row level security/);
  assert.match(sql, /revoke all on public.pending_paypal_checkouts from public,anon,authenticated/);
  assert.match(sql, /where id=p_checkout for update/);
  for (const guard of ["pending.secret_hash <> p_secret_hash", "pending.claimed_by <> p_user", "pending.expires_at <= now()", "p_status <> 'active'"]) assert.ok(sql.includes(guard));
  assert.match(sql, /perform public.qraftt_apply_verified_subscription/);
  assert.match(sql, /revoke all on function public.qraftt_claim_paypal_checkout[\s\S]*from public,anon,authenticated/);
});

test("retired confirmation cannot claim a subscription or grant paid access", () => {
 const code = source("app/api/paypal/confirm/route.ts");
 assert.match(code, /status: 410/); assert.doesNotMatch(code, /getPayPalClient|qraftt_claim/);
 assert.equal(safeReturnPath("/pricing?paypal=approved"), "/dashboard");
});

test("abandonment cannot cancel claimed subscriptions and cleanup fails closed without its secret", () => {
  const code = source("lib/paypal/abandoned-checkout.ts");
  assert.match(code, /\.is\("claimed_by", null\)\.select\(\)\.maybeSingle\(\)/);
  assert.match(code, /if \(!data\) return/);
  assert.match(source("app/api/paypal/cleanup/route.ts"), /status: 410/);
  assert.match(source("app/api/paypal/abandon/route.ts"), /status: 410/);
});

test("Sandbox cancellation uses the server API and never a live origin", async () => {
  const calls: { url: string; method?: string }[] = [];
  const client = new PayPalSandboxClient({ clientId: "test", clientSecret: "secret", fetch: async (input, init) => {
    calls.push({ url: String(input), method: init?.method });
    return calls.length === 1 ? Response.json({ access_token: "test" }) : new Response(null, { status: 204 });
  } });
  await client.cancelSubscription("I-QATEST");
  assert.equal(calls[1].url, "https://api-m.sandbox.paypal.com/v1/billing/subscriptions/I-QATEST/cancel");
  assert.equal(calls[1].method, "POST");
  await assert.rejects(client.cancelSubscription("invalid"));
});
