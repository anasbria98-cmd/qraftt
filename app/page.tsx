import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { QrGenerator } from "@/components/generator/qr-generator";
import { PremiumPromo } from "@/components/marketing/premium-promo";
import { QrCreationSteps } from "@/components/marketing/qr-creation-steps";
import { UseCaseGallery } from "@/components/marketing/use-case-gallery";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  description: siteConfig.description,
  path: "/",
  title: "Free QR Code Generator — No Signup",
});

const principles = [
  ["Free by default", "Create and download without a plan, trial, or account."],
  ["Private by design", "Your content stays in your browser whenever possible."],
  ["Ready everywhere", "Clear, high-quality codes built for screens and print."],
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <Container className="home-hero-inner">
          <p className="home-hero-kicker">Free static QR code generator</p>
          <h1 id="home-hero-title">
            Create &amp; Customize QR Codes for <span>FREE</span>
          </h1>
          <p className="home-hero-lede">
            Generate, customize and download professional QR codes in seconds —
            no signup required.
          </p>
          <ButtonLink href="#qr-generator">Create QR Code</ButtonLink>
          <p className="home-hero-proof">
            30 QR types <span aria-hidden="true">·</span> Free forever{" "}
            <span aria-hidden="true">·</span> PNG &amp; SVG
          </p>
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
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="closing-section">
        <Container>
          <div className="closing-card">
            <div>
              <p className="eyebrow">Share without friction</p>
              <h2>Your next QR code should take seconds.</h2>
            </div>
            <ButtonLink href="#formats" variant="light">
              Choose a format
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
