import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import sharp from "sharp";
import jsQR from "jsqr";
import { defaultDesign, designTemplates } from "../lib/qr/design.ts";
import { freeDesign, freeTemplateForDesign, validateExportAccess, validatedDesign, designCorrection } from "../lib/qr/access.ts";
import { premiumTemplates, premiumTemplate } from "../lib/qr/premium-templates.ts";
import { renderQrSvg as renderBaseSvg, setSvgDimensions } from "../lib/qr/render.ts";
import { referenceImages } from "../lib/qr/reference-images.ts";
import { componentFixture } from "./helpers/render-component.mjs";
import { normalizeLogoDataUrl } from "../lib/qr/logo.ts";
import { pricingPlans } from "../lib/pricing/plans.ts";
import { uploadedFrameImage } from "../lib/qr/uploaded-frame-image.ts";
import { captionUnits } from "../lib/qr/frame-caption-glyphs.ts";

const renderQrSvg: typeof renderBaseSvg = (payload, correction, design) => {
  const source = premiumTemplate(design.premiumTemplateId)?.sourceId;
  return renderBaseSvg(payload, correction, design, source ? referenceImages[source] : design.uploadedFrameId ? uploadedFrameImage(design.uploadedFrameId) : undefined);
};

const originalHashes = [
  "6dde60585a402535d6446d1f534f298327cdc0c3414dc8e9084928c0acbb75fd", "f5812ad504ebe5019727e34f5c37b1d4f7b9b6dd25878bf86de993db90fb59cf",
  "797579d3638304b3773a351b3e0a2f6c70654e099094d1dad733c8b47ad3c71e", "48c9e40d13e66803397294e0d380132b7e50884b9f3f3b5b53b1b2786d862a12",
  "0c47ef121fd5e03f8adaae6e838a9fff1121e5cc5be785522d88c5de347707ea", "d6b2bd8273cdafe3277a81809070d906a33fb85e2b8c0f303249a1d264a15476",
  "0f7e510091ac099f232c9e481ac726dcbda7512d416d9e2b3d73c1a4722f30af", "60679656d4a6841cb8e5d676b84a4cd1377b47b504173769b6c74dd7aa8a9856",
  "cbf3d406e4fc746b3e1f26176de828a495bac9b0d1ed84f3406510a93e177f5d", "5262a435e3a285462240e40c929b5c284b51174eaff8583759515fdbf07f6841",
  "6f489089bde22b2a24099a9ea1511783f74ff5e8a9a592550fb84d85232a8713", "53ed70e5ab0a39c30c2b993102267a9e82091cc71e223c1820d56b93dedc3a61",
  "13d4efa87f27cb0c4a020fd02d18c78bbad51dffeb02a28a3affb387aed732a7", "377777410a4107f3305eb56abb6df2a87eecd309233cedafbd58fc7886ea73ff",
  "82ab84f7a6232bd9ff11ff2b861c05cd3428d6bb2db25549fcac3316407a3638", "ab6d38c875c9bd8b1643167bd508fe666d747e41df0e29e0119b9a6f35e03087",
  "def4c035fd2ac97e0559dbbd7561e0c8253a0401736a293662dc8742e5d3a153", "8760a45ddfe03e657a9c890cea2f7d3424bf48e200c3a07015bfe8ca0d717b5d",
  "3ee850fca5abeabea541a558a2fd631fbd8925a34acd81dd1199cf60fbb7ef56", "590869b718c56f726fcbc5c35c0ce401357fce4c566755fe8cf3e4d06ffdb4e5",
];

test("all 20 old templates remain byte-identical apart from repaired caption outlines and allow Free PNG exports", () => {
  const originals = designTemplates.filter(template => !template.design.uploadedFrameId);
  assert.equal(originals.length, originalHashes.length);
  originals.forEach((template, index) => {
    const design = { ...template.design, logoDataUrl: null, logoSize: 16 };
    // Normalize only the caption's new font-independent geometry back to its
    // previous text element. The historic hash still protects all other artwork.
    const svg = renderQrSvg("https://example.com", template.errorCorrection, design).replace(/<g data-frame-caption="([^"]*)" role="img" aria-label="[^"]*" fill="([^"]*)" transform="translate\([^ ]+ ([^)]+)\) scale\(([^ ]+) [^)]+\)">[\s\S]*?<\/g>/g,
      (_, label, fill, y, scale) => `<text x="500" y="${y}" text-anchor="middle" fill="${fill}" font-family="Arial, sans-serif" font-size="${Number((Number(scale) * captionUnits).toFixed(6))}" font-weight="800" letter-spacing="2">${label}</text>`);
    assert.equal(createHash("sha256").update(svg).digest("hex"), originalHashes[index]);
    assert.doesNotThrow(() => validateExportAccess(false, design, "png", 512));
    assert.equal(designCorrection(design, "M"), template.errorCorrection);
    assert.equal(freeTemplateForDesign(design)?.id, template.id);
    assert.doesNotThrow(() => validateExportAccess(false, { ...design, foreground: "#010101" }, "png", 512));
    assert.doesNotThrow(() => validateExportAccess(false, design, "svg", 512));
    assert.doesNotThrow(() => validateExportAccess(false, design, "png", 2000));
  });
});

