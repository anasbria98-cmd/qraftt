import Link from "next/link";
import type { BlogArticle } from "@/lib/content/articles";

interface ArticleCardProps {
  article: BlogArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <div className="article-card-meta">
        <span>{article.readingMinutes} min read</span>
        <time dateTime={article.updatedAt}>{article.updatedAt}</time>
      </div>
      <h2>
        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
      </h2>
      <p>{article.excerpt}</p>
      <Link className="article-card-link" href={`/blog/${article.slug}`}>
        Read guide <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
