import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";
import { defaultDesign } from "../lib/qr/design.ts";

test("main QR choices precede unchanged customization tabs and template galleries", () => {
  const { GeneratorCustomization } = componentFixture("components/generator/generator-customization.tsx");
  for (const pro of [false, true]) {
    const markup = renderToStaticMarkup(createElement(GeneratorCustomization, {
      pro, design: defaultDesign, errorCorrection: "M", warnings: [],
      onDesignChange() {}, onErrorCorrectionChange() {}, onReset() {},
    }));
    assert.match(markup, /Classic QR/);
    assert.match(markup, /Logo QR/);
    assert.equal((markup.match(/class="qr-mode-thumbnail[" ]/g) ?? []).length, 6);
    for (const logo of ["nike.svg", "mcdonalds.svg", "coca-cola.svg"]) assert.ok(markup.includes(`/images/brand/${logo}`));
    assert.doesNotMatch(markup, /qr-mode-instagram|qr-mode-youtube|google-g\.svg/);
    assert.ok(markup.indexOf("qr-mode-choices") < markup.indexOf('role="tablist"'));
    for (const tab of ["frames", "shapes", "logo", "level"]) assert.ok(markup.includes(`id="customize-tab-${tab}"`));
    assert.match(markup, /Free templates/);
    assert.match(markup, /New Pro templates/);
  }
  const source = readFileSync(new URL("../components/generator/generator-customization.tsx", import.meta.url), "utf8");
  assert.ok(source.includes('if (!pro) { onRequestPro?.(); return; } setActiveTab("logo")'));
});
