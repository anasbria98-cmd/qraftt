import assert from "node:assert/strict";
import test from "node:test";
import { componentFixture } from "./helpers/render-component.mjs";

test("all legacy confirmation requests are retired without touching existing agreements", async () => {
  let calls = 0;
  const { POST } = componentFixture("app/api/paypal/confirm/route.ts", {
    "@/lib/billing/server": { getBillingStore: () => { calls++; throw Error("No billing calls allowed"); } },
    "@/lib/paypal/server": { getPayPalClient: () => { calls++; throw Error("No PayPal calls allowed"); } },
  });
  for (const id of ["I-LEGACY", "I-MONTHLY", "I-YEARLY"]) {
    const response = await POST(new Request("https://local.test/api/paypal/confirm", { method: "POST", body: JSON.stringify({ id }) }));
    assert.equal(response.status, 410);
  }
  assert.equal(calls, 0);
});
