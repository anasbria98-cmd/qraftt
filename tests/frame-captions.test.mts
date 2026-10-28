import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import sharp from "sharp";
import jsQR from "jsqr";
import { frameOptions, frameLabels } from "../lib/qr/design.ts";
import { freeDesign, validateExportAccess } from "../lib/qr/access.ts";
import { renderQrSvg, renderFramePreviewSvg } from "../lib/qr/render.ts";
import { captionGlyphs } from "../lib/qr/frame-caption-glyphs.ts";
import { componentFixture } from "./helpers/render-component.mjs";

const { exportQr } = componentFixture("lib/qr/exports.ts");
const payload = "https://example.com/readable-frame-captions";
const captionPattern = /<g data-frame-caption="[\s\S]*?<\/g>/g;

test("every intended Standard Frame label has real outline glyphs instead of missing-glyph boxes", () => {
  for (const frame of frameOptions) {
    for (const character of frameLabels[frame.value]) {
      assert.ok(captionGlyphs[character], `${frame.value}: ${character}`);
      if (character !== " ") assert.match(captionGlyphs[character].path, /[MLCQ]/);
    }
    const svg = renderQrSvg(payload, "M", { ...freeDesign, frame: frame.value });
    const preview = renderFramePreviewSvg(frame.value);
    assert.doesNotMatch(svg, /<text\b|□|�/);
    assert.doesNotMatch(preview, /<text\b|□|�/);
    const captions = svg.match(captionPattern) ?? [];
    for (const caption of captions) assert.ok(caption.includes(`data-frame-caption="${frameLabels[frame.value]}"`), frame.value);
    assert.equal((preview.match(captionPattern) ?? []).length, captions.length, frame.value);
  }
});

test("every Standard Frame exports identical caption outlines in PNG, JPG, SVG, PDF and EPS", async () => {
  for (const frame of frameOptions) {
    const design = { ...freeDesign, frame: frame.value };
    const svg = renderQrSvg(payload, "M", design);
    const captions = svg.match(captionPattern) ?? [];
    const vector = (await exportQr(svg, "svg", 1000)).toString();
    assert.deepEqual(vector.match(captionPattern) ?? [], captions);
    for (const format of ["png", "jpg"] as const) {
      validateExportAccess(false, design, format, 512);
      const bytes = await exportQr(svg, format, 512);
      const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, payload, `${frame.value}: ${format}`);
    }
    const pdf = await exportQr(svg, "pdf", 1000);
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.doesNotMatch(pdf.toString("latin1"), /\/Subtype \/Type1/, "outlined captions need no substitute PDF font");
    const eps = (await exportQr(svg, "eps", 1000)).toString();
    assert.match(eps, /^%!PS-Adobe/);
    assert.doesNotMatch(eps, /findfont|ashow/, "outlined captions need no PostScript font");
  }
});

test("independent Ghostscript reads every Standard Frame PDF/EPS with outlined captions and scannable QR", { skip: !process.env.QRAFTT_GHOSTSCRIPT_PATH }, async () => {
  const require = createRequire(import.meta.url);
  const createGs = require(process.env.QRAFTT_GHOSTSCRIPT_PATH!);
  for (const frame of frameOptions) for (const format of ["pdf", "eps"] as const) {
    const svg = renderQrSvg(payload, "M", { ...freeDesign, frame: frame.value });
    const bytes = await exportQr(svg, format, 1000);
    const originalFetch = globalThis.fetch;
    let gs;
    try { Object.assign(globalThis, { fetch: undefined }); gs = await createGs({ print: () => {}, printErr: () => {} }); }
    finally { globalThis.fetch = originalFetch; }
    gs.FS.writeFile(`/input.${format}`, bytes);
    assert.equal(gs.callMain(["-dSAFER", "-dBATCH", "-dNOPAUSE", "-sDEVICE=png16m", "-r120", "-dEPSCrop", "-sOutputFile=/result.png", `/input.${format}`]), 0);
    const { data, info } = await sharp(Buffer.from(gs.FS.readFile("/result.png"))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, payload, `${frame.value}: ${format}`);
  }
});
