import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";
import { defaultDesign, designTemplates } from "../lib/qr/design.ts";
import { premiumTemplates } from "../lib/qr/premium-templates.ts";

test("gallery cards contain only artwork while retaining names for assistive technology", () => {
  const { GeneratorCustomization } = componentFixture("components/generator/generator-customization.tsx");
  const html = renderToStaticMarkup(createElement(GeneratorCustomization, {
    design: { ...defaultDesign, ...designTemplates[0].design }, errorCorrection: "M", warnings: [],
    onDesignChange() {}, onErrorCorrectionChange() {}, onReset() {},
  }));
  const cards = [...html.matchAll(/<button\b[^>]*class="(?:design|frame)-gallery-card[^>]*>[\s\S]*?<\/button>/g)].map(match => match[0]);
  assert.equal(cards.length, 30); // 12 original/uploaded slots, 8 art slots and 10 Standard Frame slots.
  for (const card of cards) {
    assert.match(card, /aria-label="[^"]+"/);
    assert.match(card, /aria-pressed="(?:true|false)"/);
    assert.match(card, /class="(?:design|frame)-gallery-preview"/);
    assert.equal(card.replace(/<[^>]*>/g, "").trim(), "");
  }
  assert.doesNotMatch(html, /design-gallery-copy|<small>Uploaded illustrated frame/);
  assert.match(html, /class="design-gallery-card active"/);
  const names = [...html.matchAll(/<button\b[^>]*aria-label="([^"]+)"[^>]*class="design-gallery-card/g)].map(match => match[1]);
  assert.equal(names[1], designTemplates[0].name);
  assert.equal(names[12].replaceAll("&amp;", "&"), premiumTemplates[0].name);
  assert.match(html, /aria-label="Preview Shopping cart"/);
  assert.match(html, /class="gallery-preview-button"/);
});
