import { uploadedFrames } from "./uploaded-frames.ts";

export type QrBodyStyle =
  | "square"
  | "rounded"
  | "dots"
  | "circles"
  | "soft"
  | "line"
  | "connected"
  | "diamond"
  | "pill";
export type QrOuterEyeStyle = "square" | "rounded" | "circle" | "soft";
export type QrInnerEyeStyle = "square" | "rounded" | "circle" | "diamond";
export type QrArtwork =
  | "none"
  | "leaf-wreath"
  | "ocean-wave"
  | "editorial-card"
  | "menu-board"
  | "social-burst"
  | "leaf-badge"
  | "browser-window"
  | "contact-card"
  | "business-card"
  | "citrus-slices"
  | "event-pass"
  | "minimal-grid"
  | "payment-card"
  | "headphones"
  | "map-route"
  | "portrait-card"
  | "review-stars"
  | "wifi-router"
  | "botanical-arch"
  | "wildflower-corners"
  | "wedding-envelope"
  | "heart-emblem"
  | "birthday-cake"
  | "party-popper"
  | "gift-box"
  | "crescent-lantern"
  | "pasta-plate"
  | "coffee-cup"
  | "lemonade-glass"
  | "shopping-bag"
  | "parcel-box"
  | "briefcase"
  | "creator-studio"
  | "social-phone"
  | "video-screen"
  | "network-card"
  | "review-card"
  | "wallet-card"
  | "conference-badge"
  | "travel-suitcase"
  | "sun-rays"
  | "watermelon-summer"
  | "candy-swirls"
  | "pastel-clouds"
  | "luxury-curtain"
  | "gold-crest"
  | "night-sky"
  | "grid-poster"
  | "geometric-stack"
  | "building-blocks"
  | "retro-tv"
  | "aurora-ribbons"
  | "ink-brushes"
  | "round-seal"
  | "torn-poster"
  | "sticker-collage"
  | "brunch-plate"
  | "tea-pot"
  | "baby-mobile";
export type QrDecoration =
  | "none"
  | "botanical"
  | "floral"
  | "hearts"
  | "confetti"
  | "stars"
  | "holiday"
  | "crescent"
  | "coffee"
  | "food"
  | "shopping"
  | "travel"
  | "beach"
  | "geometric"
  | "playful"
  | "retro"
  | "abstract"
  | "badge"
  | "premium"
  | "sticker"
  | "sparkles";
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
  | "share-feedback"
  | "simple-square"
  | "rounded-square"
  | "thin-outline"
  | "thick-outline"
  | "top-label"
  | "speech-top"
  | "speech-bottom"
  | "scan-now"
  | "phone-card"
  | "poster"
  | "badge-circle"
  | "star-burst"
  | "corner-flourish"
  | "arrow-callout"
  | "shop-now"
  | "premium-plaque";

export interface QrDesignOptions {
  uploadedFrameId?: string | null;
  premiumTemplateId?: string | null;
  artwork: QrArtwork;
  background: string;
  bodyStyle: QrBodyStyle;
  decoration: QrDecoration;
  foreground: string;
  frame: QrFrame;
  frameBackground: string;
  frameColor: string;
  frameLabel: string | null;
  frameTransparent: boolean;
  frameTextColor: string;
  gradientColor: string | null;
  innerEyeColor: string;
  innerEyeStyle: QrInnerEyeStyle;
  logoDataUrl: string | null;
  logoSize: number;
  outerEyeColor: string;
  outerEyeStyle: QrOuterEyeStyle;
}

export const defaultDesign: QrDesignOptions = {
  artwork: "none",
  background: "#ffffff",
  bodyStyle: "square",
  decoration: "none",
  foreground: "#102a2a",
  frame: "none",
  frameBackground: "#102a2a",
  frameColor: "#ffffff",
  frameLabel: null,
  frameTransparent: false,
  frameTextColor: "#102a2a",
  gradientColor: null,
  innerEyeColor: "#102a2a",
  innerEyeStyle: "square",
  logoDataUrl: null,
  logoSize: 16,
  outerEyeColor: "#102a2a",
  outerEyeStyle: "square",
};

