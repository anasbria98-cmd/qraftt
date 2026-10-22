import assert from "node:assert/strict";
import test from "node:test";
import {
  createPageMainEntityReferences,
  createWebPageSchemaConnections,
  organizationSchema,
  schemaIds,
  websiteSchema,
} from "../lib/seo/schema.ts";
import {
  generatorTechnicalCitations,
  getGeneratorTechnicalCitations,
} from "../lib/seo/technical-citations.ts";

test("uses stable canonical IDs for the Qraftt schema entities", () => {
  assert.deepEqual(schemaIds, {
    organization: "https://www.qraftt.com/#organization",
    website: "https://www.qraftt.com/#website",
  });
  assert.equal(organizationSchema["@id"], schemaIds.organization);
  assert.equal(websiteSchema["@id"], schemaIds.website);
});

test("creates stable FAQ and HowTo IDs for WebPage main entities", () => {
  const pageUrl = "https://www.qraftt.com/wifi-qr-code-generator";
  const references = createPageMainEntityReferences(pageUrl);

  assert.deepEqual(references, {
    faqPage: { "@id": `${pageUrl}#faq` },
    howTo: { "@id": `${pageUrl}#howto` },
  });
});

test("connects the website, organization, and webpages", () => {
  assert.equal(websiteSchema.publisher["@id"], schemaIds.organization);

  const connections = createWebPageSchemaConnections();
  assert.equal(connections.isPartOf["@id"], schemaIds.website);
  assert.equal(connections.publisher["@id"], schemaIds.organization);
  assert.deepEqual(
    connections.about.map((reference) => reference["@id"]),
    [schemaIds.organization],
  );
});

test("maps technical generator claims to authoritative citation URLs", () => {
  const expectedStandards = [
    ["calendar-qr-code-generator", "rfc5545"],
    ["event-qr-code-generator", "rfc5545"],
    ["email-qr-code-generator", "rfc6068"],
    ["location-qr-code-generator", "rfc5870"],
    ["phone-qr-code-generator", "rfc3966"],
    ["sms-qr-code-generator", "rfc5724"],
    ["url-qr-code-generator", "rfc3986"],
    ["vcard-qr-code-generator", "rfc6350"],
  ] as const;

  for (const [slug, standard] of expectedStandards) {
    const citations = getGeneratorTechnicalCitations(slug);
    assert.ok(citations.some(({ url }) => url.includes(standard)));
  }

  for (const slug of [
    "audio-qr-code-generator",
    "image-qr-code-generator",
    "pdf-qr-code-generator",
    "spreadsheet-qr-code-generator",
  ] as const) {
    assert.ok(
      getGeneratorTechnicalCitations(slug).some(
        ({ url }) => new URL(url).hostname === "www.iana.org",
      ),
    );
  }

  const citations = Object.values(generatorTechnicalCitations).flat();
  assert.ok(citations.length > 0);
  assert.ok(citations.every(({ url }) => url.startsWith("https://")));
  assert.deepEqual(getGeneratorTechnicalCitations("instagram-qr-code-generator"), []);
});
