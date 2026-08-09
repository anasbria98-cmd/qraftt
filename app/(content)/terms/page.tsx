import { LegalPage } from "@/components/content/legal-page";
import { legalPages } from "@/lib/content/legal-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

const page = legalPages.terms;

export const metadata = createPageMetadata({
  description: page.description,
  path: "/terms",
  title: page.title,
});

export default function TermsPage() {
  return <LegalPage page={page} />;
}
