import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { siteConfig } from "../lib/site.ts";
import { checkoutReturnPath } from "../lib/pricing/checkout.ts";
import { safeReturnPath } from "../lib/auth/redirect.ts";
import { pricingPlans } from "../lib/pricing/plans.ts";
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage reuses full pricing with section semantics and leaves return handling on pricing", () => {
  const home = source("app/page.tsx");
  const pricing = source("components/pricing/pricing-comparison.tsx");
  assert.match(home, /<PricingComparison embedded \/>/);
  assert.ok(home.indexOf("<PricingComparison embedded") < home.indexOf('className="closing-section"'));
  assert.match(pricing, /const Root = embedded \? "section" : "main"/);
  assert.match(pricing, /const Heading = embedded \? "h2" : "h1"/);
  assert.match(pricing, /embedded \|\| params.get\("paypal"\)/);
  assert.match(pricing, /embedded \|\| !interval/);
  assert.match(source("app/pricing/page.tsx"), /<PricingComparison \/>/);
});

test("public navigation exposes pricing on desktop and mobile", () => {
  assert.ok(siteConfig.navigation.some(([label, href]) => label === "Pricing" && href === "/pricing"));
  const header = source("components/layout/header.tsx");
  assert.match(header, /href="\/pricing" className="header-pricing-link"/);
  assert.match(header, /aria-label="Mobile navigation"/);
  assert.equal(header.match(/siteConfig.navigation.map/g)?.length, 2);
});

test("all reusable generator workspaces expose Free and Pro without hiding premium controls", () => {
  const generator = source("components/generator/qr-generator.tsx");
  assert.match(generator, /aria-label=\{t\("Free and Pro plans"\)\}/);
  assert.match(generator, /Upgrade to Pro/);
  assert.match(generator, /href="\/pricing"><T text="Compare plans"/);
  assert.match(generator, /sandboxMonthlyTest=\{Boolean\(access\?\.sandboxMonthlyTest\)\}/);
  assert.match(generator, /onRequestPro=\{\(\) => setPaywall/);
  assert.match(generator, /validateExportAccess/);
});

test("premium prompts reuse the PayPal-first flow and retain accurate final pricing", () => {
  const prompt = source("components/billing/upgrade-prompt.tsx");
  for (const period of ["monthly"] as const) {
    assert.equal(safeReturnPath(checkoutReturnPath(period)), `/pricing?checkout=${period}`);
    assert.ok(prompt.includes(`checkoutReturnPath("${period}")`));
  }
  assert.match(prompt, /prefetch=\{false\}/);
  assert.match(prompt, /USD 1.00\/month/);
  assert.match(prompt, /PayPal opens first/);
  assert.match(prompt, /Keep using Free/);
  assert.doesNotMatch(prompt, /href="\/login|href="\/signup|api\/paypal/);
  assert.deepEqual(pricingPlans.map(plan => plan.id), ["free", "pro"]);
  assert.deepEqual(pricingPlans[1].prices, { monthly: 2, yearly: 19.99 });
  assert.doesNotMatch(prompt, /checkoutReturnPath\("yearly"\)/);
});
