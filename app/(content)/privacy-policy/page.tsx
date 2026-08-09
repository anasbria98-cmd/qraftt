import { LegalPage } from "@/components/content/legal-page";
import { legalPages } from "@/lib/content/legal-pages";
import { createPageMetadata } from "@/lib/seo/metadata";

const page = legalPages["privacy-policy"];

export const metadata = createPageMetadata({
  description: page.description,
  path: "/privacy-policy",
  title: page.title,
});

export default function PrivacyPolicyPage() {
  return <LegalPage page={page} />;
}
