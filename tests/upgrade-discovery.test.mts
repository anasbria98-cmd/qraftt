import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { componentFixture } from "./helpers/render-component.mjs";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("homepage and pricing retain URLs and semantics without purchase handlers", () => {
  assert.match(source("app/page.tsx"), /<PricingComparison embedded \/>/);
  assert.match(source("components/pricing/pricing-comparison.tsx"), /const Root = embedded \? "section" : "main"/);
  assert.match(source("components/layout/header.tsx"), /Free features/);
});
test("no public generator or customization component contains a paywall", () => {
  for (const path of ["components/generator/qr-generator.tsx", "components/generator/generator-customization.tsx", "components/account/dashboard-shell.tsx", "components/account/saved-qr-library.tsx", "components/account/auth-page.tsx"]) {
    assert.doesNotMatch(source(path), /ProBadge|setPaywall|UpgradePrompt|onRequestPro|Unlock Pro| · PRO|upgrade flow|Explore Pro/);
  }
  assert.equal(existsSync(new URL("../components/billing/upgrade-prompt.tsx", import.meta.url)), false);
});
test("all former purchase, claim and cancellation endpoints are inert", async () => {
  for (const name of ["subscriptions", "confirm", "sandbox-checkout", "abandon", "cleanup"]) {
    const path = `app/api/paypal/${name}/route.ts`;
    assert.doesNotMatch(source(path), /getPayPalClient|adminClient|createSubscription|cancelUnclaimedCheckout/);
    const handler = componentFixture(path);
    for (const method of ["GET", "POST"]) assert.equal((await handler[method](new Request(`https://qraftt.test/api/paypal/${name}`))).status, 410);
  }
  assert.doesNotMatch(source("vercel.json"), /paypal/);
  assert.doesNotMatch(source("app/api/paypal/webhook/route.ts"), /cancelUnclaimedCheckout|pending_paypal_checkouts/);
});
