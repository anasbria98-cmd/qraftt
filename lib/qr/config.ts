import type { LinkQrType, QrType, SocialQrType } from "./types";

export type QrTypeCategory =
  | "Popular"
  | "Links & Social"
  | "Contact & Communication"
  | "Files & Documents"
  | "Business"
  | "Payments"
  | "Other";

export interface QrTypeOption {
  category: QrTypeCategory;
  keywords?: readonly string[];
  label: string;
  value: QrType;
}

export const qrTypeCategoryOrder: readonly QrTypeCategory[] = [
  "Popular",
  "Links & Social",
  "Contact & Communication",
  "Files & Documents",
  "Business",
  "Payments",
  "Other",
];

export const qrTypeOptions: QrTypeOption[] = [
  { category: "Popular", label: "URL", value: "url" },
  { category: "Popular", label: "WiFi", value: "wifi" },
  { category: "Popular", label: "WhatsApp", value: "whatsapp" },
  { category: "Popular", label: "Google Review", value: "google-review" },
  { category: "Popular", label: "Menu", value: "menu" },
  { category: "Popular", keywords: ["document"], label: "PDF", value: "pdf-link" },
  { category: "Popular", label: "Instagram", value: "instagram" },
  { category: "Popular", keywords: ["contact"], label: "vCard", value: "vcard" },
  { category: "Links & Social", label: "Facebook", value: "facebook" },
  { category: "Links & Social", label: "YouTube", value: "youtube" },
  { category: "Links & Social", label: "TikTok", value: "tiktok" },
  { category: "Links & Social", label: "LinkedIn", value: "linkedin" },
  { category: "Links & Social", label: "Telegram", value: "telegram" },
  { category: "Links & Social", label: "Discord", value: "discord" },
  { category: "Links & Social", label: "Reddit", value: "reddit" },
  { category: "Links & Social", label: "Snapchat", value: "snapchat" },
  { category: "Links & Social", keywords: ["music", "podcast"], label: "Spotify", value: "spotify" },
  { category: "Contact & Communication", label: "Email", value: "email" },
  { category: "Contact & Communication", label: "SMS", value: "sms" },
  { category: "Contact & Communication", label: "Phone", value: "phone" },
  { category: "Files & Documents", label: "Google Docs", value: "google-docs" },
  { category: "Files & Documents", keywords: ["png", "jpg"], label: "Image", value: "image-url" },
  { category: "Files & Documents", keywords: ["mp3"], label: "Audio", value: "audio-url" },
  { category: "Files & Documents", keywords: ["excel", "sheets"], label: "Spreadsheet", value: "spreadsheet-url" },
  { category: "Files & Documents", keywords: ["pptx", "slides"], label: "Presentation", value: "presentation-url" },
  { category: "Business", label: "Google Forms", value: "google-forms" },
  { category: "Business", keywords: ["product", "store"], label: "Amazon", value: "amazon" },
  { category: "Business", keywords: ["apple", "google play", "mobile app"], label: "App Stores", value: "app-store" },
  { category: "Payments", label: "PayPal", value: "paypal" },
  { category: "Other", label: "Text", value: "text" },
  { category: "Other", keywords: ["map", "coordinates"], label: "Location", value: "location" },
  { category: "Other", keywords: ["event", "appointment"], label: "Calendar", value: "calendar" },
];

interface LinkQrConfig {
  fieldLabel: string;
  hint: string;
  placeholder: string;
}

export const linkQrConfig: Record<LinkQrType, LinkQrConfig> = {
  "google-review": {
    fieldLabel: "Google review URL",
    hint: "Paste the review link copied from your Google Business Profile.",
    placeholder: "https://g.page/r/your-review-code/review",
  },
  menu: {
    fieldLabel: "Restaurant or menu URL",
    hint: "Use a public page where guests can view your current menu.",
    placeholder: "https://restaurant.example/menu",
  },
  spotify: {
    fieldLabel: "Spotify URL",
    hint: "Use an open.spotify.com track, album, playlist, artist, show, or episode URL.",
    placeholder: "https://open.spotify.com/track/...",
  },
  paypal: {
    fieldLabel: "PayPal payment URL",
    hint: "Use an official PayPal.Me, payment, checkout, or donation link.",
    placeholder: "https://paypal.me/username",
  },
  "pdf-link": {
    fieldLabel: "Public PDF URL",
    hint: "The direct public URL must end in .pdf. Files are not uploaded to Qraft.",
    placeholder: "https://example.com/document.pdf",
  },
  "google-forms": {
    fieldLabel: "Google Forms URL",
    hint: "Use a public forms.gle link or an official Google Forms response URL.",
    placeholder: "https://forms.gle/example",
  },
  "google-docs": {
    fieldLabel: "Google Docs URL",
    hint: "Use a shareable docs.google.com/document link.",
    placeholder: "https://docs.google.com/document/d/.../view",
  },
  "image-url": {
    fieldLabel: "Public image URL",
    hint: "Use a direct PNG, JPG, WebP, GIF, or AVIF URL. Images are not uploaded.",
    placeholder: "https://example.com/image.png",
  },
  "audio-url": {
    fieldLabel: "Public audio URL",
    hint: "Use a direct MP3, WAV, OGG, M4A, AAC, FLAC, or WebM audio URL.",
    placeholder: "https://example.com/audio.mp3",
  },
  "spreadsheet-url": {
    fieldLabel: "Public spreadsheet URL",
    hint: "Use a public Excel, CSV, ODS, or Google Sheets URL.",
    placeholder: "https://docs.google.com/spreadsheets/d/.../view",
  },
  "presentation-url": {
    fieldLabel: "Public presentation URL",
    hint: "Use a public PPT, PPTX, ODP, or Google Slides URL.",
    placeholder: "https://docs.google.com/presentation/d/.../view",
  },
  "app-store": {
    fieldLabel: "App Store or Google Play URL",
    hint: "Use an official Apple App Store or Google Play app listing.",
    placeholder: "https://apps.apple.com/app/example/id123456789",
  },
};

