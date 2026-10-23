import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { limitsFor } from "../lib/billing/limits.ts";
import { pricingPlans, planBenefits } from "../lib/pricing/plans.ts";
import { qrContentValues } from "../lib/qr/content-values.ts";
import { componentFixture } from "./helpers/render-component.mjs";
import { freeDesign } from "../lib/qr/access.ts";

test("saved documents exclude hidden QR-type fields and cannot supply owner or plan privileges", () => {
  assert.deepEqual(qrContentValues("url", { url: "https://example.com", wifiPassword: "do-not-store-this" }), { url: "https://example.com" });
  const { validateSavedDocument } = componentFixture("lib/account/saved-qr.ts", { "server-only": {} });
  const result = validateSavedDocument({ version: 1, type: "url", values: { url: "https://example.com", wifiPassword: "private" }, design: freeDesign, correction: "M", format: "eps", size: 2000, user_id: "other-user", pro: true });
  assert.deepEqual(result.values, { url: "https://example.com" });
  assert.equal(result.user_id, undefined); assert.equal(result.pro, undefined);
  assert.throws(() => validateSavedDocument({ ...result, format: "exe" }));
});

test("saved-QR server calls use verified account identity, never client owner or entitlement flags", async () => {
  let authenticated = true;
  let parameters: Record<string, unknown> | undefined;
  const { savedQr } = componentFixture("lib/account/saved-qr.ts", {
    "server-only": {},
    "@/lib/supabase/server": {
      currentUser: async () => authenticated ? { id: "verified-session-owner" } : null,
      adminClient: () => ({ rpc: async (_name: string, values: Record<string, unknown>) => { parameters = values; return { data: { count: 0 }, error: null }; } }),
    },
  });
  await savedQr("usage", { user_id: "forged-owner", pro: true, storageLimit: Infinity });
  assert.equal(parameters?.p_user, "verified-session-owner");
  assert.equal(parameters?.pro, undefined); assert.equal(parameters?.storageLimit, undefined);
  authenticated = false; parameters = undefined;
  await assert.rejects(savedQr("usage"), /LOGIN_REQUIRED/); assert.equal(parameters, undefined);
});

test("monthly and yearly share core Pro features, with distinct persisted storage limits", () => {
  const pro = pricingPlans[1];
  assert.deepEqual(pro.prices, { monthly: 4.99, yearly: 19.99 });
  const month = planBenefits(pro, "monthly"), year = planBenefits(pro, "yearly");
  for (const key of Object.keys(month).filter(k => !["saved", "storage"].includes(k))) assert.equal(month[key as keyof typeof month], year[key as keyof typeof year]);
  assert.deepEqual(limitsFor(true, "monthly"), { savedCodes: 100, storageBytes: 250_000_000 });
  assert.deepEqual(limitsFor(true, "yearly"), { savedCodes: 500, storageBytes: 1_000_000_000 });
  assert.deepEqual(limitsFor(false, "yearly"), { savedCodes: 0, storageBytes: 0 });
});

test("real Postgres saved-QR migration enforces ownership, count, bytes, downgrade and service-only access", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role;
      create schema auth; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
      create table profiles(id uuid primary key);
      create table subscriptions(user_id uuid, status text, provider_plan_id text, billing_interval text, updated_at timestamptz default now());
      insert into auth.users values ('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002');
      insert into profiles select id from auth.users;
      insert into subscriptions(user_id,status,provider_plan_id,billing_interval) values ('00000000-0000-0000-0000-000000000001','active','P-TEST','monthly');`);
    await db.exec(readFileSync(new URL("../supabase/migrations/202610220001_saved_qr.sql", import.meta.url), "utf8"));
    const user = "00000000-0000-0000-0000-000000000001", other = "00000000-0000-0000-0000-000000000002";
    const rpc = async (action: string, id: string|null = null, document: object = { content: "test" }, owner = user) => (await db.query<{result: Record<string, unknown>}>("select qraftt_saved_qr($1,ARRAY['P-TEST'],$2,$3,'Test QR',$4::jsonb) as result", [owner, action, id, JSON.stringify(document)])).rows[0].result;
    assert.equal((await rpc("usage")).savedLimit, 100);
    await assert.rejects(rpc("save", null, {}, other), /PRO_REQUIRED/);
    const first = String((await rpc("save")).id);
    const measured = await rpc("usage"); assert.equal(measured.count, 1); assert.ok(Number(measured.bytes) > 0);
    await rpc("save", first, { content: "longer test content" }); assert.equal((await rpc("usage")).count, 1);
    await assert.rejects(rpc("delete", first, {}, other), /NOT_FOUND/);
    await db.exec(`insert into saved_qr_codes(user_id,title,document) select '${user}','Fixture','{}'::jsonb from generate_series(1,99);`);
    await assert.rejects(rpc("save"), /SAVED_QR_LIMIT/);
    await rpc("save", first); // Updates still permitted at count limit.
    await db.exec("update subscriptions set billing_interval='yearly'");
    assert.equal((await rpc("usage")).savedLimit, 500); assert.equal((await rpc("usage")).storageLimit, 1_000_000_000);
    await rpc("save");
    await db.exec(`insert into saved_qr_codes(user_id,title,document) select '${user}','Yearly fixture','{}'::jsonb from generate_series(1,399);`);
    assert.equal((await rpc("usage")).count, 500);
    await assert.rejects(rpc("save"), /SAVED_QR_LIMIT/);
    await db.exec("update subscriptions set billing_interval='monthly'");
    await assert.rejects(rpc("save", first), /SAVED_QR_LIMIT/);
    await db.exec(`delete from saved_qr_codes; update subscriptions set billing_interval='monthly';
      insert into saved_qr_codes(user_id,title,document) select '${user}','Storage fixture',jsonb_build_object('data',repeat('x',2777700)) from generate_series(1,90);`);
    await assert.rejects(rpc("save", null, { data: "x".repeat(10_000) }), /STORAGE_LIMIT/);
    const row = (await db.query<{id: string}>("select id from saved_qr_codes limit 1")).rows[0];
    await assert.rejects(rpc("save", row.id, { data: "x".repeat(1_100_001) }), /DOCUMENT_TOO_LARGE/);
    await rpc("save", row.id, {}); // Shrinking a document frees its measured bytes.
    await db.exec("update subscriptions set status='cancelled'");
    assert.equal((await rpc("usage")).savedLimit, 0);
    await assert.rejects(rpc("get", row.id), /PRO_REQUIRED/);
    await assert.rejects(rpc("save", row.id), /PRO_REQUIRED/);
    await rpc("delete", row.id); // Downgraded owner retains deletion rights.
    await db.exec("set role authenticated");
    await assert.rejects(db.query("select * from saved_qr_codes"), /permission denied/);
    await assert.rejects(rpc("usage"), /permission denied/);
  } finally { await db.close(); }
});
