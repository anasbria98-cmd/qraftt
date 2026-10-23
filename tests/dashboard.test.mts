import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";
import { PayPalClient } from "../lib/paypal/client.ts";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("Free and Pro subscription cards use real supplied state without unnecessary Pro upgrade prompts", () => {
  const { SubscriptionCard } = componentFixture("components/account/subscription-card.tsx");
  const free = renderToStaticMarkup(createElement(SubscriptionCard, { access: { pro: false, status: "FREE", remaining: 3 }, subscription: null }));
  assert.match(free, /Free plan/); assert.match(free, /Upgrade to Pro/); assert.match(free, /\/pricing\?checkout=monthly/);
  assert.doesNotMatch(free, /Subscription ID/);
  const pro = renderToStaticMarkup(createElement(SubscriptionCard, { access: { pro: true, status: "ACTIVE", remaining: 3 }, subscription: { id: "I-FIXTURE", billing_interval: "monthly", current_period_end: null } }));
  for (const value of ["Pro", "Active", "monthly", "I-FIXTURE", "Create with Pro"]) assert.ok(pro.includes(value));
  assert.doesNotMatch(pro, /Upgrade to Pro/);
  assert.match(pro, /Not supplied/);
});
test("billing plans reuse pricing and checkout and support both billing periods", () => {
  const { BillingPlans } = componentFixture("components/account/billing-plans.tsx");
  const free = renderToStaticMarkup(createElement(BillingPlans, { pro: false }));
  assert.match(free, /\$4.99/); assert.match(free, /Yearly/); assert.match(free, /disabled/);
  assert.match(free, /\/pricing\?checkout=monthly/); assert.doesNotMatch(free, /checkout=yearly/);
  assert.match(free, /20 original templates/);
  assert.match(free, /20 original \+ 10 Pro templates/);
  assert.match(source("components/account/billing-plans.tsx"), /String\(benefits.templates\)/);
  const yearly = renderToStaticMarkup(createElement(BillingPlans, { pro: true, interval: "yearly" }));
  assert.match(yearly, /\$19.99/); assert.match(yearly, /500 QR codes/); assert.match(yearly, /1 GB/);
  const pro = renderToStaticMarkup(createElement(BillingPlans, { pro: true }));
  assert.doesNotMatch(pro, /Upgrade to Pro/); assert.match(pro, /Current plan/);
});
test("dashboard navigation is complete and storage does not invent usage", async () => {
  const { DashboardShell } = componentFixture("components/account/dashboard-shell.tsx");
  const markup = renderToStaticMarkup(createElement(DashboardShell, { email: "fixture@example.test", pro: false }, "Dashboard fixture"));
  for (const text of ["Dashboard", "My QR Codes", "Statistics", "Import from CSV", "Archived QR Codes", "Custom Domain", "API Integration", "Profile", "Payment &amp; Subscription", "Support", "FAQ", "Log out"]) assert.ok(markup.includes(text), text);
  assert.match(markup, /aria-current="page"/); assert.match(markup, /aria-controls="dashboard-navigation"/);
  const storage = componentFixture("components/account/storage-card.tsx", { "@/lib/account/saved-qr": { savedQr: async () => { throw new Error("offline"); } } }).StorageCard;
  const state = renderToStaticMarkup(await storage());
  assert.match(state, /Storage usage is temporarily unavailable/); assert.doesNotMatch(state, /0 GB|100 MB/);
});
test("dashboard pages enforce auth, RLS ownership and environment-isolated billing without mutations", () => {
  assert.match(source("app/(account)/layout.tsx"), /await requireUser\(\)/);
  const loader = source("lib/account/dashboard.ts");
  assert.match(loader, /await requireUser\(\)/); assert.match(loader, /\.eq\("user_id", user.id\)/);
  assert.match(loader, /currentPayPalPlanIds\(process.env\)/); assert.match(loader, /getBillingStore\(\).entitlement\(user.id\)/);
  assert.doesNotMatch(loader, /\.insert\(|\.update\(|adminClient/);
  const billing = source("app/(account)/dashboard/billing/page.tsx");
  assert.match(billing, /getRecentTransactions\(account.subscription.id\)/);
  assert.doesNotMatch(billing, /searchParams|createSubscription|clientSecret|service.role/i);
  assert.match(source("app/(account)/dashboard/[section]/page.tsx"), /notFound\(\)/);
});
test("auth presentation keeps Supabase actions, callback continuation and honest pending states", () => {
  const auth = source("components/account/auth-page.tsx");
  for (const value of ["authReturnPath(params.next)", "safeReturnPath(next)", "action={config.action}", "AuthSubmit", "PasswordField"]) assert.ok(auth.includes(value));
  assert.match(source("components/account/auth-fields.tsx"), /useFormStatus/);
  assert.match(source("components/account/auth-fields.tsx"), /disabled=\{pending\}/);
  assert.match(source("lib/auth/actions.ts"), /signInWithPassword/);
  assert.match(source("lib/auth/actions.ts"), /resetPasswordForEmail/);
});
test("payment history reads only the requested subscription and never leaks payer details", async () => {
  const urls: string[] = [];
  const client = new PayPalClient({ environment: "live", clientId: "fixture", clientSecret: "fixture", fetch: async input => {
    urls.push(String(input));
    return Response.json(String(input).endsWith("token") ? { access_token: "fixture" } : { transactions: [{ id: "TX-1", status: "COMPLETED", time: "2026-10-20T00:00:00Z", payer_email: "private@example.test", amount_with_breakdown: { gross_amount: { value: "2.00", currency_code: "USD" } } }] });
  } });
  await assert.rejects(client.getRecentTransactions("../other-user"));
  const rows = await client.getRecentTransactions("I-OWNED");
  assert.match(urls[1], /https:\/\/api-m.paypal.com\/v1\/billing\/subscriptions\/I-OWNED\/transactions\?/);
  assert.deepEqual(rows, [{ id: "TX-1", status: "COMPLETED", time: "2026-10-20T00:00:00Z", amount: "2.00", currency: "USD" }]);
});

test("payment history reports upstream failure instead of inventing an empty payment list", async () => {
  for (const status of [401, 403, 404, 500]) {
    const client = new PayPalClient({ environment: "live", clientId: "fixture", clientSecret: "fixture", fetch: async input =>
      String(input).endsWith("token") ? Response.json({ access_token: "fixture" }) : Response.json({ error: "unavailable" }, { status }) });
    await assert.rejects(client.getRecentTransactions("I-OWNED"));
  }
  assert.match(source("app/(account)/dashboard/billing/page.tsx"), /historyUnavailable = true/);
});
