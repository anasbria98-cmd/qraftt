import QRCode from "qrcode";
import { referenceCandidates } from "./premium-templates.ts";
import { referenceMetadata } from "./reference-metadata.ts";
import type { QrDesignOptions } from "./design.ts";

const xml = (s: string) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const cache = new Map<string, Uint8Array>();
function samples(id: string, encoded: string) {
  let bytes = cache.get(id);
  if (!bytes) { bytes = Uint8Array.from(atob(encoded), c => c.charCodeAt(0)); cache.set(id, bytes); }
  return bytes;
}

/** Keep source artwork; add only payload-dependent scan cores/function patterns.
 * The API supplies embedded referenceImage for self-contained official exports. */
export function renderPremiumQrSvg(payload: string, design: QrDesignOptions, referenceImage?: string): string {
  const t = referenceCandidates.find(t => t.id === design.premiumTemplateId);
  if (!t) throw new Error("Unknown premium template.");
  const asset = referenceMetadata[t.sourceId as keyof typeof referenceMetadata];
  const image = referenceImage ?? `/images/qr-references/${t.sourceId}.png`;
  const qr = QRCode.create(payload, { errorCorrectionLevel: "H" });
  const n = qr.modules.size;
  const reserved = qr.modules as typeof qr.modules & { isReserved(r: number, c: number): boolean };
  const scale = 1000 / Math.max(asset.width, asset.height);
  const iw = asset.width * scale, ih = asset.height * scale;
  const ix = (1000 - iw) / 2, iy = (1000 - ih) / 2;
  const [bx, by, bw, bh] = asset.bounds;
  const field = Math.min(bw * iw, bh * ih);
  const x0 = ix + bx * iw + (bw * iw - field) / 2;
  const y0 = iy + by * ih + (bh * ih - field) / 2;
  const cell = field / n;
  const colors = samples(t.sourceId, asset.samples);
  const primary = t.sourceId === "ref-01" ? "#151326" : t.sourceId === "ref-07" ? "#0b835d" : t.sourceId === "ref-08" ? "#650900" : t.sourceId === "ref-06" ? "#4c4b26" : "#111111";
  const colorAt = (x: number, y: number) => {
    const sx = Math.max(0, Math.min(63, Math.floor((x - ix) / iw * 64)));
    const sy = Math.max(0, Math.min(63, Math.floor((y - iy) / ih * 64)));
    const i = (sy * 64 + sx) * 3;
    const rgb = [colors[i], colors[i + 1], colors[i + 2]];
    if (Math.max(...rgb) - Math.min(...rgb) < 24 || Math.min(...rgb) > 210) return primary;
    const luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
    const factor = luminance > 110 ? 110 / luminance : 1;
    return `rgb(${rgb.map(c => Math.round(c * factor)).join(",")})`;
  };
  const cells: string[] = [], functions: string[] = [];
  const isEye = (r: number, c: number) => (r < 7 && (c < 7 || c >= n - 7)) || (r >= n - 7 && c < 7);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const x = x0 + c * cell, y = y0 + r * cell;
    const fill = qr.modules.get(r, c) ? colorAt(x + cell / 2, y + cell / 2) : "#fff";
    if (reserved.isReserved(r, c)) {
      if (!isEye(r, c)) functions.push(`<rect x="${x}" y="${y}" width="${cell + .02}" height="${cell + .02}" fill="${qr.modules.get(r, c) ? primary : '#fff'}"/>`);
    } else {
      const inset = (1 - t.core) * cell / 2;
      cells.push(`<rect x="${x + inset}" y="${y + inset}" width="${cell * t.core}" height="${cell * t.core}" fill="${fill}"/>`);
    }
  }
  const targetEyes = [[x0, y0], [x0 + field - 7 * cell, y0], [x0, y0 + field - 7 * cell]];
  const eyeCores = targetEyes.map(([x, y], index) => {
    const colored = t.sourceId === "ref-05-tl" || t.sourceId === "ref-05-tr";
    const outer = colored ? ["#d30079", "#32782f", "#644080"][index] : primary;
    const inner = colored ? ["#0079a5", "#cf0078", "#a66d00"][index] : primary;
    const rounded = ["ref-01", "ref-07", "ref-11"].includes(t.sourceId) || colored;
    const radius = rounded ? cell * .4 : 0;
    let eye = `<rect x="${x}" y="${y}" width="${7 * cell}" height="${7 * cell}" rx="${radius}" fill="${outer}"/><rect x="${x + cell}" y="${y + cell}" width="${5 * cell}" height="${5 * cell}" rx="${radius}" fill="#fff"/><rect x="${x + 2 * cell}" y="${y + 2 * cell}" width="${3 * cell}" height="${3 * cell}" rx="${radius}" fill="${inner}"/>`;
    // Restore the reference's fine gold/teal eye contours without cutting across
    // the middle of the dark finder bars used by the scanner.
    if (t.sourceId === "ref-01") eye += `<rect x="${x + cell * .04}" y="${y + cell * .04}" width="${6.92 * cell}" height="${6.92 * cell}" rx="${radius}" fill="none" stroke="#cda42d" stroke-width="${cell * .035}"/><path d="M${x + cell * .12} ${y + cell * 6.88}H${x + cell * 6.88}V${y + cell * .12}" stroke="#247c73" stroke-width="${cell * .035}" fill="none"/>`;
    if (t.sourceId === "ref-08") {
      const octagon = (inset: number, size: number, cut: number) => `M${x + inset + cut} ${y + inset}h${size - 2 * cut}l${cut} ${cut}v${size - 2 * cut}l${-cut} ${cut}h${-size + 2 * cut}l${-cut} ${-cut}v${-size + 2 * cut}Z`;
      eye = `<path d="${octagon(0, cell * 7, cell * .8)}" fill="url(#reference-red)" stroke="#dca51d" stroke-width="${cell * .08}"/><path d="${octagon(cell, cell * 5, cell * .5)}" fill="#fff"/><path d="${octagon(cell * 2, cell * 3, cell * .35)}" fill="url(#reference-red)" stroke="#dca51d" stroke-width="${cell * .08}"/>`;
    }
    if (t.sourceId === "ref-11") eye = `<rect x="${x}" y="${y}" width="${7 * cell}" height="${7 * cell}" rx="${cell}" fill="#1e1b1b"/><circle cx="${x + 3.5 * cell}" cy="${y + 3.5 * cell}" r="${2.5 * cell}" fill="#fff"/><circle cx="${x + 3.5 * cell}" cy="${y + 3.5 * cell}" r="${1.65 * cell}" fill="#246a93"/><circle cx="${x + 3.5 * cell}" cy="${y + 3.5 * cell}" r="${.85 * cell}" fill="#151515"/><circle cx="${x + 3.9 * cell}" cy="${y + 3 * cell}" r="${.3 * cell}" fill="#fff"/>`;
    if (t.sourceId === "ref-06") {
      const size = t.eyeRatio * field;
      const sx = index === 1 ? x0 + field - size : x0;
      const sy = index === 2 ? y0 + field - size : y0;
      eye += `<svg x="${x}" y="${y}" width="${7 * cell}" height="${7 * cell}" viewBox="${sx} ${sy} ${size} ${size}" opacity=".1" overflow="hidden"><use href="#reference-image"/></svg>`;
    }
    return eye;
  });
  let logo = "";
  if (design.logoDataUrl) {
    const size = field * Math.min(18, Math.max(8, design.logoSize)) / 100;
    logo = `<g data-qr-center="protected"><rect x="${x0 + field / 2 - size * .64}" y="${y0 + field / 2 - size * .64}" width="${size * 1.28}" height="${size * 1.28}" fill="#fff"/><image href="${xml(design.logoDataUrl)}" x="${x0 + (field - size) / 2}" y="${y0 + (field - size) / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/></g>`;
  }
  const imageDefinition = `<image id="reference-image" href="${xml(image)}" x="${ix}" y="${iy}" width="${iw}" height="${ih}"/><radialGradient id="reference-red"><stop stop-color="#c71400"/><stop offset="1" stop-color="#390300"/></radialGradient>`;
  const imageNode = `<use href="#reference-image"/>`;
  const padding = 4 * cell;
  const rotation = `rotate(${t.rotation} ${x0 + field / 2} ${y0 + field / 2})`;
  const extra = Math.max(0, padding - x0, padding - y0, x0 + field + padding - 1000, y0 + field + padding - 1000);
  const extent = 1000 + extra * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="${-extra} ${-extra} ${extent} ${extent}" data-premium-template="${t.id}" data-reference="${t.reference}" data-error-correction="H" data-quiet-zone="4" data-scan-core="${t.core}"><defs>${imageDefinition}<clipPath id="reference-field"><rect x="${x0}" y="${y0}" width="${field}" height="${field}"/></clipPath></defs><rect x="${-extra}" y="${-extra}" width="${extent}" height="${extent}" fill="#fff"/>${imageNode}<rect x="${x0 - padding}" y="${y0 - padding}" width="${field + 2 * padding}" height="${field + 2 * padding}" fill="#fff"/><g clip-path="url(#reference-field)">${imageNode}</g><g transform="${rotation}" shape-rendering="crispEdges">${cells.join("")}</g>${logo}<g transform="${rotation}" data-qr-functional="protected" shape-rendering="crispEdges">${functions.join("")}${eyeCores.join("")}</g></svg>`;
}
