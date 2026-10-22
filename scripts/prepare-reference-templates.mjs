// Deterministic source preparation only: crop the supplied collage and package
// the user's artwork without inventing, repainting or generating illustrations.
import fs from "node:fs/promises";
import sharp from "sharp";

const root = "/Users/macbookair/Downloads/";
const sources = [
  ["ref-01", "_ (3).jpeg", "01", "Outlined navy & wood", [40, 44, 520, 518]],
  ["ref-03", "_ (5).jpeg", "03", "Horned skull", [45, 171, 642, 631]],
  ["ref-04", "_.jpeg", "04", "Animal silhouettes", [28, 27, 682, 684]],
  ["ref-05-tl", "40 Creative and Beautiful QR Codes.jpeg", "05:top-left", "Multicolor blocks", [40, 40, 240, 250], [20, 20, 270, 280]],
  ["ref-05-bl", "40 Creative and Beautiful QR Codes.jpeg", "05:bottom-left", "Black skull modules", [50, 345, 220, 218], [20, 320, 270, 270]],
  ["ref-06", "ART-QR code - Le blog de EasyDoor.jpeg", "06", "Portrait jigsaw", [54, 44, 474, 473]],
  ["ref-07", "Custom QR Codes.jpeg", "07", "Green QR & full-body Santa", [44, 44, 648, 648]],
  ["ref-08", "Gift-warp you QR Code.jpeg", "08", "Red-gold QR & Santa portrait", [58, 59, 439, 438]],
  ["ref-09", "How to create digital business cards with vCard QR codes • QR Code KIT.jpeg", "09", "Glossy communication tiles", [24, 24, 688, 688]],
  ["ref-10", "QR Codes criativos que funcionam.jpeg", "10", "Halftone Mona Lisa", [9, 10, 355, 355]],
  ["ref-11", "QR4U 035.jpeg", "11", "Blue-eye organic QR", [43, 47, 457, 444]],
];
await fs.mkdir("public/images/qr-references", { recursive: true });
const assets = {};
for (const [id, file, reference, name, bounds, crop] of sources) {
  let input = sharp(root + file);
  const original = await input.metadata();
  const [left, top, width, height] = crop ?? [0, 0, original.width, original.height];
  input = input.extract({ left, top, width, height });
  // Lossless PNG is also the review source; no AI-generated replacement art.
  const png = await input.png().toBuffer();
  await fs.writeFile(`public/images/qr-references/${id}.png`, png);
  const [bx, by, bw, bh] = bounds;
  const normalizedBounds = [(bx - left) / width, (by - top) / height, bw / width, bh / height];
  const grid = await sharp(png).resize(64, 64, { fit: "fill" }).removeAlpha().raw().toBuffer();
  assets[id] = { reference, name, width, height, bounds: normalizedBounds, image: `data:image/png;base64,${png.toString("base64")}`, samples: grid.toString("base64") };
}
const images = Object.fromEntries(Object.entries(assets).map(([id, { image }]) => [id, image]));
const metadata = Object.fromEntries(Object.entries(assets).map(([id, asset]) => [id, Object.fromEntries(Object.entries(asset).filter(([key]) => key !== "image"))]));
await fs.writeFile("lib/qr/reference-images.ts", `// Generated from user-owned source images. Server export assets only.\nexport const referenceImages: Record<string, string> = ${JSON.stringify(images)};\n`);
await fs.writeFile("lib/qr/reference-metadata.ts", `// Generated source geometry and 64x64 color samples; no invented artwork.\nexport const referenceMetadata = ${JSON.stringify(metadata)} as const;\n`);
console.log(`Prepared ${sources.length} exact reference assets. Skipped all 15 low-resolution cells of reference 02.`);