test("reference rebuild replaces invented catalog and defers unresolved references", () => {
  assert.equal(premiumTemplates.length, 10);
  assert.equal(premiumTemplates.filter(t => t.reference.startsWith("2:")).length, 0);
  assert.equal(premiumTemplates.filter(t => t.reference.startsWith("5:")).length, 2);
  assert.equal(new Set(premiumTemplates.map(t => t.id)).size, 10);
  assert.ok(premiumTemplates.every(t => !designTemplates.some(old => old.id === t.id)));
  assert.equal(pricingPlans[0].benefits.templates, "All templates");
  assert.equal(pricingPlans.length, 1);
  assert.throws(() => validatedDesign({ premiumTemplateId: "pro-ink-enamel" }), /Invalid premium/);
  assert.throws(() => validatedDesign({ premiumTemplateId: "pro-ref-11" }), /Invalid premium/);
});

test("decorative templates are free; unknown template IDs remain rejected", () => {
  for (const template of premiumTemplates) {
    const design = validatedDesign({ ...defaultDesign, ...template.design });
    assert.doesNotThrow(() => validateExportAccess(false, design, "png", 512));
    assert.doesNotThrow(() => validateExportAccess(true, design, "svg", 2000));
    assert.equal(designCorrection(design, "L"), "H");
    assert.doesNotThrow(() => validateExportAccess(false, { ...freeDesign, premiumTemplateId: template.id }, "png", 512));
  }
  assert.throws(() => validatedDesign({ premiumTemplateId: "fake-free" }), /Invalid premium/);
  assert.throws(() => validatedDesign({ logoDataUrl: 'data:image/svg+xml;base64,AAAA' }), /Invalid logo/);
});

test("final fidelity pass preserves source contours and reduces only verified scan-core sizes", () => {
  const navy = premiumTemplate("pro-ref-01")!;
  const svg = renderQrSvg("https://example.com/art", "H", { ...defaultDesign, ...navy.design });
  assert.match(svg, /stroke="#cda42d"/);
  assert.match(svg, /stroke="#247c73"/);
  assert.equal(premiumTemplate("pro-ref-05-br"), undefined);
  assert.equal(premiumTemplate("pro-ref-05-tr"), undefined);
  assert.throws(() => validatedDesign({ premiumTemplateId: "pro-ref-05-tr" }), /Invalid premium/);
  assert.throws(() => validatedDesign({ premiumTemplateId: "pro-ref-05-br" }), /Invalid premium/);
  assert.equal(premiumTemplate("pro-ref-08")?.core, .4);
  assert.equal(premiumTemplates.length, 10);
  assert.ok(premiumTemplates.every(t => !t.reference.startsWith("2:") && t.sourceId !== "ref-11"));
});

test("deduplicated Pro collection has distinct source artwork and rendered outputs", async () => {
  const sources = new Set<string>();
  const renders = new Set<string>();
  for (const template of premiumTemplates) {
    const sourceHash = createHash("sha256").update(referenceImages[template.sourceId]).digest("hex");
    assert.ok(!sources.has(sourceHash), `${template.id} repeats existing source artwork`);
    sources.add(sourceHash);
    const png = await sharp(Buffer.from(renderQrSvg("https://example.com/art", "H", { ...defaultDesign, ...template.design }))).resize(512, 512).raw().toBuffer();
    const outputHash = createHash("sha256").update(png).digest("hex");
    assert.ok(!renders.has(outputHash), `${template.id} repeats an existing rendered design`);
    renders.add(outputHash);
  }
  assert.equal(sources.size, 10);
  assert.equal(renders.size, 10);
  assert.deepEqual(premiumTemplates.filter(t => t.reference.startsWith("5:")).map(t => t.sourceId), ["ref-05-tl", "ref-05-bl"]);
});

