import { T } from "@/components/i18n/language-provider";
import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { QrGenerator } from "@/components/generator/qr-generator";
import { PremiumPromo } from "@/components/marketing/premium-promo";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { QrCreationSteps } from "@/components/marketing/qr-creation-steps";
import { UseCaseGallery } from "@/components/marketing/use-case-gallery";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/seo/metadata";

const homepageTitle = "Qraftt — Free Browser-Based Static QR Code Generator";
const homepageDescription =
  "Qraftt is a free browser-based static QR code generator with 30 QR types, design customization, and PNG and SVG exports—no signup required.";

export const metadata: Metadata = {
  ...createPageMetadata({
    description: homepageDescription,
    path: "/",
    title: homepageTitle,
  }),
  alternates: { canonical: "https://www.qraftt.com/" },
  title: { absolute: homepageTitle },
  other: {
    "directree-verify": "directree-verify=05b68ffd774fd0d8d488a7a14d53978f",
  },
};

const principles = [
  ["Free by default", "Create and download without a plan, trial, or account."],
  ["Private by design", "Your content stays in your browser whenever possible."],
  [
    "Direct by design",
    "Downloaded static QR codes encode their destination or content directly and do not depend on Qraftt redirects.",
  ],
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <Container className="home-hero-inner">
          <h1 id="home-hero-title"><T text="Create & Customize QR Codes for" />{" "}<span><T text="FREE" /></span>
          </h1>
        </Container>
      </section>

      <section className="generator-entry-section" id="qr-generator">
        <Container className="generator-entry-container">
          <QrGenerator catalogFirst />
        </Container>
      </section>

      <AdSlot placement="generator" />

      <UseCaseGallery />

      <QrCreationSteps />

      <PremiumPromo />

      <section className="section" id="why-qraft">
        <Container className="principles-layout">
          <SectionHeading
            eyebrow="Built with restraint"
            title="Everything you need. Nothing in your way."
            description="Qraftt is being built around a simple promise: useful QR tools should be accessible to everyone."
          />
          <div className="principles-list">
            {principles.map(([title, description]) => (
              <article key={title}>
                <span aria-hidden="true" />
                <div>
                  <h3><T text={title} /></h3>
                  <p><T text={description} /></p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <PricingComparison embedded />

      <section className="closing-section">
        <Container>
          <div className="closing-card">
            <div>
              <p className="eyebrow"><T text="Share without friction" /></p>
              <h2><T text="Your next QR code should take seconds." /></h2>
            </div>
            <ButtonLink href="#formats" variant="light"><T text="Choose a format" /></ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
