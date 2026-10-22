import assert from "node:assert/strict";
import test from "node:test";
import { legalPages } from "../lib/content/legal-pages.ts";
import { componentFixture } from "./helpers/render-component.mjs";

test("privacy and cookie disclosures match render API, accounts, storage and consent initialization", () => {
  const privacy = JSON.stringify(legalPages["privacy-policy"]);
  const cookies = JSON.stringify(legalPages["cookie-policy"]);
  for (const value of ["/api/qr/render", "WiFi credentials", "Supabase", "Resend", "PayPal", "cookieless", "Vercel Analytics"]) assert.ok(privacy.includes(value), value);
  for (const value of ["qraftt_customer", "qraftt_paypal_checkout", "qraftt_checkout_interval", "qraftt_auth_return", "qraftt_language_v1", "qraft_optional_consent_v1", "seven days", "24 hours", "one year"]) assert.ok(cookies.includes(value), value);
  assert.doesNotMatch(privacy + cookies, /not intentionally sent to a Qraftt application server|no login session|does not include a subscription|scripts load only after|render the downloadable code locally/);
  assert.equal(legalPages["privacy-policy"].updatedAt, "2026-10-22");
  assert.equal(legalPages["cookie-policy"].updatedAt, "2026-10-22");
  assert.equal(legalPages.terms.updatedAt, "2026-08-09", "unrelated Terms are not rewritten");
});

// Real route handlers, isolated dependencies: never loads environment credentials,
// contacts PayPal/Supabase, opens a payment, or modifies a production record.
function isolatedBilling() {
  const pending = { id: "test-pending", state: "open", subscription_id: "I-TESTONLY", provider_plan_id: "P-TESTONLY", secret_hash: "test-proof-hash", claimed_by: null as string | null, created_at: "2026-01-01T00:00:00Z", expires_at: "2099-01-01T00:00:00Z" };
  let user: null | { id: string; email_confirmed_at: string; last_sign_in_at: string } = null;
  let actual = { id: "I-TESTONLY", planId: "P-TESTONLY", customerId: "checkout:test-pending", status: "ACTIVE", period: { start: "2026-01-01T00:00:00Z", end: "2026-02-01T00:00:00Z" } };
  let stored: null | { customer_id: string; paypal_custom_id: string; plan_id: string; interval: string } = null;
  let state = "FREE", validSignature = true, claims = 0, updates = 0, proof = true;
  const seen = new Set<string>();
  const overrides = {
    "@/lib/billing/server": {
      sameOrigin: (r: Request) => r.headers.get("origin") === new URL(r.url).origin,
      billingCustomer: async () => user?.id ?? "guest:test-only",
      getBillingStore: () => ({
        subscription: async () => stored,
        entitlement: async () => ({ pro: state === "ACTIVE", status: state }),
        updateSubscription: async (_id: string, status: string, _email: string | undefined, event?: {id: string}) => { if (event && seen.has(event.id)) return; if (event) seen.add(event.id); state = status; updates++; },
      }),
    },
    "@/lib/supabase/server": {
      currentUser: async () => user,
      adminClient: () => ({ rpc: async (name: string, params: Record<string, unknown>) => {
        assert.equal(name, "qraftt_claim_paypal_checkout");
        assert.equal(params.p_user, user?.id); assert.equal(params.p_secret_hash, pending.secret_hash);
        if (pending.claimed_by) return {error: new Error("Already claimed")};
        pending.claimed_by = String(params.p_user); claims++; state = "ACTIVE";
        stored = {customer_id: String(params.p_user), paypal_custom_id: actual.customerId, plan_id: actual.planId, interval: "monthly"};
        return { error: null };
      } }),
    },
    "@/lib/paypal/server": {
      getPayPalClient: () => ({ getSubscription: async (id: string) => { assert.equal(id, "I-TESTONLY"); return actual; }, verifyWebhookSignature: async () => validSignature }),
      getProPlanId: () => "P-TESTONLY", getPayPalWebhookId: () => "TEST-WEBHOOK-ONLY",
    },
    "@/lib/paypal/guest-checkout": { pendingCheckout: async () => proof ? pending : null },
    "@/lib/paypal/plans": { currentPayPalPlanIds: () => ["P-TESTONLY"] },
    "@/lib/paypal/abandoned-checkout": { cancelUnclaimedCheckout: async () => { throw new Error("Unexpected cancellation in isolated claim test"); } },
  };
  const confirm = componentFixture("app/api/paypal/confirm/route.ts", overrides).POST;
  const webhook = componentFixture("app/api/paypal/webhook/route.ts", overrides).POST;
  return {
    pending,
    login: () => { user = {id: "test-user-only", email_confirmed_at: "2026-01-02T00:00:00Z", last_sign_in_at: "2026-01-02T00:00:00Z"}; },
    actual: (change: Partial<typeof actual>) => { actual = {...actual, ...change}; },
    signature: (value: boolean) => { validSignature = value; },
    loseProof: () => { proof = false; },
    stats: () => ({ state, claims, updates, stored }),
    confirm: (id = "I-TESTONLY") => confirm(new Request("https://local-audit.test/api/paypal/confirm", {method: "POST", headers: {origin: "https://local-audit.test", "content-type": "application/json"}, body: JSON.stringify({id, pro: true})})),
    webhook: (eventType: string, eventId = "WH-TEST-ONLY") => webhook(new Request("https://local-audit.test/api/paypal/webhook", {method: "POST", headers: {"paypal-auth-algo":"TEST", "paypal-cert-url":"https://api-m.sandbox.paypal.com/test-cert", "paypal-transmission-id":"TEST", "paypal-transmission-sig":"TEST", "paypal-transmission-time":"2026-01-03T00:00:00Z"}, body: JSON.stringify({id: eventId, event_type: eventType, create_time: "2026-01-03T00:00:00Z", resource: {id: "I-TESTONLY"}})})),
  };
}

