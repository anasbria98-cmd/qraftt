import { readFileSync } from "node:fs";
import { join } from "node:path";
import { uploadedFramePath } from "./uploaded-frames.ts";

const images = new Map<string, string>();

// Only allowlisted local assets; never fetch an untrusted image URL.
export function uploadedFrameImage(id: string) {
  let image = images.get(id);
  if (!image) {
    image = `data:image/png;base64,${readFileSync(join(process.cwd(), "public", uploadedFramePath(id))).toString("base64")}`;
    images.set(id, image);
  }
  return image;
}
