import fs from "node:fs/promises";
import sharp from "sharp";
import jsQR from "jsqr";
import { premiumTemplates } from "../lib/qr/premium-templates.ts";
import { renderPremiumQrSvg } from "../lib/qr/premium-render.ts";
import { referenceImages } from "../lib/qr/reference-images.ts";

const out = "work/reference-template-review";
await fs.mkdir(out, { recursive: true });
const escape = s => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const payload = "https://example.com/art";
const records = [];
const panels = [];
for (const t of premiumTemplates) {
  const accepted = premiumTemplates.some(p => p.id === t.id);
  const source = await fs.readFile(`public/images/qr-references/${t.sourceId}.png`);
  const svg = renderPremiumQrSvg(payload, t.design, referenceImages[t.sourceId]);
  const png = await sharp(Buffer.from(svg)).resize(512, 512).png().toBuffer();
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data === payload;
  if (accepted && !decoded) throw new Error(`${t.id}: review export did not decode to the intended payload`);
  await fs.writeFile(`${out}/${t.sourceId}-template.svg`, svg);
  await fs.writeFile(`${out}/${t.sourceId}-template.png`, png);
  if (accepted) await fs.writeFile(`public/images/qr-references/${t.sourceId}-preview.png`, png);
  const original = await sharp(source).resize(480, 480, { fit: "contain", background: "#fff" }).png().toBuffer();
  const generated = await sharp(png).resize(480, 480).png().toBuffer();
  const heading = Buffer.from(`<svg width="1000" height="62"><rect width="1000" height="62" fill="#f1f5f2"/><text x="20" y="25" font-family="Arial" font-size="17">${escape(t.name)}</text><text x="20" y="49" font-family="Arial" font-size="14">REFERENCE</text><text x="520" y="49" font-family="Arial" font-size="14">${accepted ? "GENERATED TEMPLATE · PRO" : "BLOCKED DRAFT · NOT IN CATALOG"}</text></svg>`);
  const pair = await sharp({ create: { width: 1000, height: 552, channels: 4, background: "#fff" } }).composite([
    { input: heading, left: 0, top: 0 }, { input: original, left: 10, top: 66 }, { input: generated, left: 510, top: 66 },
  ]).png().toBuffer();
  await fs.writeFile(`${out}/${t.sourceId}-comparison.png`, pair);
  panels.push(pair);
  records.push({ id: t.id, reference: t.reference, name: t.name, accepted, decoded, core: t.core });
}
const cards = records.map((r, i) => `<section><h2>${escape(r.name)}</h2><p>${r.accepted ? "Pro template · decoded to the test payload" : "Not selectable: circular blue-eye finder reliability unresolved"}</p><img src="data:image/png;base64,${panels[i].toString("base64")}" alt="${escape(r.name)} reference compared with generated template"><p>Scan-core width: ${r.core * 100}% of each data module. The supplied artwork is retained behind it. Protected finder/timing/alignment patterns and quiet zones differ where required.</p></section>`).join("");
await fs.writeFile(`${out}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Qraftt — Local reference comparison</title><style>body{font:16px/1.5 system-ui;margin:0;background:#f1f5f2;color:#172b24}main{max-width:1060px;margin:auto;padding:24px}h1{font-size:28px}section{background:white;border:1px solid #dbe4df;border-radius:12px;padding:20px;margin:24px 0}h2{font-size:20px}img{display:block;width:100%;height:auto}p{max-width:85ch}.notice{padding:20px;background:#dff3e6;border-radius:12px}</style><main><h1>REFERENCE → TEMPLATE</h1><div class="notice"><strong>Local review only — not deployed.</strong><p>${premiumTemplates.length} selectable Pro templates. 15 low-resolution cells from reference 02 are deferred; reference 11 is a blocked scan-reliability draft. The 20 old Free templates are unchanged.</p><p>Test content: <code>${payload}</code>. These are source-based art QR exports, not copied static QR destinations. Compare the actual differences before approving: new data scan cores, generated function patterns, finder proportions, quiet-zone clearing, and source-dependent contrast adjustments.</p></div>${cards}<h2>Skipped low-resolution collage cells</h2><p>REF-02-R1C1, R1C2, R1C3, R2C1, R2C2, R2C3, R3C1, R3C2, R3C3, R4C1, R4C2, R4C3, R5C1, R5C2, R5C3. Please supply individual high-resolution originals for these designs.</p></main></html>`);
await fs.writeFile(`${out}/verification.json`, JSON.stringify(records, null, 2));
const readyPanels = [];
for (let i = 0; i < records.length; i++) if (records[i].accepted) readyPanels.push(await sharp(panels[i]).resize(520).png().toBuffer());
await sharp({ create: { width: 1040, height: Math.ceil(readyPanels.length / 2) * 288, channels: 4, background: "#e7eee9" } }).composite(readyPanels.map((input, i) => ({ input, left: i % 2 * 520, top: Math.floor(i / 2) * 288 }))).png().toFile(`${out}/all-reference-comparisons.png`);
const previewCards = [];
for (const record of records) {
  const preview = await sharp(`${out}/${record.id.replace("pro-", "")}-template.png`).resize(320, 320).png().toBuffer();
  const label = Buffer.from(`<svg width="360" height="400"><rect x="6" y="6" width="348" height="388" rx="12" fill="#fff" stroke="#dce5df"/><text x="20" y="354" font-family="Arial" font-size="13" fill="#153d2d">${escape(record.name)}</text><text x="20" y="378" font-family="Arial" font-size="11" fill="#537260">PRO · LOCAL REVIEW</text></svg>`);
  previewCards.push(await sharp({ create: { width: 360, height: 400, channels: 4, background: "#f1f5f2" } }).composite([{ input: label, left: 0, top: 0 }, { input: preview, left: 20, top: 20 }]).png().toBuffer());
}
await sharp({ create: { width: 1080, height: Math.ceil(previewCards.length / 3) * 400, channels: 4, background: "#f1f5f2" } }).composite(previewCards.map((input, i) => ({ input, left: i % 3 * 360, top: Math.floor(i / 3) * 400 }))).png().toFile(`${out}/final-${premiumTemplates.length}-template-preview.png`);
console.log(`Review written to ${out}/index.html (${premiumTemplates.length} selectable, ${records.length} comparisons).`);
