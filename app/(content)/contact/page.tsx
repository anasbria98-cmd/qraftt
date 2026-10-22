import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { PageHero } from "@/components/content/page-hero";
import { createBreadcrumbSchema } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createWebPageSchemaConnections } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

const title = "Contact Qraftt";
const description =
  "Contact Qraftt support at support@qraftt.com for help, feedback, or questions about the free browser-based QR code generator.";
const breadcrumbs = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
];

export const metadata = createPageMetadata({
  description,
  path: "/contact",
  title,
});

export default function ContactPage() {
  const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs);

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@id": `${siteConfig.url}/contact#webpage`,
              "@type": "ContactPage",
              ...createWebPageSchemaConnections(),
              breadcrumb: { "@id": breadcrumbSchema["@id"] },
              description,
              name: title,
              url: `${siteConfig.url}/contact`,
            },
            breadcrumbSchema,
          ],
        }}
      />
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Contact"
        introduction="Have a question, feedback, or need help with Qraftt? We’d be happy to hear from you."
        title={title}
      />
      <section className="content-section">
        <Container className="contact-layout">
          <div className="contact-context">
            <p className="eyebrow"><T text="Before writing" /></p>
            <h2><T text="Useful details make issues easier to reproduce." /></h2>
            <p><T text="When emailing support, include the QR type, browser, device, validation message, and what happened after the scan. Never send passwords, payment details, or confidential QR payloads." /></p>
            <p><T text="Support can help clarify input formats, investigate unexpected validation or download behavior, and review accessibility or content corrections. Because Qraftt creates static QR codes in your browser, we cannot recover a code you did not save, edit its destination after printing, or restore content hosted by another website." /></p>
            <p><T text="Email us at" />{" "}
              <a href="mailto:support@qraftt.com">support@qraftt.com</a>.
            </p>
          </div>
          <section className="contact-form" aria-labelledby="email-support-title">
            <p className="eyebrow"><T text="Email support" /></p>
            <h2 id="email-support-title"><T text="Contact support@qraftt.com" /></h2>
            <p><T text="Use your preferred email app to ask a question, report a generator issue, suggest a correction, or share general feedback." /></p>
            <p><T text="Before contacting us, you may find an immediate answer in the" />{" "}
              <Link href="/blog"><T text="QR code guides" /></Link>{" "}<T text="or on the relevant generator page. For scan problems, test the downloaded code on more than one device, confirm the encoded destination is still available, and mention whether the PNG or SVG version was used." /></p>
            <p><T text="Qraftt support covers this website and its generator behavior. We cannot manage third-party destinations, device camera software, mobile carriers, WiFi networks, or external accounts linked from a QR code." /></p>
            <p><T text="For questions about information handled by Qraftt, review the" />{" "}
              <Link href="/privacy-policy"><T text="Privacy Policy" /></Link>{" "}<T text="and" />{" "}
              <Link href="/cookie-policy"><T text="Cookie Policy" /></Link>{" "}<T text="before writing. Include the page URL and a clear description of your concern, but do not email the private content encoded in a QR code. If an issue involves a third-party website opened after scanning, contact that service directly because Qraftt does not control its availability, permissions, or account access." /></p>
            <a
              className="button button-primary"
              href="mailto:support@qraftt.com"
            ><T text="Email support@qraftt.com" /></a>
          </section>
        </Container>
      </section>
    </main>
  );
}