export const bodyStyleOptions: Array<{ label: string; value: QrBodyStyle }> = [
  { label: "Square", value: "square" },
  { label: "Rounded", value: "rounded" },
  { label: "Dots", value: "dots" },
  { label: "Circles", value: "circles" },
  { label: "Soft", value: "soft" },
  { label: "Line", value: "line" },
  { label: "Connected", value: "connected" },
  { label: "Diamond", value: "diamond" },
  { label: "Pill", value: "pill" },
];

export const outerEyeStyleOptions: Array<{
  label: string;
  value: QrOuterEyeStyle;
}> = [
  { label: "Square", value: "square" },
  { label: "Rounded", value: "rounded" },
  { label: "Circle", value: "circle" },
  { label: "Soft", value: "soft" },
];

export const innerEyeStyleOptions: Array<{
  label: string;
  value: QrInnerEyeStyle;
}> = [
  { label: "Square", value: "square" },
  { label: "Rounded", value: "rounded" },
  { label: "Circle", value: "circle" },
  { label: "Diamond", value: "diamond" },
];

export interface QrFrameOption {
  label: string;
  structure: QrFrameStructure;
  value: QrFrame;
}

export type QrFrameStructure =
  | "none"
  | "pill-bottom"
  | "menu-footer"
  | "wifi-header"
  | "social-bubble"
  | "link-tab"
  | "payment-ticket"
  | "contact-rail"
  | "website-footer"
  | "event-ticket"
  | "audio-bars"
  | "map-pin"
  | "profile-card"
  | "review-stars"
  | "simple-square"
  | "rounded-square"
  | "thin-outline"
  | "thick-outline"
  | "top-label"
  | "speech-top"
  | "speech-bottom"
  | "scan-now"
  | "phone-card"
  | "poster"
  | "badge-circle"
  | "star-burst"
  | "corner-flourish"
  | "arrow-callout"
  | "shop-now"
  | "premium-plaque";

export const frameOptions: QrFrameOption[] = [
  { label: "No frame", structure: "none", value: "none" },
  { label: "Scan Me", structure: "pill-bottom", value: "scan-me" },
  { label: "View Menu", structure: "menu-footer", value: "view-menu" },
  { label: "Connect WiFi", structure: "wifi-header", value: "connect-wifi" },
  { label: "Follow Us", structure: "social-bubble", value: "follow-us" },
  { label: "Open Link", structure: "link-tab", value: "open-link" },
  { label: "Scan to Pay", structure: "payment-ticket", value: "scan-to-pay" },
  { label: "Contact Me", structure: "contact-rail", value: "contact-me" },
  { label: "Visit Website", structure: "website-footer", value: "visit-website" },
  { label: "Join Event", structure: "event-ticket", value: "join-event" },
  { label: "Listen Now", structure: "audio-bars", value: "listen-now" },
  { label: "Get Directions", structure: "map-pin", value: "get-directions" },
  { label: "See Profile", structure: "profile-card", value: "see-profile" },
  { label: "Share Feedback", structure: "review-stars", value: "share-feedback" },
  { label: "Simple Square", structure: "simple-square", value: "simple-square" },
  { label: "Rounded Square", structure: "rounded-square", value: "rounded-square" },
  { label: "Thin Outline", structure: "thin-outline", value: "thin-outline" },
  { label: "Thick Outline", structure: "thick-outline", value: "thick-outline" },
  { label: "Top Label", structure: "top-label", value: "top-label" },
  { label: "Speech Top", structure: "speech-top", value: "speech-top" },
  { label: "Speech Bottom", structure: "speech-bottom", value: "speech-bottom" },
  { label: "Scan Now", structure: "scan-now", value: "scan-now" },
  { label: "Phone Card", structure: "phone-card", value: "phone-card" },
  { label: "Poster", structure: "poster", value: "poster" },
  { label: "Circle Badge", structure: "badge-circle", value: "badge-circle" },
  { label: "Star Burst", structure: "star-burst", value: "star-burst" },
  { label: "Corner Flourish", structure: "corner-flourish", value: "corner-flourish" },
  { label: "Arrow Callout", structure: "arrow-callout", value: "arrow-callout" },
  { label: "Shop Now", structure: "shop-now", value: "shop-now" },
  { label: "Premium", structure: "premium-plaque", value: "premium-plaque" },
];

export const frameLabels = Object.fromEntries(
  frameOptions.map((option) => [
    option.value,
    option.value === "none" ? "" : option.label.toUpperCase(),
  ]),
) as Record<QrFrame, string>;

