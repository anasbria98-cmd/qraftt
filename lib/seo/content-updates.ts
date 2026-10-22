import type { GeneratorPageSlug } from "./generator-pages.ts";

export const pageContentUpdatedAt = {
  about: "2026-08-24",
  contact: "2026-09-04",
  homepage: "2026-08-24",
} as const;

/**
 * Latest source content, SEO, or GEO change for each generator page.
 * These dates are intentionally explicit and must not use deployment fallbacks.
 */
export const generatorPageContentUpdatedAt = {
  "amazon-qr-code-generator": "2026-09-10",
  "app-store-qr-code-generator": "2026-09-10",
  "audio-qr-code-generator": "2026-09-09",
  "calendar-qr-code-generator": "2026-09-10",
  "discord-qr-code-generator": "2026-09-10",
  "email-qr-code-generator": "2026-09-10",
  "event-qr-code-generator": "2026-09-09",
  "facebook-qr-code-generator": "2026-09-09",
  "google-review-qr-code-generator": "2026-09-09",
  "google-docs-qr-code-generator": "2026-09-10",
  "google-forms-qr-code-generator": "2026-09-10",
  "image-qr-code-generator": "2026-09-10",
  "instagram-qr-code-generator": "2026-09-09",
  "linkedin-qr-code-generator": "2026-09-10",
  "location-qr-code-generator": "2026-09-09",
  "menu-qr-code-generator": "2026-09-10",
  "paypal-qr-code-generator": "2026-09-09",
  "pdf-qr-code-generator": "2026-09-09",
  "phone-qr-code-generator": "2026-09-10",
  "qr-code-generator": "2026-09-01",
  "rsvp-qr-code-generator": "2026-09-08",
  "sms-qr-code-generator": "2026-09-09",
  "snapchat-qr-code-generator": "2026-09-09",
  "spotify-qr-code-generator": "2026-09-10",
  "spreadsheet-qr-code-generator": "2026-09-10",
  "telegram-qr-code-generator": "2026-09-09",
  "text-qr-code-generator": "2026-09-10",
  "tiktok-qr-code-generator": "2026-09-09",
  "url-qr-code-generator": "2026-09-10",
  "vcard-qr-code-generator": "2026-09-09",
  "whatsapp-qr-code-generator": "2026-09-01",
  "wifi-qr-code-generator": "2026-08-31",
  "youtube-qr-code-generator": "2026-09-09",
} as const satisfies Record<GeneratorPageSlug, string>;

export function getGeneratorPageContentUpdatedAt(slug: GeneratorPageSlug) {
  return generatorPageContentUpdatedAt[slug];
}
