// Build-time only. Fontkit is already installed with PDFKit; no runtime font
// loader is needed by the browser, Sharp, PDF or EPS renderers.
import { openSync } from "fontkit";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const font = openSync(fileURLToPath(new URL("./assets/Arimo.ttf", import.meta.url))).getVariation({ wght: 700 });
const glyphs = Object.fromEntries(Array.from({ length: 95 }, (_, i) => {
  const character = String.fromCharCode(i + 32);
  const glyph = font.glyphForCodePoint(i + 32);
  if (!glyph.id && character !== " ") throw new Error(`Missing caption glyph: ${character}`);
  return [character, { advance: glyph.advanceWidth, path: glyph.path.toSVG() }];
}));
const kerning = {};
for (const first of Object.keys(glyphs)) for (const second of Object.keys(glyphs)) {
  const run = font.layout(first + second);
  if (run.glyphs.length !== 2) continue;
  const adjustment = run.positions[0].xAdvance - glyphs[first].advance;
  if (adjustment) kerning[first + second] = adjustment;
}
writeFileSync(new URL("../lib/qr/frame-caption-glyphs.ts", import.meta.url), `// Generated from Arimo Bold (SIL OFL); see scripts/assets/OFL-Arimo.txt.\n// Regenerate with node scripts/generate-frame-caption-font.mjs.\nexport const captionUnits = ${font.unitsPerEm};\nexport const captionGlyphs: Record<string, { advance: number; path: string }> = ${JSON.stringify(glyphs)};\nexport const captionKerning: Record<string, number> = ${JSON.stringify(kerning)};\n`);
