import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { authFailureMessage } from "../lib/auth/errors.ts";
import { checkoutAuthReturnPath } from "../lib/auth/redirect.ts";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("pending checkout resumes after auth from any account entry without starting another payment", () => {
  const pending = { state: "open", claimed_by: null, subscription_id: "I-TEST", expires_at: "2030-01-01T00:00:00Z" };
  for (const next of [undefined, "/dashboard", "/pricing", "/account", "/pricing?checkout=monthly", "/pricing?checkout=yearly"]) {
    assert.equal(checkoutAuthReturnPath(next, pending, 0), "/pricing?paypal=approved");
  }
  assert.equal(checkoutAuthReturnPath("/reset-password", pending, 0), "/reset-password");
  assert.equal(checkoutAuthReturnPath("/dashboard", { ...pending, claimed_by: "another-user" }, 0), "/dashboard");
  assert.equal(checkoutAuthReturnPath("/dashboard", { ...pending, state: "cancelled" }, 0), "/dashboard");
  assert.equal(checkoutAuthReturnPath("/dashboard", pending, Date.parse(pending.expires_at)), "/dashboard");
  assert.equal(checkoutAuthReturnPath("https://evil.test", null), "/dashboard");
});
test("auth failures explain rate limits, confirmation, existing accounts and invalid credentials", () => {
  assert.match(authFailureMessage({ code: "over_email_send_rate_limit" }), /wait/);
  assert.match(authFailureMessage({ code: "user_already_exists" }), /already registered/);
  assert.match(authFailureMessage({ code: "email_not_confirmed" }), /Confirm your email/);
  assert.match(authFailureMessage({ code: "invalid_credentials" }), /Qraftt credentials/);
  assert.doesNotMatch(authFailureMessage({ code: "unexpected" }), /secret|token/i);
});
test("recovery preserves approved checkout intent without cancelling or granting entitlement", () => {
  const actions = source("lib/auth/actions.ts");
  assert.match(actions, /data.user\?\.identities\?\.length === 0/);
  assert.match(actions, /qraftt_auth_return/);
  assert.match(actions, /Your password has been updated. Please log in.", next/);
  assert.match(source("components/account/auth-page.tsx"), /forgot-password\$\{suffix\}/);
  assert.doesNotMatch(actions, /claim_pending|cancelSubscription|\.from\("subscriptions"\)/);
});
test("callback accepts PKCE and allowlisted email OTP types without exposing tokens in redirects", () => {
  const callback = source("app/auth/callback/route.ts");
  assert.match(callback, /exchangeCodeForSession/);
  assert.match(callback, /verifyOtp/);
  assert.match(callback, /type === "recovery" \? "\/reset-password"/);
  assert.match(callback, /private, no-store/);
});
