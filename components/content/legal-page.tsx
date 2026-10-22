import {
  createBreadcrumbSchema,
  type BreadcrumbItem,
} from "@/components/seo/breadcrumbs";
import Link from "next/link";
import { PageHero } from "@/components/content/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import type { LegalPageContent } from "@/lib/content/legal-pages";
import { createWebPageSchemaConnections } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

interface LegalPageProps {
  page: LegalPageContent;
}

export function LegalPage({ page }: LegalPageProps) {
  const path = `/${page.slug}` as const;
  const url = `${siteConfig.url}${path}`;
  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/", label: "Home" },
    { href: path, label: page.title },
  ];
  const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs);

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@id": `${url}#webpage`,
              "@type": "WebPage",
              ...createWebPageSchemaConnections(),
              breadcrumb: { "@id": breadcrumbSchema["@id"] },
              description: page.description,
              name: page.title,
              url,
            },
            breadcrumbSchema,
          ],
        }}
      />
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={page.eyebrow}
        introduction={page.introduction}
        title={page.title}
      />
      <Container className="legal-layout">
        <p className="legal-updated">
          Effective and last updated: <time dateTime={page.updatedAt}>{page.updatedAt}</time>
        </p>
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.points ? (
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {section.links ? (
              <p>
                {section.links.map((link, index) => (
                  <span key={link.href}>
                    {index > 0 ? " · " : null}
                    {link.href.startsWith("/") ? (
                      <Link href={link.href}>{link.label}</Link>
                    ) : (
                      <a href={link.href} rel="noopener noreferrer" target="_blank">
                        {link.label}
                      </a>
                    )}
                  </span>
                ))}
              </p>
            ) : null}
          </section>
        ))}
      </Container>
    </main>
  );
}
