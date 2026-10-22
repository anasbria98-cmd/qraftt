import Link from "next/link";
import { ArticleCard } from "@/components/blog/article-card";
import { PageHero } from "@/components/content/page-hero";
import { createBreadcrumbSchema } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { blogArticleList } from "@/lib/content/articles";
import { createPageMetadata } from "@/lib/seo/metadata";
import { createWebPageSchemaConnections } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

const title = "QR Code Guides";
const description =
  "Practical QR code guides covering creation, WiFi setup, logos, colors, error correction, sizing, Google Reviews, printing, and testing.";
const breadcrumbs = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export const metadata = createPageMetadata({
  description,
  path: "/blog",
  title,
});

export default function BlogPage() {
  const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs);

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@id": `${siteConfig.url}/blog#collection`,
              "@type": "CollectionPage",
              ...createWebPageSchemaConnections(),
              breadcrumb: { "@id": breadcrumbSchema["@id"] },
              description,
              hasPart: blogArticleList.map((article) => ({
                "@type": "Article",
                headline: article.title,
                url: `${siteConfig.url}/blog/${article.slug}`,
              })),
              name: title,
              url: `${siteConfig.url}/blog`,
            },
            breadcrumbSchema,
          ],
        }}
      />
      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow="Learn before you print"
        introduction="Clear, practical guides for creating QR codes that scan reliably and work the way you expect."
        title="QR code guides without the jargon"
      />
      <section className="content-section">
        <Container>
          <div className="article-grid">
            {blogArticleList.map((article, index) => (
              <ArticleCard
                article={article}
                key={article.slug}
                priority={index === 0}
              />
            ))}
          </div>
          <div className="content-cta">
            <div>
              <p className="eyebrow">Ready to create?</p>
              <h2>Put the guidance into practice.</h2>
              <p>Generate a static QR code locally with no account or redirect.</p>
            </div>
            <Link className="button button-primary" href="/qr-code-generator">
              Open the QR generator
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
