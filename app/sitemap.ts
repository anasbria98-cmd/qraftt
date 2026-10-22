import type { MetadataRoute } from "next";
import { blogArticleList } from "@/lib/content/articles";
import { legalPages } from "@/lib/content/legal-pages";
import {
  getGeneratorPageContentUpdatedAt,
  pageContentUpdatedAt,
} from "@/lib/seo/content-updates";
import { generatorPageList } from "@/lib/seo/generator-pages";
import { siteConfig } from "@/lib/site";

const trustPages = [
  { path: "/about", updatedAt: pageContentUpdatedAt.about },
  { path: "/contact", updatedAt: pageContentUpdatedAt.contact },
  {
    path: "/privacy-policy",
    updatedAt: legalPages["privacy-policy"].updatedAt,
  },
  { path: "/terms", updatedAt: legalPages.terms.updatedAt },
  {
    path: "/cookie-policy",
    updatedAt: legalPages["cookie-policy"].updatedAt,
  },
] as const;

function contentDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

const blogIndexUpdatedAt = blogArticleList.reduce(
  (latest, article) =>
    article.updatedAt > latest ? article.updatedAt : latest,
  blogArticleList[0]?.updatedAt ?? "2026-08-09",
);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      lastModified: contentDate(pageContentUpdatedAt.homepage),
      priority: 1,
      url: `${siteConfig.url}/`,
    },
    ...generatorPageList.map((page) => ({
      changeFrequency: "monthly" as const,
      lastModified: contentDate(getGeneratorPageContentUpdatedAt(page.slug)),
      priority: page.slug === "qr-code-generator" ? 0.9 : 0.8,
      url: `${siteConfig.url}/${page.slug}`,
    })),
    { url: `${siteConfig.url}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    {
      changeFrequency: "weekly",
      lastModified: contentDate(blogIndexUpdatedAt),
      priority: 0.8,
      url: `${siteConfig.url}/blog`,
    },
    ...blogArticleList.map((article) => ({
      changeFrequency: "monthly" as const,
      images: [`${siteConfig.url}${article.image.src}`],
      lastModified: contentDate(article.updatedAt),
      priority: 0.7,
      url: `${siteConfig.url}/blog/${article.slug}`,
    })),
    ...trustPages.map(({ path, updatedAt }) => ({
      changeFrequency: "yearly" as const,
      lastModified: contentDate(updatedAt),
      priority: path === "/about" ? 0.6 : 0.4,
      url: `${siteConfig.url}${path}`,
    })),
  ];
}
