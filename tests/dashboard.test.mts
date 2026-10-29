import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";
import { PayPalClient } from "../lib/paypal/client.ts";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("every account card exposes the complete free toolkit without checkout", () => {
  const { SubscriptionCard } = componentFixture("components/account/subscription-card.tsx");
  const html = renderToStaticMarkup(createElement(SubscriptionCard));
  for (const text of ["Free", "All features included", "100 QR codes", "250 MB", "Create a QR code"]) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /Upgrade|checkout|Pro active/);
});
test("account storage replaces paid plans but preserves historical records read-only", () => {
  const code = source("app/(account)/dashboard/billing/page.tsx");
  assert.match(code, /Historical payment records/);
  assert.match(code, /not automatically cancelled or changed/);
  assert.match(code, /eq\("user_id", user.id\)/);
  assert.doesNotMatch(code, /BillingPlans|createSubscription|checkout=|\.insert\(|\.update\(/);
});
test("dashboard navigation is complete and storage does not invent usage", async () => {
  const { DashboardShell } = componentFixture("components/account/dashboard-shell.tsx");
  const markup = renderToStaticMarkup(createElement(DashboardShell, { email: "fixture@example.test", pro: false }, "Dashboard fixture"));
  for (const text of ["Dashboard", "My QR Codes", "Statistics", "Import from CSV", "Archived QR Codes", "Custom Domain", "API Integration", "Profile", "Account &amp; storage", "Support", "FAQ", "Log out"]) assert.ok(markup.includes(text), text);
  assert.match(markup, /aria-current="page"/); assert.match(markup, /aria-controls="dashboard-navigation"/);
  assert.match(markup, /class="brand"/);
  assert.doesNotMatch(markup, /workspaceMark|>Free<|Free account/);
  for (const path of ["statistics", "import", "archive", "domains", "api"]) assert.doesNotMatch(markup, new RegExp(`href="/dashboard/${path}"`));
  assert.equal((markup.match(/aria-disabled="true"/g) ?? []).length, 5);
  const storage = componentFixture("components/account/storage-card.tsx", { "@/lib/account/saved-qr": { savedQr: async () => { throw new Error("offline"); } } }).StorageCard;
  const state = renderToStaticMarkup(await storage());
  assert.match(state, /Storage usage is temporarily unavailable/); assert.doesNotMatch(state, /0 GB|100 MB/);
});

test("usage overview shows measured count, decimal MB and remaining capacity", async () => {
  const { StorageCard } = componentFixture("components/account/storage-card.tsx", { "@/lib/account/saved-qr": { savedQr: async (action: string) => {
    assert.equal(action, "usage"); return { count: 37, bytes: 125_500_000, savedLimit: 100, storageLimit: 250_000_000 };
  } } });
  const html = renderToStaticMarkup(await StorageCard({ title: "Usage overview" }));
  for (const text of ["Usage overview", "37 / 100", "125.5 MB / 250 MB", "63", "124.5 MB", "QR codes remaining"]) assert.ok(html.includes(text), text);
  assert.match(html, /aria-label="Saved QR codes used" value="37" max="100"/);
  assert.match(html, /aria-label="Saved QR storage used" value="125500000" max="250000000"/);
});

test("over-quota accounts retain honest usage and zero remaining capacity", async () => {
  const { StorageCard } = componentFixture("components/account/storage-card.tsx", { "@/lib/account/saved-qr": { savedQr: async () => ({ count: 110, bytes: 260_000_000, savedLimit: 100, storageLimit: 250_000_000 }) } });
  const html = renderToStaticMarkup(await StorageCard());
  assert.ok(html.includes("110 / 100")); assert.ok(html.includes("260 MB / 250 MB"));
  assert.doesNotMatch(html, /-10|-10 MB/);
});

test("recent designs are newest first, bounded, read-only and preserve edit/download links", async () => {
  const calls: string[] = [];
  const records = [1, 3, 2, 4].map(n => ({ id: `owned-${n}`, title: `Saved <QR> ${n}`, updated_at: `2026-10-${20 + n}T00:00:00Z`, storage_bytes: 100 }));
  const { RecentQrCodes } = componentFixture("components/account/recent-qr-codes.tsx", {
    "next/image": { __esModule: true, default: ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => createElement("img", { src, alt, width, height }) },
    "@/lib/account/saved-qr": { savedQr: async (action: string, input?: { id: string }) => {
      calls.push(`${action}:${input?.id ?? ""}`);
      if (action === "list") return records;
      assert.equal(action, "get");
      return { document: { type: "url", values: { url: "https://example.com" }, design: {}, correction: "M" } };
    } },
    "@/lib/qr/render": { renderQrSvg: () => "<svg/>" },
    "@/lib/qr/exports": { exportQr: async () => Buffer.from("fixture-png") },
  });
  const html = renderToStaticMarkup(await RecentQrCodes());
  assert.deepEqual(calls, ["list:", "get:owned-4", "get:owned-3", "get:owned-2"]);
  assert.ok(html.indexOf("Saved &lt;QR&gt; 4") < html.indexOf("Saved &lt;QR&gt; 3"));
  assert.match(html, /saved=owned-4/); assert.match(html, /Edit \/ download/); assert.match(html, /data:image\/png;base64/);
  assert.doesNotMatch(html, /saved=owned-1/);
});

test("recent designs distinguish empty libraries, failed loads and unavailable previews", async () => {
  for (const fail of [false, true]) {
    const { RecentQrCodes } = componentFixture("components/account/recent-qr-codes.tsx", { "@/lib/account/saved-qr": { savedQr: async () => { if (fail) throw new Error("offline"); return []; } } });
    const html = renderToStaticMarkup(await RecentQrCodes());
    assert.ok(html.includes(fail ? "temporarily unavailable" : "No saved QR codes yet"));
    if (fail) assert.doesNotMatch(html, /No saved QR codes yet/);
    else assert.match(html, /Create QR Code/);
  }
  const { RecentQrCodes } = componentFixture("components/account/recent-qr-codes.tsx", { "@/lib/account/saved-qr": { savedQr: async (action: string) => {
    if (action === "get") throw new Error("preview unavailable");
    return [{ id: "owned", title: "Preserved", updated_at: "2026-10-28T00:00:00Z" }];
  } } });
  const html = renderToStaticMarkup(await RecentQrCodes());
  assert.match(html, /Preview unavailable/); assert.match(html, /saved=owned/); assert.match(html, /Preserved/);
});
test("dashboard pages enforce auth, RLS ownership and environment-isolated billing without mutations", () => {
  assert.match(source("app/(account)/layout.tsx"), /await requireUser\(\)/);
  const loader = source("lib/account/dashboard.ts");
  assert.match(loader, /await requireUser\(\)/); assert.match(loader, /\.eq\("id", user.id\)/);
  assert.doesNotMatch(loader, /subscriptions|PayPal|entitlement/);
  assert.doesNotMatch(loader, /\.insert\(|\.update\(|adminClient/);
  const billing = source("app/(account)/dashboard/billing/page.tsx");
  assert.match(billing, /from\("subscriptions"\).select/);
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
  assert.match(source("app/(account)/dashboard/billing/page.tsx"), /history.error/);
});
