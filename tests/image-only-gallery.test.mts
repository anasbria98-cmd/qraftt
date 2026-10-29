import test from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";
import { defaultDesign, designTemplates } from "../lib/qr/design.ts";
import { premiumTemplates } from "../lib/qr/premium-templates.ts";
import { freeDesign } from "../lib/qr/access.ts";

test("gallery cards contain only artwork while retaining names for assistive technology", () => {
  const { GeneratorCustomization } = componentFixture("components/generator/generator-customization.tsx");
  const html = renderToStaticMarkup(createElement(GeneratorCustomization, {
    design: { ...defaultDesign, ...designTemplates[0].design }, errorCorrection: "M", warnings: [],
    onDesignChange() {}, onErrorCorrectionChange() {}, onReset() {},
  }));
  const cards = [...html.matchAll(/<button\b[^>]*class="(?:design|frame)-gallery-card[^>]*>[\s\S]*?<\/button>/g)].map(match => match[0]);
  assert.equal(cards.length, 32); // 11 Free slots, all 10 art slots and 11 Standard Frame slots.
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
  assert.equal(names[11].replaceAll("&amp;", "&"), premiumTemplates[0].name);
  assert.match(html, /aria-label="Preview Shopping cart"/);
  assert.match(html, /class="gallery-preview-button"/);
  const decorative = html.split('aria-label="Decorative templates"')[1].split('</section>')[0];
  const decorativeNames = [...decorative.matchAll(/<button\b[^>]*aria-label="([^"]+)"[^>]*class="design-gallery-card/g)].map(match => match[1].replaceAll("&amp;", "&"));
  assert.deepEqual(decorativeNames, premiumTemplates.map(template => template.name));
  assert.doesNotMatch(decorative, /library-expand-button|View all|Show fewer/);
  assert.match(html, /View all 30 templates/);
  assert.match(html, /View all 30 frames/);
  for (const id of ["free-template-gallery", "standard-frame-gallery"]) {
    const sectionEnd = html.slice(html.indexOf(`id="${id}"`)).split("</section>")[0].trim();
    assert.match(sectionEnd, /class="library-expand-button gallery-more-card"[\s\S]*<\/button><\/div>$/);
    assert.match(sectionEnd, new RegExp(`aria-controls="${id}"`));
  }
});

test("No template reflects the actual unchanged reset design", () => {
  const { GeneratorCustomization } = componentFixture("components/generator/generator-customization.tsx");
  const html = renderToStaticMarkup(createElement(GeneratorCustomization, {
    design: freeDesign, errorCorrection: "M", warnings: [], onDesignChange() {}, onErrorCorrectionChange() {}, onReset() {},
  }));
  assert.match(html, /aria-label="No template" aria-pressed="true" class="design-gallery-card active"/);
});
