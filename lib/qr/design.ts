export type QrBodyStyle =
  | "square"
  | "rounded"
  | "dots"
  | "circles"
  | "soft";
export type QrEyeStyle = "square" | "rounded" | "circle" | "soft";
export type QrFrame =
  | "none"
  | "scan-me"
  | "view-menu"
  | "connect-wifi"
  | "follow-us"
  | "open-link"
  | "scan-to-pay"
  | "contact-me"
  | "visit-website"
  | "join-event"
  | "listen-now"
  | "get-directions"
  | "see-profile"
  | "share-feedback";

export interface QrDesignOptions {
  background: string;
  bodyStyle: QrBodyStyle;
  eyeStyle: QrEyeStyle;
  foreground: string;
  frame: QrFrame;
  frameBackground: string;
  frameTextColor: string;
  gradientColor: string | null;
  logoDataUrl: string | null;
  logoSize: number;
}

export const defaultDesign: QrDesignOptions = {
  background: "#ffffff",
  bodyStyle: "square",
  eyeStyle: "square",
  foreground: "#102a2a",
  frame: "none",
  frameBackground: "#102a2a",
  frameTextColor: "#ffffff",
  gradientColor: null,
  logoDataUrl: null,
  logoSize: 16,
};

export const bodyStyleOptions: Array<{ label: string; value: QrBodyStyle }> = [
  { label: "Square", value: "square" },
  { label: "Rounded", value: "rounded" },
  { label: "Dots", value: "dots" },
  { label: "Circles", value: "circles" },
  { label: "Soft", value: "soft" },
];

export const eyeStyleOptions: Array<{ label: string; value: QrEyeStyle }> = [
  { label: "Square", value: "square" },
  { label: "Rounded", value: "rounded" },
  { label: "Circle", value: "circle" },
  { label: "Soft", value: "soft" },
];

export interface QrFrameOption {
  label: string;
  value: QrFrame;
  variant: "plain" | "badge" | "caption" | "outline" | "ticket";
}

export const frameOptions: QrFrameOption[] = [
  { label: "No frame", value: "none", variant: "plain" },
  { label: "Scan Me", value: "scan-me", variant: "badge" },
  { label: "View Menu", value: "view-menu", variant: "caption" },
  { label: "Connect WiFi", value: "connect-wifi", variant: "outline" },
  { label: "Follow Us", value: "follow-us", variant: "badge" },
  { label: "Open Link", value: "open-link", variant: "caption" },
  { label: "Scan to Pay", value: "scan-to-pay", variant: "ticket" },
  { label: "Contact Me", value: "contact-me", variant: "outline" },
  { label: "Visit Website", value: "visit-website", variant: "caption" },
  { label: "Join Event", value: "join-event", variant: "ticket" },
  { label: "Listen Now", value: "listen-now", variant: "badge" },
  { label: "Get Directions", value: "get-directions", variant: "outline" },
  { label: "See Profile", value: "see-profile", variant: "caption" },
  { label: "Share Feedback", value: "share-feedback", variant: "ticket" },
];

export const frameLabels = Object.fromEntries(
  frameOptions.map((option) => [
    option.value,
    option.value === "none" ? "" : option.label.toUpperCase(),
  ]),
) as Record<QrFrame, string>;

export const frameVariants = Object.fromEntries(
  frameOptions.map((option) => [option.value, option.variant]),
) as Record<QrFrame, QrFrameOption["variant"]>;

type TemplateDesign = Omit<QrDesignOptions, "logoDataUrl" | "logoSize">;

export interface QrDesignTemplate {
  description: string;
  design: TemplateDesign;
  id: string;
  name: string;
}

function template(
  id: string,
  name: string,
  description: string,
  design: Partial<TemplateDesign>,
): QrDesignTemplate {
  const base: TemplateDesign = {
    background: defaultDesign.background,
    bodyStyle: defaultDesign.bodyStyle,
    eyeStyle: defaultDesign.eyeStyle,
    foreground: defaultDesign.foreground,
    frame: defaultDesign.frame,
    frameBackground: defaultDesign.frameBackground,
    frameTextColor: defaultDesign.frameTextColor,
    gradientColor: defaultDesign.gradientColor,
  };
  return { description, design: { ...base, ...design }, id, name };
}

