import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  defaultDesign,
  designPresets,
  designTemplates,
  frameOptions,
  getDesignWarnings,
  noTemplate,
  type QrDesignOptions,
} from "../lib/qr/design.ts";
import {
  QUIET_ZONE_MODULES,
  renderFramePreviewSvg,
  renderQrSvg,
  setSvgDimensions,
} from "../lib/qr/render.ts";

const baseDesign: QrDesignOptions = { ...defaultDesign };

test("keeps generated gallery artwork out of server-rendered HTML", async () => {
  const source = await readFile(
    new URL("../components/generator/generator-customization.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /URL\.createObjectURL\(new Blob/);
  assert.doesNotMatch(source, /data:image\/svg\+xml;charset=utf-8/);
  assert.match(source, /previewsReady/);
});

test("renders reusable body, independent eyes, gradient, frame, and logo customization", () => {
  const svg = renderQrSvg("https://example.com", "H", {
    ...baseDesign,
    bodyStyle: "diamond",
    frame: "scan-me",
    gradientColor: "#287a54",
    innerEyeColor: "#7c2d12",
    innerEyeStyle: "diamond",
    logoDataUrl: "data:image/png;base64,iVBORw0KGgo=",
    logoSize: 18,
    outerEyeColor: "#164e63",
    outerEyeStyle: "circle",
  });

  assert.equal(QUIET_ZONE_MODULES, 4);
  assert.match(svg, /<linearGradient id="qr-gradient"/);
  assert.match(svg, /data-qr-body="diamond"/);
  assert.match(svg, /data-qr-outer-eye="circle"/);
  assert.match(svg, /data-qr-inner-eye="diamond"/);
  assert.match(svg, /#164e63/);
  assert.match(svg, /#7c2d12/);
  assert.match(svg, /data-frame-caption="SCAN ME"/);
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

test("template and frame libraries stay reduced, distinct, and scan-safe", () => {
  assert.equal(designTemplates.length, 30);
  assert.equal(noTemplate.id, "none");
  assert.equal(frameOptions.length, 30);
  assert.equal(new Set(designTemplates.map((template) => template.id)).size, designTemplates.length);
  assert.equal(new Set(designTemplates.filter(t => !t.design.uploadedFrameId).map((template) => template.design.artwork)).size, 20);
  assert.equal(new Set(frameOptions.map((frame) => frame.value)).size, frameOptions.length);
  assert.equal(new Set(frameOptions.map((frame) => frame.structure)).size, frameOptions.length);

  const renderedTemplates = new Set<string>();

  for (const template of designTemplates) {
    if (template.design.uploadedFrameId) {
      renderedTemplates.add(renderQrSvg("https://example.com", template.errorCorrection, { ...defaultDesign, ...template.design }));
      continue;
    }
    const design = {
      ...template.design,
      logoDataUrl: null,
      logoSize: 16,
    };
    assert.ok(
      getDesignWarnings(design).minimumContrast >= 4.5,
      `${template.name} should retain reliable color contrast`,
    );
    const svg = renderQrSvg("https://example.com", template.errorCorrection, design);
    assert.match(svg, /viewBox="0 0 1000 1000"/);
    renderedTemplates.add(svg);
    assert.notEqual(template.design.artwork, "none");
    assert.equal(template.errorCorrection, "H");
    assert.match(svg, new RegExp(`data-qr-artwork="${template.design.artwork}"`));
  }

  assert.equal(renderedTemplates.size, designTemplates.length);

  const renderedFrames = new Set(
    frameOptions.map((frame) =>
      renderQrSvg("https://example.com", "H", {
        ...baseDesign,
        frame: frame.value,
      }),
    ),
  );
  assert.equal(renderedFrames.size, frameOptions.length);

  for (const frame of frameOptions) {
    const preview = renderFramePreviewSvg(frame.value);
    assert.doesNotMatch(preview, /data-qr-outer-eye=/);
    assert.match(preview, /fill="#f8fafc"/);
    assert.match(preview, /data-frame-preview=/);
  }
});

test("proof-of-concept templates and frames render as real vector compositions", () => {
  const prototypeTemplates = [
    ["shop-window", "shopping-bag"],
    ["wildflower", "wildflower-corners"],
    ["rose-vows", "wedding-envelope"],
    ["coffee-house", "coffee-cup"],
    ["love-note", "heart-emblem"],
    ["cocktail", "lemonade-glass"],
    ["passport", "travel-suitcase"],
    ["birthday", "birthday-cake"],
  ] as const;
  const prototypeFrames = [
    "speech-top",
    "scan-me",
    "phone-card",
    "scan-now",
    "arrow-callout",
    "badge-circle",
    "star-burst",
    "scan-to-pay",
  ] as const;

  for (const [id, artwork] of prototypeTemplates) {
    const template = designTemplates.find((candidate) => candidate.id === id);
    assert.ok(template, `${id} template should exist`);
    assert.equal(template.design.artwork, artwork);
    assert.equal(template.design.frame, "none");
    assert.equal(template.design.decoration, "none");
    assert.equal(template.errorCorrection, "H");
    const svg = renderQrSvg("https://example.com/prototype", "H", {
      ...template.design,
      logoDataUrl: null,
      logoSize: 16,
    });
    assert.match(svg, new RegExp(`data-qr-artwork="${artwork}"`));
    assert.match(svg, /data-qr-outer-eye=/);
    assert.match(svg, /data-qr-inner-eye=/);
  }

  for (const frame of prototypeFrames) {
    const preview = renderFramePreviewSvg(frame);
    assert.doesNotMatch(preview, /data-qr-outer-eye=/);
    assert.match(preview, /fill="#ffffff"/);
    const exported = renderQrSvg("https://example.com/prototype", "H", {
      ...baseDesign,
      frame,
    });
    assert.match(exported, /data-qr-outer-eye=/);
  }
});

test("custom frame colors and CTA text are preserved in vector exports", () => {
  const svg = renderQrSvg("https://example.com", "H", {
    ...baseDesign,
    decoration: "floral",
    frame: "premium-plaque",
    frameColor: "#facc15",
    frameLabel: "OPEN THE INVITE",
    frameTextColor: "#102a2a",
  });

  assert.match(svg, /OPEN THE INVITE/);
  assert.match(svg, /#facc15/);
  assert.match(svg, /data-qr-outer-eye=/);
  assert.match(setSvgDimensions(svg, 2_000), /width="2000" height="2000"/);
});

test("SVG resolution changes preserve vector artwork and view box", () => {
  const svg = renderQrSvg("https://example.com", "M", baseDesign);
  const resized = setSvgDimensions(svg, 2_000);

  assert.match(resized, /width="2000" height="2000"/);
  assert.match(resized, /viewBox="0 0 1000 1000"/);
});

test("transparent frames keep an opaque QR quiet zone", () => {
  const svg = renderQrSvg("https://example.com", "H", {
    ...baseDesign,
    frame: "scan-me",
    frameTransparent: true,
  });

  assert.match(svg, /<rect width="1000" height="1000" fill="transparent"\/>/);
  assert.match(
    svg,
    /<rect x="115" y="64" width="770" height="770" rx="28" fill="#ffffff"\/>/,
  );
});
