import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { componentFixture } from "./helpers/render-component.mjs";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("public account entry is Login when signed out and Dashboard when authenticated", () => {
  const { HeaderAccountAnchor } = componentFixture("components/layout/header-account.tsx");
  const signedOut = renderToStaticMarkup(createElement(HeaderAccountAnchor, { authenticated: false }));
  assert.match(signedOut, /href="\/login"/); assert.match(signedOut, />Login</);
  const signedIn = renderToStaticMarkup(createElement(HeaderAccountAnchor, { authenticated: true }));
  assert.match(signedIn, /href="\/dashboard"/); assert.match(signedIn, />Dashboard</);
  assert.doesNotMatch(signedIn, />Login</);
});
test("one header provider serves desktop and mobile while public page rendering stays static", () => {
  const header = source("components/layout/header.tsx");
  assert.equal(header.match(/<HeaderAccountLink \/>/g)?.length, 2);
  assert.match(header, /<HeaderAccountProvider>/);
  assert.match(header, /header-cta[\s\S]*HeaderAccountLink/);
  assert.match(header, /mobile-menu-cta[\s\S]*HeaderAccountLink/);
  assert.doesNotMatch(header, /next\/headers|authClient|currentUser|supabase/);
  const client = source("components/layout/header-account.tsx");
  assert.match(client, /cache: "no-store"/); assert.match(client, /controller.abort\(\)/);
  assert.match(client, /addEventListener\("focus"/); assert.match(client, /\[pathname\]/);
  assert.doesNotMatch(client, /localStorage|plan:|service_role|clientSecret/);
});
test("header status endpoint verifies the session and exposes no account details or cached identity", async () => {
  for (const user of [null, { id: "fixture", email: "private@example.test" }]) {
    let checks = 0;
    const { GET } = componentFixture("app/api/auth/session/route.ts", { "@/lib/supabase/server": { currentUser: async () => { checks++; return user; } } });
    const response = await GET();
    assert.equal(checks, 1); assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.get("vary"), "Cookie");
    assert.deepEqual(await response.json(), { authenticated: Boolean(user) });
  }
});
test("an unavailable auth backend fails safely without inventing authenticated status", async () => {
  const { GET } = componentFixture("app/api/auth/session/route.ts", { "@/lib/supabase/server": { currentUser: async () => { throw new Error("Private upstream detail"); } } });
  const response = await GET(); assert.equal(response.status, 503);
  assert.doesNotMatch(JSON.stringify(await response.json()), /Private upstream|token|secret/);
});
test("account navigation exposes creation and marks future features clearly; profile plan is read-only", () => {
  const nav = source("components/account/dashboard-shell.tsx");
  assert.match(nav, /\["Create QR Code", "\/qr-code-generator"/);
  assert.match(nav, /comingSoon.has\(href\)/);
  const profile = source("app/(account)/account/page.tsx");
  assert.match(profile, /await dashboardAccount\(\)/); assert.match(profile, /access.pro \? "Pro active" : "Free plan"/);
  assert.match(profile, /action=\{logout\}/); assert.doesNotMatch(profile, /name="plan"|\.update\(/);
});
