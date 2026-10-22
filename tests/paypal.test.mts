import assert from "node:assert/strict";
import test from "node:test";
import {
  PAYPAL_SANDBOX_API_ORIGIN,
  PayPalSandboxClient,
} from "../lib/paypal/client.ts";
import { parsePayPalSubscriptionEvent } from "../lib/paypal/events.ts";
import { resolveProPlanId } from "../lib/paypal/plans.ts";

function mockResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

test("temporary $1 override requires Sandbox and explicit opt-in for production", () => {
  const env = { NODE_ENV: "development", PAYPAL_ENV: "sandbox", PAYPAL_PRO_MONTHLY_PLAN_ID: "P-MONTHLY", PAYPAL_PRO_YEARLY_PLAN_ID: "P-YEARLY", PAYPAL_SANDBOX_TEST_PLAN_ID: "P-TEST" };
  assert.equal(resolveProPlanId("monthly", env), "P-TEST");
  assert.equal(resolveProPlanId("yearly", env), "P-YEARLY");
  assert.equal(resolveProPlanId("monthly", { ...env, NODE_ENV: "production" }), "P-MONTHLY");
  assert.equal(resolveProPlanId("monthly", { ...env, NODE_ENV: "production", VERCEL_ENV: "preview" }), "P-TEST");
  assert.equal(resolveProPlanId("yearly", { ...env, NODE_ENV: "production", VERCEL_ENV: "preview" }), "P-YEARLY");
  assert.equal(resolveProPlanId("monthly", { ...env, VERCEL_ENV: "production" }), "P-MONTHLY");
  assert.equal(resolveProPlanId("monthly", { ...env, NODE_ENV: "production", VERCEL_ENV: "preview", PAYPAL_ENV: "live" }), "P-MONTHLY");
  assert.equal(resolveProPlanId("monthly", { ...env, PAYPAL_ENV: "live" }), "P-MONTHLY");
  assert.equal(resolveProPlanId("monthly", { ...env, PAYPAL_SANDBOX_TEST_PLAN_ID: "" }), "P-MONTHLY");
  const production = { ...env, NODE_ENV: "production", VERCEL_ENV: "production", PAYPAL_SANDBOX_PRODUCTION_TEST: "true" };
  assert.equal(resolveProPlanId("monthly", production), "P-TEST");
  assert.equal(resolveProPlanId("yearly", production), "P-YEARLY");
  assert.equal(resolveProPlanId("monthly", { ...production, PAYPAL_ENV: "live" }), "P-MONTHLY");
  assert.equal(resolveProPlanId("monthly", { ...production, PAYPAL_SANDBOX_PRODUCTION_TEST: "false" }), "P-MONTHLY");
});

test("uses sandbox-only OAuth with server credentials", async () => {
  const requests: Array<{ body?: string; headers?: Headers; url: string }> = [];
  const client = new PayPalSandboxClient({
    clientId: "sandbox-client",
    clientSecret: "sandbox-secret",
    fetch: async (input, init) => {
      requests.push({
        body: typeof init?.body === "string" ? init.body : undefined,
        headers: new Headers(init?.headers),
        url: input.toString(),
      });
      return mockResponse({ access_token: "sandbox-token", expires_in: 32400 });
    },
  });

  const token = await client.getAccessToken();

  assert.equal(token.accessToken, "sandbox-token");
  assert.equal(requests[0]?.url, `${PAYPAL_SANDBOX_API_ORIGIN}/v1/oauth2/token`);
  assert.equal(requests[0]?.body, "grant_type=client_credentials");
  assert.match(requests[0]?.headers?.get("authorization") ?? "", /^Basic /);
});

