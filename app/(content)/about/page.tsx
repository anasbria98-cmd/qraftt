import Link from "next/link";
import { PageHero } from "@/components/content/page-hero";
import { createBreadcrumbSchema } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

const title = "About Qraftt";
const description =
  "Learn why Qraftt provides free, client-side static QR code tools with no signup, subscription, scan limits, or hosted redirects.";
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
        introduction="Qraftt is a focused set of free static QR tools for people who need a reliable code without creating an account, choosing a subscription, or routing scans through a QR vendor."
        title="Useful QR tools, built with restraint"
      />
      <section className="content-section">
        <Container className="about-grid">
          <article>
            <span>01</span>
            <h2>Free without an account</h2>
            <p>
              The core generator is available without signup, payment, a trial,
              or a saved-code dashboard. Optional advertising preparation stays
              inactive unless it is configured and a visitor grants consent.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Static by design</h2>
            <p>
              Downloaded codes store their destination or structured content
              directly. They do not depend on a Qraftt redirect, subscription, or
              scan counter after download.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>Local generation</h2>
            <p>
              QR payloads and image exports are created in the browser. The site
              does not need a generator database to turn your content into PNG or
              SVG files.
            </p>
          </article>
          <article>
            <span>04</span>
            <h2>Practical guidance</h2>
            <p>
              Dedicated generator pages and guides explain payload formats,
              privacy tradeoffs, sizing, testing, and maintenance instead of
              treating generation as the only step.
            </p>
          </article>
        </Container>
      </section>
      <section className="section section-muted">
        <Container className="trust-copy-grid">
          <div>
            <p className="eyebrow">What Qraftt can do</p>
            <h2>Create a file you control.</h2>
          </div>
          <div>
            <p>
              Qraftt validates supported inputs, generates a live preview, and
              exports PNG or SVG. Once downloaded, the static code can be placed
              in your own documents, websites, packaging, or signs.
            </p>
            <p>
              Qraftt cannot guarantee that an external page remains online, that
              every scanner behaves identically, or that a code will survive a
              poor print process. Testing the final destination and physical
              result remains essential.
            </p>
            <div className="inline-links">
              <Link href="/qr-code-generator">Create a QR code</Link>
              <Link href="/blog">Read the guides</Link>
              <Link href="/privacy-policy">Review privacy details</Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
