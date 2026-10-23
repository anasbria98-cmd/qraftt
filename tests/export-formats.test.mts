import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import jsQR from "jsqr";
import { componentFixture } from "./helpers/render-component.mjs";
import { defaultDesign, designTemplates, type QrDesignOptions } from "../lib/qr/design.ts";
import { premiumTemplates, premiumTemplate } from "../lib/qr/premium-templates.ts";
import { renderQrSvg } from "../lib/qr/render.ts";
import { referenceImages } from "../lib/qr/reference-images.ts";
import { validateExportAccess, freeDesign } from "../lib/qr/access.ts";
import type { ErrorCorrectionLevel } from "../lib/qr/types.ts";
import { uploadedFrameImage } from "../lib/qr/uploaded-frame-image.ts";

const { exportQr } = componentFixture("lib/qr/exports.ts");
const payload = "https://example.com/export-check?value=actual-content";
let secondaryDecode: ((bytes: Buffer) => Promise<boolean>) | undefined;
const decode = async (bytes: Buffer, label: string) => {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data;
  assert.ok(decoded === payload || await secondaryDecode?.(bytes), label);
};

test("Free allows PNG/JPG only at basic resolution and server-side rejects paid designs", () => {
  for (const format of ["png", "jpg"]) assert.doesNotThrow(() => validateExportAccess(false, freeDesign, format, 512));
  for (const format of ["svg", "pdf", "eps"]) assert.throws(() => validateExportAccess(false, freeDesign, format, 512));
  assert.throws(() => validateExportAccess(false, freeDesign, "png", 1000));
  assert.throws(() => validateExportAccess(false, { ...freeDesign, logoDataUrl: "data:image/png;base64,AA==" }, "png", 512));
  for (const template of premiumTemplates) assert.throws(() => validateExportAccess(false, { ...defaultDesign, ...template.design }, "jpg", 512));
});

test("official render route shares the daily PNG/JPG quota and ignores forged Pro flags", async () => {
  let pro = false, downloads = 0;
  const { POST } = componentFixture("app/api/qr/render/route.ts", {
    "@/lib/qr/local-review": { localTemplateReview: () => false },
    "@/lib/billing/server": {
      sameOrigin: () => true, billingCustomer: async () => "isolated-test-user",
      getBillingStore: () => ({ entitlement: async () => ({ pro }), consumeFreeDownload: async () => ++downloads <= 3 }),
    },
  });
  const request = (format: string, extra = {}) => POST(new Request("https://qraftt.test/api/qr/render", { method: "POST", body: JSON.stringify({ payload, design: freeDesign, size: 512, format, ...extra }) }));
  for (const format of ["svg", "pdf", "eps"]) assert.equal((await request(format, { pro: true, plan: "pro" })).status, 403);
  assert.equal((await request("png", { size: 2000, pro: true })).status, 403);
  for (const format of ["png", "jpg", "png"]) assert.equal((await request(format)).status, 200);
  assert.equal((await request("jpg")).status, 429);
  const count = downloads;
  pro = true;
  for (const format of ["png", "jpg", "svg", "pdf", "eps"]) assert.equal((await request(format, { size: 2000 })).status, 200);
  assert.equal(downloads, count, "Pro does not consume daily Free allowance");
});

test("PNG/JPG preserve selected raster resolution; SVG/PDF/EPS have real file structures", async () => {
  const svg = renderQrSvg(payload, "H", defaultDesign);
  for (const size of [512, 1000, 2000]) for (const format of ["png", "jpg"]) {
    const bytes = await exportQr(svg, format, size);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, size); assert.equal(metadata.height, size);
    await decode(bytes, `${format} ${size}`);
  }
  const vector = (await exportQr(svg, "svg", 2000)).toString();
  assert.match(vector, /<svg/); assert.match(vector, /<path|<rect/);
  assert.match((await exportQr(svg, "pdf", 2000)).toString("ascii"), /^%PDF-/);
  const eps = (await exportQr(svg, "eps", 2000)).toString();
  assert.match(eps, /^%!PS-Adobe-3.0 EPSF-3.0/); assert.match(eps, /moveto/); assert.match(eps, /fill/);
  assert.doesNotMatch(eps, /\/ImageType/); // Plain QR is actual vector geometry, not a raster wrapper.
});

