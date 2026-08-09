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
].sort();

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
  }
});