test("approved guest checkout requires authentication and claims once for the correct user", async () => {
  const h = isolatedBilling();
  const guest = await h.confirm();
  assert.equal(guest.status, 401); assert.equal((await guest.json()).approved, true);
  assert.equal(h.stats().claims, 0);
  h.login(); const claimed = await h.confirm();
  assert.equal(claimed.status, 200); assert.equal((await claimed.json()).pro, true);
  assert.equal(h.stats().claims, 1); assert.equal(h.stats().stored?.customer_id, "test-user-only");
  assert.equal((await h.confirm()).status, 200); assert.equal(h.stats().claims, 1);
});

test("pending approval and missing browser proof never grant Pro", async () => {
  const h = isolatedBilling(); h.actual({status: "APPROVAL_PENDING"}); h.login();
  assert.equal((await h.confirm()).status, 409); assert.equal(h.stats().claims, 0);
  h.actual({status: "ACTIVE"}); h.loseProof();
  assert.equal((await h.confirm()).status, 404); assert.equal(h.stats().claims, 0);
});

test("real webhook handler rejects invalid signatures without changing entitlement", async () => {
  const h = isolatedBilling(); h.login(); await h.confirm(); h.signature(false);
  assert.equal((await h.webhook("BILLING.SUBSCRIPTION.CANCELLED")).status, 401);
  assert.equal(h.stats().state, "ACTIVE"); assert.equal(h.stats().updates, 0);
});

test("verified webhook lifecycle uses provider status, revokes access, and tolerates retries", async () => {
  const h = isolatedBilling(); h.login(); await h.confirm();
  for (const status of ["SUSPENDED", "CANCELLED", "EXPIRED"]) {
    h.actual({status});
    assert.equal((await h.webhook("BILLING.SUBSCRIPTION." + status, "WH-TEST-" + status)).status, 200);
    assert.equal(h.stats().state, status);
  }
  h.actual({status:"ACTIVE"});
  assert.equal((await h.webhook("BILLING.SUBSCRIPTION.PAYMENT.FAILED", "WH-FAIL")).status, 200);
  assert.equal(h.stats().state, "PAYMENT_FAILED");
  const updates = h.stats().updates;
  assert.equal((await h.webhook("BILLING.SUBSCRIPTION.PAYMENT.FAILED", "WH-FAIL")).status, 200);
  assert.equal(h.stats().updates, updates);
  h.actual({status:"CANCELLED"});
  assert.equal((await h.webhook("BILLING.SUBSCRIPTION.ACTIVATED", "WH-FORGED-ACTIVATION")).status, 200);
  assert.equal(h.stats().state, "CANCELLED", "provider status wins over an activation label");
});

test("verified event with incorrect PayPal ownership cannot alter access", async () => {
  const h = isolatedBilling(); h.login(); await h.confirm(); h.actual({customerId: "different-owner"});
  assert.equal((await h.webhook("BILLING.SUBSCRIPTION.CANCELLED")).status, 503);
  assert.equal(h.stats().state, "ACTIVE"); assert.equal(h.stats().updates, 0);
});
