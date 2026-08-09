import assert from "node:assert/strict";
import test from "node:test";
import {
  designPresets,
  getDesignWarnings,
  type QrDesignOptions,
} from "../lib/qr/design.ts";
import { QUIET_ZONE_MODULES, renderQrSvg } from "../lib/qr/render.ts";

const baseDesign: QrDesignOptions = {
  background: "#ffffff",
  bodyStyle: "square",
  eyeStyle: "square",
  foreground: "#102a2a",
  frame: "none",
  gradientColor: null,
  logoDataUrl: null,
  logoSize: 16,
};

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
