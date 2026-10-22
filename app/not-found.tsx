import { T } from "@/components/i18n/language-provider";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content">
      <section className="content-hero">
        <Container className="content-hero-inner">
          <p className="eyebrow"><T text="404 · Page not found" /></p>
          <h1><T text="This page is not available." /></h1>
          <p><T text="The address may have changed or the page may no longer exist. You can return home or open the free QR generator." /></p>
          <div className="hero-actions">
            <ButtonLink href="/"><T text="Return home" /></ButtonLink>
            <ButtonLink href="/qr-code-generator" variant="secondary"><T text="Create a QR code" /></ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