interface SocialQrConfig {
  allowedHosts: readonly string[];
  baseUrl?: string;
  fieldLabel: string;
  hint: string;
  maxLength?: number;
  minLength?: number;
  pathPrefix?: string;
  placeholder: string;
  urlOnly?: boolean;
  usernamePattern?: RegExp;
}

export const socialQrConfig: Record<SocialQrType, SocialQrConfig> = {
  instagram: {
    allowedHosts: ["instagram.com"],
    baseUrl: "https://www.instagram.com/",
    fieldLabel: "Instagram username or profile URL",
    hint: "Enter a username or a public Instagram profile URL.",
    maxLength: 30,
    minLength: 1,
    placeholder: "@username",
    usernamePattern: /^[a-z\d._]+$/i,
  },
  facebook: {
    allowedHosts: ["facebook.com", "fb.com"],
    baseUrl: "https://www.facebook.com/",
    fieldLabel: "Facebook username or page URL",
    hint: "Enter a username or a public Facebook profile or page URL.",
    maxLength: 50,
    minLength: 5,
    placeholder: "facebook.com/yourpage",
    usernamePattern: /^[a-z\d.]+$/i,
  },
  youtube: {
    allowedHosts: ["youtube.com", "youtu.be"],
    fieldLabel: "YouTube URL",
    hint: "Use a public channel, video, playlist, or Shorts URL.",
    placeholder: "https://youtube.com/@channel",
    urlOnly: true,
  },
  tiktok: {
    allowedHosts: ["tiktok.com"],
    baseUrl: "https://www.tiktok.com/",
    fieldLabel: "TikTok username or profile URL",
    hint: "Enter a username or a public TikTok profile URL.",
    maxLength: 24,
    minLength: 2,
    pathPrefix: "@",
    placeholder: "@username",
    usernamePattern: /^[a-z\d._]+$/i,
  },
  linkedin: {
    allowedHosts: ["linkedin.com"],
    fieldLabel: "LinkedIn URL",
    hint: "Use a public profile, company, or post URL.",
    placeholder: "https://linkedin.com/in/username",
    urlOnly: true,
  },
  telegram: {
    allowedHosts: ["t.me", "telegram.me"],
    baseUrl: "https://t.me/",
    fieldLabel: "Telegram username or URL",
    hint: "Enter a public username, channel, group, or t.me URL.",
    maxLength: 32,
    minLength: 5,
    placeholder: "@username",
    usernamePattern: /^[a-z\d_]+$/i,
  },
  discord: {
    allowedHosts: ["discord.gg", "discord.com", "discordapp.com"],
    fieldLabel: "Discord invite or server URL",
    hint: "Use an official Discord invite or discord.com server/channel URL.",
    placeholder: "https://discord.gg/example",
    urlOnly: true,
  },
  reddit: {
    allowedHosts: ["reddit.com", "redd.it"],
    fieldLabel: "Reddit URL",
    hint: "Use a public Reddit community, profile, post, or short link.",
    placeholder: "https://www.reddit.com/r/example/",
    urlOnly: true,
  },
  amazon: {
    allowedHosts: [
      "amazon.com",
      "amazon.ca",
      "amazon.com.mx",
      "amazon.com.br",
      "amazon.co.uk",
      "amazon.de",
      "amazon.fr",
      "amazon.it",
      "amazon.es",
      "amazon.nl",
      "amazon.pl",
      "amazon.se",
      "amazon.com.be",
      "amazon.co.jp",
      "amazon.in",
      "amazon.com.au",
      "amazon.sg",
      "amazon.ae",
      "amazon.sa",
      "amazon.eg",
      "amazon.com.tr",
      "amzn.to",
    ],
    fieldLabel: "Amazon product or store URL",
    hint: "Use a public product or storefront URL on an official Amazon domain.",
    placeholder: "https://www.amazon.com/dp/PRODUCTID",
    urlOnly: true,
  },
  snapchat: {
    allowedHosts: ["snapchat.com"],
    fieldLabel: "Snapchat profile or destination URL",
    hint: "Use an official snapchat.com profile, Lens, Spotlight, or shared destination.",
    placeholder: "https://www.snapchat.com/add/username",
    urlOnly: true,
  },
};

export function isSocialQrType(type: QrType): type is SocialQrType {
  return type in socialQrConfig;
}

export function isLinkQrType(type: QrType): type is LinkQrType {
  return type in linkQrConfig;
}
