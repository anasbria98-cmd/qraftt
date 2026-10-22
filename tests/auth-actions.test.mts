import assert from "node:assert/strict";
import test from "node:test";
import { componentFixture } from "./helpers/render-component.mjs";
import { checkoutAuthReturnPath } from "../lib/auth/redirect.ts";

class RedirectSignal extends Error { location: string; constructor(location: string) { super("Redirect"); this.location = location; } }
function harness(pending = false) {
  const calls: Array<{ name: string; input?: unknown }> = [];
  const cookies = new Map<string, string>();
  const auth = {
    signInWithPassword: async (input: unknown) => { calls.push({ name: "login", input }); return { error: null }; },
    signUp: async (input: unknown) => { calls.push({ name: "signup", input }); return { data: { user: { identities: [{}] }, session: null }, error: null }; },
    resetPasswordForEmail: async (email: string, options: unknown) => { calls.push({ name: "recovery", input: { email, options } }); return { error: null }; },
    getUser: async () => ({ data: { user: { id: "fixture-user" } } }),
    updateUser: async (input: unknown) => { calls.push({ name: "reset", input }); return { error: null }; },
    signOut: async () => { calls.push({ name: "logout" }); return { error: null }; },
  };
  const actions = componentFixture("lib/auth/actions.ts", {
    "next/navigation": { redirect: (location: string) => { throw new RedirectSignal(location); } },
    "next/headers": { cookies: async () => ({ set: (key: string, value: string) => cookies.set(key, value), get: (key: string) => cookies.has(key) ? { value: cookies.get(key) } : undefined, delete: (key: string) => cookies.delete(key) }) },
    "@/lib/supabase/server": { authClient: async () => ({ auth }) },
    "@/lib/auth/providers": { googleAuthAvailable: async () => true },
    "@/lib/auth/continuation": { authReturnPath: async (value: unknown) => checkoutAuthReturnPath(value, pending ? { state: "open", claimed_by: null, subscription_id: "I-FIXTURE", expires_at: "2099-01-01T00:00:00Z" } : null) },
  });
  const form = new FormData(); form.set("email", "fixture@example.test"); form.set("password", "Only-a-render-test-password-123");
  return { actions, auth, calls, cookies, form };
}
async function destination(action: () => Promise<unknown>) {
  try { await action(); assert.fail("Expected redirect"); }
  catch (error) { if (!(error instanceof RedirectSignal)) throw error; return new URL(error.location, "https://www.qraftt.com"); }
}
test("successful normal login reaches dashboard; pending checkout resumes linking without another checkout", async () => {
  for (const pending of [false, true]) {
    const h = harness(pending);
    const target = await destination(() => h.actions.login(h.form));
    assert.equal(target.pathname, pending ? "/pricing" : "/dashboard");
    if (pending) assert.equal(target.searchParams.get("paypal"), "approved");
    assert.deepEqual(h.calls.map(call => call.name), ["login"]);
  }
});
test("signup preserves email confirmation and existing accounts get a clear login path", async () => {
  const h = harness(true);
  const confirmation = await destination(() => h.actions.signup(h.form));
  assert.equal(confirmation.pathname, "/login");
  assert.match(confirmation.searchParams.get("message")!, /Confirm your email/);
  assert.equal(confirmation.searchParams.get("next"), "/pricing?paypal=approved");
  h.auth.signUp = async () => ({ data: { user: { identities: [] }, session: null }, error: null });
  const existing = await destination(() => h.actions.signup(h.form));
  assert.equal(existing.pathname, "/login"); assert.match(existing.searchParams.get("message")!, /already registered/);
});
test("forgot/reset preserves pending continuation and requires a fresh login after password update", async () => {
  const h = harness(true);
  const sent = await destination(() => h.actions.forgotPassword(h.form));
  assert.equal(sent.pathname, "/forgot-password"); assert.match(sent.searchParams.get("message")!, /reset email/);
  assert.equal(h.cookies.get("qraftt_auth_return"), "/pricing?paypal=approved");
  const reset = await destination(() => h.actions.resetPassword(h.form));
  assert.equal(reset.pathname, "/login"); assert.equal(reset.searchParams.get("next"), "/pricing?paypal=approved");
  assert.deepEqual(h.calls.map(call => call.name), ["recovery", "reset", "logout"]);
});