test("every Pro template exports real SVG and PNG with protected function patterns", async () => {
  for (const template of premiumTemplates) {
    const design = { ...defaultDesign, ...template.design };
    const svg = renderQrSvg("https://example.com/original-art", "L", design);
    assert.match(svg, /data-error-correction="H"/);
    assert.match(svg, /data-quiet-zone="4"/);
    assert.match(svg, /data-qr-functional="protected"/);
    assert.doesNotMatch(svg, /<script|foreignObject|href="https?:/);
    const png = await sharp(Buffer.from(setSvgDimensions(svg, 512))).png().toBuffer();
    assert.equal((await sharp(png).metadata()).width, 512);
  }
});

test("center-logo uploads are free and force high correction", async () => {
  const logo = await sharp({ create: { width: 32, height: 32, channels: 4, background: "#14532d" } }).png().toBuffer();
  const dataUrl = `data:image/png;base64,${logo.toString("base64")}`;
  for (const base of [freeDesign, ...designTemplates.map(t => t.design), ...premiumTemplates.map(t => t.design)]) {
    const design = validatedDesign({ ...defaultDesign, ...base, logoDataUrl: dataUrl, logoSize: 18 });
    assert.doesNotThrow(() => validateExportAccess(false, design, "png", 512));
    assert.equal(designCorrection(design, "L"), "H");
    const svg = renderQrSvg("https://example.com/logo", "L", design);
    assert.match(svg, /preserveAspectRatio="xMidYMid meet"/);
    assert.ok(svg.indexOf(dataUrl) < svg.lastIndexOf("<rect"), "functional patterns must survive center overlays");
    await sharp(Buffer.from(svg)).png().toBuffer();
  }
});

test("logo sanitization rejects disguised SVG and re-encodes bounded real rasters", async () => {
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><image href="file:///etc/passwd"/></svg>').toString("base64");
  await assert.rejects(normalizeLogoDataUrl(`data:image/png;base64,${svg}`), /Invalid logo/);
  await assert.rejects(normalizeLogoDataUrl(`data:image/svg+xml;base64,${svg}`), /Invalid logo/);
  const raster = await sharp({ create: { width: 600, height: 300, channels: 4, background: "#123c2d" } }).jpeg().toBuffer();
  const result = await normalizeLogoDataUrl(`data:image/jpeg;base64,${raster.toString("base64")}`);
  assert.match(result, /^data:image\/png;base64,/);
  const metadata = await sharp(Buffer.from(result.split(",")[1], "base64")).metadata();
  assert.equal(metadata.width, 512);
  assert.equal(metadata.height, 256);
});

test("render endpoint permits all designs without billing but preserves validation and origin protection", async () => {
  let pro = false;
  let downloads = 0;
  const { POST } = componentFixture("app/api/qr/render/route.ts", {
    "@/lib/billing/server": {
      sameOrigin: (r: Request) => r.headers.get("origin") === new URL(r.url).origin,
      billingCustomer: async () => "isolated-test-principal",
      getBillingStore: () => ({ entitlement: async () => ({ pro }), consumeFreeDownload: async () => ++downloads <= 3 }),
    },
  });
  const request = (design: unknown, extra = {}) => POST(new Request("https://qraftt.test/api/qr/render", { method: "POST", headers: { Origin: "https://qraftt.test", "Content-Type": "application/json" }, body: JSON.stringify({ payload: "https://example.com/test", design, format: "png", size: 512, preview: true, ...extra }) }));
  for (const t of designTemplates) {
    assert.equal((await request({ ...defaultDesign, ...t.design }, { correction: t.errorCorrection })).status, 200);
  }
  assert.equal(downloads, 0, "previews do not use a download");
  for (const t of premiumTemplates) {
    assert.equal((await request({ ...defaultDesign, ...t.design }, { pro: true })).status, 200, "templates are free regardless of client flags");
  }
  const original = { ...defaultDesign, ...designTemplates[0].design };
  for (let i = 0; i < 3; i++) assert.equal((await request(original, { preview: false })).status, 200);
  assert.equal((await request(original, { preview: false })).status, 200);
  pro = true;
  for (const t of premiumTemplates) {
    const response = await request({ ...defaultDesign, ...t.design }, { preview: false, format: "svg", size: 2000 });
    assert.equal(response.status, 200);
    assert.match(await response.text(), /width="2000" height="2000"/);
  }
  assert.equal(downloads, 0, "all downloads are unlimited without billing calls");
  const crossOrigin = new Request("https://qraftt.test/api/qr/render", { method: "POST", headers: { Origin: "https://other.test" } });
  assert.equal((await POST(crossOrigin)).status, 403);
});

test("all reference premium PNGs decode at 512px and 1000px for URL, text and contact payloads", async () => {
  const payloads = ["https://example.com/art", "A short original note for a QR template scan test.", "BEGIN:VCARD\nVERSION:3.0\nFN:Qraftt Test\nTEL:+12025550123\nEMAIL:test@example.com\nEND:VCARD"];
  for (const template of premiumTemplates) for (const payload of payloads) for (const size of [512, 1000]) {
    const svg = setSvgDimensions(renderQrSvg(payload, "L", { ...defaultDesign, ...template.design }), size);
    const { data, info } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, payload, `${template.id} at ${size}px must decode`);
  }
});

test("all reference center-logo exports decode at basic size and camera-scaled high resolution", async () => {
  const image = await sharp({ create: { width: 48, height: 24, channels: 4, background: "#102a2a" } }).png().toBuffer();
  const logoDataUrl = `data:image/png;base64,${image.toString("base64")}`;
  const payload = "https://example.com/my-own-logo";
  for (const template of premiumTemplates) for (const size of [512, 2000]) {
    const svg = setSvgDimensions(renderQrSvg(payload, "L", { ...defaultDesign, ...template.design, logoDataUrl, logoSize: 18 }), size);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    assert.equal((await sharp(png).metadata()).width, size);
    // A phone camera sees a resampled QR, not a 2000px image one-to-one.
    const { data, info } = await sharp(png).resize({ width: Math.min(size, 800) }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data, payload, `${template.id} with logo at ${size}px`);
  }
});
