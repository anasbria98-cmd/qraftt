import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { PageHero } from "@/components/content/page-hero";
import { createBreadcrumbSchema } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createWebPageSchemaConnections } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

const title = "About Qraftt";
const description =
  "Qraftt is a free browser-based static QR code generator with 30 QR types, design customization, and PNG/SVG export, with no signup or hosted redirects.";
const introduction =
  "Qraftt is a free browser-based static QR code generator with 30 QR types, design customization, and PNG and SVG exports. QR payloads and image exports are created locally in your browser without requiring signup, a subscription, hosted redirects, or a saved-code account.";
const breadcrumbs = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export const metadata = createPageMetadata({
  description,
  path: "/about",
  title,
});

export default function AboutPage() {
  const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs);

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@id": `${siteConfig.url}/about#webpage`,
              "@type": "AboutPage",
              ...createWebPageSchemaConnections(),
              breadcrumb: { "@id": breadcrumbSchema["@id"] },
              description,
              name: title,
              url: `${siteConfig.url}/about`,
            },
            breadcrumbSchema,
          ],
        }}
      />
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Why Qraftt exists"
        introduction={introduction}
        title={title}
      />
      <section className="content-section">
        <Container className="about-grid">
          <article>
            <span>01</span>
            <h2><T text="Free without an account" /></h2>
            <p><T text="The core generator is available without signup, payment, a trial, or a saved-code dashboard. Optional advertising preparation stays inactive unless it is configured and a visitor grants consent." /></p>
          </article>
          <article>
            <span>02</span>
            <h2><T text="Static by design" /></h2>
            <p><T text="Downloaded codes store their destination or structured content directly. They do not depend on a Qraftt redirect, subscription, or scan counter after download." /></p>
          </article>
          <article>
            <span>03</span>
            <h2><T text="Local generation" /></h2>
            <p><T text="QR payloads and image exports are created in the browser. The site does not need a generator database to turn your content into PNG or SVG files." /></p>
          </article>
          <article>
            <span>04</span>
            <h2><T text="Practical guidance" /></h2>
            <p><T text="Dedicated generator pages and guides explain payload formats, privacy tradeoffs, sizing, testing, and maintenance instead of treating generation as the only step." /></p>
          </article>
        </Container>
      </section>
      <section className="section section-muted">
        <Container className="trust-copy-grid">
          <div>
            <p className="eyebrow"><T text="What Qraftt can do" /></p>
            <h2><T text="Create a file you control." /></h2>
          </div>
          <div>
            <p><T text="Qraftt validates supported inputs, generates a live preview, and exports PNG or SVG. Once downloaded, the static code can be placed in your own documents, websites, packaging, or signs." /></p>
            <p><T text="Qraftt cannot guarantee that an external page remains online, that every scanner behaves identically, or that a code will survive a poor print process. Testing the final destination and physical result remains essential." /></p>
            <p><T text="The 30 supported QR types cover common links, contact and messaging actions, WiFi access, locations, calendar events, social profiles, public files, forms, reviews, and payment links. Design controls include colors, patterns, frames, templates, error correction, and a locally processed logo. These choices are included to make a useful static code, not to add tracking or change its destination." /></p>
            <p><T text="Qraftt does not host uploaded documents, create dynamic redirects, collect scan analytics, or require a user dashboard. If a QR code points to an external service, that service controls availability, permissions, sign-in requirements, and future URL changes." /></p>
            <div className="inline-links">
              <Link href="/qr-code-generator"><T text="Create a QR code" /></Link>
              <Link href="/blog"><T text="Read the guides" /></Link>
              <Link href="/privacy-policy"><T text="Review privacy details" /></Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
