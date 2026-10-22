import type { Metadata } from "next";
import { PricingComparison } from "@/components/pricing/pricing-comparison";

export const metadata: Metadata = {
  title: "Qraftt Pricing — Free and Pro",
  description: "Compare Qraftt Free and Pro QR tools. Pro is USD $2 per month with premium customization and unlimited downloads.",
  alternates: { canonical: "/pricing" },
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  return <PricingComparison />;
}
