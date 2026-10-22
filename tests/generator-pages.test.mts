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
  "event-qr-code-generator",
  "calendar-qr-code-generator",
  "rsvp-qr-code-generator",
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

const mainFaqSlugs = ["qr-code-generator", ...prioritySlugs] as const;

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

test("RSVP page uses the URL generator with focused event guidance", () => {
  const page = generatorPages["rsvp-qr-code-generator"];
  const pageCopy = JSON.stringify(page);
  const contextualLinks =
    page.guidance?.items.flatMap(
      ({ descriptionParts }) =>
        descriptionParts?.flatMap(({ href }) => (href ? [href] : [])) ?? [],
    ) ?? [];

  assert.equal(page.type, "url");
  assert.match(page.seoTitle, /QR Code Generator for RSVP/);
  assert.match(page.h1, /QR Code Generator for RSVP/);
  assert.match(page.metaDescription, /QR code generator for RSVP/);
  assert.ok(page.faq.length >= 6);
  assert.ok(page.guidance && page.guidance.items.length >= 10);
  assert.equal(page.explainer?.title, "How RSVP QR codes work");
  assert.equal(page.explainer?.items.length, 3);
  const explainerWords = [
    page.explainer?.description,
    ...(page.explainer?.items.map(({ description }) => description) ?? []),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  assert.ok(explainerWords >= 180 && explainerWords <= 220);
  assert.match(pageCopy, /invitations or save the dates/i);
  assert.match(pageCopy, /photo sharing/i);
  assert.match(pageCopy, /scan the QR code/i);
  assert.ok(
    [
      "/google-forms-qr-code-generator",
      "/url-qr-code-generator",
      "/calendar-qr-code-generator",
      "/vcard-qr-code-generator",
    ].every((href) => contextualLinks.includes(href as `/${string}`)),
  );
  assert.ok(
    generatorPages["calendar-qr-code-generator"].related.includes(page.slug),
  );
  assert.ok(
    generatorPages["google-forms-qr-code-generator"].related.includes(page.slug),
  );
});

test("Event page reuses calendar payloads without claiming registration features", () => {
  const page = generatorPages["event-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "calendar");
  assert.match(page.seoTitle, /Event QR Code Generator/);
  assert.match(page.h1, /Event QR Code Generator/);
  assert.match(page.metaDescription, /event QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/event qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /event name/);
  assert.match(bodyCopy, /start and end time/);
  assert.match(bodyCopy, /venue|location/);
  assert.match(bodyCopy, /iCalendar VEVENT/);
  assert.match(bodyCopy, /invitations|posters|flyers|tickets|badges|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /does not register attendees|does not collect.*RSVPs/);
  assert.ok(bodyWords.length >= 950 && bodyWords.length <= 1150);
  assert.ok(bodyWords.length / sentenceCount < 15);
  assert.doesNotMatch(
    bodyCopy,
    /attendance tracking|check-in system|calendar integration|dynamic QR|scan analytics/i,
  );
  assert.ok(
    generatorPages["calendar-qr-code-generator"].related.includes(page.slug),
  );
  assert.ok(generatorPages["rsvp-qr-code-generator"].related.includes(page.slug));
});

test("main generator targets free no-signup and logo intent", () => {
  const page = generatorPages["qr-code-generator"];
  const guidanceTitles = page.guidance?.items.map(({ title }) => title) ?? [];
  const contextualLinks =
    page.guidance?.items.flatMap(
      ({ descriptionParts }) =>
        descriptionParts?.flatMap(({ href }) => (href ? [href] : [])) ?? [],
    ) ?? [];

  assert.match(page.seoTitle, /Free QR Code Generator with Logo/);
  assert.match(page.metaDescription, /free QR code generator with no signup/);
  assert.match(page.introduction, /free QR code with no signup/);
  assert.ok(
    [
      "Match the QR type to the action",
      "Add a logo carefully",
      "Protect contrast and the quiet zone",
      "Understand what a static code stores",
    ].every((title) => guidanceTitles.includes(title)),
  );
  assert.ok(
    (
      [
        "/wifi-qr-code-generator",
        "/whatsapp-qr-code-generator",
        "/vcard-qr-code-generator",
        "/google-review-qr-code-generator",
        "/menu-qr-code-generator",
        "/pdf-qr-code-generator",
      ] as const
    ).every((href) => contextualLinks.includes(href)),
  );
  assert.ok(page.useCases.length >= 6);
  assert.ok(page.faq.length >= 9);
});

test("WiFi page targets free no-signup intent with practical safety guidance", () => {
  const page = generatorPages["wifi-qr-code-generator"];
  const guidanceTitles = page.guidance?.items.map(({ title }) => title) ?? [];

  assert.match(page.seoTitle, /Free WiFi QR Code Generator/);
  assert.match(page.metaDescription, /free WiFi QR code generator with no signup/);
  assert.match(page.introduction, /free WiFi QR code generator with no signup/);
  assert.ok(
    [
      "Understand the network payload",
      "Check device compatibility",
      "Choose a readable print size",
      "Protect the password and privacy",
    ].every((title) => guidanceTitles.includes(title)),
  );
  const bodyCopy = [
    page.introduction,
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];

  assert.equal(
    (bodyCopy.toLowerCase().match(/wifi qr code generator/g) ?? []).length,
    1,
  );
  for (const repeatedWord of ["qr", "wifi", "code"]) {
    const count = bodyWords.filter((word) => word === repeatedWord).length;
    assert.ok(count / bodyWords.length < 0.025);
  }
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;
  assert.ok(bodyWords.length >= 700 && bodyWords.length <= 820);
  assert.ok(bodyWords.length / sentenceCount < 12);
});

test("Audio page targets public-file intent without implying uploads", () => {
  const page = generatorPages["audio-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /Audio QR Code Generator/);
  assert.match(page.h1, /Audio QR Code Generator/);
  assert.match(page.metaDescription, /Audio QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/audio qr code generator/g) ?? []).length,
    1,
  );
  assert.equal(
    (bodyCopy.toLowerCase().match(/mp3 qr code generator/g) ?? []).length,
    1,
  );
  assert.ok(bodyWords.length >= 1050 && bodyWords.length <= 1160);
  assert.ok(bodyWords.length / sentenceCount < 14);
  assert.doesNotMatch(bodyCopy, /upload your audio|upload an audio file/i);
});

test("Instagram page adds practical sharing guidance without keyword stuffing", () => {
  const page = generatorPages["instagram-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.explainer?.items.length, 4);
  assert.match(bodyCopy, /business cards/);
  assert.match(bodyCopy, /printed material/);
  assert.match(bodyCopy, /social media/);
  assert.match(bodyCopy, /static QR code/);
  assert.ok(bodyWords.length >= 820 && bodyWords.length <= 900);
  assert.ok(bodyWords.length / sentenceCount < 13);
  assert.doesNotMatch(bodyCopy, /dynamic QR|fake review|aggregateRating/i);
});

test("Facebook page covers business-page and print intent clearly", () => {
  const page = generatorPages["facebook-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /Facebook QR Code Generator/);
  assert.match(page.h1, /Facebook QR Code Generator/);
  assert.match(page.metaDescription, /Facebook QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/facebook qr code generator/g) ?? [])
      .length,
    1,
  );
  assert.match(bodyCopy, /business cards/);
  assert.match(bodyCopy, /printed material/);
  assert.match(bodyCopy, /social media promotion/);
  assert.match(bodyCopy, /Does Facebook have a QR code generator\?/);
  assert.ok(bodyWords.length >= 880 && bodyWords.length <= 960);
  assert.ok(bodyWords.length / sentenceCount < 14);
  assert.doesNotMatch(bodyCopy, /dynamic QR|scan analytics|aggregateRating/i);
});

test("PDF page targets direct public-document intent without implying uploads", () => {
  const page = generatorPages["pdf-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /PDF QR Code Generator/);
  assert.match(page.h1, /PDF QR Code Generator/);
  assert.match(page.metaDescription, /PDF QR code generator/i);
  assert.ok(
    ((bodyCopy.toLowerCase().match(/pdf qr code generator/g) ?? []).length >=
      1) &&
      ((bodyCopy.toLowerCase().match(/pdf qr code generator/g) ?? []).length <=
        2),
  );
  assert.match(bodyCopy, /direct public URL ending in \.pdf/i);
  assert.match(bodyCopy, /brochure|menu|guide|résumé|catalog|report/i);
  assert.match(bodyCopy, /printed|printing/i);
  assert.match(bodyCopy, /download|PNG|SVG/i);
  assert.ok(bodyWords.length >= 950 && bodyWords.length <= 1100);
  assert.ok(bodyWords.length / sentenceCount < 15);
  assert.doesNotMatch(
    bodyCopy,
    /upload your PDF|host your PDF|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("YouTube page covers video, channel, print, and mobile intent accurately", () => {
  const page = generatorPages["youtube-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /YouTube QR Code Generator/);
  assert.match(page.h1, /YouTube QR Code Generator/);
  assert.match(page.metaDescription, /YouTube QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/youtube qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /YouTube video/);
  assert.match(bodyCopy, /YouTube channel/);
  assert.match(bodyCopy, /posters|flyers|business cards|packaging|presentations/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /phone|mobile/);
  assert.ok(bodyWords.length >= 900 && bodyWords.length <= 1050);
  assert.ok(bodyWords.length / sentenceCount < 14);
  assert.doesNotMatch(
    bodyCopy,
    /upload your video|host your video|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("Telegram page covers profiles, groups, channels, and link-only behavior", () => {
  const page = generatorPages["telegram-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /Telegram QR Code Generator/);
  assert.match(page.h1, /Telegram QR Code Generator/);
  assert.match(page.metaDescription, /Telegram QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/telegram qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /profile/);
  assert.match(bodyCopy, /group/);
  assert.match(bodyCopy, /channel/);
  assert.match(bodyCopy, /posters|flyers|business cards|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /does not create the temporary account-login code/i);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1100);
  assert.ok(bodyWords.length / sentenceCount < 15);
  assert.doesNotMatch(
    bodyCopy,
    /dynamic QR|scan analytics|host your|aggregateRating/i,
  );
});

test("Location page covers exact coordinates without claiming a map-provider link", () => {
  const page = generatorPages["location-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /Location QR Code Generator/);
  assert.match(page.h1, /Location QR Code Generator/);
  assert.match(page.metaDescription, /location QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/location qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /latitude and longitude/i);
  assert.match(bodyCopy, /venue|entrance|meeting point|delivery|travel/i);
  assert.match(bodyCopy, /Google Maps/);
  assert.match(bodyCopy, /standard geo (?:address|URI)/i);
  assert.match(bodyCopy, /directions/);
  assert.ok(bodyWords.length >= 1050 && bodyWords.length <= 1150);
  assert.ok(bodyWords.length / sentenceCount < 15.5);
  assert.doesNotMatch(
    bodyCopy,
    /creates? a Google Maps link|live-location tracking|GPS tracking|dynamic QR|scan analytics/i,
  );
});

test("SMS page covers editable message drafts without implying automatic sending", () => {
  const page = generatorPages["sms-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /SMS QR Code Generator/);
  assert.match(page.h1, /SMS QR Code Generator/);
  assert.match(page.metaDescription, /SMS QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/sms qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /phone number/);
  assert.match(bodyCopy, /prefill|prefilled/i);
  assert.match(bodyCopy, /messaging app/);
  assert.match(bodyCopy, /support|appointment|feedback|campaign|promotion/i);
  assert.match(bodyCopy, /business cards|posters|flyers|packaging|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /chooses? whether to edit, send, or cancel/i);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1150);
  assert.ok(bodyWords.length / sentenceCount < 14.5);
  assert.doesNotMatch(
    bodyCopy,
    /guaranteed delivery|bulk messaging|dynamic QR|scan analytics/i,
  );
});

test("Phone page targets phone-number intent without implying automatic calls", () => {
  const page = generatorPages["phone-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "phone");
  assert.match(page.seoTitle, /QR Code for Phone Number/);
  assert.match(page.h1, /QR Code for a Phone Number/);
  assert.match(page.metaDescription, /qr code for a phone number/i);
  assert.match(page.metaDescription, /phone QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/qr code for phone number/g) ?? []).length,
    1,
  );
  assert.equal(
    (bodyCopy.toLowerCase().match(/phone qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /tel: URI|tel destination/);
  assert.match(bodyCopy, /customer service|sales|booking/);
  assert.match(bodyCopy, /business cards|posters|flyers|signs|packaging|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /must confirm the call|chooses whether to call|does not place the call automatically/);
  assert.match(bodyCopy, /format and length only/);
  assert.ok(page.faq.length >= 11);
  assert.ok(bodyWords.length >= 1050 && bodyWords.length <= 1200);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /automatic(?:ally)? places? (?:a )?call|call tracking|call recording|number provisioning|VoIP integration|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("PayPal page covers payment links without implying payment processing", () => {
  const page = generatorPages["paypal-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /PayPal QR Code Generator/);
  assert.match(page.h1, /PayPal QR Code Generator/);
  assert.match(page.metaDescription, /PayPal QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/paypal qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /PayPal\.Me/);
  assert.match(bodyCopy, /payment|checkout|donation|hosted-button/);
  assert.match(bodyCopy, /invoices|counter signs|menus|flyers|business cards/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /does not use PayPal APIs/);
  assert.match(bodyCopy, /never processes payments|does not.*process/i);
  assert.ok(bodyWords.length >= 1050 && bodyWords.length <= 1200);
  assert.ok(bodyWords.length / sentenceCount < 15);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt (?:verifies transactions|receives funds|confirms payment)|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("TikTok page covers profile and video links without implying login support", () => {
  const page = generatorPages["tiktok-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /TikTok QR Code Generator/);
  assert.match(page.h1, /TikTok QR Code Generator/);
  assert.match(page.metaDescription, /TikTok QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/tiktok qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /profile/);
  assert.match(bodyCopy, /video/);
  assert.match(bodyCopy, /posters|flyers|packaging|business cards|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /does not create the temporary account-login code/i);
  assert.ok(bodyWords.length >= 950 && bodyWords.length <= 1100);
  assert.ok(bodyWords.length / sentenceCount < 15);
  assert.doesNotMatch(
    bodyCopy,
    /account integration available|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("Snapchat page covers supported destinations without claiming native Snapcodes", () => {
  const page = generatorPages["snapchat-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /Snapchat QR Code Generator/);
  assert.match(page.h1, /Snapchat QR Code Generator/);
  assert.match(page.metaDescription, /Snapchat QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/snapchat qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /profile|Lens|Spotlight/);
  assert.match(bodyCopy, /business cards|posters|flyers|packaging|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /standard QR code/);
  assert.match(bodyCopy, /does not create official Snapcodes/);
  assert.ok(bodyWords.length >= 950 && bodyWords.length <= 1100);
  assert.ok(bodyWords.length / sentenceCount < 15);
  assert.doesNotMatch(
    bodyCopy,
    /Snapcode generator|login QR|account integration|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("Google Review page targets free intent with practical business guidance", () => {
  const page = generatorPages["google-review-qr-code-generator"];
  const guidanceTitles = page.guidance?.items.map(({ title }) => title) ?? [];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /Free Google Review QR Code Generator/);
  assert.match(page.h1, /Google Review QR Code Generator/);
  assert.match(page.metaDescription, /free Google Review QR code generator with no signup/);
  assert.match(page.introduction, /free Google Review QR code generator with no signup/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/google review qr code generator/g) ?? [])
      .length,
    1,
  );
  assert.ok(
    [
      "Prefer the official review-request link",
      "Understand Maps listing behavior",
      "Print for reliable scanning",
      "Know what the static code stores",
    ].every((title) => guidanceTitles.includes(title)),
  );
  assert.ok(page.useCases.length >= 6);
  assert.ok(page.faq.length >= 13);
  assert.match(bodyCopy, /restaurants|salons|clinics|hotels|shops/);
  assert.match(bodyCopy, /receipts|counters|table cards|posters|business cards|packaging/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /does not collect, moderate, verify, publish, or gate reviews/);
  assert.match(bodyCopy, /does not contain.*Google API/);
  assert.ok(bodyWords.length >= 1200 && bodyWords.length <= 1500);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /automatic review collection|review analytics|dynamic QR|aggregateRating/i,
  );
});

test("Menu page covers public destinations without implying hosting or ordering", () => {
  const page = generatorPages["menu-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "menu");
  assert.match(page.seoTitle, /Menu QR Code Generator/);
  assert.match(page.h1, /Menu QR Code Generator/);
  assert.match(page.metaDescription, /menu QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/menu qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /mobile web menu|digital menu/);
  assert.match(bodyCopy, /public PDF|hosted PDF/);
  assert.match(bodyCopy, /ordering page/);
  assert.match(bodyCopy, /restaurants|cafés|bars|food trucks|hotels/);
  assert.match(bodyCopy, /table tents|counters|posters|flyers|receipts|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /does not upload or host|does not host or edit/);
  assert.ok(page.faq.length >= 11);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1200);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt (?:hosts menus|edits menus|processes orders|processes payments)|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("Google Forms page covers respondent links without implying form management", () => {
  const page = generatorPages["google-forms-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "google-forms");
  assert.match(page.seoTitle, /Google Forms QR Code Generator/);
  assert.match(page.h1, /Google Forms QR Code Generator/);
  assert.match(page.metaDescription, /Google Forms QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/google forms qr code generator/g) ?? [])
      .length,
    1,
  );
  assert.match(bodyCopy, /forms\.gle/);
  assert.match(bodyCopy, /viewform/);
  assert.match(bodyCopy, /surveys|feedback forms|registrations|questionnaires|sign-up forms/);
  assert.match(bodyCopy, /classroom/);
  assert.match(bodyCopy, /posters|flyers|presentations|table cards|signs|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /does not copy, create, or host|without creating, hosting, or managing/);
  assert.ok(page.faq.length >= 11);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1150);
  assert.ok(bodyWords.length / sentenceCount < 14);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt (?:creates forms|edits forms|stores responses|manages responses)|Google API integration|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("Image page targets direct hosted files without implying image uploads", () => {
  const page = generatorPages["image-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "image-url");
  assert.match(page.seoTitle, /Image QR Code Generator/);
  assert.match(page.h1, /Image QR Code Generator/);
  assert.match(page.metaDescription, /image QR code generator/i);
  assert.match(page.metaDescription, /photo QR code generator/i);
  assert.equal(
    (bodyCopy.toLowerCase().match(/image qr code generator/g) ?? []).length,
    1,
  );
  assert.equal(
    (bodyCopy.toLowerCase().match(/photo qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /PNG, JPG, JPEG, WebP, GIF, or AVIF/);
  assert.match(bodyCopy, /public direct URL|direct file address/);
  assert.match(bodyCopy, /photography|portfolio|product|menu|catalog/);
  assert.match(bodyCopy, /posters|flyers|packaging|labels|printed materials/);
  assert.match(bodyCopy, /download|PNG|SVG/);
  assert.match(bodyCopy, /logo.*QR design|image destination[\s\S]*logo/i);
  assert.match(bodyCopy, /does not upload, host, store, or edit|does not upload, host, or store/);
  assert.ok(page.faq.length >= 11);
  assert.ok(bodyWords.length >= 1150 && bodyWords.length <= 1250);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt (?:uploads images|hosts images|stores images|creates galleries|edits images)|dynamic QR|scan analytics|aggregateRating/i,
  );
});

test("WhatsApp page targets free no-signup intent with safe wa.me guidance", () => {
  const page = generatorPages["whatsapp-qr-code-generator"];
  const guidanceTitles = page.guidance?.items.map(({ title }) => title) ?? [];

  assert.match(page.seoTitle, /Free WhatsApp QR Code Generator/);
  assert.match(page.metaDescription, /free WhatsApp QR code generator with no signup/);
  assert.match(page.introduction, /free WhatsApp QR code generator with no signup/);
  assert.ok(
    [
      "Start with the country code",
      "Write a useful pre-filled message",
      "Protect phone and message privacy",
      "Know the static-code limits",
    ].every((title) => guidanceTitles.includes(title)),
  );
  assert.ok(page.useCases.length >= 6);
  assert.ok(page.faq.length >= 10);
});

test("vCard page targets free contact intent with safe field guidance", () => {
  const page = generatorPages["vcard-qr-code-generator"];
  const guidanceTitles = page.guidance?.items.map(({ title }) => title) ?? [];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    page.topic,
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.match(page.seoTitle, /Free vCard QR Code Generator/);
  assert.match(page.seoTitle, /vCard QR Code Generator/);
  assert.match(page.h1, /vCard QR Code Generator/);
  assert.match(page.metaDescription, /vCard QR code generator/);
  assert.match(page.introduction, /vCard QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/vcard qr code generator/g) ?? []).length,
    1,
  );
  assert.ok(
    [
      "Format the mobile number internationally",
      "Check the email character by character",
      "Protect contact privacy",
      "Know when the printed code changes",
    ].every((title) => guidanceTitles.includes(title)),
  );
  assert.ok(page.useCases.length >= 6);
  assert.ok(page.faq.length >= 14);
  assert.ok(page.explainer);
  assert.match(
    page.explainer?.description ?? "",
    /choose whether to save it/,
  );
  assert.match(
    page.explainer?.items.map(({ description }) => description).join(" ") ?? "",
    /business card|printed|Download and test/i,
  );
  assert.match(
    page.faq.find(({ question }) =>
      question.includes("mobile number and email address"),
    )?.answer ?? "",
    /format and 7–15 digit length only; it does not verify that the number is real/,
  );
  assert.match(
    page.faq.find(({ question }) =>
      question.includes("save the contact automatically"),
    )?.answer ?? "",
    /on compatible scanners/,
  );
  assert.match(bodyCopy, /business cards?/i);
  assert.match(bodyCopy, /digital|saveable contact/i);
  assert.match(bodyCopy, /download|PNG|SVG/i);
  assert.ok(bodyWords.length >= 1350 && bodyWords.length <= 1500);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /dynamic QR|scan analytics|cloud hosting|aggregateRating/i,
  );
});

test("Spotify page covers supported share links without claiming Spotify Codes", () => {
  const page = generatorPages["spotify-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "spotify");
  assert.match(page.seoTitle, /Spotify QR Code Generator/);
  assert.match(page.h1, /Spotify QR Code Generator/);
  assert.match(page.metaDescription, /Spotify QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/spotify qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /QR code generator for Spotify/i);
  assert.match(bodyCopy, /Spotify playlist QR code/i);
  assert.match(bodyCopy, /open\.spotify\.com/i);
  assert.match(bodyCopy, /track|song/i);
  assert.match(bodyCopy, /album/i);
  assert.match(bodyCopy, /playlist/i);
  assert.match(bodyCopy, /artist/i);
  assert.match(bodyCopy, /podcast show|episode/i);
  assert.match(bodyCopy, /posters?|flyers?|album artwork|business cards?|packaging|social graphics?/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.match(bodyCopy, /Spotify Codes/i);
  assert.ok(page.faq.length >= 10);
  assert.ok(page.useCases.length >= 6);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1200);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt creates official Spotify Codes|automatic playback|Qraftt follows|Qraftt saves|Spotify API integration|dynamic QR|Qraftt scan analytics|aggregateRating/i,
  );
});

test("Amazon page covers supported destinations without implying Amazon integration", () => {
  const page = generatorPages["amazon-qr-code-generator"];
  const body = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap((item) => [item.title, item.description]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap((item) => [item.title, item.description]) ?? []),
    ...page.howTo.flatMap((step) => [step.title, step.description]),
    ...page.useCases.flatMap((useCase) => [useCase.title, useCase.description]),
    ...page.faq.flatMap((item) => [item.question, item.answer]),
  ]
    .filter(Boolean)
    .join(" ");
  const wordCount = body.match(/[A-Za-z0-9’-]+/g)?.length ?? 0;
  const sentenceCount = body.split(/[.!?]+(?:\s|$)/).filter(Boolean).length;

  assert.match(page.seoTitle.toLowerCase(), /amazon qr code generator/);
  assert.match(page.h1.toLowerCase(), /amazon qr code generator/);
  assert.match(page.metaDescription.toLowerCase(), /amazon qr code generator/);
  assert.equal((body.toLowerCase().match(/amazon qr code generator/g) ?? []).length, 1);
  assert.match(body, /product/i);
  assert.match(body, /wish list/i);
  assert.match(body, /registry/i);
  assert.match(body, /storefront/i);
  assert.match(body, /amzn\.to/i);
  assert.match(body, /not affiliated|independent/i);
  assert.match(body, /PNG or SVG/i);
  assert.ok(page.faq.length >= 10);
  assert.ok(page.useCases.length >= 6);
  assert.ok(wordCount >= 900 && wordCount <= 1200, `unexpected word count: ${wordCount}`);
  assert.ok(wordCount / sentenceCount < 18, "Amazon copy should remain easy to read");
  assert.doesNotMatch(
    body,
    /automatic purchases|cart additions|order tracking|Amazon Pay integration|affiliate tracking|dynamic QR|scan analytics/i,
  );
});

test("App Store page covers one-store links without implying smart routing", () => {
  const page = generatorPages["app-store-qr-code-generator"];
  const body = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap((item) => [item.title, item.description]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap((item) => [item.title, item.description]) ?? []),
    ...page.howTo.flatMap((step) => [step.title, step.description]),
    ...page.useCases.flatMap((useCase) => [useCase.title, useCase.description]),
    ...page.faq.flatMap((item) => [item.question, item.answer]),
  ]
    .filter(Boolean)
    .join(" ");
  const wordCount = body.match(/[A-Za-z0-9’-]+/g)?.length ?? 0;
  const sentenceCount = body.split(/[.!?]+(?:\s|$)/).filter(Boolean).length;

  assert.match(page.seoTitle.toLowerCase(), /app store qr code generator/);
  assert.match(page.h1.toLowerCase(), /app store qr code generator/);
  assert.match(page.metaDescription.toLowerCase(), /app store qr code generator/);
  const primaryBodyUses =
    body.toLowerCase().match(/app store qr code generator/g)?.length ?? 0;
  assert.ok(primaryBodyUses >= 1 && primaryBodyUses <= 2);
  assert.match(body, /apps\.apple\.com/i);
  assert.match(body, /play\.google\.com\/store\/apps\/details/i);
  assert.match(body, /one (?:direct )?(?:store )?(?:URL|listing|destination)/i);
  assert.match(body, /does not detect|does not.*switch stores/i);
  assert.match(body, /PNG or SVG/i);
  assert.match(body, /not affiliated|independent/i);
  assert.ok(page.faq.length >= 10);
  assert.ok(page.useCases.length >= 6);
  assert.ok(wordCount >= 950 && wordCount <= 1200, `unexpected word count: ${wordCount}`);
  assert.ok(wordCount / sentenceCount < 18, "App Store copy should remain easy to read");
  assert.doesNotMatch(
    body,
    /smart routing|automatic installation|deep-link routing|scan analytics|dynamic QR|Apple API integration|Google API integration/i,
  );
});

test("Calendar page targets event import without duplicating event marketing", () => {
  const page = generatorPages["calendar-qr-code-generator"];
  const eventPage = generatorPages["event-qr-code-generator"];
  const body = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap((item) => [item.title, item.description]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap((item) => [item.title, item.description]) ?? []),
    ...page.howTo.flatMap((step) => [step.title, step.description]),
    ...page.useCases.flatMap((useCase) => [useCase.title, useCase.description]),
    ...page.faq.flatMap((item) => [item.question, item.answer]),
  ]
    .filter(Boolean)
    .join(" ");
  const wordCount = body.match(/[A-Za-z0-9’-]+/g)?.length ?? 0;
  const sentenceCount = body.split(/[.!?]+(?:\s|$)/).filter(Boolean).length;

  assert.match(page.seoTitle.toLowerCase(), /calendar qr code generator/);
  assert.match(page.h1.toLowerCase(), /calendar qr code generator/);
  assert.match(page.metaDescription.toLowerCase(), /calendar qr code generator/);
  const primaryBodyUses =
    body.toLowerCase().match(/calendar qr code generator/g)?.length ?? 0;
  assert.ok(primaryBodyUses >= 1 && primaryBodyUses <= 2);
  assert.match(body, /iCalendar VEVENT/);
  assert.match(body, /title.*start.*end/i);
  assert.match(body, /optional location.*optional description/i);
  assert.match(body, /meetings/i);
  assert.match(body, /appointments/i);
  assert.match(body, /classes/i);
  assert.match(body, /webinars/i);
  assert.match(body, /workshops/i);
  assert.match(body, /does not.*automatically/i);
  assert.match(body, /PNG.*SVG/i);
  assert.ok(page.related.includes(eventPage.slug));
  assert.notEqual(page.seoTitle, eventPage.seoTitle);
  assert.notEqual(page.h1, eventPage.h1);
  assert.ok(wordCount >= 950 && wordCount <= 1200, `unexpected word count: ${wordCount}`);
  assert.ok(wordCount / sentenceCount < 16, "Calendar copy should remain easy to read");
  assert.doesNotMatch(
    body,
    /Google Calendar API|Outlook integration|automatic calendar syncing|attendance tracking|ticketing system|scan analytics|dynamic QR/i,
  );
});

test("Discord page covers supported links without implying login integration", () => {
  const page = generatorPages["discord-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "discord");
  assert.match(page.seoTitle, /Discord QR Code Generator/);
  assert.match(page.h1, /Discord QR Code Generator/);
  assert.match(page.metaDescription, /Discord QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/discord qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /QR code generator for Discord/i);
  assert.match(bodyCopy, /Discord QR code/i);
  assert.match(bodyCopy, /discord\.gg/i);
  assert.match(bodyCopy, /discord\.com\/invite/i);
  assert.match(bodyCopy, /discord\.com\/channels/i);
  assert.match(bodyCopy, /discordapp\.com/i);
  assert.match(bodyCopy, /gaming|creator communities?|clubs?|classes|events?/i);
  assert.match(bodyCopy, /posters?|flyers?|business cards?|stream overlays?|packaging|presentations?/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.match(bodyCopy, /expire|revoked|usage limit|permissions?/i);
  assert.ok(page.faq.length >= 10);
  assert.ok(page.useCases.length >= 6);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1200);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt logs? (?:users? )?in|Qraftt approves membership|Qraftt creates invites|Discord API integration|dynamic QR|Qraftt scan analytics|aggregateRating/i,
  );
});

test("Google Docs page covers document URLs without implying Google integration", () => {
  const page = generatorPages["google-docs-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "google-docs");
  assert.match(page.seoTitle, /Google Docs QR Code Generator/);
  assert.match(page.h1, /Google Docs QR Code Generator/);
  assert.match(page.metaDescription, /Google Docs QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/google docs qr code generator/g) ?? [])
      .length,
    1,
  );
  assert.match(bodyCopy, /QR code generator for Google Docs/i);
  assert.match(bodyCopy, /Google Docs QR code/i);
  assert.match(bodyCopy, /Google Doc/i);
  assert.match(bodyCopy, /docs\.google\.com\/document/i);
  assert.match(bodyCopy, /sharing permissions|viewer|commenter|editor/i);
  assert.match(bodyCopy, /meeting notes?|instructions?|classroom resources?|policies|schedules/i);
  assert.match(bodyCopy, /presentations?|posters?|handouts?|signs?|printed/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.ok(page.faq.length >= 11);
  assert.ok(page.useCases.length >= 6);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1200);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt changes permissions|Qraftt hosts the document|upload your document|edit documents? in Qraftt|Google Drive QR code generator|dynamic QR|scan analytics|scan tracking|aggregateRating/i,
  );
});

test("Spreadsheet page covers public files without implying Excel integration", () => {
  const page = generatorPages["spreadsheet-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "spreadsheet-url");
  assert.match(page.seoTitle, /Spreadsheet QR Code Generator/);
  assert.match(page.h1, /Spreadsheet QR Code Generator/);
  assert.match(page.metaDescription, /Spreadsheet QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/spreadsheet qr code generator/g) ?? [])
      .length,
    1,
  );
  assert.match(bodyCopy, /Excel QR code generator/i);
  assert.match(bodyCopy, /Google Sheets QR code generator/i);
  assert.match(bodyCopy, /QR code for Google Sheets/i);
  assert.match(bodyCopy, /\.xls|XLS/);
  assert.match(bodyCopy, /\.xlsx|XLSX/);
  assert.match(bodyCopy, /\.csv|CSV/);
  assert.match(bodyCopy, /\.ods|ODS/);
  assert.match(bodyCopy, /reports?|inventor(?:y|ies)|schedules?|price lists?|data sheets?/i);
  assert.match(bodyCopy, /printed documents?|labels?|posters?|presentations?/i);
  assert.match(bodyCopy, /public(?:ly)? (?:URL|reachable|accessible)|permissions/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.ok(page.faq.length >= 12);
  assert.ok(page.useCases.length >= 6);
  assert.ok(bodyWords.length >= 1000 && bodyWords.length <= 1200);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /upload your spreadsheet|Qraftt hosts|edit spreadsheets? in Qraftt|Google account integration|dynamic QR|scan analytics|scan tracking|aggregateRating/i,
  );
});

test("LinkedIn page covers official URLs without implying account integration", () => {
  const page = generatorPages["linkedin-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "linkedin");
  assert.match(page.seoTitle, /LinkedIn QR Code Generator/);
  assert.match(page.h1, /LinkedIn QR Code Generator/);
  assert.match(page.metaDescription, /LinkedIn QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/linkedin qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /LinkedIn QR code/i);
  assert.match(bodyCopy, /profile/i);
  assert.match(bodyCopy, /company page/i);
  assert.match(bodyCopy, /posts?|newsletter/i);
  assert.match(bodyCopy, /résumés?|CVs?|business cards?/i);
  assert.match(bodyCopy, /conference badges?|recruiting|job-fair/i);
  assert.match(bodyCopy, /presentations?|posters|printed/i);
  assert.match(bodyCopy, /app or a browser/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.ok(page.faq.length >= 9);
  assert.ok(page.useCases.length >= 6);
  assert.ok(bodyWords.length >= 900 && bodyWords.length <= 1100);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /logs? into LinkedIn|creates? LinkedIn accounts?|bypass(?:es)? LinkedIn|dynamic QR|scan analytics|account integration|aggregateRating/i,
  );
});

test("URL page covers direct web destinations without implying redirect services", () => {
  const page = generatorPages["url-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "url");
  assert.match(page.seoTitle, /URL QR Code Generator/);
  assert.match(page.h1, /URL QR Code Generator/);
  assert.match(page.metaDescription, /URL QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/url qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /URL to QR code generator/i);
  assert.match(bodyCopy, /HTTP and HTTPS|HTTP or HTTPS/i);
  assert.match(bodyCopy, /adds HTTPS|add HTTPS/i);
  assert.match(bodyCopy, /2,000-character/);
  assert.match(bodyCopy, /landing page|online store|portfolio|booking page/i);
  assert.match(bodyCopy, /posters|flyers|business cards|packaging|signs/i);
  assert.match(bodyCopy, /browser|registered to handle/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.ok(page.faq.length >= 9);
  assert.ok(page.useCases.length >= 6);
  assert.ok(bodyWords.length >= 850 && bodyWords.length <= 1050);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /Qraftt URL shortener|Qraftt redirects scans|change the destination after printing|Qraftt scan analytics|custom domain hosting|aggregateRating/i,
  );
});

test("Text page describes direct offline text without implying hosted content", () => {
  const page = generatorPages["text-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "text");
  assert.match(page.seoTitle, /Text QR Code Generator/);
  assert.match(page.h1, /Text QR Code Generator/);
  assert.match(page.metaDescription, /Text QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/text qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /text to QR code/i);
  assert.match(bodyCopy, /2,000 characters/);
  assert.match(bodyCopy, /without (?:an )?internet|offline/i);
  assert.match(bodyCopy, /short notes?|instructions?/i);
  assert.match(bodyCopy, /reference numbers?|product detail|labels?/i);
  assert.match(bodyCopy, /event|classroom/i);
  assert.match(bodyCopy, /posters|signs|cards|packaging|printed/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.ok(page.faq.length >= 9);
  assert.ok(page.useCases.length >= 6);
  assert.ok(bodyWords.length >= 950 && bodyWords.length <= 1100);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /cloud storage|editable content|dynamic QR|scan analytics|tracking|hosted by Qraftt|account required|aggregateRating/i,
  );
});

test("Email page describes editable mailto drafts without implying delivery", () => {
  const page = generatorPages["email-qr-code-generator"];
  const bodyCopy = [
    page.introduction,
    page.explainer?.title,
    page.explainer?.description,
    ...(page.explainer?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.guidance?.title,
    page.guidance?.description,
    ...(page.guidance?.items.flatMap(({ title, description }) => [
      title,
      description,
    ]) ?? []),
    page.howToTitle,
    ...page.howTo.flatMap(({ title, description }) => [title, description]),
    ...page.faq.flatMap(({ question, answer }) => [question, answer]),
    ...page.useCases.flatMap(({ title, description }) => [title, description]),
  ]
    .filter(Boolean)
    .join(" ");
  const bodyWords = bodyCopy.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const sentenceCount = (bodyCopy.match(/[.!?]+/g) ?? []).length;

  assert.equal(page.type, "email");
  assert.match(page.seoTitle, /Email QR Code Generator/);
  assert.match(page.h1, /Email QR Code Generator/);
  assert.match(page.metaDescription, /email QR code generator/);
  assert.equal(
    (bodyCopy.toLowerCase().match(/email qr code generator/g) ?? []).length,
    1,
  );
  assert.match(bodyCopy, /QR code for email/i);
  assert.match(bodyCopy, /mailto/i);
  assert.match(bodyCopy, /recipient/i);
  assert.match(bodyCopy, /optional subject/i);
  assert.match(bodyCopy, /optional (?:body|message)/i);
  assert.match(bodyCopy, /editable (?:email )?draft/i);
  assert.match(bodyCopy, /business cards?/i);
  assert.match(bodyCopy, /packaging|posters|flyers|signs|printed/i);
  assert.match(bodyCopy, /PNG|SVG/i);
  assert.match(bodyCopy, /200 characters/);
  assert.match(bodyCopy, /1,000 characters/);
  assert.ok(page.faq.length >= 11);
  assert.ok(bodyWords.length >= 900 && bodyWords.length <= 1100);
  assert.ok(bodyWords.length / sentenceCount < 16);
  assert.doesNotMatch(
    bodyCopy,
    /automatically sends|email delivery|inbox tracking|open tracking|dynamic QR|CRM integration|mailing-list collection|aggregateRating/i,
  );
});

test("main generator FAQs lead with concise, distinct answers", () => {
  const firstSentences: string[] = [];

  for (const slug of mainFaqSlugs) {
    for (const item of generatorPages[slug].faq) {
      const firstSentence = item.answer.match(/^.*?[.!?](?=\s|$)/)?.[0];

      assert.ok(firstSentence, `${slug}: ${item.question}`);
      assert.ok(firstSentence.length <= 160, `${slug}: ${item.question}`);
      assert.doesNotMatch(firstSentence, /^(?:Yes|No)\.$/);
      assert.doesNotMatch(
        firstSentence,
        /^(?:This|The) static QR code/,
        `${slug}: ${item.question}`,
      );
      firstSentences.push(firstSentence);
    }
  }

  assert.equal(new Set(firstSentences).size, firstSentences.length);
});
