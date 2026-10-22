import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Breadcrumbs,
  createBreadcrumbSchema,
  type BreadcrumbItem,
} from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import {
  getRelatedBlogArticles,
  type BlogArticle,
} from "@/lib/content/articles";
import {
  createWebPageSchemaConnections,
  schemaReferences,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

interface ArticlePageProps {
  article: BlogArticle;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function ArticlePage({ article }: ArticlePageProps) {
  const path = `/blog/${article.slug}` as const;
  const url = `${siteConfig.url}${path}`;
  const imageUrl = `${siteConfig.url}${article.image.src}`;
  const imageId = `${url}#primaryimage`;
  const articleId = `${url}#article`;
  const faqSection = article.sections.find(
    (section) => section.faqs && section.faqs.length > 0,
  );
  const faqId = `${url}#faq`;
  const relatedArticles = getRelatedBlogArticles(article.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: path, label: article.title },
  ];
  const breadcrumbSchema = createBreadcrumbSchema(breadcrumbs);

  return (
    <main id="main-content">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@id": articleId,
              "@type": "Article",
              author: schemaReferences.organization,
              dateModified: article.updatedAt,
              datePublished: article.publishedAt,
              description: article.description,
              mainEntity: faqSection ? { "@id": faqId } : undefined,
              headline: article.title,
              image: { "@id": imageId },
              mainEntityOfPage: { "@id": `${url}#webpage` },
              publisher: schemaReferences.organization,
              url,
            },
            {
              "@id": `${url}#webpage`,
              "@type": "WebPage",
              ...createWebPageSchemaConnections(),
              breadcrumb: { "@id": breadcrumbSchema["@id"] },
              description: article.description,
              mainEntity: [
                { "@id": articleId },
                ...(faqSection ? [{ "@id": faqId }] : []),
              ],
              primaryImageOfPage: { "@id": imageId },
              name: article.title,
              url,
            },
            {
              "@id": imageId,
              "@type": "ImageObject",
              caption: article.image.alt,
              contentUrl: imageUrl,
              height: article.image.height,
              url: imageUrl,
              width: article.image.width,
            },
            breadcrumbSchema,
            ...(faqSection
              ? [
                  {
                    "@id": faqId,
                    "@type": "FAQPage",
                    mainEntity: faqSection.faqs?.map((faq) => ({
                      "@type": "Question",
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                      },
                      name: faq.question,
                    })),
                  },
                ]
              : []),
          ],
        }}
      />

      <article>
        <header className="article-hero">
          <Container className="article-hero-inner">
            <Breadcrumbs items={breadcrumbs} />
            <p className="eyebrow">Practical QR guide</p>
            <h1>{article.title}</h1>
            <p className="article-deck">{article.excerpt}</p>
            <div className="article-byline">
              <span>By {siteConfig.name}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.updatedAt}>
                Updated {formatDate(article.updatedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{article.readingMinutes} min read</span>
            </div>
            <figure className="article-hero-visual">
              <Image
                alt={article.image.alt}
                height={article.image.height}
                priority
                sizes="(max-width: 900px) calc(100vw - 2rem), 832px"
                src={article.image.src}
                width={article.image.width}
              />
            </figure>
          </Container>
        </header>

        <Container className="article-layout">
          <aside className="article-toc" aria-label="On this page">
            <p>On this page</p>
            <ol>
              {article.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="article-body">
            {article.sections.map((section, index) => (
              <Fragment key={section.id}>
                <section id={section.id}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.contextualLinks?.map((link) => (
                    <p key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                      {` — ${link.description}`}
                    </p>
                  ))}
                  {section.faqs?.map((faq) => (
                    <div key={faq.question}>
                      <h3>{faq.question}</h3>
                      <p>{faq.answer}</p>
                    </div>
                  ))}
                  {section.bullets ? (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.table ? (
                    <div className="article-table-wrap">
                      <table>
                        <caption>{section.table.caption}</caption>
                        <thead>
                          <tr>
                            {section.table.headers.map((header) => (
                              <th key={header} scope="col">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row) => (
                            <tr key={row.join("-")}>
                              {row.map((cell, cellIndex) =>
                                cellIndex === 0 ? (
                                  <th key={cell} scope="row">
                                    {cell}
                                  </th>
                                ) : (
                                  <td key={cell}>{cell}</td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                  {section.note ? (
                    <aside className="article-note">{section.note}</aside>
                  ) : null}
                </section>
                {index === 2 ? <AdSlot placement="article" /> : null}
              </Fragment>
            ))}

            <section className="article-related" aria-labelledby="related-guides-title">
              <p className="eyebrow">Continue learning</p>
              <h2 id="related-guides-title">Related QR code guides</h2>
              <div>
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    href={`/blog/${relatedArticle.slug}`}
                    key={relatedArticle.slug}
                  >
                    <strong>{relatedArticle.title}</strong>
                    <span>{relatedArticle.excerpt}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="article-generators" aria-labelledby="article-tools-title">
              <p className="eyebrow">Put it into practice</p>
              <h2 id="article-tools-title">Relevant QR generators</h2>
              <div>
                {article.generators.map((link) => (
                  <Link href={link.href} key={link.href}>
                    <strong>{link.label}</strong>
                    <span>{link.description}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="article-sources" aria-labelledby="article-sources-title">
              <h2 id="article-sources-title">Technical references</h2>
              <ul>
                {article.sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} rel="noreferrer" target="_blank">
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </Container>
      </article>
    </main>
  );
}
