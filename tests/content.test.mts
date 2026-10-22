import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  blogArticleList,
  getRelatedBlogArticles,
} from "../lib/content/articles.ts";
import { legalPages } from "../lib/content/legal-pages.ts";
import {
  generatorPageContentUpdatedAt,
  getGeneratorPageContentUpdatedAt,
  pageContentUpdatedAt,
} from "../lib/seo/content-updates.ts";
import {
  generatorPageList,
  generatorPages,
} from "../lib/seo/generator-pages.ts";

const expectedArticleSlugs = [
  "how-to-create-a-qr-code",
  "how-to-create-a-wifi-qr-code",
  "do-qr-codes-expire",
  "static-vs-dynamic-qr-codes",
  "qr-code-size-guide",
  "how-to-add-a-logo-to-a-qr-code",
  "qr-code-error-correction-guide",
  "how-to-test-a-qr-code",
  "qr-code-color-contrast-guide",
  "how-to-create-a-google-review-qr-code",
  "how-to-create-a-whatsapp-qr-code-for-free",
  "how-to-create-a-vcard-qr-code-for-a-digital-business-card",
  "how-to-create-a-qr-code-menu-for-a-restaurant",
  "how-to-create-a-qr-code-for-a-google-form",
  "how-to-create-a-qr-code-for-a-pdf",
].sort();

const previouslyLowIncomingArticleSlugs = [
  "how-to-create-a-google-review-qr-code",
  "how-to-create-a-whatsapp-qr-code-for-free",
  "how-to-create-a-vcard-qr-code-for-a-digital-business-card",
  "how-to-create-a-qr-code-menu-for-a-restaurant",
  "how-to-create-a-qr-code-for-a-google-form",
  "how-to-create-a-qr-code-for-a-pdf",
] as const;

test("defines fifteen substantial and uniquely targeted articles", async () => {
  assert.deepEqual(
    blogArticleList.map((article) => article.slug).sort(),
    expectedArticleSlugs,
  );
  assert.equal(
    new Set(blogArticleList.map((article) => article.title)).size,
    expectedArticleSlugs.length,
  );
  assert.equal(
    new Set(blogArticleList.map((article) => article.description)).size,
    expectedArticleSlugs.length,
  );

  for (const article of blogArticleList) {
    const proseLength = article.sections
      .flatMap((section) => section.paragraphs)
      .join(" ").length;

    assert.ok(article.sections.length >= 5);
    assert.ok(proseLength >= 2_500);
    assert.ok(article.generators.length >= 3);
    assert.ok(article.sources.length >= 2);
    assert.ok(article.sources.every((source) => source.href.startsWith("https://")));
    assert.ok(article.image.alt.length >= 30);
    assert.match(article.image.src, /^\/images\/blog\/[a-z0-9-]+\.svg$/);
    assert.equal(article.image.width, 1200);
    assert.equal(article.image.height, 630);
    await readFile(new URL(`../public${article.image.src}`, import.meta.url), "utf8");

    const relatedArticles = getRelatedBlogArticles(article.slug);
    assert.ok(relatedArticles.length >= 3);
    assert.equal(
      new Set(relatedArticles.map((related) => related.slug)).size,
      relatedArticles.length,
    );
    assert.ok(relatedArticles.every((related) => related.slug !== article.slug));
    assert.ok(
      article.generators.every((link) => {
        const slug = link.href.slice(1);
        return Boolean(generatorPages[slug as keyof typeof generatorPages]);
      }),
    );
  }

  assert.equal(
    new Set(blogArticleList.map((article) => article.image.src)).size,
    expectedArticleSlugs.length,
  );

  const relatedIncomingLinks = new Map(
    blogArticleList.map((article) => [article.slug, 0]),
  );
  for (const article of blogArticleList) {
    for (const related of getRelatedBlogArticles(article.slug)) {
      relatedIncomingLinks.set(
        related.slug,
        (relatedIncomingLinks.get(related.slug) ?? 0) + 1,
      );
    }
  }
  for (const slug of previouslyLowIncomingArticleSlugs) {
    assert.ok((relatedIncomingLinks.get(slug) ?? 0) >= 1);
  }
});

