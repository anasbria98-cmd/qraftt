import { LegalPage } from "@/components/content/legal-page";
import { legalPages } from "@/lib/content/legal-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

const page = legalPages["cookie-policy"];

export const metadata = createPageMetadata({
  description: page.description,
  path: "/cookie-policy",
  title: page.title,
});

export default function CookiePolicyPage() {
  return <LegalPage page={page} />;
}
