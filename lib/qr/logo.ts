// Node-only: imported by the official render route, never by the browser gallery.
import sharp from "sharp";

export async function normalizeLogoDataUrl(value: string): Promise<string> {
  const match = /^data:image\/(png|jpeg|webp);base64,([a-zA-Z0-9+/=]+)$/.exec(value);
  if (!match || value.length > 1_000_000) throw new Error("Invalid logo.");
  const bytes = Buffer.from(match[2], "base64");
  const png = bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"));
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!(match[1] === "png" && png || match[1] === "jpeg" && jpeg || match[1] === "webp" && webp)) throw new Error("Invalid logo image.");
  const image = sharp(bytes, { limitInputPixels: 4_000_000 });
  const metadata = await image.metadata();
  if (!["png", "jpeg", "webp"].includes(metadata.format ?? "")) throw new Error("Unsupported logo image.");
  const safe = await image.rotate().resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true }).png().toBuffer();
  return `data:image/png;base64,${safe.toString("base64")}`;
}
