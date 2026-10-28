import assert from "node:assert/strict";
import test from "node:test";
import { pricingPlans, planBenefits, pricingDisplayAmount } from "../lib/pricing/plans.ts";
import { safeReturnPath } from "../lib/auth/redirect.ts";
import { componentFixture } from "./helpers/render-component.mjs";
import { renderToStaticMarkup } from "react-dom/server";
test("one free offer includes every feature with identical account limits", () => {
  assert.equal(pricingPlans.length, 1);
  const plan = pricingPlans[0];
  assert.equal(plan.id, "free"); assert.equal(plan.checkout, null);
  assert.deepEqual(plan.prices, { monthly: 0, yearly: 0 });
  assert.ok(Object.values(plan.benefits).every(value => value !== false));
  assert.deepEqual(planBenefits(plan, "monthly"), planBenefits(plan, "yearly"));
  assert.equal(plan.benefits.saved, "100 QR codes"); assert.equal(plan.benefits.storage, "250 MB");
  for (const period of ["monthly", "yearly"] as const) for (const sandbox of [false, true]) assert.equal(pricingDisplayAmount(plan, period, sandbox), 0);
});
test("pricing renders all export formats and no purchase controls", () => {
  const { PricingComparison } = componentFixture("components/pricing/pricing-comparison.tsx");
  const html = renderToStaticMarkup(PricingComparison({}));
  for (const text of ["Completely free", "PNG", "JPG", "SVG", "PDF", "EPS", "250 MB", "100", "Unlimited", "Logo QR"]) assert.ok(html.includes(text));
  assert.doesNotMatch(html, /Upgrade|checkout|PayPal|PRO|4\.99|19\.99/);
});
test("old checkout return destinations cannot restart a purchase after login", () => {
  for (const value of ["/pricing?checkout=monthly", "/pricing?checkout=yearly", "/pricing?paypal=approved"]) assert.equal(safeReturnPath(value), "/dashboard");
});
