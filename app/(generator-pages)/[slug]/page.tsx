import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeneratorLandingPage } from "@/components/seo/generator-landing-page";
import {
  generatorPageList,
  getGeneratorPage,
} from "@/lib/seo/generator-pages";

interface GeneratorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return generatorPageList.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: GeneratorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getGeneratorPage(slug);
  if (!page) notFound();

  return {
    alternates: {
      canonical: `/${page.slug}`,
    },
    description: page.metaDescription,
    openGraph: {
      description: page.metaDescription,
      title: page.seoTitle,
      type: "website",
      url: `/${page.slug}`,
    },
    title: page.seoTitle,
  };
}

export default async function GeneratorPage({ params }: GeneratorPageProps) {
  const { slug } = await params;
  const page = getGeneratorPage(slug);
  if (!page) notFound();

  return <GeneratorLandingPage page={page} />;
}
