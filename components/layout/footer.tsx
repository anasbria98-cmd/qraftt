import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CookieSettingsButton } from "@/components/privacy/cookie-settings-button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-main">
          <div className="footer-brand">
            <Logo />
            <p>
              Simple, private QR tools for people who just want to get things
              shared.
            </p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {[...siteConfig.navigation, ...siteConfig.legalNavigation].map(([label, href]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
            <CookieSettingsButton />
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Free to create. Free to share.</p>
        </div>
      </Container>
    </footer>
  );
}
