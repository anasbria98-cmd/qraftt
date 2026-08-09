import type { Metadata } from "next";

interface PageMetadataInput {
  description: string;
  path: `/${string}`;
  title: string;
  type?: "article" | "website";
}

export function createPageMetadata({
  description,
  path,
  title,
  type = "website",
}: PageMetadataInput): Metadata {
  return {
    alternates: { canonical: path },
    description,
    openGraph: {
      description,
      title,
      type,
      url: path,
    },
    title,
  };
}
