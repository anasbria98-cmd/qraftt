import assert from "node:assert/strict";
import test from "node:test";
import { displayCurrencies, formatDisplayPrice, isDisplayCurrency } from "../lib/pricing/currencies.ts";
import { pricingPlans, pricingDisplayAmount } from "../lib/pricing/plans.ts";
import { checkoutPeriod, checkoutReturnPath } from "../lib/pricing/checkout.ts";
import { readFileSync } from "node:fs";

test("checkout resumes only allowlisted billing periods and keeps public final prices", () => {
  assert.equal(checkoutPeriod("monthly"), "monthly");
  assert.equal(checkoutPeriod("yearly"), "yearly");
  for (const value of [null, "", "business", "https://evil.test", {}]) assert.equal(checkoutPeriod(value), null);
  assert.equal(checkoutReturnPath("yearly"), "/pricing?checkout=yearly");
  const source = readFileSync(new URL("../components/pricing/pricing-comparison.tsx", import.meta.url), "utf8");
  assert.match(source, /formatPrice\(plan.prices\[period\]\)/);
  assert.match(source, /authDialog.current\?\.showModal\(\)/);
  assert.match(source, /data.login && data.approved/);
  assert.match(source, /\/login\?next=%2Fpricing%3Fpaypal%3Dapproved/);
  assert.doesNotMatch(source.slice(source.indexOf("const upgrade ="), source.indexOf("const currency =")), /showModal/);
  assert.match(source, /resumed.current = true/);
  assert.doesNotMatch(source, /pricingDisplayAmount/);
});

test("converts all six display currencies while preserving the USD source prices", () => {
  assert.deepEqual(displayCurrencies, ["USD", "EUR", "GBP", "CAD", "AUD", "MAD"]);
  assert.equal(isDisplayCurrency("USD"), true);
  assert.equal(isDisplayCurrency("invalid"), false);
  assert.equal(formatDisplayPrice(5, "USD"), "$5");
  assert.equal(formatDisplayPrice(39, "USD"), "$39");
  assert.equal(formatDisplayPrice(5, "EUR"), "€4.46");
  assert.equal(formatDisplayPrice(39, "GBP"), "£29.47");
  assert.match(formatDisplayPrice(59, "MAD"), /579\.23/);
  for (const currency of displayCurrencies) {
    assert.match(formatDisplayPrice(0, currency), /0/);
    for (const plan of pricingPlans) {
      assert.doesNotMatch(formatDisplayPrice(plan.prices.monthly, currency), /NaN/);
      assert.doesNotMatch(formatDisplayPrice(plan.prices.yearly, currency), /NaN/);
    }
  }
  assert.deepEqual(pricingPlans.map((plan) => plan.prices), [
    { monthly: 0, yearly: 0 }, { monthly: 4.99, yearly: 19.99 },
  ]);
});

test("local Sandbox display overrides only monthly Pro and preserves final prices", () => {
  const pro = pricingPlans.find(plan => plan.id === "pro")!;
  const free = pricingPlans.find(plan => plan.id === "free")!;
  assert.equal(pricingDisplayAmount(pro, "monthly", true), 1);
  assert.equal(pricingDisplayAmount(pro, "yearly", true), 19.99);
  assert.equal(pricingDisplayAmount(pro, "monthly", false), 4.99);
  assert.equal(pricingDisplayAmount(free, "monthly", true), 0);
  assert.deepEqual(pro.prices, { monthly: 4.99, yearly: 19.99 });
});