export const frameStructures = Object.fromEntries(
  frameOptions.map((option) => [option.value, option.structure]),
) as Record<QrFrame, QrFrameStructure>;

type TemplateDesign = Omit<QrDesignOptions, "logoDataUrl" | "logoSize">;

const templateArtworkById: Record<string, QrArtwork> = {
  none: "none",
  forest: "leaf-wreath",
  ocean: "ocean-wave",
  studio: "editorial-card",
  cafe: "menu-board",
  "social-pop": "social-burst",
  emerald: "leaf-badge",
  navy: "browser-window",
  coral: "contact-card",
  slate: "business-card",
  citrus: "citrus-slices",
  lavender: "event-pass",
  mono: "minimal-grid",
  payment: "payment-card",
  audio: "headphones",
  directions: "map-route",
  profile: "portrait-card",
  review: "review-stars",
  wifi: "wifi-router",
  botanical: "botanical-arch",
  wildflower: "wildflower-corners",
  "rose-vows": "wedding-envelope",
  "love-note": "heart-emblem",
  birthday: "birthday-cake",
  confetti: "party-popper",
  holiday: "gift-box",
  moonlight: "crescent-lantern",
  "pasta-night": "pasta-plate",
  "coffee-house": "coffee-cup",
  cocktail: "lemonade-glass",
  "shop-window": "shopping-bag",
  ecommerce: "parcel-box",
  executive: "briefcase",
  creator: "creator-studio",
  "reel-pop": "social-phone",
  "video-premiere": "video-screen",
  wireless: "network-card",
  "five-star": "review-card",
  "quick-pay": "wallet-card",
  conference: "conference-badge",
  passport: "travel-suitcase",
  summer: "sun-rays",
  "beach-day": "watermelon-summer",
  "candy-pop": "candy-swirls",
  "pastel-card": "pastel-clouds",
  velvet: "luxury-curtain",
  "gold-label": "gold-crest",
  midnight: "night-sky",
  "minimal-grid": "grid-poster",
  geometry: "geometric-stack",
  playroom: "building-blocks",
  "retro-wave": "retro-tv",
  aurora: "aurora-ribbons",
  "abstract-ink": "ink-brushes",
  "round-badge": "round-seal",
  "street-poster": "torn-poster",
  "sticker-pack": "sticker-collage",
  brunch: "brunch-plate",
  "tea-garden": "tea-pot",
  "baby-shower": "baby-mobile",
};

export interface QrDesignTemplate {
  description: string;
  design: TemplateDesign;
  errorCorrection: "M" | "Q" | "H";
  id: string;
  name: string;
}

function template(
  id: string,
  name: string,
  description: string,
  design: Partial<TemplateDesign> & { eyeStyle?: QrOuterEyeStyle },
): QrDesignTemplate {
  const base: TemplateDesign = {
    artwork: defaultDesign.artwork,
    background: defaultDesign.background,
    bodyStyle: defaultDesign.bodyStyle,
    decoration: defaultDesign.decoration,
    foreground: defaultDesign.foreground,
    frame: defaultDesign.frame,
    frameBackground: defaultDesign.frameBackground,
    frameColor: defaultDesign.frameColor,
    frameLabel: defaultDesign.frameLabel,
    frameTransparent: defaultDesign.frameTransparent,
    frameTextColor: defaultDesign.frameTextColor,
    gradientColor: defaultDesign.gradientColor,
    innerEyeColor: defaultDesign.innerEyeColor,
    innerEyeStyle: defaultDesign.innerEyeStyle,
    outerEyeColor: defaultDesign.outerEyeColor,
    outerEyeStyle: defaultDesign.outerEyeStyle,
  };
  const { eyeStyle, ...designOptions } = design;
  const resolved: TemplateDesign = { ...base, ...designOptions };
  resolved.artwork = design.artwork ?? templateArtworkById[id] ?? "none";
  if (eyeStyle) {
    resolved.outerEyeStyle = eyeStyle;
    resolved.innerEyeStyle = eyeStyle === "soft" ? "rounded" : eyeStyle;
  }
  if (!design.outerEyeColor) resolved.outerEyeColor = resolved.foreground;
  if (!design.innerEyeColor) resolved.innerEyeColor = resolved.foreground;
  const errorCorrection =
    resolved.artwork !== "none" || resolved.decoration !== "none"
      ? "H"
      : resolved.frame !== "none"
        ? "Q"
        : "M";
  return { description, design: resolved, errorCorrection, id, name };
}

