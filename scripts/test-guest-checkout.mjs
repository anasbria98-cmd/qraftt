// Explicit local integration test: real pending Sandbox checkout, synthetic DB claim fixtures.
import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import env from "@next/env";
import { createClient } from "@supabase/supabase-js";
if (process.env.QRAFTT_SUPABASE_QA !== "1") throw Error("Set QRAFTT_SUPABASE_QA=1 for isolated guest checkout integration tests.");
env.loadEnvConfig(process.cwd(), true);
if (process.env.PAYPAL_ENV !== "sandbox") throw Error("Sandbox only.");
const origin = "http://localhost:3000";
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const ready = await db.from("pending_paypal_checkouts").select("id").limit(0);
if (ready.error) throw Error("Apply 202610180002_guest_checkout.sql before running this test.");
const users = [], rows = [];
const check = error => { if (error) throw error; };
try {
  const response = await fetch(origin + "/api/paypal/subscriptions", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify({ interval: "monthly" }) });
  const checkout = await response.json();
  assert.equal(response.status, 201, JSON.stringify(checkout));
  assert.equal(new URL(checkout.approvalUrl).hostname, "www.sandbox.paypal.com");
  const cookieHeader = response.headers.getSetCookie().find(value => value.startsWith("qraftt_paypal_checkout="));
  assert.ok(cookieHeader); assert.match(cookieHeader, /HttpOnly/i); assert.match(cookieHeader, /SameSite=Lax/i);
  const cookie = cookieHeader.split(";")[0];
  const secret = cookie.slice(cookie.indexOf("=") + 1);
  const pending = await db.from("pending_paypal_checkouts").select("*").eq("subscription_id", checkout.id).single();
  check(pending.error); rows.push(pending.data.id);
  assert.equal(pending.data.secret_hash, createHash("sha256").update(secret).digest("hex"));
  assert.equal(pending.data.provider_plan_id, process.env.PAYPAL_SANDBOX_TEST_PLAN_ID);
  assert.equal(pending.data.claimed_by, null);
  const headers = { Origin: origin, "Content-Type": "application/json", Cookie: cookie };
  const confirm = await fetch(origin + "/api/paypal/confirm", { method: "POST", headers, body: "{}" });
  assert.equal(confirm.status, 409); assert.equal((await confirm.json()).pro, false);
  const idOnly = await fetch(origin + "/api/paypal/confirm", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify({ id: checkout.id }) });
  assert.equal(idOnly.status, 404);
  console.log("PASS: signed-out real $1 Sandbox checkout starts without login; ID alone and pending approval cannot grant Pro.");

  for (let i = 0; i < 2; i++) {
    const { data, error } = await db.auth.admin.createUser({ email: `qraftt-guest-qa-${randomUUID()}@example.invalid`, password: `Qa!${randomUUID()}`, email_confirm: true });
    check(error); users.push(data.user.id);
  }
  const id = randomUUID(), hash = createHash("sha256").update(randomBytes(32)).digest("hex");
  const subscription = "I-QA" + randomBytes(12).toString("hex").toUpperCase();
  check((await db.from("pending_paypal_checkouts").insert({ id, secret_hash: hash, subscription_id: subscription, provider_plan_id: "P-QAFIXTURE", billing_interval: "monthly" })).error); rows.push(id);
  const args = { p_checkout: id, p_secret_hash: hash, p_user: users[0], p_status: "active", p_observed_at: new Date().toISOString() };
  assert.ok((await db.rpc("qraftt_claim_paypal_checkout", { ...args, p_secret_hash: "0".repeat(64) })).error);
  assert.ok((await db.rpc("qraftt_claim_paypal_checkout", { ...args, p_status: "approval_pending" })).error);
  const races = await Promise.all(users.map(p_user => db.rpc("qraftt_claim_paypal_checkout", { ...args, p_user })));
  assert.equal(races.filter(r => !r.error).length, 1);
  const saved = await db.from("subscriptions").select("user_id,paypal_custom_id,status").eq("id", subscription).single();
  check(saved.error); assert.equal(saved.data.status, "active"); assert.equal(saved.data.paypal_custom_id, `checkout:${id}`);
  assert.equal((await db.from("profiles").select("plan").eq("id", saved.data.user_id).single()).data.plan, "pro");
  check((await db.rpc("qraftt_claim_paypal_checkout", { ...args, p_user: saved.data.user_id })).error);
  const expiryId = randomUUID(); rows.push(expiryId);
  check((await db.from("pending_paypal_checkouts").insert({ id: expiryId, secret_hash: "1".repeat(64), provider_plan_id: "P-QAFIXTURE", billing_interval: "monthly", subscription_id: "I-QA" + randomBytes(12).toString("hex").toUpperCase(), expires_at: new Date(0).toISOString() })).error);
  assert.ok((await db.rpc("qraftt_claim_paypal_checkout", { ...args, p_checkout: expiryId, p_secret_hash: "1".repeat(64), p_user: users.find(user => user !== saved.data.user_id) })).error);
  const anonymous = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
  assert.ok((await anonymous.from("pending_paypal_checkouts").select("*")).error);
  assert.ok((await anonymous.rpc("qraftt_claim_paypal_checkout", args)).error);
  console.log("PASS: synthetic DB fixtures reject wrong proof, inactive/expired claims and cross-account replay; concurrent claims have one winner. This is NOT a real payment approval.");
} finally {
  for (const id of rows) check((await db.from("pending_paypal_checkouts").delete().eq("id", id)).error);
  for (const user of users) check((await db.auth.admin.deleteUser(user)).error);
  console.log("Removed isolated guest-checkout QA fixtures.");
}
