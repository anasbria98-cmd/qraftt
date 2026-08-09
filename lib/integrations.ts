export type AdPlacement = "generator" | "content" | "article";

export function normalizeGoogleAnalyticsId(value: string | undefined) {
  const id = value?.trim().toUpperCase();
  return id && /^G-[A-Z0-9]+$/.test(id) ? id : null;
}

export function normalizeAdSenseClientId(value: string | undefined) {
  const id = value?.trim().toLowerCase();
  return id && /^ca-pub-\d+$/.test(id) ? id : null;
}

export function normalizeAdSenseSlotId(value: string | undefined) {
  const id = value?.trim();
  return id && /^\d+$/.test(id) ? id : null;
}

export const googleAnalyticsId = normalizeGoogleAnalyticsId(
  process.env.NEXT_PUBLIC_GA_ID,
);

export const adSenseClientId = normalizeAdSenseClientId(
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
);

export const adSenseSlotIds: Record<AdPlacement, string | null> = {
  generator: normalizeAdSenseSlotId(
    process.env.NEXT_PUBLIC_ADSENSE_GENERATOR_SLOT_ID,
  ),
  content: normalizeAdSenseSlotId(
    process.env.NEXT_PUBLIC_ADSENSE_CONTENT_SLOT_ID,
  ),
  article: normalizeAdSenseSlotId(
    process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT_ID,
  ),
};
