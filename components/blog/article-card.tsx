import Link from "next/link";
import Image from "next/image";
import type { BlogArticle } from "@/lib/content/articles";

interface ArticleCardProps {
  article: BlogArticle;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="article-card">
      <Link className="article-card-media" href={`/blog/${article.slug}`}>
        <Image
          alt={article.image.alt}
          height={article.image.height}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 720px) calc(100vw - 3rem), (max-width: 1100px) 50vw, 33vw"
          src={article.image.src}
          width={article.image.width}
        />
      </Link>
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
