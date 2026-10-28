import { defaultDesign, bodyStyleOptions, outerEyeStyleOptions, innerEyeStyleOptions, frameOptions, designTemplates, type QrDesignOptions } from "./design.ts";
import { premiumTemplate } from "./premium-templates.ts";
import { uploadedFrame } from "./uploaded-frames.ts";

export const freeDesign: QrDesignOptions = {
  ...defaultDesign, foreground: "#000000", outerEyeColor: "#000000", innerEyeColor: "#000000",
};

export function validateExportAccess(_historicalPro: boolean, design: QrDesignOptions, format: string, size: number) {
  validatedDesign(design);
  if (!["png", "jpg", "svg", "pdf", "eps"].includes(format) || ![512, 1000, 2000].includes(size)) throw new Error("Invalid export request.");
}

export function freeTemplateForDesign(design: QrDesignOptions) {
  if (design.premiumTemplateId || design.logoDataUrl || design.logoSize !== freeDesign.logoSize) return undefined;
  if (!frameOptions.some(option => option.value === design.frame)) return undefined;
  return designTemplates.find((template) => (template.design.uploadedFrameId ?? null) === (design.uploadedFrameId ?? null) && Object.entries(template.design).every(([key, value]) => key === "frame" || design[key as keyof QrDesignOptions] === value));
}

export function isFreeDesign(design: QrDesignOptions) {
  try { validatedDesign(design); return true; } catch { return false; }
}

export function designCorrection(design: QrDesignOptions, requested: "L" | "M" | "Q" | "H") {
  return design.logoDataUrl || design.premiumTemplateId ? "H" : freeTemplateForDesign(design)?.errorCorrection ?? requested;
}

export function validatedDesign(value: unknown): QrDesignOptions {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid design.");
  const input = value as Record<string, unknown>;
  const result = { ...freeDesign };
  if (input.uploadedFrameId != null) {
    if (typeof input.uploadedFrameId !== "string" || !uploadedFrame(input.uploadedFrameId)) throw new Error("Invalid uploaded frame.");
    result.uploadedFrameId = input.uploadedFrameId;
  }
  if (input.premiumTemplateId != null) {
    if (typeof input.premiumTemplateId !== "string" || !premiumTemplate(input.premiumTemplateId)) throw new Error("Invalid premium template.");
    result.premiumTemplateId = input.premiumTemplateId;
  }
  for (const key of Object.keys(defaultDesign) as (keyof QrDesignOptions)[]) {
    if (!(key in input)) continue;
    const v = input[key];
    if (["background", "foreground", "frameBackground", "frameColor", "frameTextColor", "innerEyeColor", "outerEyeColor"].includes(key)) {
      if (typeof v !== "string" || !/^#[a-f\d]{6}$/i.test(v)) throw new Error("Invalid color.");
    } else if (key === "gradientColor") {
      if (v !== null && (typeof v !== "string" || !/^#[a-f\d]{6}$/i.test(v))) throw new Error("Invalid gradient.");
    } else if (key === "logoDataUrl") {
      if (v !== null && (typeof v !== "string" || v.length > 1_000_000 || !/^data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(v))) throw new Error("Invalid logo.");
    } else if (key === "logoSize") {
      if (typeof v !== "number" || !Number.isFinite(v) || v < 8 || v > 25) throw new Error("Invalid logo size.");
    } else if (key === "frameTransparent") {
      if (typeof v !== "boolean") throw new Error("Invalid transparency.");
    } else if (key === "frameLabel") {
      if (v !== null && (typeof v !== "string" || v.length > 32)) throw new Error("Invalid label.");
    } else {
      const allowed = key === "bodyStyle" ? bodyStyleOptions.map((x) => x.value)
        : key === "outerEyeStyle" ? outerEyeStyleOptions.map((x) => x.value)
        : key === "innerEyeStyle" ? innerEyeStyleOptions.map((x) => x.value)
        : key === "frame" ? frameOptions.map((x) => x.value)
        : designTemplates.map((x) => x.design[key]);
      if (!allowed.includes(v as never) && v !== defaultDesign[key]) throw new Error("Invalid design style.");
    }
    Object.assign(result, { [key]: v });
  }
  return result;
}