// Optional independent Ghostscript interpreter installed OUTSIDE the application.
// Run QRAFTT_GHOSTSCRIPT_PATH=/path/to/@jspawn/ghostscript-wasm npm test.
test("all 20 Free and 10 Pro templates, gradient and center logo decode in every format", { skip: !process.env.QRAFTT_GHOSTSCRIPT_PATH }, async () => {
  const require = createRequire(import.meta.url);
  const createGs = require(process.env.QRAFTT_GHOSTSCRIPT_PATH!);
  const zxing = require(`${process.env.QRAFTT_GHOSTSCRIPT_PATH}/../../zxing-wasm/dist/cjs/reader/index.js`);
  zxing.prepareZXingModule({ overrides: { wasmBinary: readFileSync(`${process.env.QRAFTT_GHOSTSCRIPT_PATH}/../../zxing-wasm/dist/reader/zxing_reader.wasm`) } });
  secondaryDecode = async bytes => (await zxing.readBarcodes(new Uint8Array(await sharp(bytes).png().toBuffer()), { formats: ["QRCode"], tryHarder: true })).some((result: { text: string }) => result.text === payload);
  async function rasterize(bytes: Buffer, extension: string) {
    const originalFetch = globalThis.fetch;
    // Old Emscripten loader otherwise attempts browser fetch() for a local WASM file.
    // This test process alone temporarily uses its native filesystem loader.
    let gs;
    try { Object.assign(globalThis, { fetch: undefined }); gs = await createGs({ print: () => {}, printErr: () => {} }); }
    finally { globalThis.fetch = originalFetch; }
    gs.FS.writeFile(`/input.${extension}`, bytes);
    const status = gs.callMain(["-dSAFER", "-dBATCH", "-dNOPAUSE", "-sDEVICE=png16m", "-r170", "-dEPSCrop", "-sOutputFile=/result.png", `/input.${extension}`]);
    assert.equal(status, 0, extension);
    return Buffer.from(gs.FS.readFile("/result.png"));
  }
  const logo = await sharp({ create: { width: 48, height: 48, channels: 4, background: "#164b37" } }).png().toBuffer();
  const designs = [
    ...designTemplates.map(t => ({ name: t.id, design: { ...defaultDesign, ...t.design }, correction: t.errorCorrection })),
    ...premiumTemplates.map(t => ({ name: t.id, design: { ...defaultDesign, ...t.design }, correction: "H" })),
    ...premiumTemplates.map(t => ({ name: `${t.id}-logo`, design: { ...defaultDesign, ...t.design, logoDataUrl: `data:image/png;base64,${logo.toString("base64")}`, logoSize: 18 }, correction: "H" })),
    { name: "center-logo", design: { ...defaultDesign, logoDataUrl: `data:image/png;base64,${logo.toString("base64")}` }, correction: "H" },
    { name: "gradient-frame", design: { ...defaultDesign, foreground: "#123c2b", gradientColor: "#245f40", frame: "scan-me" }, correction: "H" },
    { name: "arabic-caption", design: { ...defaultDesign, frame: "scan-me", frameLabel: "امسح الرمز" }, correction: "H" },
  ];
  for (const item of designs) {
    const source = premiumTemplate(item.design.premiumTemplateId)?.sourceId;
    const svg = renderQrSvg(payload, item.correction as ErrorCorrectionLevel, item.design as QrDesignOptions, source ? referenceImages[source] : item.design.uploadedFrameId ? uploadedFrameImage(item.design.uploadedFrameId) : undefined);
    for (const format of ["png", "jpg", "svg", "pdf", "eps"]) {
      let exported: Buffer;
      try { exported = await exportQr(svg, format, 1000); }
      catch (error) { throw new Error(`${item.name}: ${format}`, { cause: error }); }
      assert.ok(exported.length < 4_000_000, `${item.name}: ${format} stays below function response limits`);
      await decode(format === "pdf" || format === "eps" ? await rasterize(exported, format) : exported, `${item.name}: ${format}`);
    }
  }
});
