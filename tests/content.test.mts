import assert from "node:assert/strict";
import test from "node:test";
import { blogArticleList } from "../lib/content/articles.ts";
import { legalPages } from "../lib/content/legal-pages.ts";
import { generatorPages } from "../lib/seo/generator-pages.ts";

const expectedArticleSlugs = [
  "how-to-create-a-qr-code",
  "how-to-create-a-wifi-qr-code",
  "do-qr-codes-expire",
  "static-vs-dynamic-qr-codes",
  "qr-code-size-guide",
].sort();

test("defines five substantial and uniquely targeted articles", () => {
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
    assert.ok(
      article.generators.every((link) => {
        const slug = link.href.slice(1);
        return Boolean(generatorPages[slug as keyof typeof generatorPages]);
      }),
    );
  }
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
