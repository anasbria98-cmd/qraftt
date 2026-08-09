import type { MetadataRoute } from "next";
import { blogArticleList } from "@/lib/content/articles";
import { generatorPageList } from "@/lib/seo/generator-pages";
import { siteConfig } from "@/lib/site";

const trustPaths = [
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      changeFrequency: "weekly",
      lastModified,
      priority: 1,
      url: siteConfig.url,
    },
    ...generatorPageList.map((page) => ({
      changeFrequency: "monthly" as const,
      lastModified,
      priority: page.slug === "qr-code-generator" ? 0.9 : 0.8,
      url: `${siteConfig.url}/${page.slug}`,
    })),
    {
      changeFrequency: "weekly",
      lastModified,
      priority: 0.8,
      url: `${siteConfig.url}/blog`,
    },
    ...blogArticleList.map((article) => ({
      changeFrequency: "monthly" as const,
      lastModified: new Date(`${article.updatedAt}T00:00:00Z`),
      priority: 0.7,
      url: `${siteConfig.url}/blog/${article.slug}`,
    })),
    ...trustPaths.map((path) => ({
      changeFrequency: "yearly" as const,
      lastModified,
      priority: path === "/about" ? 0.6 : 0.4,
      url: `${siteConfig.url}${path}`,
    })),
  ];
}
