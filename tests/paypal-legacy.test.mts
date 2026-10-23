import assert from "node:assert/strict";
import test from "node:test";
import { componentFixture } from "./helpers/render-component.mjs";

test("legacy confirmation survives checkout plan rotation without relaxing ownership or environment checks", async () => {
  const values = { PAYPAL_ENV: "live", PAYPAL_PRO_MONTHLY_PLAN_ID: "P-NEWLIVE", PAYPAL_PRO_YEARLY_PLAN_ID: "P-YEARLIVE", PAYPAL_LIVE_LEGACY_PLAN_IDS: "P-OLDLIVE", PAYPAL_SANDBOX_LEGACY_PLAN_IDS: "P-SANDBOX" };
  const previous = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  Object.assign(process.env, values);
  try {
    for (const customId of ["test-user", "checkout:test-proof"]) {
      for (const planId of ["P-OLDLIVE", "P-NEWLIVE", "P-YEARLIVE", "P-SANDBOX", "P-UNKNOWN"]) {
        for (const failure of ["none", "owner", "custom", "plan"]) {
          let updates = 0;
          const stored = { customer_id: failure === "owner" ? "another-user" : "test-user", paypal_custom_id: customId, plan_id: planId, interval: planId === "P-YEARLIVE" ? "yearly" : "monthly" };
          const { POST } = componentFixture("app/api/paypal/confirm/route.ts", {
            "@/lib/billing/server": {
              sameOrigin: () => true, billingCustomer: async () => "test-user",
              getBillingStore: () => ({ subscription: async () => stored, updateSubscription: async () => { updates++; }, entitlement: async () => ({ pro: true }) }),
            },
            "@/lib/supabase/server": { currentUser: async () => ({ email_confirmed_at: "2026-01-01" }), adminClient: () => { throw new Error("Unexpected database claim"); } },
            "@/lib/paypal/server": { getPayPalClient: () => ({ getSubscription: async () => ({ id: "I-TESTONLY", customerId: failure === "custom" ? "another-user" : customId, planId: failure === "plan" ? "P-MISMATCH" : planId, status: "ACTIVE", period: {} }) }) },
            "@/lib/paypal/guest-checkout": { pendingCheckout: async () => null },
            "@/lib/paypal/abandoned-checkout": { cancelUnclaimedCheckout: async () => { throw new Error("Unexpected cancellation"); } },
          });
          const response = await POST(new Request("https://local.test/api/paypal/confirm", { method: "POST", body: JSON.stringify({ id: "I-TESTONLY" }) }));
          const accepted = failure === "none" && !["P-SANDBOX", "P-UNKNOWN"].includes(planId);
          assert.equal(response.status, accepted ? 200 : failure === "owner" ? 404 : 503, `${customId}/${planId}/${failure}`);
          assert.equal(updates, accepted ? 1 : 0);
        }
      }
    }
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
