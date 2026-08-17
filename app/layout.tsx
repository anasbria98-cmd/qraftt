import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ConsentProvider } from "@/components/privacy/consent-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { adSenseClientId } from "@/lib/integrations";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Qraftt — Free QR Code Generator",
    template: "%s | Qraftt",
  },
  description: siteConfig.description,
  other: adSenseClientId
    ? { "google-adsense-account": adSenseClientId }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            description: siteConfig.description,
            name: siteConfig.name,
            url: siteConfig.url,
          }}
        />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ConsentProvider>
          <div className="site-shell">
            <Header />
            {children}
            <Footer />
          </div>
        </ConsentProvider>
      </body>
    </html>
  );
}
