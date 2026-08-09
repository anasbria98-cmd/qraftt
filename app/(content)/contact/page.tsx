import { PageHero } from "@/components/content/page-hero";
import { createBreadcrumbSchema } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

const title = "Contact Qraft";
const description =
  "View Qraft’s contact page and the current status of support submissions for the free client-side QR generator.";
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
        introduction="The contact interface is prepared, but online submissions are not connected yet. Nothing entered below is transmitted or stored."
        title="Get in touch with Qraft"
      />
      <section className="content-section">
        <Container className="contact-layout">
          <div className="contact-context">
            <p className="eyebrow">Before writing</p>
            <h2>Useful details make issues easier to reproduce.</h2>
            <p>
              When a working support channel is added, include the QR type,
              browser, device, validation message, and what happened after the
              scan. Never send passwords, payment details, or confidential QR
              payloads.
            </p>
            <div className="contact-status">
              <strong>Submission status</strong>
              <span>Not connected — UI preview only</span>
            </div>
          </div>
          <form aria-describedby="contact-form-status" className="contact-form">
            <div className="contact-form-row">
              <label>
                <span>Name</span>
                <input autoComplete="name" name="name" placeholder="Your name" type="text" />
              </label>
              <label>
                <span>Email</span>
                <input
                  autoComplete="email"
                  inputMode="email"
                  name="email"
                  placeholder="you@example.com"
                  type="email"
                />
              </label>
            </div>
            <label>
              <span>Topic</span>
              <select defaultValue="" name="topic">
                <option disabled value="">
                  Choose a topic
                </option>
                <option>Generator issue</option>
                <option>Content correction</option>
                <option>Privacy question</option>
                <option>General feedback</option>
              </select>
            </label>
            <label>
              <span>Message</span>
              <textarea
                name="message"
                placeholder="Describe the issue without including sensitive information."
                rows={7}
              />
            </label>
            <p className="contact-form-note" id="contact-form-status">
              This form cannot be submitted yet. Text remains only in this page
              until you leave or refresh it.
            </p>
            <button className="button button-primary" disabled type="button">
              Submission unavailable
            </button>
          </form>
        </Container>
      </section>
    </main>
  );
}