const completeTemplateArtworkLibrary: QrDesignTemplate[] = [
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
  template("botanical", "Wedding Arch", "Botanical ceremony arch with a protected QR center", {
    background: "#f7fee7",
    bodyStyle: "rounded",
    decoration: "botanical",
    eyeStyle: "soft",
    foreground: "#173f2a",
    frame: "corner-flourish",
    frameBackground: "#315c3b",
    frameColor: "#d9f99d",
  }),
  template("wildflower", "Floral Bouquet", "QR nestled inside a full floral arrangement", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "soft",
    foreground: "#4c0519",
    frame: "none",
    frameBackground: "#fff1f2",
    frameColor: "#be123c",
    gradientColor: "#9f1239",
  }),
  template("rose-vows", "Envelope", "QR presented inside an illustrated open envelope", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "rounded",
    foreground: "#7c2d12",
    frame: "none",
    frameBackground: "#fff7ed",
    frameColor: "#c2410c",
    gradientColor: "#9a3412",
  }),
  template("love-note", "Heart / Love", "QR held inside a bold heart composition", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "circle",
    foreground: "#831843",
    frame: "none",
    frameBackground: "#fff1f2",
    frameColor: "#e11d48",
    gradientColor: "#be123c",
  }),
  template("birthday", "Birthday / Celebration", "QR wrapped as a gift with balloons", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "circle",
    foreground: "#3b0764",
    frame: "none",
    frameBackground: "#faf5ff",
    frameColor: "#7c3aed",
    gradientColor: "#6d28d9",
  }),
  template("confetti", "Confetti", "Colorful celebration", {
    background: "#faf5ff",
    bodyStyle: "rounded",
    decoration: "confetti",
    eyeStyle: "soft",
    foreground: "#3b0764",
    frame: "top-label",
    frameBackground: "#581c87",
    frameColor: "#e9d5ff",
    frameLabel: "JOIN THE PARTY",
    gradientColor: "#6b21a8",
  }),
  template("holiday", "Gift Box", "Wrapped gift composition for offers and celebrations", {
    background: "#f0fdf4",
    bodyStyle: "square",
    decoration: "holiday",
    eyeStyle: "rounded",
    foreground: "#14532d",
    frame: "poster",
    frameBackground: "#7f1d1d",
    frameColor: "#fef2f2",
    frameLabel: "SEASON'S GREETINGS",
  }),
  template("moonlight", "Moonlight", "Elegant crescent motif", {
    background: "#fffbeb",
    bodyStyle: "soft",
    decoration: "crescent",
    eyeStyle: "soft",
    foreground: "#422006",
    frame: "premium-plaque",
    frameBackground: "#1e1b4b",
    frameColor: "#fde68a",
    frameLabel: "SCAN & DISCOVER",
  }),
  template("pasta-night", "Pasta Night", "Warm restaurant poster", {
    background: "#fff7ed",
    bodyStyle: "circles",
    decoration: "food",
    eyeStyle: "circle",
    foreground: "#7c2d12",
    frame: "view-menu",
    frameBackground: "#431407",
    frameColor: "#fed7aa",
    frameLabel: "TODAY'S MENU",
  }),
  template("coffee-house", "Coffee", "QR served inside an illustrated café cup", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "soft",
    foreground: "#451a03",
    frame: "none",
    frameBackground: "#fef3c7",
    frameColor: "#92400e",
    gradientColor: "#78350f",
  }),
  template("cocktail", "Summer Drink", "QR immersed in a lemonade glass scene", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "circle",
    foreground: "#164e63",
    frame: "none",
    frameBackground: "#ecfeff",
    frameColor: "#0891b2",
    gradientColor: "#155e75",
  }),
  template("shop-window", "Shopping Bag", "QR printed into a full illustrated shopping bag", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "rounded",
    foreground: "#7c2d12",
    frame: "none",
    frameBackground: "#fff7ed",
    frameColor: "#ea580c",
    gradientColor: "#9a3412",
  }),
  template("ecommerce", "Ecommerce", "Modern product sticker", {
    background: "#eff6ff",
    bodyStyle: "soft",
    decoration: "sticker",
    eyeStyle: "soft",
    foreground: "#172554",
    frame: "arrow-callout",
    frameBackground: "#1e3a8a",
    frameColor: "#dbeafe",
    frameLabel: "VIEW PRODUCT",
  }),
  template("executive", "Executive", "Polished business card", {
    background: "#f8fafc",
    bodyStyle: "square",
    decoration: "geometric",
    eyeStyle: "square",
    foreground: "#0f172a",
    frame: "simple-square",
    frameBackground: "#1e293b",
    frameColor: "#cbd5e1",
    frameLabel: "CONNECT",
  }),
  template("creator", "Creator", "Bold personal channel", {
    background: "#fdf2f8",
    bodyStyle: "dots",
    decoration: "abstract",
    eyeStyle: "circle",
    foreground: "#500724",
    frame: "see-profile",
    frameBackground: "#831843",
    frameColor: "#fbcfe8",
    frameLabel: "SEE MY WORK",
    gradientColor: "#4c1d95",
  }),
  template("reel-pop", "Reel Pop", "Energetic social card", {
    background: "#fff7ed",
    bodyStyle: "circles",
    decoration: "confetti",
    eyeStyle: "soft",
    foreground: "#701a75",
    frame: "follow-us",
    frameBackground: "#4a044e",
    frameColor: "#f5d0fe",
    frameLabel: "WATCH MORE",
    gradientColor: "#9f1239",
  }),
  template("video-premiere", "Video Premiere", "High-contrast video launch", {
    background: "#fef2f2",
    bodyStyle: "square",
    decoration: "stars",
    eyeStyle: "rounded",
    foreground: "#450a0a",
    frame: "poster",
    frameBackground: "#7f1d1d",
    frameColor: "#fecaca",
    frameLabel: "WATCH NOW",
  }),
  template("wireless", "Wireless", "Friendly network card", {
    background: "#ecfeff",
    bodyStyle: "rounded",
    decoration: "geometric",
    eyeStyle: "soft",
    foreground: "#164e63",
    frame: "connect-wifi",
    frameBackground: "#155e75",
    frameColor: "#cffafe",
    frameLabel: "JOIN NETWORK",
    gradientColor: "#134e4a",
  }),
  template("five-star", "Review Stars", "Five-star review request composition", {
    background: "#fffbeb",
    bodyStyle: "soft",
    decoration: "stars",
    eyeStyle: "circle",
    foreground: "#422006",
    frame: "share-feedback",
    frameBackground: "#713f12",
    frameColor: "#fde68a",
    frameLabel: "RATE YOUR VISIT",
  }),
  template("quick-pay", "Quick Pay", "Clear secure payment badge", {
    background: "#ecfdf5",
    bodyStyle: "square",
    decoration: "badge",
    eyeStyle: "square",
    foreground: "#064e3b",
    frame: "scan-to-pay",
    frameBackground: "#065f46",
    frameColor: "#d1fae5",
    frameLabel: "SCAN TO PAY",
  }),
  template("conference", "Conference", "Professional event ticket", {
    background: "#eef2ff",
    bodyStyle: "rounded",
    decoration: "geometric",
    eyeStyle: "rounded",
    foreground: "#312e81",
    frame: "join-event",
    frameBackground: "#3730a3",
    frameColor: "#e0e7ff",
    frameLabel: "EVENT ACCESS",
  }),
  template("passport", "Travel Suitcase", "QR mounted into an illustrated travel case", {
    background: "#ffffff",
    bodyStyle: "rounded",
    decoration: "none",
    eyeStyle: "soft",
    foreground: "#172554",
    frame: "none",
    frameBackground: "#eff6ff",
    frameColor: "#1d4ed8",
    gradientColor: "#1e3a8a",
  }),
  template("summer", "Summer", "Sunny seasonal card", {
    background: "#fffbeb",
    bodyStyle: "circles",
    decoration: "beach",
    eyeStyle: "circle",
    foreground: "#713f12",
    frame: "badge-circle",
    frameBackground: "#075985",
    frameColor: "#fde68a",
    frameLabel: "SUMMER GUIDE",
  }),
  template("beach-day", "Beach Day", "Ocean-wave destination", {
    background: "#ecfeff",
    bodyStyle: "dots",
    decoration: "beach",
    eyeStyle: "circle",
    foreground: "#164e63",
    frame: "open-link",
    frameBackground: "#0e7490",
    frameColor: "#cffafe",
    frameLabel: "EXPLORE HERE",
    gradientColor: "#155e75",
  }),
  template("candy-pop", "Candy Pop", "Colorful playful shapes", {
    background: "#fdf4ff",
    bodyStyle: "circles",
    decoration: "playful",
    eyeStyle: "circle",
    foreground: "#581c87",
    frame: "star-burst",
    frameBackground: "#86198f",
    frameColor: "#f5d0fe",
    frameLabel: "SCAN FOR FUN",
    gradientColor: "#9f1239",
  }),
  template("pastel-card", "Pastel Card", "Soft editorial palette", {
    background: "#fdf2f8",
    bodyStyle: "soft",
    decoration: "hearts",
    eyeStyle: "soft",
    foreground: "#4c1d95",
    frame: "rounded-square",
    frameBackground: "#5b21b6",
    frameColor: "#fce7f3",
  }),
  template("velvet", "Velvet", "Deep premium finish", {
    background: "#faf5ff",
    bodyStyle: "rounded",
    decoration: "premium",
    eyeStyle: "rounded",
    foreground: "#2e1065",
    frame: "premium-plaque",
    frameBackground: "#3b0764",
    frameColor: "#e9d5ff",
    frameLabel: "EXCLUSIVE ACCESS",
  }),
  template("gold-label", "Gold Label", "Luxury gold-inspired card", {
    background: "#fffbeb",
    bodyStyle: "square",
    decoration: "premium",
    eyeStyle: "square",
    foreground: "#422006",
    frame: "thin-outline",
    frameBackground: "#1c1917",
    frameColor: "#facc15",
    frameLabel: "DISCOVER MORE",
  }),
  template("midnight", "Midnight", "Dark gallery presentation", {
    background: "#f8fafc",
    bodyStyle: "dots",
    decoration: "sparkles",
    eyeStyle: "circle",
    foreground: "#020617",
    frame: "top-label",
    frameBackground: "#020617",
    frameColor: "#cbd5e1",
    frameLabel: "OPEN EXPERIENCE",
  }),
  template("minimal-grid", "Minimal Grid", "Quiet structured layout", {
    background: "#ffffff",
    bodyStyle: "square",
    decoration: "geometric",
    eyeStyle: "rounded",
    foreground: "#1f2937",
    frame: "thin-outline",
    frameBackground: "#374151",
    frameColor: "#f9fafb",
  }),
  template("geometry", "Modern Creative", "Architectural shapes and layered modern color", {
    background: "#eff6ff",
    bodyStyle: "soft",
    decoration: "geometric",
    eyeStyle: "square",
    foreground: "#1e3a8a",
    frame: "corner-flourish",
    frameBackground: "#1e40af",
    frameColor: "#dbeafe",
    gradientColor: "#312e81",
  }),
  template("playroom", "Playroom", "Friendly kids design", {
    background: "#fefce8",
    bodyStyle: "circles",
    decoration: "playful",
    eyeStyle: "soft",
    foreground: "#3f3f0f",
    frame: "speech-top",
    frameBackground: "#365314",
    frameColor: "#ecfccb",
    frameLabel: "LET'S PLAY",
  }),
  template("retro-wave", "Retro Wave", "Vintage poster energy", {
    background: "#fff7ed",
    bodyStyle: "rounded",
    decoration: "retro",
    eyeStyle: "circle",
    foreground: "#7c2d12",
    frame: "poster",
    frameBackground: "#4c1d95",
    frameColor: "#fed7aa",
    frameLabel: "TUNE IN",
    gradientColor: "#713f12",
  }),
  template("aurora", "Aurora", "Modern layered gradient", {
    background: "#ecfdf5",
    bodyStyle: "dots",
    decoration: "abstract",
    eyeStyle: "soft",
    foreground: "#064e3b",
    frame: "simple-square",
    frameBackground: "#312e81",
    frameColor: "#a7f3d0",
    gradientColor: "#312e81",
  }),
  template("abstract-ink", "Abstract Ink", "Expressive modern marks", {
    background: "#f8fafc",
    bodyStyle: "soft",
    decoration: "abstract",
    eyeStyle: "rounded",
    foreground: "#0f172a",
    frame: "arrow-callout",
    frameBackground: "#334155",
    frameColor: "#e2e8f0",
    frameLabel: "LOOK HERE",
  }),
  template("round-badge", "Round Badge", "Compact branded seal", {
    background: "#f0fdfa",
    bodyStyle: "circles",
    decoration: "badge",
    eyeStyle: "circle",
    foreground: "#134e4a",
    frame: "badge-circle",
    frameBackground: "#134e4a",
    frameColor: "#ccfbf1",
    frameLabel: "SCAN ME",
  }),
  template("street-poster", "Street Poster", "Bold campaign layout", {
    background: "#fef2f2",
    bodyStyle: "square",
    decoration: "sticker",
    eyeStyle: "square",
    foreground: "#450a0a",
    frame: "poster",
    frameBackground: "#991b1b",
    frameColor: "#fee2e2",
    frameLabel: "OPEN NOW",
  }),
  template("sticker-pack", "Sticker Pack", "Layered sticker accents", {
    background: "#f0f9ff",
    bodyStyle: "dots",
    decoration: "sticker",
    eyeStyle: "soft",
    foreground: "#0c4a6e",
    frame: "scan-now",
    frameBackground: "#075985",
    frameColor: "#e0f2fe",
    gradientColor: "#134e4a",
  }),
  template("brunch", "Brunch", "Fresh daytime menu", {
    background: "#fefce8",
    bodyStyle: "rounded",
    decoration: "food",
    eyeStyle: "soft",
    foreground: "#3f3f0f",
    frame: "view-menu",
    frameBackground: "#365314",
    frameColor: "#ecfccb",
    frameLabel: "BRUNCH MENU",
  }),
  template("tea-garden", "Tea Garden", "Botanical cafe card", {
    background: "#f7fee7",
    bodyStyle: "circles",
    decoration: "botanical",
    eyeStyle: "circle",
    foreground: "#1a2e05",
    frame: "phone-card",
    frameBackground: "#3f6212",
    frameColor: "#d9f99d",
    frameLabel: "RESERVE A TABLE",
  }),
  template("baby-shower", "Baby Shower", "Soft star celebration", {
    background: "#eff6ff",
    bodyStyle: "soft",
    decoration: "stars",
    eyeStyle: "soft",
    foreground: "#1e3a8a",
    frame: "speech-bottom",
    frameBackground: "#3730a3",
    frameColor: "#dbeafe",
    frameLabel: "CELEBRATE WITH US",
  }),
];

