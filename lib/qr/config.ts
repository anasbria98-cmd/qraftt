import type { LinkQrType, QrType, SocialQrType } from "./types";

export const qrTypeOptions: Array<{ label: string; value: QrType }> = [
  { label: "URL", value: "url" },
  { label: "Text", value: "text" },
  { label: "WiFi", value: "wifi" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Email", value: "email" },
  { label: "vCard", value: "vcard" },
  { label: "SMS", value: "sms" },
  { label: "Phone", value: "phone" },
  { label: "Location", value: "location" },
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "YouTube", value: "youtube" },
  { label: "TikTok", value: "tiktok" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Telegram", value: "telegram" },
  { label: "Google Review", value: "google-review" },
  { label: "Menu", value: "menu" },
  { label: "Spotify", value: "spotify" },
  { label: "PayPal", value: "paypal" },
  { label: "PDF Link", value: "pdf-link" },
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
};

export function isSocialQrType(type: QrType): type is SocialQrType {
  return type in socialQrConfig;
}

export function isLinkQrType(type: QrType): type is LinkQrType {
  return type in linkQrConfig;
}
