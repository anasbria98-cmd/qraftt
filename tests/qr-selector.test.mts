import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  featuredQrTypes,
  qrTypeCategoryOrder,
  qrTypeOptions,
} from "../lib/qr/config.ts";

test("groups every QR type once with the priority types first", () => {
  assert.equal(qrTypeOptions.length, 30);
  assert.equal(
    new Set(qrTypeOptions.map((option) => option.value)).size,
    qrTypeOptions.length,
  );
  const supportedValues: readonly string[] = qrTypeOptions.map(
    (option) => option.value,
  );
  assert.ok(!supportedValues.includes("reddit"));
  assert.ok(!supportedValues.includes("presentation-url"));
  assert.deepEqual(qrTypeCategoryOrder, [
    "Popular",
    "Social",
    "Contact",
    "Google & Files",
    "Business / Other",
  ]);

  for (const category of qrTypeCategoryOrder) {
    assert.ok(
      qrTypeOptions.some((option) => option.category === category),
      `${category} should contain at least one QR type`,
    );
  }

  assert.deepEqual(
    qrTypeOptions
      .filter((option) => option.category === "Popular")
      .map((option) => option.value),
    [
      "url",
      "wifi",
      "whatsapp",
      "google-review",
      "menu",
      "pdf-link",
      "vcard",
    ],
  );
  assert.deepEqual(qrTypeOptions.map((option) => option.value), [
    "url",
    "wifi",
    "whatsapp",
    "google-review",
    "menu",
    "pdf-link",
    "vcard",
    "instagram",
    "facebook",
    "youtube",
    "tiktok",
    "linkedin",
    "telegram",
    "discord",
    "snapchat",
    "spotify",
    "email",
    "sms",
    "phone",
    "google-docs",
    "google-forms",
    "image-url",
    "audio-url",
    "spreadsheet-url",
    "amazon",
    "app-store",
    "paypal",
    "text",
    "location",
    "calendar",
  ]);
  assert.ok(qrTypeOptions.every((option) => option.label.length <= 16));
  assert.deepEqual(featuredQrTypes, [
    "url",
    "wifi",
    "whatsapp",
    "pdf-link",
    "image-url",
    "text",
    "instagram",
    "youtube",
    "google-forms",
  ]);
});

test("keeps popular types visible and all 30 available on demand", async () => {
  const selectorSource = await readFile(
    new URL("../components/generator/qr-type-selector.tsx", import.meta.url),
    "utf8",
  );

  assert.match(selectorSource, /className="popular-type-panel"/);
  assert.match(selectorSource, /View All/);
  assert.match(selectorSource, /catalogOpen \? \(/);
  assert.match(selectorSource, /All 30 QR types/);
  assert.match(selectorSource, /className="qr-type-catalog"/);
  assert.match(selectorSource, /generator-fields-panel/);
});

test("leads from the homepage hero into the full QR type selector", async () => {
  const homepageSource = await readFile(
    new URL("../app/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(homepageSource, /Create &amp; Customize QR Codes for/);
  assert.match(homepageSource, /Generate, customize and download professional QR codes/);
  assert.match(homepageSource, /href="#qr-generator"/);
  assert.match(homepageSource, /<QrGenerator catalogFirst \/>/);
  assert.doesNotMatch(homepageSource, /Choose Type/);
  assert.doesNotMatch(homepageSource, /All Types of QR Codes/);
  assert.doesNotMatch(homepageSource, /Make a QR code/);
});

test("replaces the plain steps list with three branded visual steps", async () => {
  const [homepageSource, stepsSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../components/marketing/qr-creation-steps.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.match(homepageSource, /<QrCreationSteps \/>/);
  assert.doesNotMatch(homepageSource, /From idea to scan in three steps/);
  assert.match(stepsSource, /Create Your QR Code in 3 Simple Steps/);
  assert.match(stepsSource, /Choose Your QR Type/);
  assert.match(stepsSource, /Add Your Content/);
  assert.match(stepsSource, /Customize & Download/);
  assert.equal((stepsSource.match(/label: "Step \d"/g) ?? []).length, 3);
});

test("replaces the plain format cards with eight linked visual use cases", async () => {
  const [homepageSource, gallerySource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../components/marketing/use-case-gallery.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.match(homepageSource, /<UseCaseGallery \/>/);
  assert.doesNotMatch(homepageSource, /The right format for every share/);
  for (const title of [
    "Restaurants & Cafes",
    "Business",
    "WiFi",
    "Events",
    "Reviews",
    "Social Media",
    "Payments",
    "Files",
  ]) {
    assert.match(gallerySource, new RegExp(title.replace("&", "&")));
  }
  assert.equal((gallerySource.match(/kind: "[a-z]+"/g) ?? []).length, 8);
});

test("places the premium promo between the visual steps and trust section", async () => {
  const [homepageSource, promoSource] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../components/marketing/premium-promo.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  const stepsPosition = homepageSource.indexOf("<QrCreationSteps />");
  const promoPosition = homepageSource.indexOf("<PremiumPromo />");
  const trustPosition = homepageSource.indexOf('id="why-qraft"');
  assert.ok(stepsPosition >= 0 && stepsPosition < promoPosition);
  assert.ok(promoPosition < trustPosition);
  assert.match(promoSource, /Design QR codes people/);
  assert.match(promoSource, /href="#qr-generator"/);
  assert.match(promoSource, /qraftt-premium-promo\.png/);
  assert.match(promoSource, /unoptimized/);
  assert.match(promoSource, /PNG &amp; SVG/);
  assert.match(promoSource, /Created locally/);
});
