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

  assert.match(homepageSource, /<T text="Create & Customize QR Codes for"/);
  assert.match(
    homepageSource,
    /Qraftt — Free Browser-Based Static QR Code Generator/,
  );
  assert.match(
    homepageSource,
    /Qraftt is a free browser-based static QR code generator with 30 QR types, design customization, and PNG and SVG exports/,
  );
  const hero = homepageSource.split('<section className="home-hero"')[1].split("</section>")[0];
  assert.doesNotMatch(hero, /home-hero-kicker|home-hero-lede|home-hero-proof|ButtonLink|<br/);
  assert.match(homepageSource, /id="qr-generator"/);
  assert.match(homepageSource, /<QrGenerator catalogFirst \/>/);
  assert.match(
    homepageSource,
    /Downloaded static QR codes encode their destination or content directly and do not depend on Qraftt redirects/,
  );
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
  assert.match(promoSource, /qraftt-premium-sculpture\.webp/);
  assert.match(promoSource, /height=\{1086\}/);
  assert.match(promoSource, /width=\{1448\}/);
  assert.match(promoSource, /unoptimized/);
  assert.match(promoSource, /<T text="PNG & SVG"/);
  assert.match(promoSource, /Created locally/);
});

test("premium artwork is frameless and uses a balanced responsive composition", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const shell = css.match(/\.premium-promo-image-shell\s*\{([^}]+)\}/)?.[1] ?? "";
  assert.match(shell, /aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(shell, /background:\s*transparent/);
  assert.doesNotMatch(shell, /border:|border-radius:|box-shadow:|overflow:\s*hidden/);
  assert.match(css, /\.premium-promo-visual\s*\{[^}]*width:\s*100%/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*0\.92fr\)\s*minmax\(0,\s*1\.08fr\)/);
});
