import { captionGlyphs, captionKerning, captionUnits } from "./frame-caption-glyphs.ts";

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// Outlines keep the original baseline, centered anchor, size and tracking.
// No installed fonts, network access or PDF/EPS font substitution is involved.
export function outlineFrameCaption(label: string, y: number, fill: string, size: number) {
  const characters = [...label];
  if (!characters.every(character => captionGlyphs[character])) return null;
  const scale = size / captionUnits;
  let advance = 0;
  const paths = characters.map((character, index) => {
    const glyph = captionGlyphs[character];
    const path = glyph.path ? `<path transform="translate(${advance} 0)" d="${glyph.path}"/>` : "";
    advance += glyph.advance + (captionKerning[character + (characters[index + 1] ?? "")] ?? 0) + 2 / scale;
    return path;
  });
  return `<g data-frame-caption="${escapeXml(label)}" role="img" aria-label="${escapeXml(label)}" fill="${escapeXml(fill)}" transform="translate(${500 - advance * scale / 2} ${y}) scale(${scale} ${-scale})">${paths.join("")}</g>`;
}
