import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import sharp from "sharp";
import jsQR from "jsqr";
import { uploadedFrames, uploadedFramePath } from "../lib/qr/uploaded-frames.ts";
import { uploadedFrameImage } from "../lib/qr/uploaded-frame-image.ts";
import { designTemplates } from "../lib/qr/design.ts";
import { validatedDesign, validateExportAccess, freeTemplateForDesign } from "../lib/qr/access.ts";
import { renderQrSvg, setSvgDimensions } from "../lib/qr/render.ts";
import { componentFixture } from "./helpers/render-component.mjs";

const { exportQr } = componentFixture("lib/qr/exports.ts");

test("10 distinct uploaded PNGs lead the Free library, with all 20 originals retained", () => {
  assert.deepEqual(designTemplates.slice(0, 10).map(t => t.id), uploadedFrames.map(f => f.id));
  assert.equal(designTemplates.filter(t => !t.design.uploadedFrameId).length, 20);
  const hashes = uploadedFrames.map(f => createHash("sha256").update(readFileSync(`public${uploadedFramePath(f.id)}`)).digest("hex"));
  assert.equal(new Set(hashes).size, 10);
  assert.throws(() => validatedDesign({ uploadedFrameId: "../../secret" }));
});

for (const frame of uploadedFrames) test(`${frame.name}: real content, Free PNG/JPG, preview/export artwork and scan`, async () => {
  const template = designTemplates.find(t => t.id === frame.id)!;
  const design = validatedDesign(template.design);
  assert.equal(freeTemplateForDesign(design)?.id, frame.id);
  assert.equal(freeTemplateForDesign({ ...design, foreground: "#123456" }), undefined, "custom colors cannot use the approved-frame exception");
  const image = uploadedFrameImage(frame.id);
  assert.equal(image, `data:image/png;base64,${readFileSync(`public${uploadedFramePath(frame.id)}`).toString("base64")}`);
  for (const payload of ["https://example.com/my-real-business", "A real message, not the embedded demo QR", "BEGIN:VCARD\nVERSION:3.0\nFN:Frame Test\nTEL:+12025550123\nEND:VCARD"]) {
    const svg = renderQrSvg(payload, "H", design, image);
    assert.ok(svg.includes(image));
    for (const format of ["png", "jpg"] as const) {
      validateExportAccess(false, design, format, 512);
      const bytes = await exportQr(svg, format, 512);
      const preview = await sharp(Buffer.from(setSvgDimensions(svg, 512))).flatten({ background: "white" }).png().toBuffer();
      for (const candidate of [bytes, preview]) {
        const { data, info } = await sharp(candidate).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        let decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data;
        if (!decoded) {
          // Also test a closer camera view of the original exported pixels.
          const [x, y, right, bottom] = frame.bounds;
          const crop = await sharp(candidate).extract({ left: Math.floor(x * 512 / 1254), top: Math.floor(y * 512 / 1254), width: Math.ceil((right - x) * 512 / 1254), height: Math.ceil((bottom - y) * 512 / 1254) }).resize(800, 800).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
          decoded = jsQR(new Uint8ClampedArray(crop.data), crop.info.width, crop.info.height)?.data;
        }
        assert.equal(decoded, payload, `${frame.id} ${format}: ${payload}`);
      }
    }
  }
});
