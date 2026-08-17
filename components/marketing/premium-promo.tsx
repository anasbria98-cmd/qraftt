import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function PremiumPromo() {
  return (
    <section className="premium-promo-section" aria-labelledby="premium-promo-title">
      <Container className="premium-promo-container">
        <div className="premium-promo-copy">
          <p className="premium-promo-eyebrow">Make it unmistakably yours</p>
          <h2 id="premium-promo-title">
            Design QR codes people <span>notice and trust.</span>
          </h2>
          <p>
            Combine original templates, frames, patterns, colors, and your logo—then
            export a polished static QR code without an account or hosted redirect.
          </p>
          <ButtonLink className="premium-promo-button" href="#qr-generator" variant="light">
            Create Your QR Code <span aria-hidden="true">→</span>
          </ButtonLink>
          <ul className="premium-promo-notes" aria-label="Qraftt design benefits">
            <li>Created locally</li>
            <li>Scan-safe controls</li>
            <li>PNG &amp; SVG</li>
          </ul>
        </div>

        <div className="premium-promo-visual">
          <div className="premium-promo-image-shell">
            <Image
              alt="Qraftt branded QR experiences showcase"
              height={941}
              priority={false}
              sizes="(min-width: 1024px) 58vw, 100vw"
              src="/images/qraftt-premium-promo.png"
              unoptimized
              width={1672}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
