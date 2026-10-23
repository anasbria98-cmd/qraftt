import sharp from "sharp";
import { setSvgDimensions } from "./render";

export const exportFormats = ["png", "jpg", "svg", "pdf", "eps"] as const;
export type ExportFormat = typeof exportFormats[number];
export const exportMime: Record<ExportFormat, string> = {
  png: "image/png", jpg: "image/jpeg", svg: "image/svg+xml", pdf: "application/pdf", eps: "application/postscript",
};
async function preserveFrameText(svg: string) {
  // Use the same font renderer as the preview for frame captions (including
  // Arabic/CJK), rather than silently substituting PDF/EPS built-in Latin fonts.
  // Only these small caption bands are embedded; QR paths remain vector.
  const matches = [...svg.matchAll(/<text\b([^>]*)>[\s\S]*?<\/text>/g)];
  for (const match of matches) {
    const y = Number(/\by="([\d.]+)"/.exec(match[1])?.[1] ?? 0);
    const size = Number(/\bfont-size="([\d.]+)"/.exec(match[1])?.[1] ?? 42);
    const top = Math.max(0, y - size * 1.5), height = Math.min(1000 - top, size * 2);
    const region = svg.replace(/viewBox="[^"]*"/, `viewBox="0 ${top} 1000 ${height}"`).replace(/width="[^"]*"/, 'width="2000"').replace(/height="[^"]*"/, `height="${Math.ceil(height * 2)}"`);
    const png = await sharp(Buffer.from(region), { limitInputPixels: 16_000_000 }).png().toBuffer();
    svg = svg.replace(match[0], `<image x="0" y="${top}" width="1000" height="${height}" preserveAspectRatio="none" href="data:image/png;base64,${png.toString("base64")}"/>`);
  }
  return svg;
}
export async function exportQr(svg: string, format: ExportFormat, size: number) {
  svg = setSvgDimensions(svg, size);
  if (format === "svg") return Buffer.from(svg);
  if (format === "pdf" || format === "eps") svg = await preserveFrameText(svg);
  if (format === "eps") return (await import("./eps")).svgToEps(svg);
  if (format === "pdf") {
    const [{ default: PDFDocument }, { default: SVGtoPDF }] = await Promise.all([import("pdfkit"), import("svg-to-pdfkit")]);
    // A 150 mm square printable page. QR paths remain vectors; uploaded logos
    // and supplied reference artwork retain their original embedded image data.
    const page = 150 / 25.4 * 72;
    const doc = new PDFDocument({ size: [page, page], margin: 0, compress: true });
    const chunks: Buffer[] = [];
    const done = new Promise<Buffer>((resolve, reject) => {
      doc.on("data", chunk => chunks.push(Buffer.from(chunk)));
      doc.on("end", () => resolve(Buffer.concat(chunks))); doc.on("error", reject);
    });
    SVGtoPDF(doc, svg, 0, 0, { width: page, height: page, preserveAspectRatio: "xMidYMid meet", assumePt: true });
    doc.end(); return done;
  }
  const image = sharp(Buffer.from(svg), { limitInputPixels: 16_000_000 }).resize(size, size);
  return format === "jpg" ? image.flatten({ background: "#ffffff" }).jpeg({ quality: 100, chromaSubsampling: "4:4:4" }).toBuffer() : image.png().toBuffer();
}
