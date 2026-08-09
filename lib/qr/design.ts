export type QrBodyStyle = "square" | "rounded" | "dots";
export type QrEyeStyle = "square" | "rounded" | "circle";
export type QrFrame =
  | "none"
  | "scan-me"
  | "view-menu"
  | "connect-wifi"
  | "follow-us"
  | "open-link";

export interface QrDesignOptions {
  background: string;
  bodyStyle: QrBodyStyle;
  eyeStyle: QrEyeStyle;
  foreground: string;
  frame: QrFrame;
  gradientColor: string | null;
  logoDataUrl: string | null;
  logoSize: number;
}

export const bodyStyleOptions: Array<{ label: string; value: QrBodyStyle }> = [
  { label: "Square", value: "square" },
  { label: "Rounded", value: "rounded" },
  { label: "Dots", value: "dots" },
];

export const eyeStyleOptions: Array<{ label: string; value: QrEyeStyle }> = [
  { label: "Square", value: "square" },
  { label: "Rounded", value: "rounded" },
  { label: "Circle", value: "circle" },
];

export const frameOptions: Array<{
  label: string;
  value: QrFrame;
}> = [
  { label: "No frame", value: "none" },
  { label: "Scan Me", value: "scan-me" },
  { label: "View Menu", value: "view-menu" },
  { label: "Connect WiFi", value: "connect-wifi" },
  { label: "Follow Us", value: "follow-us" },
  { label: "Open Link", value: "open-link" },
];

export const frameLabels: Record<QrFrame, string> = {
  none: "",
  "scan-me": "SCAN ME",
  "view-menu": "VIEW MENU",
  "connect-wifi": "CONNECT WIFI",
  "follow-us": "FOLLOW US",
  "open-link": "OPEN LINK",
};

export interface QrDesignPreset {
  design: Omit<QrDesignOptions, "logoDataUrl" | "logoSize">;
  name: string;
}

export const designPresets: QrDesignPreset[] = [
  {
    name: "Minimal",
    design: {
      background: "#ffffff",
      bodyStyle: "square",
      eyeStyle: "square",
      foreground: "#102a2a",
      frame: "none",
      gradientColor: null,
    },
  },
  {
    name: "Business",
    design: {
      background: "#ffffff",
      bodyStyle: "rounded",
      eyeStyle: "rounded",
      foreground: "#123b4a",
      frame: "open-link",
      gradientColor: "#287a54",
    },
  },
  {
    name: "Restaurant",
    design: {
      background: "#fffaf2",
      bodyStyle: "dots",
      eyeStyle: "circle",
      foreground: "#5c2d1f",
      frame: "view-menu",
      gradientColor: null,
    },
  },
  {
    name: "Social",
    design: {
      background: "#ffffff",
      bodyStyle: "dots",
      eyeStyle: "circle",
      foreground: "#3b2f8f",
      frame: "follow-us",
      gradientColor: "#a21caf",
    },
  },
  {
    name: "Event",
    design: {
      background: "#f6fff8",
      bodyStyle: "rounded",
      eyeStyle: "circle",
      foreground: "#0f5132",
      frame: "scan-me",
      gradientColor: "#287a54",
    },
  },
];

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
  if (design.logoDataUrl && design.logoSize >= 19) {
    warnings.push(
      "A large logo can reduce scan reliability. Test the code before printing or reduce the logo size.",
    );
  }

  return { minimumContrast, warnings };
}
