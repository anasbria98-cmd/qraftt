import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main-content">
      <section className="content-hero">
        <Container className="content-hero-inner">
          <p className="eyebrow">404 · Page not found</p>
          <h1>This page is not available.</h1>
          <p>
            The address may have changed or the page may no longer exist. You
            can return home or open the free QR generator.
          </p>
          <div className="hero-actions">
            <ButtonLink href="/">Return home</ButtonLink>
            <ButtonLink href="/qr-code-generator" variant="secondary">
              Create a QR code
            </ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  );
}
