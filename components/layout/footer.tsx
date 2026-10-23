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
            <span className="footer-socials">
              <a href="https://www.youtube.com/@qraftt.generator" target="_blank" rel="noopener noreferrer" aria-label="Qraftt on YouTube (opens in a new tab)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61595929613573" target="_blank" rel="noopener noreferrer" aria-label="Qraftt on Facebook (opens in a new tab)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M24 12a12 12 0 1 0-13.875 11.855V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.386A12.003 12.003 0 0 0 24 12Z" /></svg>
              </a>
              <a href="https://www.instagram.com/qraftt.generator/" target="_blank" rel="noopener noreferrer" aria-label="Qraftt on Instagram (opens in a new tab)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
            </span>
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
