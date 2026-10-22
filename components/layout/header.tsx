import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";
import { HeaderAccountLink, HeaderAccountProvider } from "./header-account";
import { LanguageSelector } from "@/components/i18n/language-selector";
import { T } from "@/components/i18n/language-provider";

export function Header() {
  return (
    <HeaderAccountProvider><header className="site-header">
      <Container className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {siteConfig.navigation.map(([label, href]) => (
            <Link href={href} key={href}>
              <T text={label} />
            </Link>
          ))}
        </nav>
        <Link href="/pricing" className="header-pricing-link"><T text="Free & Pro" /></Link>
        <div className="header-cta">
          <LanguageSelector />
          <HeaderAccountLink />
          <ButtonLink href="/#qr-generator"><T text="Create QR Code" /></ButtonLink>
        </div>
        <div className="mobile-language-selector"><LanguageSelector /></div>
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
                  <T text={label} />
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-cta">
              <HeaderAccountLink />
              <ButtonLink href="/#qr-generator"><T text="Create QR Code" /></ButtonLink>
            </div>
          </div>
        </details>
      </Container>
    </header></HeaderAccountProvider>
  );
}
