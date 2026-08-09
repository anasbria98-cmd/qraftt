import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { QrGenerator } from "@/components/generator/qr-generator";
import {
  Breadcrumbs,
  createBreadcrumbSchema,
  type BreadcrumbItem,
} from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  generatorPages,
  type GeneratorPageContent,
} from "@/lib/seo/generator-pages";
import { siteConfig } from "@/lib/site";

interface GeneratorLandingPageProps {
  page: GeneratorPageContent;
}

function createPageSchema(
  page: GeneratorPageContent,
  breadcrumbs: ReadonlyArray<BreadcrumbItem>,
) {
  const url = `${siteConfig.url}/${page.slug}`;
  const breadcrumb = createBreadcrumbSchema(breadcrumbs);
  const topic = page.topic ?? page.label;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${url}#webpage`,
        "@type": "WebPage",
        breadcrumb: { "@id": breadcrumb["@id"] },
        description: page.metaDescription,
        name: page.seoTitle,
        url,
      },
      breadcrumb,
      {
        "@type": "HowTo",
        description: page.introduction,
        name: `How to create your ${topic}`,
        step: page.howTo.map((step, index) => ({
          "@type": "HowToStep",
          name: step.title,
          position: index + 1,
          text: step.description,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
          name: item.question,
        })),
      },
    ],
  };
}

export function GeneratorLandingPage({ page }: GeneratorLandingPageProps) {
  const topic = page.topic ?? page.label;
  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/", label: "Home" },
    ...(page.slug === "qr-code-generator"
      ? []
      : [{ href: "/qr-code-generator", label: "QR Code Generator" }]),
    { href: `/${page.slug}`, label: page.label },
  ];

  return (
    <main id="main-content">
      <JsonLd data={createPageSchema(page, breadcrumbs)} />

      <section className="hero-section generator-landing-hero">
        <Container className="hero-grid">
          <div className="hero-copy">
            <Breadcrumbs items={breadcrumbs} />
            <Badge>{page.badge}</Badge>
            <h1>{page.h1}</h1>
            <p className="hero-lede">{page.introduction}</p>
            <ul className="hero-notes" aria-label="Generator benefits">
              <li>Generated locally</li>
              <li>No signup</li>
              <li>PNG &amp; SVG</li>
            </ul>
          </div>
          <QrGenerator initialType={page.type} key={page.slug} />
        </Container>
      </section>

      <section className="section section-muted">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Three simple steps"
            title={`How to create your ${topic}`}
          />
          <ol className="steps-grid seo-steps">
            {page.howTo.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {page.guidance ? (
        <section className="section">
          <Container>
            <SectionHeading
              eyebrow="Before you publish"
              title={page.guidance.title}
              description={page.guidance.description}
            />
            <div className="format-grid seo-use-cases">
              {page.guidance.items.map((item, index) => (
                <article className="format-card" key={item.title}>
                  <span className="format-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <AdSlot placement="content" />

      <section className="section">
        <Container>
          <SectionHeading
            eyebrow="Practical ideas"
            title={`Useful ways to use your ${topic}`}
          />
          <div className="format-grid seo-use-cases">
            {page.useCases.map((useCase, index) => (
              <article className="format-card" key={useCase.title}>
                <span className="format-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{useCase.title}</h3>
                  <p>{useCase.description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section-muted">
        <Container className="seo-faq-layout">
          <SectionHeading
            eyebrow="Helpful answers"
            title={`${topic} FAQ`}
            description="Clear answers to the questions people usually ask before creating and sharing this type of QR code."
          />
          <div className="seo-faq-list">
            {page.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="section seo-related-section">
        <Container>
          <SectionHeading
            eyebrow="Keep creating"
            title="Related QR generators"
            description="Choose another focused generator for the information you need to share next."
          />
          <nav aria-label="Related QR generators" className="seo-related-grid">
            {page.related.map((slug) => {
              const related = generatorPages[slug];
              return (
                <Link href={`/${related.slug}`} key={related.slug}>
                  <span>{related.label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              );
            })}
          </nav>
        </Container>
      </section>
    </main>
  );
}
