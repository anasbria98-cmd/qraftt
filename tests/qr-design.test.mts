import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultDesign,
  designPresets,
  designTemplates,
  frameOptions,
  getDesignWarnings,
  type QrDesignOptions,
} from "../lib/qr/design.ts";
import {
  QUIET_ZONE_MODULES,
  renderQrSvg,
  setSvgDimensions,
} from "../lib/qr/render.ts";

const baseDesign: QrDesignOptions = { ...defaultDesign };

test("renders reusable body, eye, gradient, frame, and logo customization", () => {
  const svg = renderQrSvg("https://example.com", "H", {
    ...baseDesign,
    bodyStyle: "dots",
    eyeStyle: "circle",
    frame: "scan-me",
    gradientColor: "#287a54",
    logoDataUrl: "data:image/png;base64,iVBORw0KGgo=",
    logoSize: 18,
  });

  assert.equal(QUIET_ZONE_MODULES, 4);
  assert.match(svg, /<linearGradient id="qr-gradient"/);
  assert.match(svg, /data-qr-eye="circle"/);
  assert.match(svg, /<circle/);
  assert.match(svg, />SCAN ME<\/text>/);
  assert.match(svg, /<image href="data:image\/png;base64,iVBORw0KGgo="/);
});

test("presets maintain safe foreground and background contrast", () => {
  for (const preset of designPresets) {
    const safety = getDesignWarnings({
      ...preset.design,
      logoDataUrl: null,
      logoSize: 16,
    });
    assert.ok(
      safety.minimumContrast >= 4.5,
      `${preset.name} should retain reliable color contrast`,
    );
  }
});

test("template and frame galleries stay complete and scan-safe", () => {
  assert.ok(designTemplates.length >= 15 && designTemplates.length <= 20);
  assert.equal(designTemplates[0].id, "none");
  assert.ok(frameOptions.length >= 12 && frameOptions.length <= 15);

  for (const template of designTemplates) {
    const design = {
      ...template.design,
      logoDataUrl: null,
      logoSize: 16,
    };
    assert.ok(
      getDesignWarnings(design).minimumContrast >= 4.5,
      `${template.name} should retain reliable color contrast`,
    );
    assert.match(renderQrSvg("https://example.com", "H", design), /viewBox="0 0 1000 1000"/);
  }
});

test("SVG resolution changes preserve vector artwork and view box", () => {
  const svg = renderQrSvg("https://example.com", "M", baseDesign);
  const resized = setSvgDimensions(svg, 2_000);

  assert.match(resized, /width="2000" height="2000"/);
  assert.match(resized, /viewBox="0 0 1000 1000"/);
});
