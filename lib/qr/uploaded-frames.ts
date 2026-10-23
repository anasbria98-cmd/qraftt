// Original uploaded PNGs are immutable. Bounds include their white quiet zone.
export const uploadedFrames = [
  { id: "uploaded-frame-01", name: "Shopping cart", bounds: [542, 505, 909, 872], color: "#b236c4" },
  { id: "uploaded-frame-02", name: "Globe & landmarks", bounds: [432, 513, 823, 904], color: "#83310d" },
  { id: "uploaded-frame-03", name: "Ships & nautical border", bounds: [364, 494, 893, 1023], color: "#963a07" },
  { id: "uploaded-frame-04", name: "Green botanical", bounds: [321, 394, 953, 1026], color: "#5d9f25" },
  { id: "uploaded-frame-05", name: "Pencil & straw mug", bounds: [434, 553, 882, 1001], color: "#04392f" },
  { id: "uploaded-frame-06", name: "Super Sale starbursts", bounds: [353, 396, 914, 957], color: "#fb4b0a" },
  { id: "uploaded-frame-07", name: "Holiday Day ring", bounds: [350, 393, 908, 951], color: "#e5940b" },
  { id: "uploaded-frame-08", name: "Fedora & mustache", bounds: [344, 409, 928, 993], color: "#053f2d" },
  { id: "uploaded-frame-09", name: "Leather suitcase", bounds: [354, 426, 900, 972], color: "#75401e" },
  { id: "uploaded-frame-10", name: "Pink roses", bounds: [330, 362, 925, 957], color: "#ff576a" },
] as const;

export function uploadedFrame(id?: string | null) {
  return uploadedFrames.find(frame => frame.id === id);
}

export function uploadedFramePath(id: string) {
  const frame = uploadedFrame(id);
  if (!frame) throw new Error("Invalid uploaded frame.");
  return `/images/free-frames/${frame.id.replace("uploaded-", "")}.png`;
}
