import type { Metadata } from "next";

interface PageMetadataInput {
  description: string;
  image?: `/${string}`;
  imageAlt?: string;
  path: `/${string}`;
  title: string;
  type?: "article" | "website";
}

export function createPageMetadata({
  description,
  image,
  imageAlt,
  path,
  title,
  type = "website",
}: PageMetadataInput): Metadata {
  return {
    alternates: { canonical: path },
    description,
    openGraph: {
      description,
      images: image ? [{ alt: imageAlt ?? title, url: image }] : undefined,
      title,
      type,
      url: path,
    },
    twitter: image
      ? {
          card: "summary_large_image",
          description,
          images: [image],
          title,
        }
      : undefined,
    title,
  };
}
