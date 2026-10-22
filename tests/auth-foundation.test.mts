import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { safeReturnPath } from "../lib/auth/redirect.ts";
import { validNewPassword } from "../lib/auth/validation.ts";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("new passwords respect Supabase length and UTF-8 byte limits", () => {
  assert.equal(validNewPassword("a".repeat(11)), false);
  assert.equal(validNewPassword("a".repeat(12)), true);
  assert.equal(validNewPassword("a".repeat(72)), true);
  assert.equal(validNewPassword("a".repeat(73)), false);
  assert.equal(validNewPassword("😀".repeat(18)), true);
  assert.equal(validNewPassword("😀".repeat(19)), false);
});

test("auth callbacks accept only intentional local destinations", () => {
  for (const path of ["/dashboard", "/account", "/pricing", "/reset-password", "/pricing?checkout=monthly", "/pricing?checkout=yearly"]) assert.equal(safeReturnPath(path), path);
  for (const path of ["//evil.test", "https://evil.test", "/%2fevil.test", "\\evil.test", undefined, "/dashboard?next=https://evil.test"]) assert.equal(safeReturnPath(path), "/dashboard");
});
test("checkout continuation rejects arbitrary queries and keeps signup/login intent", () => {
  for (const path of ["/pricing?checkout=invalid", "/pricing?checkout=monthly&next=https://evil.test", "/pricing?checkout=monthly#bad"]) assert.equal(safeReturnPath(path), "/dashboard");
  assert.match(source("lib/auth/actions.ts"), /if \(data.session\) redirect\(next\)/);
  assert.match(source("lib/auth/actions.ts"), /httpOnly: true/);
  assert.match(source("app/auth/callback/route.ts"), /next === "\/dashboard" && interval/);
  assert.match(source("components/account/auth-page.tsx"), /encodeURIComponent\(next\)/);
});
test("Supabase migration protects billing writes and scopes account reads", () => {
  const sql = source("supabase/migrations/202610180001_saas_foundation.sql");
  for (const table of ["profiles", "subscriptions", "download_usage", "billing_webhook_events"]) assert.ok(sql.includes(`alter table public.${table} enable row level security;`));
  assert.match(sql, /grant update\(display_name\) on public\.profiles to authenticated/);
  assert.doesNotMatch(sql, /grant (?:all|insert|update|delete) on public\.subscriptions to authenticated/);
  assert.match(sql, /subscriptions_read_own[\s\S]*auth\.uid\(\)\) = user_id/);
  assert.match(sql, /profiles_read_own[\s\S]*auth\.uid\(\)\) = id/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /if p_observed_at < current_event then return/);
  assert.match(sql, /on conflict\(id\) do nothing/);
  assert.match(sql, /public\.download_usage\.count<3/);
  assert.match(sql, /revoke all on function public\.qraftt_consume_download[\s\S]*from public,anon,authenticated/);
});
test("checkout starts before auth while entitlement requires verified ownership", () => {
  const checkout = source("app/api/paypal/subscriptions/route.ts");
  assert.match(checkout, /prepareGuestCheckout\(planId, interval\)/);
  assert.doesNotMatch(checkout, /status: 401/);
  assert.match(source("lib/billing/server.ts"), /if \(user\) return user\.id/);
  assert.doesNotMatch(source("lib/billing/server.ts"), /new BillingStore/);
  assert.match(source("app/api/paypal/confirm/route.ts"), /stored\.customer_id !== customer/);
  assert.match(source("app/api/paypal/webhook/route.ts"), /actual\.customerId !== stored\.paypal_custom_id/);
  assert.ok(source("lib/supabase/server.ts").startsWith('import "server-only"'));
  assert.doesNotMatch(source("app/api/paypal/sandbox-checkout/route.ts"), /createSubscription/);
});
test("private account routes stay outside the public sitemap and session refresh stays scoped", () => {
  assert.match(source("app/(account)/layout.tsx"), /await requireUser\(\)/);
  assert.match(source("app/(account)/layout.tsx"), /index: false/);
  assert.match(source("app/(auth)/layout.tsx"), /index: false/);
  assert.doesNotMatch(source("app/sitemap.ts"), /\/dashboard|\/account|\/signup|\/login/);
  assert.doesNotMatch(source("proxy.ts"), /matcher:.*\/\(\(/);
});
