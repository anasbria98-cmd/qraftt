import { defaultDesign, type QrDesignTemplate } from "./design.ts";

export interface PremiumTemplate extends QrDesignTemplate {
  reference: string;
  sourceId: string;
  eyeRatio: number;
  rotation: number;
  core: number;
}
function reference(sourceId: string, name: string, source: string, eyeRatio: number, rotation = 0): PremiumTemplate {
  return { id: `pro-${sourceId}`, sourceId, name, reference: source, eyeRatio, rotation, core: sourceId === "ref-08" ? .4 : .25,
    description: `Reference ${source} · supplied artwork and original colors`,
    errorCorrection: "H", design: { ...defaultDesign, premiumTemplateId: `pro-${sourceId}` } };
}
// Source coordinates, not substituted motifs. Reference 02's 15 low-resolution
// cells are deferred. Excluded franchise images are not inputs.
export const referenceCandidates: PremiumTemplate[] = [
  reference("ref-01", "Reference 01 · Navy & wood", "1", 146 / 520),
  reference("ref-03", "Reference 03 · Horned skull", "3", 172 / 642),
  reference("ref-04", "Reference 04 · Animal silhouettes", "4", 191 / 682),
  reference("ref-05-tl", "Reference 05 · Multicolor", "5:top-left", .31),
  reference("ref-05-bl", "Reference 05 · Black skulls", "5:bottom-left", .30),
  reference("ref-06", "Reference 06 · Portrait jigsaw", "6", .265),
  reference("ref-07", "Reference 07 · Green Santa", "7", 157 / 648),
  reference("ref-08", "Reference 08 · Red-gold Santa", "8", 106 / 439, 180),
  reference("ref-09", "Reference 09 · Communication tiles", "9", 230 / 688),
  reference("ref-10", "Reference 10 · Halftone portrait", "10", 76 / 355),
  reference("ref-11", "Reference 11 · Blue eyes", "11", 130 / 457),
];
// Keep the supplied blue-eye appearance in the review, but do not sell/export a
// design whose circular finder artwork has not passed our decoding checks.
export const premiumTemplates = referenceCandidates.filter(t => t.sourceId !== "ref-11");
export function premiumTemplate(id: string | null | undefined) {
  return premiumTemplates.find((template) => template.id === id);
}
