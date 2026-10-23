import type { Metadata } from "next";
import { PricingComparison } from "@/components/pricing/pricing-comparison";

export const metadata: Metadata = {
  title: "Qraftt Pricing — Free and Pro",
  description: "Compare Qraftt Free and Pro QR tools. Pro is USD $4.99 per month or $19.99 per year with premium customization and unlimited downloads.",
  alternates: { canonical: "/pricing" },
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  return <PricingComparison />;
}
