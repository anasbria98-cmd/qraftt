export interface LegalSection {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
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
      "Learn how Qraft handles QR generator inputs, files, technical request data, third-party destinations, and future policy changes.",
    eyebrow: "Privacy",
    introduction:
      "Qraft is designed to create static QR codes in your browser without an account or generator database. This policy explains what that means, what the website may still receive during ordinary delivery, and the limits of our control.",
    sections: [
      {
        heading: "QR generator content",
        paragraphs: [
          "QR payloads are generated locally in your browser. The text, URLs, WiFi credentials, contact details, and other values you enter are not intentionally sent to a Qraft application server for QR generation or stored in a Qraft database.",
          "Downloaded PNG and SVG files are created for you to save on your device. Qraft does not maintain an account library or hosted copy of those generated files.",
        ],
      },
      {
        heading: "Website delivery data",
        paragraphs: [
          "Like most websites, the infrastructure that delivers Qraft may receive standard technical request data such as an IP address, browser and device information, requested URL, timestamps, and security-related logs. Hosting and network providers may process this information to deliver pages, prevent abuse, and maintain reliability.",
          "This technical request data is separate from the content entered into the client-side generator. We do not intentionally place generator payloads in page URLs or send them with ordinary page requests.",
        ],
      },
      {
        heading: "Accounts, analytics, and advertising",
        paragraphs: [
          "Qraft does not require an account, and this site does not include a subscription or payment system. Lightweight Google Analytics and Google AdSense integrations are prepared but remain disabled when their public configuration IDs are absent.",
          "When those integrations are configured, their scripts load only after a visitor accepts optional services through the consent interface. Google may then process technical usage, device, advertising, or measurement data under its own terms. Rejecting optional services does not block the QR generator.",
        ],
      },
      {
        heading: "Third-party destinations",
        paragraphs: [
          "A QR code can point to a website, social network, payment provider, map, file host, or other external service. When someone scans and opens that destination, the third party receives the request and applies its own privacy terms. Qraft does not control those services.",
          "Review a destination before encoding or scanning it, and do not include personal or confidential information in a code that will be distributed publicly.",
        ],
      },
      {
        heading: "Contact and policy updates",
        paragraphs: [
          "The current contact page is an interface only and does not transmit or store submissions. A working contact method will be published when the necessary backend or support channel is available.",
          "This policy may be updated as Qraft changes. The date shown on this page identifies the current version. Material changes should be described clearly rather than applied retroactively to generator content that Qraft does not store.",
        ],
      },
    ],
    slug: "privacy-policy",
    title: "Privacy Policy",
    updatedAt: "2026-08-09",
  },
  terms: {
    description:
      "Read the terms for using Qraft’s free, client-side static QR code generator and informational website.",
    eyebrow: "Terms",
    introduction:
      "These terms describe the current free Qraft website and its client-side static QR tools. They do not create a subscription, payment plan, or mandatory account relationship.",
    sections: [
      {
        heading: "Using the service",
        paragraphs: [
          "You may use Qraft to create and download static QR codes for lawful purposes. You are responsible for the content you encode, the destinations you choose, and how you publish or distribute the resulting files.",
          "Do not use the service to facilitate fraud, phishing, malware, harassment, unlawful tracking, infringement, or access to content you are not authorized to share.",
        ],
      },
      {
        heading: "Static codes and external destinations",
        paragraphs: [
          "A static QR code stores its payload directly and cannot be edited after download. Qraft does not promise that an external URL, account, file, network, or third-party service will remain available, accurate, safe, or unchanged.",
          "Payment QR types only encode a validated external payment URL. Qraft does not process payments, hold funds, determine fees, or participate in transactions between users and payment providers.",
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
          "Qraft is provided on an as-available basis. While the goal is a reliable and accurate tool, uninterrupted access, compatibility with every scanner, or fitness for a particular commercial, legal, safety-critical, or regulated use is not guaranteed.",
          "Do not rely on a QR code as the only way to provide emergency, accessibility, legally required, or safety-critical information. Provide an appropriate visible alternative where the context requires it.",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "The service and these terms may change as Qraft develops. The current version date appears on this page. New paid features, accounts, advertising, or materially different data practices would require corresponding product and policy updates; none are implied by these terms.",
        ],
      },
    ],
    slug: "terms",
    title: "Terms of Use",
    updatedAt: "2026-08-09",
  },
  "cookie-policy": {
    description:
      "Understand Qraft’s current use of cookies, client-side QR generation, hosting technology, browser controls, and future updates.",
    eyebrow: "Cookies",
    introduction:
      "Qraft’s QR generator does not need cookies to encode and download static QR codes. This page describes the current website and distinguishes browser-based generation from cookie storage.",
    sections: [
      {
        heading: "Current cookie use",
        paragraphs: [
          "Qraft does not require account, checkout, or generator-history cookies. There is no login session, subscription checkout, or saved QR library.",
          "The fact that QR generation happens in your browser does not itself mean a cookie is created. Generator values are held in the page while you work and are used to render the downloadable code locally.",
        ],
      },
      {
        heading: "Consent preference storage",
        paragraphs: [
          "The consent interface stores an accepted or rejected preference in local browser storage so the site can remember whether optional services may load. This preference is not used to save QR payloads or build a generator history.",
          "Use the Cookie settings control in the footer to reopen the choice. If browser storage is unavailable or cleared, the site may ask again.",
        ],
      },
      {
        heading: "Hosting and essential technology",
        paragraphs: [
          "The hosting, security, or network services that deliver the website may use technical mechanisms needed to route traffic, prevent abuse, balance requests, or maintain service integrity. Their operation can vary by provider and browser.",
          "If Qraft introduces a site-controlled essential cookie, this policy should identify its purpose and duration. No such cookie is currently required for the QR generator’s core workflow.",
        ],
      },
      {
        heading: "Advertising and analytics",
        paragraphs: [
          "Qraft includes dormant preparation for Google Analytics and Google AdSense. A service is not loaded when its required public ID is missing, and configured optional Google scripts load only after consent is accepted.",
          "When active, those services may use cookies or similar identifiers for measurement or advertising according to their configuration, Google’s policies, and applicable law. Rejecting optional services keeps them from loading during that page session and does not disable core QR functionality.",
        ],
      },
      {
        heading: "Browser controls",
        paragraphs: [
          "Most browsers let you inspect, block, or delete cookies through privacy settings. Blocking essential storage can affect some websites, though the current Qraft generator is designed not to depend on an account or saved browser session.",
          "Browser settings do not control information sent when you choose to open an external destination from a QR code. The destination site applies its own cookie and privacy practices.",
        ],
      },
      {
        heading: "Updates to this policy",
        paragraphs: [
          "This policy will need revision if the website begins using analytics, advertising, account sessions, preference storage, or other technologies that change the description above. The effective date identifies the current version.",
        ],
      },
    ],
    slug: "cookie-policy",
    title: "Cookie Policy",
    updatedAt: "2026-08-09",
  },
};