test("automatically includes every article in the sitemap", async () => {
  const sitemapSource = await readFile(
    new URL("../app/sitemap.ts", import.meta.url),
    "utf8",
  );

  assert.match(sitemapSource, /\.\.\.blogArticleList\.map/);
  assert.match(sitemapSource, /`\$\{siteConfig\.url\}\/blog\/\$\{article\.slug\}`/);
  assert.match(sitemapSource, /images: \[`\$\{siteConfig\.url\}\$\{article\.image\.src\}`\]/);
  assert.match(sitemapSource, /lastModified: contentDate\(article\.updatedAt\)/);
});

test("WhatsApp article keeps visible FAQs and FAQ schema data synchronized", async () => {
  const article = blogArticleList.find(
    ({ slug }) => slug === "how-to-create-a-whatsapp-qr-code-for-free",
  );
  const faqSection = article?.sections.find((section) => section.id === "faq");

  assert.ok(article);
  assert.equal(faqSection?.faqs?.length, 5);
  assert.ok(
    article.sections.some((section) =>
      section.contextualLinks?.some(
        (link) => link.href === "/whatsapp-qr-code-generator",
      ),
    ),
  );
  assert.ok(
    article.sections.some((section) =>
      section.contextualLinks?.some(
        (link) => link.href === "/qr-code-generator",
      ),
    ),
  );

  const articlePageSource = await readFile(
    new URL("../components/blog/article-page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(articlePageSource, /"@type": "FAQPage"/);
  assert.match(articlePageSource, /mainEntity: faqSection\.faqs\?\.map/);
});

test("vCard business-card article has synchronized FAQs and contextual CTAs", () => {
  const article = blogArticleList.find(
    ({ slug }) =>
      slug === "how-to-create-a-vcard-qr-code-for-a-digital-business-card",
  );
  const faqSection = article?.sections.find((section) => section.id === "faq");

  assert.ok(article);
  assert.equal(faqSection?.faqs?.length, 5);
  assert.ok(
    article.sections.some((section) =>
      section.contextualLinks?.some(
        (link) => link.href === "/vcard-qr-code-generator",
      ),
    ),
  );
  assert.ok(
    article.sections.some((section) =>
      section.contextualLinks?.some(
        (link) => link.href === "/qr-code-generator",
      ),
    ),
  );
});

test("restaurant menu article has synchronized FAQs and required contextual links", () => {
  const article = blogArticleList.find(
    ({ slug }) => slug === "how-to-create-a-qr-code-menu-for-a-restaurant",
  );
  const faqSection = article?.sections.find((section) => section.id === "faq");
  const contextualHrefs = article?.sections.flatMap(
    (section) => section.contextualLinks?.map((link) => link.href) ?? [],
  );

  assert.ok(article);
  assert.equal(faqSection?.faqs?.length, 6);
  assert.ok(contextualHrefs?.includes("/menu-qr-code-generator"));
  assert.ok(contextualHrefs?.includes("/pdf-qr-code-generator"));
  assert.ok(contextualHrefs?.includes("/qr-code-generator"));
});

test("Google Form article has synchronized FAQs and required contextual links", () => {
  const article = blogArticleList.find(
    ({ slug }) => slug === "how-to-create-a-qr-code-for-a-google-form",
  );
  const faqSection = article?.sections.find((section) => section.id === "faq");
  const contextualHrefs = article?.sections.flatMap(
    (section) => section.contextualLinks?.map((link) => link.href) ?? [],
  );

  assert.ok(article);
  assert.equal(faqSection?.faqs?.length, 6);
  assert.ok(contextualHrefs?.includes("/google-forms-qr-code-generator"));
  assert.ok(contextualHrefs?.includes("/qr-code-generator"));
});

test("PDF article has synchronized FAQs and required contextual links", () => {
  const article = blogArticleList.find(
    ({ slug }) => slug === "how-to-create-a-qr-code-for-a-pdf",
  );
  const faqSection = article?.sections.find((section) => section.id === "faq");
  const contextualHrefs = article?.sections.flatMap(
    (section) => section.contextualLinks?.map((link) => link.href) ?? [],
  );

  assert.ok(article);
  assert.equal(faqSection?.faqs?.length, 6);
  assert.ok(contextualHrefs?.includes("/pdf-qr-code-generator"));
  assert.ok(contextualHrefs?.includes("/qr-code-generator"));
});

test("legal content describes the current product without invented entities", () => {
  assert.deepEqual(Object.keys(legalPages).sort(), [
    "cookie-policy",
    "privacy-policy",
    "terms",
  ]);

  for (const page of Object.values(legalPages)) {
    assert.ok(page.sections.length >= 5);
    assert.ok(page.introduction.length >= 120);
    assert.ok(page.sections.every((section) => section.paragraphs.length >= 1));
  }
});

test("about page clearly identifies Qraftt and its factual product scope", async () => {
  const source = await readFile(
    new URL("../app/(content)/about/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const title = "About Qraftt"/);
  assert.match(source, /free browser-based static QR code generator/);
  assert.match(source, /30 QR types/);
  assert.match(source, /PNG and SVG exports/);
  assert.match(source, /title=\{title\}/);
  assert.doesNotMatch(source, /Useful QR tools, built with restraint/);
  assert.equal(pageContentUpdatedAt.about, "2026-08-24");
});

test("uses stable content dates for sitemap entries", () => {
  const dates = [
    ...Object.values(pageContentUpdatedAt),
    ...generatorPageList.map((page) =>
      getGeneratorPageContentUpdatedAt(page.slug),
    ),
    ...blogArticleList.map((article) => article.updatedAt),
    ...Object.values(legalPages).map((page) => page.updatedAt),
  ];

  for (const date of dates) {
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(!Number.isNaN(Date.parse(`${date}T00:00:00.000Z`)));
  }
});

test("covers every generator page with its explicit source-change date", () => {
  const generatorSlugs = generatorPageList.map((page) => page.slug).sort();

  assert.deepEqual(
    Object.keys(generatorPageContentUpdatedAt).sort(),
    generatorSlugs,
  );
  assert.equal(Object.keys(generatorPageContentUpdatedAt).length, 33);

  for (const slug of generatorSlugs) {
    assert.equal(
      getGeneratorPageContentUpdatedAt(slug),
      generatorPageContentUpdatedAt[slug],
    );
    assert.equal(
      generatorPageContentUpdatedAt[slug],
      slug === "menu-qr-code-generator" ||
      slug === "discord-qr-code-generator" ||
      slug === "email-qr-code-generator" ||
      slug === "google-docs-qr-code-generator" ||
      slug === "linkedin-qr-code-generator" ||
      slug === "amazon-qr-code-generator" ||
      slug === "app-store-qr-code-generator" ||
      slug === "calendar-qr-code-generator" ||
      slug === "spotify-qr-code-generator" ||
      slug === "spreadsheet-qr-code-generator" ||
      slug === "text-qr-code-generator" ||
      slug === "url-qr-code-generator" ||
      slug === "google-forms-qr-code-generator" ||
      slug === "image-qr-code-generator" ||
      slug === "phone-qr-code-generator"
        ? "2026-09-10"
        : slug === "audio-qr-code-generator" ||
      slug === "facebook-qr-code-generator" ||
      slug === "event-qr-code-generator" ||
      slug === "google-review-qr-code-generator" ||
      slug === "instagram-qr-code-generator" ||
      slug === "location-qr-code-generator" ||
      slug === "paypal-qr-code-generator" ||
      slug === "pdf-qr-code-generator" ||
      slug === "sms-qr-code-generator" ||
      slug === "snapchat-qr-code-generator" ||
      slug === "telegram-qr-code-generator" ||
      slug === "tiktok-qr-code-generator" ||
      slug === "vcard-qr-code-generator" ||
      slug === "youtube-qr-code-generator"
        ? "2026-09-09"
        : slug === "rsvp-qr-code-generator"
        ? "2026-09-08"
        : slug === "qr-code-generator" ||
        slug === "whatsapp-qr-code-generator"
        ? "2026-09-01"
        : slug === "wifi-qr-code-generator"
          ? "2026-08-31"
          : "2026-08-24",
    );
  }
});