export const noTemplate = completeTemplateArtworkLibrary.find(
  (candidate) => candidate.id === "none",
)!;

const phaseATemplateIds = [
  "shop-window",
  "wildflower",
  "rose-vows",
  "coffee-house",
  "love-note",
  "cocktail",
  "passport",
  "birthday",
  "pasta-night",
  "botanical",
  "executive",
  "reel-pop",
  "gold-label",
  "forest",
  "conference",
  "holiday",
  "five-star",
  "wifi",
  "quick-pay",
  "geometry",
] as const;

export const designTemplates: QrDesignTemplate[] = [...uploadedFrames.map((frame): QrDesignTemplate => ({
  id: frame.id, name: frame.name, description: "Uploaded illustrated frame", errorCorrection: "H",
  design: { ...defaultDesign, uploadedFrameId: frame.id, foreground: frame.color, outerEyeColor: frame.color, innerEyeColor: frame.color },
})), ...phaseATemplateIds.map((id) => {
  const selected = completeTemplateArtworkLibrary.find(
    (candidate) => candidate.id === id,
  );
  if (!selected) throw new Error(`Missing Phase A template: ${id}`);
  return selected;
})];

export interface QrDesignPreset {
  design: TemplateDesign;
  name: string;
}

export const designPresets: QrDesignPreset[] = [
  designTemplates.find((template) => template.id === "forest")!,
  designTemplates.find((template) => template.id === "executive")!,
  designTemplates.find((template) => template.id === "pasta-night")!,
  designTemplates.find((template) => template.id === "reel-pop")!,
  designTemplates.find((template) => template.id === "conference")!,
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
  const colors = [
    design.foreground,
    design.gradientColor,
    design.outerEyeColor,
    design.innerEyeColor,
  ].filter(
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
    contrastRatio(design.frameColor, design.frameTextColor) < 4.5
  ) {
    warnings.push(
      "Frame text has low contrast. Choose more distinct frame and text colors.",
    );
  }

  return { minimumContrast, warnings };
}
