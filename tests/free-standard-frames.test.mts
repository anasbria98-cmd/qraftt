import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import jsQR from "jsqr";
import { defaultDesign, designTemplates, frameOptions } from "../lib/qr/design.ts";
import { freeDesign, validatedDesign, validateExportAccess, designCorrection } from "../lib/qr/access.ts";
import { componentFixture } from "./helpers/render-component.mjs";

test("every Standard Frame renders for Free with real payloads; other paid features remain locked", async () => {
  const { POST } = componentFixture("app/api/qr/render/route.ts", {
    "@/lib/qr/local-review": { localTemplateReview: () => false },
    "@/lib/billing/server": { sameOrigin: () => true, billingCustomer: async () => "isolated-free-frame-test", getBillingStore: () => ({ entitlement: async () => ({ pro: false }) }) },
  });
  for (const frame of frameOptions) {
    const design = validatedDesign({ ...freeDesign, frame: frame.value });
    for (const format of ["png", "jpg"]) assert.doesNotThrow(() => validateExportAccess(false, design, format, 512));
    for (const format of ["svg", "pdf", "eps"]) assert.throws(() => validateExportAccess(false, design, format, 512));
    assert.throws(() => validateExportAccess(false, design, "png", 1000));
    for (const change of [{ logoDataUrl: "data:image/png;base64,AA==" }, { gradientColor: "#123456" }, { bodyStyle: "dots" }, { frameLabel: "Custom caption" }, { frameTransparent: true }, { frameBackground: "#123456" }] as const) {
      assert.throws(() => validateExportAccess(false, { ...design, ...change }, "png", 512));
    }
    const payload = `https://example.com/frame/${frame.value}`;
    const response = await POST(new Request("https://qraftt.test/api/qr/render", { method: "POST", body: JSON.stringify({ payload, design, format: "png", size: 512, correction: "M", preview: true }) }));
    assert.equal(response.status, 200, frame.value);
    const { data, info } = await sharp(Buffer.from(await response.arrayBuffer())).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, payload, frame.value);
    for (const template of designTemplates) {
      const decorated = { ...defaultDesign, ...template.design, frame: frame.value };
      assert.doesNotThrow(() => validateExportAccess(false, decorated, "png", 512));
      assert.equal(designCorrection(decorated, "M"), template.errorCorrection);
    }
  }
});
