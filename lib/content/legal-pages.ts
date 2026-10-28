export interface LegalSection {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
  links?: ReadonlyArray<{ href: string; label: string }>;
}

export interface LegalPageContent {
  description: string;
  eyebrow: string;
  introduction: string;
  sections: ReadonlyArray<LegalSection>;
  slug: LegalPageSlug;
  title: string;
  updatedAt: string;
}

export type LegalPageSlug = "privacy-policy" | "terms" | "cookie-policy";

export const legalPages: Record<LegalPageSlug, LegalPageContent> = {
  "privacy-policy": {
    description:
      "Learn how Qraftt handles QR generator inputs, files, technical request data, third-party destinations, and future policy changes.",
    eyebrow: "Privacy",
    introduction:
      "Qraftt creates static QR codes through a browser interface and a server-side render API. All QR tools and exports are free without an account. Optional accounts provide saved-design storage. This policy describes the data used by these current features.",
    sections: [
      {
        heading: "QR generator content",
        paragraphs: [
          "Your browser prepares a QR payload from the fields you enter. For live previews and PNG, JPG, SVG, PDF or EPS exports, it sends that payload, design settings and any selected center-logo image to Qraftt’s /api/qr/render endpoint. This includes entered text, destination URLs, WiFi credentials, contact details or event information. Production requests use HTTPS. Do not enter information you are not authorized to process or share.",
          "The render endpoint processes this content to produce the requested image. Preview and export do not save your payload or image to a library. If you explicitly choose Save to dashboard, Qraftt persists your QR content, design settings and embedded logo in your account until you delete that saved design or your account. Do not save sensitive content unless you intend to store it. This is not a promise that hosting infrastructure has no technical logs or transient processing. Downloads are unlimited and no download counters are required for access.",
          "Downloaded files are saved on your device. Only designs explicitly saved to your dashboard are stored in your account.",
        ],
      },
      {
        heading: "Website delivery data",
        paragraphs: [
          "Like most websites, the infrastructure that delivers Qraftt may receive standard technical request data such as an IP address, browser and device information, requested URL, timestamps, and security-related logs. Hosting and network providers may process this information to deliver pages, prevent abuse, and maintain reliability.",
          "QR content is sent in render-request bodies, not intentionally added to Qraftt page URLs. Hosting providers process those requests as well as ordinary page requests. Opening a destination after scanning a code is a separate request to that destination.",
        ],
      },
      {
        heading: "Accounts, analytics, and advertising",
        paragraphs: [
          "Supabase provides account authentication and database storage. Account records include an identifier, email, optional display name and timestamps. Historical subscription records, including PayPal identifiers and status, are retained but never determine feature access. Every account may save 100 QR codes using 250 MB. Usage measures persisted document and title bytes, including embedded logo data. Deletes release that usage. Existing over-limit data is retained; new saves or storage growth are blocked until space is freed. Downloads do not use dashboard storage. Scan analytics are not implemented.",
          "Authentication may use email and password or Google sign-in. Confirmation and password-recovery emails are sent through Supabase Auth using Qraftt’s configured Resend SMTP service. These providers process the information needed for authentication and email delivery. Contact support@qraftt.com for questions about account data or requests concerning its retention; this page does not promise immediate deletion of billing or security records.",
          "Qraftt no longer offers PayPal checkout or paid subscriptions. Historical billing, checkout and webhook records may be retained for reconciliation and legal obligations. Historical PayPal agreements are not automatically cancelled or modified; previous subscribers should manage renewals directly in PayPal. Qraftt does not store full payment-card details.",
          "Google Analytics and AdSense integrations are present. Google and its partners may process information for analytics, advertising, security and fraud prevention according to the configuration and consent signals they receive. Available advertising behavior can vary by visitor choice, location and provider settings.",
          "Advertising data may be processed for purposes such as delivering ads, measuring their performance, limiting how often an ad appears, and detecting or preventing fraud and abuse. Non-personalized ads are not selected using a personalized advertising profile, but Google may still process limited contextual, device, measurement, security, or fraud-prevention information as permitted by the visitor’s choices and applicable law.",
          "When GA4 is configured, its tag initializes with analytics_storage, ad_storage, ad_user_data and ad_personalization set to denied. The consent interface updates those signals after your choice. Google’s advanced consent behavior may still send cookieless measurement or consent requests while consent is denied. Qraftt’s AdSense verification script also loads independently of the consent-controlled advertising loader, so rejecting optional services does not mean that no request is made to Google. Core QR generation remains available after rejection.",
          "Qraftt also includes Vercel Analytics for site-usage measurement. Hosting and analytics providers receive technical information according to their service configuration. Use Cookie settings in the footer to change Qraftt’s optional-service preference, and review the linked provider information for their data practices. The presence of an integration is not a guarantee that ads are displayed or that analytics delivery succeeds on every visit.",
        ],
        links: [
          { href: "/cookie-policy", label: "Read the Qraftt Cookie Policy" },
          { href: "https://adssettings.google.com/", label: "Google Ads Settings" },
          {
            href: "https://policies.google.com/technologies/partner-sites",
            label: "How Google uses information from sites or apps that use its services",
          },
        ],
      },
      {
        heading: "Third-party destinations",
        paragraphs: [
          "A QR code can point to a website, social network, payment provider, map, file host, or other external service. When someone scans and opens that destination, the third party receives the request and applies its own privacy terms. Qraftt does not control those services.",
          "Review a destination before encoding or scanning it, and do not include personal or confidential information in a code that will be distributed publicly.",
        ],
      },
      {
        heading: "Contact and policy updates",
        paragraphs: [
          "Support is available at support@qraftt.com. Visit the Contact page for the current support details.",
          "This policy may be updated as Qraftt changes. The date shown on this page identifies the current version. Material changes should be described clearly rather than applied retroactively to generator content that Qraftt does not store.",
        ],
        links: [{ href: "/contact", label: "Contact Qraftt" }],
      },
    ],
    slug: "privacy-policy",
    title: "Privacy Policy",
    updatedAt: "2026-10-28",
  },
  terms: {
    description:
      "Read the terms for using Qraftt’s free static QR code generator and informational website.",
    eyebrow: "Terms",
    introduction:
      "These terms describe the current free Qraftt website and its static QR tools, server-side rendering and optional saved-design accounts. They do not create a subscription, payment plan, or mandatory account relationship.",
    sections: [
      {
        heading: "Using the service",
        paragraphs: [
          "You may use Qraftt to create and download static QR codes for lawful purposes. You are responsible for the content you encode, the destinations you choose, and how you publish or distribute the resulting files.",
          "Do not use the service to facilitate fraud, phishing, malware, harassment, unlawful tracking, infringement, or access to content you are not authorized to share.",
        ],
      },
      {
        heading: "Static codes and external destinations",
        paragraphs: [
          "A static QR code stores its payload directly and cannot be edited after download. Qraftt does not promise that an external URL, account, file, network, or third-party service will remain available, accurate, safe, or unchanged.",
          "Payment QR types only encode a validated external payment URL. Qraftt does not process payments, hold funds, determine fees, or participate in transactions between users and payment providers.",
        ],
      },
      {
        heading: "Testing and user responsibility",
        paragraphs: [
          "You must verify the decoded content and test a QR code in its final context before publishing, manufacturing, or printing at scale. Color, size, damage, material, lighting, scanner behavior, and destination access can affect results.",
          "You are also responsible for having the rights and permissions needed for any content, trademark, contact details, network credentials, files, or links you encode and distribute.",
        ],
      },
      {
        heading: "Availability and warranties",
        paragraphs: [
          "Qraftt is provided on an as-available basis. While the goal is a reliable and accurate tool, uninterrupted access, compatibility with every scanner, or fitness for a particular commercial, legal, safety-critical, or regulated use is not guaranteed.",
          "Do not rely on a QR code as the only way to provide emergency, accessibility, legally required, or safety-critical information. Provide an appropriate visible alternative where the context requires it.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "The service and these terms may change as Qraftt develops. The current version date appears on this page. New paid features, accounts, advertising, or materially different data practices would require corresponding product and policy updates; none are implied by these terms.",
        ],
      },
    ],
    slug: "terms",
    title: "Terms of Use",
    updatedAt: "2026-10-28",
  },
  "cookie-policy": {
    description:
      "Understand Qraftt’s authentication, session and preference storage, server-side QR rendering, and Google consent signals.",
    eyebrow: "Cookies",
    introduction:
      "Qraftt uses cookies for optional account authentication, plus local browser storage for language and optional-service preferences. QR preview and export content is sent separately to a server-side render endpoint; it is not stored as a QR history in these cookies.",
    sections: [
      {
        heading: "Current cookie use",
        paragraphs: [
          "Supabase authentication uses sb-… cookies for session and sign-in verification data. Their lifetime follows the authentication configuration. The qraftt_session_only preference requests session cookies when Remember me is not selected; browser session-restoration settings can affect how long a session remains available. Logout attempts to end the current browser session.",
          "The former qraftt_customer cookie is no longer used to enforce download limits. Downloads are unlimited. Old cookies may remain until expiry or removal by your browser; clearing them does not delete account data.",
          "Legacy checkout cookies are no longer used for purchases or feature access. The qraftt_auth_return HTTP-only cookie can preserve a password-recovery return path for up to one day. Authentication cookies use secure production attributes.",
        ],
      },
      {
        heading: "Consent preference storage",
        paragraphs: [
          "The consent interface stores an accepted or rejected preference in local browser storage so the site can remember whether optional services may load. This preference is not used to save QR payloads or build a generator history.",
          "Use the Cookie settings control in the footer to reopen the choice. If browser storage is unavailable or cleared, the site may ask again.",
          "The qraftt_language_v1 local-storage preference remembers your chosen interface language. The qraft_optional_consent_v1 preference remembers acceptance or rejection. These entries have no automatic expiry in the application and remain until changed or removed by you or your browser. Neither stores QR content.",
        ],
      },
      {
        heading: "Hosting and essential technology",
        paragraphs: [
          "The hosting, security, or network services that deliver the website may use technical mechanisms needed to route traffic, prevent abuse, balance requests, or maintain service integrity. Their operation can vary by provider and browser.",
          "Session cookies are separate from optional advertising preferences. Blocking essential cookies can prevent account login and saved-design access. Creating and exporting QR codes does not require an account, payment or a download-limit cookie.",
        ],
      },
      {
        heading: "Advertising and analytics",
        paragraphs: [
          "Configured GA4 initializes with denied Consent Mode defaults before a choice and receives updated signals after acceptance or rejection. Google may send cookieless measurement and consent requests while denied. The AdSense verification script loads independently of acceptance; a separate configured advertising loader is enabled after acceptance. These are not equivalent to blocking every third-party request before consent.",
          "Google and Vercel analytics or advertising services may process technical data under their own configurations and policies. Optional-service rejection leaves core QR tools available, but does not prevent all hosting, verification or cookieless requests. Changing a choice updates Qraftt’s stored preference and consent signals; it does not retroactively erase provider records or guarantee removal of previously set third-party cookies. Review the Privacy Policy for provider information.",
        ],
      },
      {
        heading: "Browser controls",
        paragraphs: [
          "Most browsers let you inspect, block or delete cookies and local storage. Blocking essential storage can prevent account sessions from working. Clearing local state does not cancel a PayPal subscription. Manage a historical agreement directly in PayPal, not by deleting browser data.",
          "Browser settings do not control information sent when you choose to open an external destination from a QR code. The destination site applies its own cookie and privacy practices.",
        ],
      },
      {
        heading: "Updates to this policy",
        paragraphs: [
          "This policy describes the current application behavior and will be updated when those technologies change. Provider settings, browser behavior and hosting operations can also affect storage and requests. Contact support@qraftt.com with questions. The effective date identifies this version.",
        ],
      },
    ],
    slug: "cookie-policy",
    title: "Cookie Policy",
    updatedAt: "2026-10-28",
  },
};
