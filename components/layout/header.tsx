import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <Container className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {siteConfig.navigation.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-cta">
          <ButtonLink href="/#qr-generator">Create QR Code</ButtonLink>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation menu">
            <span />
            <span />
            <span />
          </summary>
          <div className="mobile-menu-panel">
            <nav aria-label="Mobile navigation">
              {siteConfig.navigation.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-cta">
              <ButtonLink href="/#qr-generator">Create QR Code</ButtonLink>
            </div>
          </div>
        </details>
      </Container>
    </header>
  );
}
