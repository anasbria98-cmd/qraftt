// Explicit opt-in integration test. Creates and removes only isolated QA accounts.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import env from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

if (process.env.QRAFTT_SUPABASE_QA !== "1") throw new Error("Set QRAFTT_SUPABASE_QA=1 to authorize temporary QA accounts and Sandbox checkout testing.");
env.loadEnvConfig(process.cwd(), true);
if (process.env.PAYPAL_ENV !== "sandbox") throw new Error("Sandbox only.");
const origin = "http://localhost:3000";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const options = { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) } };
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, options);
const created = [], clients = [];
const suffix = randomUUID().replaceAll("-", "");
const password = "Qa!" + randomUUID();
const check = (error, stage) => { if (error) throw new Error(stage + ": " + error.message); };
try {
  for (let i = 0; i < 2; i++) {
    const email = `qraftt-qa-${suffix}-${i}@example.invalid`;
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    check(error, "Create isolated QA account");
    created.push({ id: data.user.id, email });
    const client = createClient(url, pub, options);
    check((await client.auth.signInWithPassword({ email, password })).error, "QA sign in");
    clients.push(client);
  }
  console.log("PASS: temporary QA accounts authenticate without sending email.");
  for (let i = 0; i < 2; i++) {
    const own = await clients[i].from("profiles").select("id,plan");
    check(own.error, "Own profile");
    assert.equal(own.data.length, 1); assert.equal(own.data[0].id, created[i].id); assert.equal(own.data[0].plan, "free");
    const other = await clients[i].from("profiles").select("id").eq("id", created[1-i].id);
    check(other.error, "Cross-account read"); assert.deepEqual(other.data, []);
  }
  console.log("PASS: profile trigger and cross-account RLS isolation.");
  assert.ok((await clients[0].from("profiles").update({ plan: "pro" }).eq("id", created[0].id)).error);
  const name = await clients[0].from("profiles").update({ display_name: "Temporary QA" }).eq("id", created[0].id).select("display_name").single();
  check(name.error, "Own display name"); assert.equal(name.data.display_name, "Temporary QA");
  const subId = "I-QA" + suffix.toUpperCase();
  check((await admin.from("subscriptions").insert({ id: subId, user_id: created[0].id, provider_plan_id: "P-QAFIXTURE", billing_interval: "monthly", status: "approval_pending" })).error, "Isolated billing fixture");
  const otherSub = await clients[1].from("subscriptions").select("id").eq("id", subId);
  check(otherSub.error, "Cross-account subscription"); assert.deepEqual(otherSub.data, []);
  assert.ok((await clients[0].from("subscriptions").update({ status: "active" }).eq("id", subId)).error);
  assert.ok((await clients[0].rpc("qraftt_apply_verified_subscription", { p_id: subId, p_status: "active", p_observed_at: new Date().toISOString() })).error);
  for (const table of ["download_usage", "billing_webhook_events"]) assert.ok((await clients[0].from(table).select("*").limit(1)).error);
  console.log("PASS: client plan/billing writes, private-table reads and billing RPC calls denied.");
  const quota = await Promise.all(Array.from({ length: 6 }, () => admin.rpc("qraftt_consume_download", { p_principal: created[0].id })));
  quota.forEach(r => check(r.error, "Atomic quota")); assert.equal(quota.filter(r => r.data === true).length, 3);
  console.log("PASS: concurrent free quota allows exactly three downloads.");
  const now = Date.now();
  const transitions = [
    ["active", now-5000, "A", "pro"], ["cancelled", now-4000, "B", "free"],
    ["active", now-6000, "C", "free"], ["active", now-5000, "A", "free"],
    ["active", now-3000, "D", "pro"], ["payment_failed", now-2000, "E", "free"],
    ["active", now-1500, "F", "pro"], ["suspended", now-1000, "G", "free"],
    ["active", now-500, "H", "pro"], ["expired", now, "J", "free"],
  ];
  for (const [status, time, event, expectedPlan] of transitions) {
    check((await admin.rpc("qraftt_apply_verified_subscription", { p_id: subId, p_status: status, p_observed_at: new Date(time).toISOString(), p_event_id: "QA-"+suffix+event })).error, "Fixture transition");
    const profile = await admin.from("profiles").select("plan").eq("id", created[0].id).single();
    check(profile.error, "Fixture plan"); assert.equal(profile.data.plan, expectedPlan);
  }
  console.log("PASS: synthetic fixture activation/revocation, ordering and deduplication (not a payment).");
  const jar = new Map();
  const ssr = createServerClient(url, pub, { cookies: {
    getAll: () => [...jar].map(([name, value]) => ({ name, value })),
    setAll(values) { for (const c of values) jar.set(c.name, c.value); },
  } });
  check((await ssr.auth.signInWithPassword({ email: created[1].email, password })).error, "SSR sign in");
  const cookie = [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
  const headers = { Cookie: cookie, Origin: origin, "Content-Type": "application/json" };
  assert.equal((await fetch(origin+"/dashboard", { headers: { Cookie: cookie }, redirect: "manual" })).status, 200);
  const session = await fetch(origin+"/api/billing/session", { headers: { Cookie: cookie } });
  assert.equal(session.status, 200); assert.equal((await session.json()).pro, false);
  const checkout = await fetch(origin+"/api/paypal/subscriptions", { method: "POST", headers, body: JSON.stringify({ interval: "monthly" }) });
  const result = await checkout.json(); assert.equal(checkout.status, 201, JSON.stringify(result));
  assert.equal(new URL(result.approvalUrl).hostname, "www.sandbox.paypal.com"); assert.equal(result.status, "APPROVAL_PENDING");
  const saved = await admin.from("subscriptions").select("user_id,provider_plan_id").eq("id", result.id).single();
  check(saved.error, "Stored checkout"); assert.equal(saved.data.user_id, created[1].id); assert.equal(saved.data.provider_plan_id, process.env.PAYPAL_SANDBOX_TEST_PLAN_ID);
  const verification = await fetch(origin+"/api/paypal/confirm", { method: "POST", headers, body: JSON.stringify({ id: result.id }) });
  const verified = await verification.json(); assert.equal(verification.status, 200); assert.equal(verified.pro, false); assert.equal(verified.status, "APPROVAL_PENDING");
  console.log("PASS: authenticated dashboard/session and user-linked $1 Sandbox checkout; pending approval stays Free.");
  const attack = await fetch(origin+"/api/paypal/confirm", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify({ id: result.id }) });
  assert.notEqual(attack.status, 200);
  console.log("PASS: anonymous caller cannot claim another user's subscription.");
} finally {
  for (const client of clients) await client.auth.signOut();
  for (const user of created) {
    const usage = await admin.from("download_usage").delete().eq("principal", user.id);
    const removed = await admin.auth.admin.deleteUser(user.id);
    if (usage.error || removed.error) {
      console.error("Temporary QA cleanup failed; inspect QA records before retrying.");
      process.exitCode = 1;
    } else console.log("CLEANUP: temporary QA account and dependent fixtures removed.");
  }
}
