import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import jsQR from "jsqr";
import { localTemplateReview } from "../lib/qr/local-review.ts";
import { premiumTemplates } from "../lib/qr/premium-templates.ts";
import { defaultDesign } from "../lib/qr/design.ts";
import { componentFixture } from "./helpers/render-component.mjs";

const enabled = { NODE_ENV: "development", QRAFTT_LOCAL_TEMPLATE_REVIEW: "1" };
test("review access requires explicit development flag and loopback, never production or Vercel", () => {
  const local = new Request("http://127.0.0.1:3017/api/billing/session");
  assert.equal(localTemplateReview(local, enabled), true);
  assert.equal(localTemplateReview(new Request("http://localhost:3017/"), enabled), true);
  for (const env of [{}, { ...enabled, NODE_ENV: "production" }, { ...enabled, NODE_ENV: "test" }, { ...enabled, QRAFTT_LOCAL_TEMPLATE_REVIEW: "0" }, { ...enabled, VERCEL: "1" }, { ...enabled, VERCEL_ENV: "preview" }]) {
    assert.equal(localTemplateReview(local, env), false);
  }
  for (const url of ["https://www.qraftt.com/", "https://qraft.vercel.app/", "http://192.168.1.2/", "http://localhost.evil.test/", "https://localhost/"]) {
    assert.equal(localTemplateReview(new Request(url, { headers: { "x-forwarded-host": "localhost", "x-template-review": "1" } }), enabled), false);
  }
  assert.equal(localTemplateReview(undefined, enabled), false);
});

test("session reports universal free access without accessing accounts or billing", async () => {
  const { GET } = componentFixture("app/api/billing/session/route.ts", {
    "@/lib/qr/local-review": { localTemplateReview: (r: Request) => localTemplateReview(r, enabled) },
    "@/lib/billing/server": { billingCustomer: () => { throw new Error("must not access accounts"); } },
  });
  const response = await GET(new Request("http://127.0.0.1:3017/api/billing/session"));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "FREE", downloads: "unlimited", savedCodes: 100, storageBytes: 250_000_000 });
  assert.equal(response.headers.get("set-cookie"), null);
});

test("local review exports every approved template with real payloads, with no billing or quota access", async () => {
  const { POST } = componentFixture("app/api/qr/render/route.ts", {
    "@/lib/qr/local-review": { localTemplateReview: (r: Request) => localTemplateReview(r, enabled) },
    "@/lib/billing/server": {
      sameOrigin: (r: Request) => r.headers.get("origin") === new URL(r.url).origin,
      billingCustomer: () => { throw new Error("must not access accounts"); },
      getBillingStore: () => { throw new Error("must not access billing"); },
    },
  });
  const request = (design: unknown, extra = {}) => POST(new Request("http://127.0.0.1:3017/api/qr/render", { method: "POST", headers: { origin: "http://127.0.0.1:3017" }, body: JSON.stringify({ payload: "https://example.com/review", design, format: "png", size: 512, ...extra }) }));
  for (const template of premiumTemplates) {
    const design = { ...defaultDesign, ...template.design };
    const response = await request(design);
    assert.equal(response.status, 200, template.id);
    const { data, info } = await sharp(Buffer.from(await response.arrayBuffer())).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, "https://example.com/review", template.id);
    assert.equal((await request(design, { format: "svg", size: 2000 })).status, 200);
    // Regression: 256px artistic previews failed on real-world longer content.
    for (const payload of ["https://example.com/" + "long-path/".repeat(15), "Real customer content: café, hello, مرحبا, 日本語."]) {
      const preview = await request(design, { payload, preview: true });
      assert.equal(preview.status, 200, template.id);
      const { data, info } = await sharp(Buffer.from(await preview.arrayBuffer())).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.width, 1000);
      assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, payload, template.id + " full-resolution preview");
    }
  }
  const logo = await sharp({ create: { width: 32, height: 32, channels: 4, background: "#102a2a" } }).png().toBuffer();
  assert.equal((await request({ ...defaultDesign, logoDataUrl: `data:image/png;base64,${logo.toString("base64")}` })).status, 200);
  for (const id of ["pro-ref-11", "pro-ref-05-tr", "pro-ref-05-br", "pro-ink-enamel"]) {
    assert.equal((await request({ ...defaultDesign, premiumTemplateId: id })).status, 400);
  }
  assert.equal((await POST(new Request("http://127.0.0.1:3017/api/qr/render", { method: "POST", headers: { origin: "https://other.test" } }))).status, 403);
});
