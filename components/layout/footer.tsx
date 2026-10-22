import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CookieSettingsButton } from "@/components/privacy/cookie-settings-button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";
import { T } from "@/components/i18n/language-provider";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p><T text="Simple, private QR tools for people who just want to get things shared." /></p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {[...siteConfig.navigation, ...siteConfig.legalNavigation].map(([label, href]) => (
              <Link href={href} key={href}>
                <T text={label} />
              </Link>
            ))}
            <a href="mailto:support@qraftt.com">support@qraftt.com</a>
            <CookieSettingsButton />
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}<T text=". All rights reserved." /></p>
          <p><T text="Free to create. Free to share." /></p>
        </div>
        <a
          className="directree-badge"
          href="https://www.directree.io"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="Verified on directree"
            height={22}
            src="https://www.directree.io/badge/directree-badge-lightmode.svg"
            unoptimized
            style={{ width: "auto", height: 22 }}
            width={120}
          />
        </a>
      </Container>
    </footer>
  );
}