export const designTemplates: QrDesignTemplate[] = [
  template("none", "No template", "Safe classic QR", {}),
  template("forest", "Forest", "Natural green gradient", {
    background: "#f7fff9",
    bodyStyle: "rounded",
    eyeStyle: "soft",
    foreground: "#123c2d",
    gradientColor: "#276749",
  }),
  template("ocean", "Ocean", "Deep blue and crisp", {
    background: "#f5fbff",
    bodyStyle: "dots",
    eyeStyle: "circle",
    foreground: "#0b3c5d",
    frame: "open-link",
    frameBackground: "#0b3c5d",
    gradientColor: "#075985",
  }),
  template("studio", "Minimal", "Neutral editorial style", {
    background: "#f8fafc",
    bodyStyle: "soft",
    eyeStyle: "rounded",
    foreground: "#1e293b",
  }),
  template("cafe", "Restaurant", "Warm menu presentation", {
    background: "#fff8ee",
    bodyStyle: "circles",
    eyeStyle: "circle",
    foreground: "#5a2e1f",
    frame: "view-menu",
    frameBackground: "#5a2e1f",
  }),
  template("social-pop", "Social", "Bold social gradient", {
    background: "#fff7ff",
    bodyStyle: "dots",
    eyeStyle: "circle",
    foreground: "#4c1d95",
    frame: "follow-us",
    frameBackground: "#4c1d95",
    gradientColor: "#9d174d",
  }),
  template("emerald", "Emerald", "Fresh branded callout", {
    background: "#ecfdf5",
    bodyStyle: "rounded",
    eyeStyle: "soft",
    foreground: "#064e3b",
    frame: "scan-me",
    frameBackground: "#064e3b",
    gradientColor: "#065f46",
  }),
  template("navy", "Navy", "Professional web link", {
    background: "#eff6ff",
    bodyStyle: "soft",
    eyeStyle: "rounded",
    foreground: "#172554",
    frame: "visit-website",
    frameBackground: "#172554",
    gradientColor: "#1e40af",
  }),
  template("coral", "Coral", "Friendly contact card", {
    background: "#fff7ed",
    bodyStyle: "circles",
    eyeStyle: "circle",
    foreground: "#7c2d12",
    frame: "contact-me",
    frameBackground: "#7c2d12",
    gradientColor: "#9a3412",
  }),
  template("slate", "Business", "Quiet professional finish", {
    background: "#f8fafc",
    bodyStyle: "rounded",
    eyeStyle: "square",
    foreground: "#1e293b",
    frame: "open-link",
    frameBackground: "#1e293b",
  }),
  template("citrus", "Citrus", "Bright but readable", {
    background: "#fefce8",
    bodyStyle: "dots",
    eyeStyle: "soft",
    foreground: "#3f3f0f",
    frame: "scan-me",
    frameBackground: "#3f3f0f",
    gradientColor: "#4d5f14",
  }),
  template("lavender", "Event", "Event-ready purple", {
    background: "#f5f3ff",
    bodyStyle: "circles",
    eyeStyle: "circle",
    foreground: "#312e81",
    frame: "join-event",
    frameBackground: "#312e81",
    gradientColor: "#6d28d9",
  }),
  template("mono", "Monochrome", "Clean print classic", {
    bodyStyle: "rounded",
    eyeStyle: "rounded",
    foreground: "#111827",
  }),
  template("payment", "Payment", "Clear payment prompt", {
    background: "#f0fdfa",
    bodyStyle: "square",
    eyeStyle: "soft",
    foreground: "#134e4a",
    frame: "scan-to-pay",
    frameBackground: "#134e4a",
  }),
  template("audio", "Audio", "Rich listening prompt", {
    background: "#fdf4ff",
    bodyStyle: "dots",
    eyeStyle: "circle",
    foreground: "#4a044e",
    frame: "listen-now",
    frameBackground: "#4a044e",
    gradientColor: "#86198f",
  }),
  template("directions", "Directions", "Travel-friendly blue", {
    background: "#ecfeff",
    bodyStyle: "soft",
    eyeStyle: "rounded",
    foreground: "#164e63",
    frame: "get-directions",
    frameBackground: "#164e63",
    gradientColor: "#155e75",
  }),
  template("profile", "Profile", "Personal and warm", {
    background: "#fff7ed",
    bodyStyle: "circles",
    eyeStyle: "soft",
    foreground: "#3f1d0b",
    frame: "see-profile",
    frameBackground: "#3f1d0b",
  }),
  template("review", "Review", "Confident feedback prompt", {
    background: "#fffbeb",
    bodyStyle: "rounded",
    eyeStyle: "circle",
    foreground: "#713f12",
    frame: "share-feedback",
    frameBackground: "#713f12",
    gradientColor: "#854d0e",
  }),
  template("wifi", "WiFi", "Simple connection card", {
    background: "#f0fdf4",
    bodyStyle: "soft",
    eyeStyle: "rounded",
    foreground: "#14532d",
    frame: "connect-wifi",
    frameBackground: "#14532d",
    gradientColor: "#166534",
  }),
];

export interface QrDesignPreset {
  design: TemplateDesign;
  name: string;
}

export const designPresets: QrDesignPreset[] = [
  designTemplates[3],
  designTemplates[9],
  designTemplates[4],
  designTemplates[5],
  designTemplates[11],
].map(({ design, name }) => ({ design, name }));

function luminance(hex: string) {
  const channels = [1, 3, 5].map((start) =>
    Number.parseInt(hex.slice(start, start + 2), 16) / 255,
  );
  const [red, green, blue] = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
  );
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

export function contrastRatio(first: string, second: string) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

export function getDesignWarnings(design: QrDesignOptions) {
  const colors = [design.foreground, design.gradientColor].filter(
    (color): color is string => Boolean(color),
  );
  const minimumContrast = Math.min(
    ...colors.map((color) => contrastRatio(color, design.background)),
  );
  const warnings: string[] = [];

  if (minimumContrast < 4.5) {
    warnings.push(
      "Low color contrast may make this QR code harder to scan. Use a darker foreground or lighter background.",
    );
  }
  if (design.logoDataUrl && design.logoSize >= 17) {
    warnings.push(
      "A larger logo needs careful testing. Reduce it for dense QR codes or small print sizes.",
    );
  }
  if (
    design.frame !== "none" &&
    contrastRatio(design.frameBackground, design.frameTextColor) < 4.5
  ) {
    warnings.push(
      "Frame text has low contrast. Choose more distinct frame and text colors.",
    );
  }

  return { minimumContrast, warnings };
}
