import assert from "node:assert/strict";
import test from "node:test";
import {
  generatorPageList,
  generatorPages,
} from "../lib/seo/generator-pages.ts";

const expectedSlugs = [
  "qr-code-generator",
  "wifi-qr-code-generator",
  "whatsapp-qr-code-generator",
  "vcard-qr-code-generator",
  "url-qr-code-generator",
  "text-qr-code-generator",
  "email-qr-code-generator",
  "sms-qr-code-generator",
  "phone-qr-code-generator",
  "location-qr-code-generator",
  "instagram-qr-code-generator",
  "facebook-qr-code-generator",
  "youtube-qr-code-generator",
  "tiktok-qr-code-generator",
  "linkedin-qr-code-generator",
  "telegram-qr-code-generator",
  "google-review-qr-code-generator",
  "menu-qr-code-generator",
  "spotify-qr-code-generator",
  "paypal-qr-code-generator",
  "pdf-qr-code-generator",
  "calendar-qr-code-generator",
  "google-forms-qr-code-generator",
  "google-docs-qr-code-generator",
  "image-qr-code-generator",
  "audio-qr-code-generator",
  "spreadsheet-qr-code-generator",
  "discord-qr-code-generator",
  "amazon-qr-code-generator",
  "snapchat-qr-code-generator",
  "app-store-qr-code-generator",
].sort();

const prioritySlugs = [
  "wifi-qr-code-generator",
  "whatsapp-qr-code-generator",
  "google-review-qr-code-generator",
  "menu-qr-code-generator",
  "pdf-qr-code-generator",
  "instagram-qr-code-generator",
  "vcard-qr-code-generator",
  "url-qr-code-generator",
] as const;

test("defines all substantial and uniquely targeted generator pages", () => {
  assert.deepEqual(
    generatorPageList.map((page) => page.slug).sort(),
    expectedSlugs,
  );
  assert.equal(
    new Set(generatorPageList.map((page) => page.seoTitle)).size,
    expectedSlugs.length,
  );
  assert.equal(
    new Set(generatorPageList.map((page) => page.metaDescription)).size,
    expectedSlugs.length,
  );
  assert.equal(
    new Set(generatorPageList.map((page) => page.h1)).size,
    expectedSlugs.length,
  );

  for (const page of generatorPageList) {
    assert.ok(page.introduction.length >= 120);
    assert.ok(page.howTo.length >= 3);
    assert.ok(page.useCases.length >= 4);
    assert.ok(page.faq.length >= 4);
    assert.ok(page.related.length >= 3);
    assert.ok(page.related.every((slug) => Boolean(generatorPages[slug])));
    assert.equal(new Set(page.related).size, page.related.length);
    assert.ok(!page.related.includes(page.slug));
  }

  for (const [slug, page] of Object.entries(generatorPages)) {
    assert.equal(page.slug, slug);
  }
});

test("priority pages have focused metadata and practical guidance", () => {
  for (const slug of prioritySlugs) {
    const page = generatorPages[slug];
    assert.ok(page.seoTitle.length >= 35 && page.seoTitle.length <= 60);
    assert.ok(
      page.metaDescription.length >= 120 && page.metaDescription.length <= 160,
    );
    assert.ok(page.topic);
    assert.ok(page.guidance);
    assert.ok(page.guidance.items.length >= 3);
    assert.ok(page.guidance.description.length >= 100);
  }
});
