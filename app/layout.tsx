import { T } from "@/components/i18n/language-provider";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ConsentProvider } from "@/components/privacy/consent-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { adSenseClientId, googleAnalyticsId } from "@/lib/integrations";
import {
  organizationSchema,
  websiteSchema,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";
import "./globals.css";
import "./premium-depth.css";
import { LanguageProvider } from "@/components/i18n/language-provider";

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
      <head>
      {googleAnalyticsId ? (
        <>
          <Script id="qraft-google-consent-default" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
window.gtag('js', new Date());
window.gtag('config', '${googleAnalyticsId}');`}
          </Script>
          <Script
            async
            id="qraft-google-analytics"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="beforeInteractive"
          />
        </>
      ) : null}
      <script
        async
        crossOrigin="anonymous"
        id="qraft-google-adsense-verification"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2658604492693909"
      />
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [organizationSchema, websiteSchema],
          }}
        />
        <LanguageProvider><a className="skip-link" href="#main-content"><T text="Skip to content" /></a>
        <ConsentProvider>
          <div className="site-shell">
            <Header />
            {children}
            <Footer />
          </div>
        </ConsentProvider></LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
