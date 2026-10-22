import { T } from "@/components/i18n/language-provider";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function PremiumPromo() {
  return (
    <section className="premium-promo-section" aria-labelledby="premium-promo-title">
      <Container className="premium-promo-container">
        <div className="premium-promo-copy">
          <p className="premium-promo-eyebrow"><T text="Make it unmistakably yours" /></p>
          <h2 id="premium-promo-title"><T text="Design QR codes people" />{" "}<span><T text="notice and trust." /></span>
          </h2>
          <p><T text="Combine original templates, frames, patterns, colors, and your logo—then export a polished static QR code without an account or hosted redirect." /></p>
          <ButtonLink className="premium-promo-button" href="#qr-generator" variant="light"><T text="Create Your QR Code" />{" "}<span aria-hidden="true">→</span>
          </ButtonLink>
          <ul className="premium-promo-notes" aria-label="Qraftt design benefits">
            <li><T text="Created locally" /></li>
            <li><T text="Scan-safe controls" /></li>
            <li><T text="PNG & SVG" /></li>
          </ul>
        </div>

        <div className="premium-promo-visual">
          <div className="premium-promo-image-shell">
            <Image
              alt="Qraftt branded QR experiences showcase"
              height={1086}
              priority={false}
              sizes="(min-width: 1440px) 720px, (min-width: 1024px) 52vw, 100vw"
              src="/images/qraftt-premium-sculpture.webp"
              unoptimized
              width={1448}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
