import type { Metadata } from "next";
import { AdSlot } from "@/components/ads/ad-slot";
import { QrGenerator } from "@/components/generator/qr-generator";
import { Badge } from "@/components/ui/badge";
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

const formats = [
  ["01", "URL", "Send people to any page with one quick scan."],
  ["02", "WiFi", "Let guests join a network without typing a password."],
  ["03", "WhatsApp", "Open a conversation with an optional ready-made message."],
  ["04", "Text", "Share a note, code, instruction, or short message."],
  ["05", "Email", "Prepare an addressed email with subject and body."],
  ["06", "vCard", "Make contact details effortless to save and share."],
] as const;

const principles = [
  ["Free by default", "Create and download without a plan, trial, or account."],
  ["Private by design", "Your content stays in your browser whenever possible."],
  ["Ready everywhere", "Clear, high-quality codes built for screens and print."],
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero-section">
        <Container className="hero-grid">
          <div className="hero-copy">
            <Badge>Free forever · No signup</Badge>
            <h1>
              Make a QR code.
              <span> Keep it yours.</span>
            </h1>
            <p className="hero-lede">
              A focused QR toolkit for everyday sharing—fast to create, simple
              to customize, and free to download.
            </p>
            <div className="hero-actions">
              <ButtonLink href="#formats">Explore QR formats</ButtonLink>
              <ButtonLink href="#how-it-works" variant="secondary">
                How it works
              </ButtonLink>
            </div>
            <ul className="hero-notes" aria-label="Product benefits">
              <li>No account</li>
              <li>No scan limits</li>
              <li>PNG &amp; SVG</li>
            </ul>
          </div>
          <QrGenerator />
        </Container>
      </section>

      <AdSlot placement="generator" />

      <section className="section" id="formats">
        <Container>
          <SectionHeading
            eyebrow="One toolkit"
            title="The right format for every share"
            description="Start with the information you need to share. Qraft will handle the structure for you."
          />
          <div className="format-grid">
            {formats.map(([number, name, description]) => (
              <article className="format-card" key={name}>
                <span className="format-number">{number}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section-muted" id="how-it-works">
        <Container>
          <SectionHeading
            eyebrow="Simple by design"
            title="From idea to scan in three steps"
            align="center"
          />
          <ol className="steps-grid">
            <li>
              <span>1</span>
              <h3>Choose a format</h3>
              <p>Select the QR type that matches what you want to share.</p>
            </li>
            <li>
              <span>2</span>
              <h3>Make it recognizable</h3>
              <p>Adjust colors and details while previewing every change.</p>
            </li>
            <li>
              <span>3</span>
              <h3>Download and use</h3>
              <p>Export a crisp file for digital use or professional print.</p>
            </li>
          </ol>
        </Container>
      </section>

      <section className="section" id="why-qraft">
        <Container className="principles-layout">
          <SectionHeading
            eyebrow="Built with restraint"
            title="Everything you need. Nothing in your way."
            description="Qraft is being built around a simple promise: useful QR tools should be accessible to everyone."
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