test("creates subscriptions only through the sandbox API", async () => {
  const requests: Array<{ body?: string; url: string }> = [];
  const client = new PayPalSandboxClient({
    clientId: "sandbox-client",
    clientSecret: "sandbox-secret",
    fetch: async (input, init) => {
      requests.push({
        body: typeof init?.body === "string" ? init.body : undefined,
        url: input.toString(),
      });
      if (requests.length === 1) return mockResponse({ access_token: "sandbox-token" });
      return mockResponse({
        id: "I-SANDBOX",
        links: [{ href: "https://www.sandbox.paypal.com/checkout", rel: "approve" }],
        status: "APPROVAL_PENDING",
      }, 201);
    },
  });

  const subscription = await client.createSubscription({
    cancelUrl: "https://www.qraftt.com/?paypal=cancelled",
    planId: "P-SANDBOX",
    returnUrl: "https://www.qraftt.com/?paypal=approved",
  });

  assert.equal(subscription.id, "I-SANDBOX");
  assert.equal(subscription.status, "APPROVAL_PENDING");
  assert.equal(
    requests[1]?.url,
    `${PAYPAL_SANDBOX_API_ORIGIN}/v1/billing/subscriptions`,
  );
  assert.match(requests[1]?.body ?? "", /"plan_id":"P-SANDBOX"/);
});

test("verifies webhook signatures through the PayPal sandbox endpoint", async () => {
  const requests: Array<{ body?: string; url: string }> = [];
  const client = new PayPalSandboxClient({
    clientId: "sandbox-client",
    clientSecret: "sandbox-secret",
    fetch: async (input, init) => {
      requests.push({
        body: typeof init?.body === "string" ? init.body : undefined,
        url: input.toString(),
      });
      if (requests.length === 1) return mockResponse({ access_token: "sandbox-token" });
      return mockResponse({ verification_status: "SUCCESS" });
    },
  });

  const verified = await client.verifyWebhookSignature({
    authAlgo: "SHA256withRSA",
    certUrl: "https://api-m.sandbox.paypal.com/cert",
    event: { event_type: "BILLING.SUBSCRIPTION.ACTIVATED" },
    transmissionId: "id",
    transmissionSignature: "signature",
    transmissionTime: "time",
    webhookId: "webhook-id",
  });

  assert.equal(verified, true);
  assert.equal(
    requests[1]?.url,
    `${PAYPAL_SANDBOX_API_ORIGIN}/v1/notifications/verify-webhook-signature`,
  );
  assert.match(requests[1]?.body ?? "", /"webhook_id":"webhook-id"/);
});

test("maps PayPal subscription lifecycle events without accepting unknown events", () => {
  assert.deepEqual(
    parsePayPalSubscriptionEvent({
      event_type: "BILLING.SUBSCRIPTION.ACTIVATED",
      id: "WH-1",
      resource: { id: "I-1" },
    }),
    {
      eventId: "WH-1",
      eventType: "BILLING.SUBSCRIPTION.ACTIVATED",
      state: "activated",
      subscriptionId: "I-1",
    },
  );
  assert.equal(
    parsePayPalSubscriptionEvent({ event_type: "UNSUPPORTED.EVENT" }).state,
    null,
  );
});

test("retrieves approval status from PayPal and rejects invalid subscription IDs", async () => {
  const urls: string[] = [];
  const client = new PayPalSandboxClient({
    clientId: "sandbox-client",
    clientSecret: "sandbox-secret",
    fetch: async (input) => {
      urls.push(input.toString());
      return urls.length === 1
        ? mockResponse({ access_token: "sandbox-token" })
        : mockResponse({ id: "I-TEST", status: "ACTIVE", plan_id: "P-TEST" });
    },
  });
  await assert.rejects(() => client.getSubscription("../secret"), /Invalid/);
  assert.equal(urls.length, 0);
  assert.deepEqual(await client.getSubscription("I-TEST"), {
    id: "I-TEST", status: "ACTIVE", planId: "P-TEST",
    period: { start: undefined, end: undefined },
  });
  assert.equal(urls[1], `${PAYPAL_SANDBOX_API_ORIGIN}/v1/billing/subscriptions/I-TEST`);
});

test("failed webhook verification does not authenticate an event", async () => {
  let calls = 0;
  const client = new PayPalSandboxClient({
    clientId: "sandbox-client", clientSecret: "sandbox-secret",
    fetch: async () => (++calls === 1
      ? mockResponse({ access_token: "sandbox-token" })
      : mockResponse({ verification_status: "FAILURE" })),
  });
  assert.equal(await client.verifyWebhookSignature({
    authAlgo: "SHA256withRSA", certUrl: "https://api-m.sandbox.paypal.com/cert",
    event: { event_type: "BILLING.SUBSCRIPTION.ACTIVATED" },
    transmissionId: "fake", transmissionSignature: "fake", transmissionTime: "fake", webhookId: "registered-id",
  }), false);
});
