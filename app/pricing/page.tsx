import type { Metadata } from "next";
import { PricingComparison } from "@/components/pricing/pricing-comparison";

export const metadata: Metadata = {
  title: "Qraftt — All QR Features Free",
  description: "All QR types, templates, Logo QR and PNG, JPG, SVG, PDF and EPS exports are free. Unlimited downloads; 100 saved QR codes and 250 MB per account.",
  alternates: { canonical: "/pricing" },
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  return <PricingComparison />;
}
