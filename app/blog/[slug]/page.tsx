import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/blog/article-page";
import { blogArticleList, getBlogArticle } from "@/lib/content/articles";
import { createPageMetadata } from "@/lib/seo/metadata";

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogArticleList.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  return createPageMetadata({
    description: article.description,
    image: article.image.src,
    imageAlt: article.image.alt,
    path: `/blog/${article.slug}`,
    title: article.title,
    type: "article",
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);
  if (!article) notFound();

  return <ArticlePage article={article} />;
}
