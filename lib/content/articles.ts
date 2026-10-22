export interface ContentLink {
  description: string;
  href: `/${string}`;
  label: string;
}

export interface ArticleTable {
  caption: string;
  headers: readonly string[];
  rows: ReadonlyArray<readonly string[]>;
}

export interface ArticleSection {
  bullets?: readonly string[];
  contextualLinks?: readonly ContentLink[];
  faqs?: ReadonlyArray<{
    answer: string;
    question: string;
  }>;
  heading: string;
  id: string;
  note?: string;
  paragraphs: readonly string[];
  table?: ArticleTable;
}

export interface ArticleImage {
  alt: string;
  height: number;
  src: `/images/${string}`;
  width: number;
}

export interface BlogArticle {
  description: string;
  excerpt: string;
  generators: ReadonlyArray<ContentLink>;
  image: ArticleImage;
  publishedAt: string;
  readingMinutes: number;
  sections: ReadonlyArray<ArticleSection>;
  slug: BlogArticleSlug;
  sources: ReadonlyArray<{ href: string; label: string }>;
  title: string;
  updatedAt: string;
}

export type BlogArticleSlug =
  | "how-to-create-a-qr-code"
  | "how-to-create-a-wifi-qr-code"
  | "do-qr-codes-expire"
  | "static-vs-dynamic-qr-codes"
  | "qr-code-size-guide"
  | "how-to-add-a-logo-to-a-qr-code"
  | "qr-code-error-correction-guide"
  | "how-to-test-a-qr-code"
  | "qr-code-color-contrast-guide"
  | "how-to-create-a-google-review-qr-code"
  | "how-to-create-a-whatsapp-qr-code-for-free"
  | "how-to-create-a-vcard-qr-code-for-a-digital-business-card"
  | "how-to-create-a-qr-code-menu-for-a-restaurant"
  | "how-to-create-a-qr-code-for-a-google-form"
  | "how-to-create-a-qr-code-for-a-pdf";

export const blogArticles: Record<BlogArticleSlug, BlogArticle> = {
  "how-to-create-a-qr-code": {
    description:
      "Learn how to create a reliable QR code, choose the right content type, test it properly, and export it for screens or print.",
    excerpt:
      "A practical start-to-finish guide to making a QR code that scans reliably and opens exactly what you intended.",
    image: {
      alt: "Three-step diagram showing QR content, customization, and a finished scan",
      height: 630,
      src: "/images/blog/how-to-create-a-qr-code.svg",
      width: 1200,
    },
    generators: [
      {
        description: "Encode a direct website destination and download PNG or SVG.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Compare every supported static format in one workspace.",
        href: "/qr-code-generator",
        label: "Open the free QR generator",
      },
      {
        description: "Share a message that can be read without opening a website.",
        href: "/text-qr-code-generator",
        label: "Create a text QR code",
      },
    ],
    publishedAt: "2026-08-09",
    readingMinutes: 7,
    sections: [
      {
        heading: "Start with the action after the scan",
        id: "choose-the-action",
        paragraphs: [
          "A useful QR code begins with a clear outcome. Decide whether a scan should open a web page, join a WiFi network, prepare a message, display plain text, or save contact details. Choosing the matching format matters because scanner apps recognize structured content such as URLs, phone numbers, and WiFi credentials differently.",
          "For a website, use the final public HTTPS address rather than a link copied from an editing screen or private dashboard. For structured formats, enter complete information: international phone numbers need a country code, while WiFi credentials must match the router exactly. Keep the payload as short as practical because more data creates a denser symbol with smaller modules at the same physical size.",
        ],
        bullets: [
          "Use URL for a page people can open in a browser.",
          "Use Text for information that should remain inside the QR code.",
          "Use a dedicated format for WiFi, email, SMS, phone, location, or contact details.",
          "Avoid placing sensitive information in a QR code that will be displayed publicly.",
        ],
      },
      {
        heading: "Enter and validate the content",
        id: "enter-content",
        paragraphs: [
          "Paste or type the destination into the matching generator. Qraftt validates common mistakes before rendering—for example, unsafe URL schemes, malformed email addresses, invalid coordinates, and incomplete phone numbers. Validation can confirm a format, but it cannot promise that an external page will stay online or that information on another service is correct.",
          "Review the destination as carefully as you would proofread printed copy. A static QR code stores the payload directly, so a typo becomes part of the downloaded symbol. If the destination changes later, you normally need to generate and print a new code.",
        ],
      },
      {
        heading: "Choose a readable design",
        id: "design-for-scanning",
        paragraphs: [
          "Dark modules on a light background remain the safest choice. Color is possible, but the foreground and background need strong contrast. Avoid transparent or visually busy backgrounds, and keep the clear margin around the symbol free of text, borders, and artwork.",
          "Error correction can help recover data when part of a code is dirty or damaged. Higher levels add redundancy, but they also make a code denser for the same payload. Medium is a sensible general starting point; use higher correction when the environment is demanding, then compensate with a larger printed code and thorough testing.",
        ],
        note:
          "A QR code that looks attractive but scans slowly is not finished. Readability is part of the design, not a final optional check.",
      },
      {
        heading: "Test the live preview and final file",
        id: "test-the-code",
        paragraphs: [
          "Scan the preview with more than one phone when possible. Confirm the exact destination, not just that the camera recognizes a QR code. For a URL, let the page load and check redirects. For a structured action, confirm the phone displays the expected network, recipient, number, or coordinates before accepting the action.",
          "Testing must continue after export. Print or place the code at its real size, on the real material, under realistic lighting, and scan from the distance people will use. Gloss, folds, curved packaging, low-resolution printing, and nearby artwork can all change performance even when the source file is valid.",
        ],
        bullets: [
          "Try iOS and Android cameras if the audience uses both.",
          "Test close up and at the expected viewing distance.",
          "Check bright, dim, and reflective lighting where relevant.",
          "Verify the destination again immediately before a large print run.",
        ],
      },
      {
        heading: "Download PNG or SVG for the job",
        id: "choose-file-format",
        paragraphs: [
          "PNG is convenient for documents, social posts, slide decks, and many everyday digital uses. Keep it at its original dimensions or reduce it carefully; enlarging a small raster image can blur module edges. SVG is usually the better handoff for professional print because it remains sharp at any scale.",
          "Keep a record of the encoded destination alongside the source file. Give files descriptive names, and store the editable artwork separately from the final print export. That small workflow makes later checks and replacements much easier.",
        ],
      },
      {
        heading: "A reliable QR code checklist",
        id: "checklist",
        paragraphs: [
          "Before publishing, make sure the code passes a short operational review. The most common QR failures are not mysterious technical problems; they are incorrect links, insufficient contrast, missing clear space, undersized printing, or destinations that require access the audience does not have.",
        ],
        bullets: [
          "The destination is correct, public when necessary, and mobile friendly.",
          "The payload uses the right QR content format.",
          "Foreground and background have strong contrast.",
          "A clear quiet zone surrounds all four sides.",
          "The exported file was tested at final size on multiple devices.",
        ],
      },
    ],
    slug: "how-to-create-a-qr-code",
    sources: [
      {
        href: "https://www.qrcode.com/en/howto/",
        label: "DENSO WAVE: How to introduce QR Codes",
      },
      {
        href: "https://www.qrcode.com/en/about/error_correction.html",
        label: "DENSO WAVE: Error correction feature",
      },
    ],
    title: "How to Create a QR Code",
    updatedAt: "2026-09-02",
  },
  "how-to-create-a-wifi-qr-code": {
    description:
      "Create a WiFi QR code safely with the correct network name, security type, password handling, testing, and placement guidance.",
    excerpt:
      "Share guest-network access without making visitors type a long password—and avoid the setup mistakes that cause failed joins.",
    image: {
      alt: "Phone scanning a WiFi QR code beside a router and wireless signal",
      height: 630,
      src: "/images/blog/how-to-create-a-wifi-qr-code.svg",
      width: 1200,
    },
    generators: [
      {
        description: "Enter the SSID, security type, and password locally in your browser.",
        href: "/wifi-qr-code-generator",
        label: "Create a WiFi QR code",
      },
      {
        description: "Give guests a separate page with policies or troubleshooting details.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Add a direct support chat beside the network sign.",
        href: "/whatsapp-qr-code-generator",
        label: "Create a WhatsApp QR code",
      },
    ],
    publishedAt: "2026-08-09",
    readingMinutes: 7,
    sections: [
      {
        heading: "What a WiFi QR code contains",
        id: "what-it-contains",
        paragraphs: [
          "A WiFi QR code is not a remote login service. It contains a structured text payload with the network name, security type, password when one is required, and an optional hidden-network flag. Compatible phones recognize that structure and offer to join the network after the person scans it.",
          "The convenience comes with an important consequence: the credentials are inside the code. Anyone who can scan, photograph, or decode a displayed WiFi QR code may be able to read the password. Use a guest network rather than exposing a private staff or infrastructure network.",
        ],
      },
      {
        heading: "Collect the exact network details",
        id: "collect-details",
        paragraphs: [
          "Find the network name, or SSID, in the router or access-point settings. Capitalization, spaces, punctuation, and hidden characters matter. Do not rely on a handwritten label if the network has been renamed since the router was installed.",
          "Match the security choice to the network configuration. WPA or WPA2 is common for password-protected guest networks, WEP is an older option, and an open network uses no password. If the SSID is hidden, enable the hidden-network setting; otherwise leave it off.",
        ],
        bullets: [
          "SSID: copy it exactly, including spaces and case.",
          "Security: choose the mode configured on the network.",
          "Password: enter the current guest password, not the router admin password.",
          "Hidden network: enable only when the SSID is intentionally hidden.",
        ],
      },
      {
        heading: "Generate the code locally",
        id: "generate-locally",
        paragraphs: [
          "Open the WiFi generator, enter the details, and watch the preview update. Qraftt escapes punctuation that has a special meaning in WiFi QR payloads, such as semicolons and backslashes. The completed code is created in the browser; the network name and password are not sent to a Qraftt database.",
          "Choose a high-contrast foreground and background. If the code will sit near a kitchen, workshop, reception desk, or outdoor area where it may become dirty, a higher error-correction level can help—but it can also make the symbol denser, so allow more physical space.",
        ],
      },
      {
        heading: "Test a real join, not just a scan",
        id: "test-the-join",
        paragraphs: [
          "Use a phone that is not already connected to the network. Scan the preview, accept the join prompt, and verify that the device receives access. A phone that remembers the network can hide an incorrect password because it may connect with credentials saved earlier.",
          "Repeat the test with at least one other device type if guests use a mix of iOS and Android. Then test the exported or printed version. If the camera sees the code but the join fails, recheck the SSID, security choice, password, and hidden-network setting before changing the visual design.",
        ],
        note:
          "Temporarily forget the network on a test device before scanning. That is the simplest way to prove the QR payload can complete a fresh connection.",
      },
      {
        heading: "Place and protect the code responsibly",
        id: "safe-placement",
        paragraphs: [
          "Display the code where intended guests can reach it, but avoid public windows, street-facing signs, or unrestricted online posts unless the network is designed for that exposure. A QR code does not add access control; it only makes the embedded credentials easier to use.",
          "Label the network clearly and provide a small amount of context, such as “Guest WiFi.” Keep the quiet zone clear, use a matte surface where possible, and place the sign where a phone can be held steady without blocking a queue or workspace.",
        ],
      },
      {
        heading: "Plan for password changes",
        id: "password-changes",
        paragraphs: [
          "A static WiFi QR code cannot update itself. When the SSID, password, or security mode changes, create a new code and replace every displayed copy. Remove old signs promptly so visitors do not waste time trying obsolete credentials.",
          "For a business, keep a short list of where codes are installed: reception, meeting rooms, menus, welcome books, and event displays. That inventory turns a password rotation from a scavenger hunt into a predictable maintenance task.",
        ],
      },
    ],
    slug: "how-to-create-a-wifi-qr-code",
    sources: [
      {
        href: "https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11",
        label: "ZXing: WiFi network QR payload format",
      },
      {
        href: "https://www.qrcode.com/en/about/error_correction.html",
        label: "DENSO WAVE: Error correction feature",
      },
    ],
    title: "How to Create a WiFi QR Code",
    updatedAt: "2026-09-02",
  },
  "do-qr-codes-expire": {
    description:
      "Understand when QR codes stop working, why static codes do not expire on their own, and how destinations, redirects, and print quality affect lifespan.",
    excerpt:
      "The pattern usually is not the part that expires. Learn what actually breaks and how to make a QR code last.",
    image: {
      alt: "Static QR code beside an infinity symbol and a destination warning clock",
      height: 630,
      src: "/images/blog/do-qr-codes-expire.svg",
      width: 1200,
    },
    generators: [
      {
        description: "Create a static code that stores the destination directly.",
        href: "/qr-code-generator",
        label: "Create a free static QR code",
      },
      {
        description: "Encode your final public URL without a Qraftt redirect.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Keep information inside the symbol instead of relying on a web page.",
        href: "/text-qr-code-generator",
        label: "Create a text QR code",
      },
    ],
    publishedAt: "2026-08-09",
    readingMinutes: 6,
    sections: [
      {
        heading: "The short answer",
        id: "short-answer",
        paragraphs: [
          "A standards-compliant static QR code does not contain a timer, renewal date, or account status. Its black-and-light pattern represents data. If that pattern remains readable, scanners can continue decoding the same data years later.",
          "What happens after decoding is a separate question. A URL can lead to an expired domain, deleted page, private file, or discontinued service. A managed or dynamic QR provider can disable its redirect. Printed material can fade or become damaged. People often describe all of those failures as an expired QR code, even though the underlying causes differ.",
        ],
      },
      {
        heading: "Static codes do not depend on a QR provider",
        id: "static-codes",
        paragraphs: [
          "A static URL QR code stores the destination itself. When someone scans it, the scanner reads that address and offers to open it. The generator does not need to stay online after the file is downloaded, and there is no subscription check built into the symbol.",
          "Static does not mean the destination is permanent. If you encode https://example.com/menu and later delete that page, the QR code still decodes correctly—it simply points to a page that no longer works. Keeping the same stable URL while updating its content is the most practical way to preserve long-lived printed codes.",
        ],
      },
      {
        heading: "Dynamic codes rely on a redirect service",
        id: "dynamic-codes",
        paragraphs: [
          "A dynamic QR code usually stores a short URL controlled by a service provider. The provider receives the scan and redirects the visitor to the current destination selected in an account dashboard. That design can support destination changes and scan analytics, but the printed code depends on the redirect domain, account, plan, and service continuing to work.",
          "If a trial ends, a subscription lapses, a provider closes, or a redirect is suspended, the code may stop reaching its target. The QR pattern still decodes; the managed link is what failed. Before using a dynamic product for permanent signage, understand its retention, pricing, export, and redirect policies.",
        ],
      },
      {
        heading: "Five reasons a QR code appears to expire",
        id: "failure-reasons",
        paragraphs: [
          "Most failures can be traced to the destination, an intermediary, or the physical symbol. Separating those layers makes troubleshooting much faster.",
        ],
        bullets: [
          "The encoded domain expired or its DNS configuration changed.",
          "The page, PDF, profile, or shared file was removed or made private.",
          "A dynamic redirect account or plan became inactive.",
          "The print faded, scratched, folded, or lost contrast against its background.",
          "The code was printed too small or altered in a way that damaged modules or quiet space.",
        ],
      },
      {
        heading: "How to build for a long lifespan",
        id: "long-lifespan",
        paragraphs: [
          "Use a domain and URL path you control when possible. A stable address such as yourdomain.com/guide can remain constant while the content behind it changes. Avoid temporary file-sharing URLs, preview links, session-based pages, and destinations that require your personal login.",
          "Keep the payload short, export SVG for professional print, preserve the four-module quiet zone, and choose materials suited to the environment. Maintain a simple inventory of permanent QR placements and test them on a schedule, especially after website migrations or domain changes.",
        ],
        bullets: [
          "Use the final HTTPS URL and verify it in a private browser window.",
          "Prefer a stable page on a domain your organization controls.",
          "Redirect that stable page at your own web host if content must move.",
          "Keep source files and a record of the encoded payload.",
          "Re-scan permanent signs after web, hosting, or branding changes.",
        ],
      },
      {
        heading: "How to diagnose a code that stopped working",
        id: "diagnose",
        paragraphs: [
          "First, scan the code with a reader that displays the decoded content before opening it. If it cannot decode at all, try the original digital file; a successful digital scan points to print damage, size, contrast, or lighting. If the payload decodes, copy the URL into a browser and inspect the error.",
          "A domain or page error needs a website fix. A permission screen needs a public-sharing change. A third-party redirect warning belongs to the dynamic provider. This layered check tells you whether the QR image must be replaced or the destination can be repaired without reprinting.",
        ],
      },
    ],
    slug: "do-qr-codes-expire",
    sources: [
      {
        href: "https://www.qrcode.com/en/about/index.html",
        label: "DENSO WAVE: What is a QR Code?",
      },
      {
        href: "https://www.qrcode.com/en/howto/trouble.html",
        label: "DENSO WAVE: QR code reading problems",
      },
    ],
    title: "Do QR Codes Expire?",
    updatedAt: "2026-09-02",
  },
  "static-vs-dynamic-qr-codes": {
    description:
      "Compare static and dynamic QR codes by destination control, editing, analytics, privacy, cost, reliability, and long-term use.",
    excerpt:
      "Static and dynamic codes can look identical, but the link architecture behind them creates very different tradeoffs.",
    image: {
      alt: "Comparison diagram of a direct static QR path and a redirected dynamic QR path",
      height: 630,
      src: "/images/blog/static-vs-dynamic-qr-codes.svg",
      width: 1200,
    },
    generators: [
      {
        description: "Generate a direct static destination with no account or redirect.",
        href: "/qr-code-generator",
        label: "Create a static QR code",
      },
      {
        description: "Store your website address directly in the downloadable symbol.",
        href: "/url-qr-code-generator",
        label: "Create a static URL QR code",
      },
      {
        description: "Encode offline-readable information with no web destination at all.",
        href: "/text-qr-code-generator",
        label: "Create a static text QR code",
      },
    ],
    publishedAt: "2026-08-09",
    readingMinutes: 8,
    sections: [
      {
        heading: "The difference is the destination architecture",
        id: "core-difference",
        paragraphs: [
          "Static and dynamic QR codes use the same QR symbol standard. The useful distinction is what data the symbol stores and whether an intermediary controls the route after a scan.",
          "A static URL code stores the final address, such as yoursite.com/menu. A dynamic product generally stores a short link owned or managed by a QR platform. That platform receives the visit, may record scan information, and redirects the visitor to a destination configured in an account.",
        ],
      },
      {
        heading: "Side-by-side comparison",
        id: "comparison",
        paragraphs: [
          "Neither model is universally best. Choose based on whether the destination must change after printing and whether you accept the cost, privacy, and availability implications of a managed redirect.",
        ],
        table: {
          caption: "Practical differences between static and dynamic QR codes",
          headers: ["Consideration", "Static", "Dynamic"],
          rows: [
            ["Encoded data", "Final content or URL", "Provider-controlled short URL"],
            ["Edit after printing", "No, unless your own URL stays stable", "Usually through a provider dashboard"],
            ["Provider dependency", "None after generation", "Redirect service must remain active"],
            ["Scan analytics", "Not built into the QR code", "Often available from the redirect provider"],
            ["Account or fee", "Not inherently required", "Commonly requires an account or paid plan"],
            ["Privacy exposure", "Scan goes to the destination", "Provider can receive redirect request data"],
          ],
        },
      },
      {
        heading: "When static is the stronger choice",
        id: "choose-static",
        paragraphs: [
          "Static codes are a good fit when the content is final, the destination is stable, or the code should work without an ongoing QR vendor. Examples include WiFi access, plain text, phone and email actions, vCards, permanent website addresses, and documents hosted at a URL you control.",
          "They are also easier to reason about from a privacy perspective. A direct code does not insert a QR analytics company between the scanner and the destination. The destination website can still receive normal web request data, but the generation provider is not required for the scan to complete.",
        ],
        bullets: [
          "You know the final payload before printing.",
          "You control a stable domain or page path.",
          "You do not need QR-platform scan analytics.",
          "You want no subscription or vendor lock-in.",
          "You are encoding structured data rather than a changeable web campaign.",
        ],
      },
      {
        heading: "When a managed redirect may be useful",
        id: "choose-dynamic",
        paragraphs: [
          "A dynamic service can be useful when a campaign destination must change after thousands of items are printed, or when aggregated scan reporting is essential and appropriate consent and privacy controls are in place. It can also shorten a very long destination, which may reduce QR density.",
          "Those benefits are operational, not magic properties of the QR symbol. Evaluate the provider as infrastructure: check its pricing, redirect speed, data retention, domain ownership, export options, uptime history, and what happens if an account is closed. A free trial is not a permanence guarantee.",
        ],
      },
      {
        heading: "A static code can still point to changeable content",
        id: "stable-url-strategy",
        paragraphs: [
          "If you control a website, encode a stable URL on your own domain and manage changes there. For example, yoursite.com/summer-menu can remain printed while you update the page or configure a server-side redirect under your control. The QR image stays static, but your web architecture provides flexibility.",
          "This approach preserves domain ownership and avoids a dedicated QR redirect vendor, though it still requires you to maintain the website and domain. Use a path intended to last, document where it is printed, and avoid coupling it to a temporary CMS preview address.",
        ],
        note:
          "“Static QR code” describes the encoded payload. It does not require the web page behind a URL to remain unchanged forever.",
      },
      {
        heading: "Questions to ask before printing",
        id: "decision-checklist",
        paragraphs: [
          "The cost of a QR decision is mostly the cost of replacing physical material. Answer these questions before a large print run, and test the complete scan path rather than judging only the QR image.",
        ],
        bullets: [
          "Who controls the encoded domain and how long will it be maintained?",
          "Must the destination change without reprinting?",
          "Are scan analytics truly needed, and is their collection appropriate?",
          "What happens when a subscription, account, or provider ends?",
          "Can the final destination load quickly and work well on a phone?",
          "Is there a documented owner responsible for testing permanent placements?",
        ],
      },
    ],
    slug: "static-vs-dynamic-qr-codes",
    sources: [
      {
        href: "https://github.com/zxing/zxing/wiki/Barcode-Contents#url",
        label: "ZXing: URL payloads in barcodes",
      },
      {
        href: "https://www.qrcode.com/en/about/standards.html",
        label: "DENSO WAVE: QR Code standardization",
      },
    ],
    title: "Static vs Dynamic QR Codes",
    updatedAt: "2026-09-02",
  },
  "qr-code-size-guide": {
    description:
      "Choose a practical QR code size for labels, cards, menus, flyers, posters, and signs while protecting module clarity and quiet space.",
    excerpt:
      "There is no single correct QR size. Use payload density, print quality, distance, material, and testing to choose one that scans reliably.",
    image: {
      alt: "QR code measured with rulers for labels, cards, and posters",
      height: 630,
      src: "/images/blog/qr-code-size-guide.svg",
      width: 1200,
    },
    generators: [
      {
        description: "Export a scalable SVG and test it at your final dimensions.",
        href: "/qr-code-generator",
        label: "Create a print-ready QR code",
      },
      {
        description: "Keep the encoded web address direct and as short as practical.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Build a table or counter menu code for close-range scanning.",
        href: "/menu-qr-code-generator",
        label: "Create a menu QR code",
      },
    ],
    publishedAt: "2026-08-09",
    readingMinutes: 8,
    sections: [
      {
        heading: "Size is really about module clarity",
        id: "module-clarity",
        paragraphs: [
          "A QR code is a grid of square modules. The symbol version determines how many modules appear on each side: Version 1 begins at 21 by 21, and larger versions add modules as the payload or error-correction requirement grows. Two QR codes printed at the same overall width can therefore have very different module sizes.",
          "Scanners need to distinguish individual modules. Long content, higher error correction, small physical dimensions, low-resolution output, ink spread, and poor focus all reduce the margin for error. That is why a universal minimum width is misleading without knowing the payload and production method.",
        ],
      },
      {
        heading: "Practical starting sizes",
        id: "starting-sizes",
        paragraphs: [
          "The ranges below are conservative starting points for short URL codes with strong contrast and normal phone cameras. They are not guarantees. Dense payloads, curved surfaces, poor lighting, greater scan distance, or low-quality printing may need substantially more space.",
        ],
        table: {
          caption: "Suggested starting widths before real-world testing",
          headers: ["Placement", "Starting width", "Typical scan condition"],
          rows: [
            ["Small labels or business cards", "25–30 mm", "Close, steady handheld scan"],
            ["Menus, handouts, and flyers", "30–40 mm", "Comfortable arm’s-length scan"],
            ["Counter and tabletop signs", "40–60 mm", "Short distance with varied lighting"],
            ["Posters", "60–100 mm or more", "Several steps away"],
            ["Walls, windows, and large signs", "Calculate and test on site", "Distance and glare dominate"],
          ],
        },
        note:
          "If space is tight, shorten the payload before shrinking the symbol. A stable short URL usually produces a less dense code than a long tracking address.",
      },
      {
        heading: "Preserve the four-module quiet zone",
        id: "quiet-zone",
        paragraphs: [
          "QR Code specifications require a clear margin four modules wide on every side. This quiet zone helps the scanner separate the symbol from surrounding text, images, borders, and patterns. It is part of the required code area, not optional whitespace that a designer can crop away.",
          "Because the quiet zone is measured in modules, its physical width changes with the module size. Keep it a plain light color consistent with the background and avoid placing a decorative frame inside it. When handing an SVG to a designer or printer, explicitly ask them to preserve the margin.",
        ],
      },
      {
        heading: "Match size to scanning distance",
        id: "scan-distance",
        paragraphs: [
          "A code on a handout is scanned differently from one above a reception desk. As distance increases, each module occupies fewer camera pixels and hand movement has a larger effect. Increase the code generously for posters and signs rather than treating a close-range scan on your monitor as proof.",
          "A common planning heuristic is to make the code width roughly one tenth of the intended scan distance, then increase it for dense codes or difficult conditions. Treat that ratio only as a first mockup. Mount a full-size proof in the real location and test with ordinary phones from the natural approach path.",
        ],
      },
      {
        heading: "Choose the right export and production method",
        id: "export-and-print",
        paragraphs: [
          "SVG is the safest format for professional printing because module edges remain crisp when the artwork is scaled. PNG works well for screens and office documents when used at sufficient resolution. Do not enlarge a small screenshot, apply smoothing, round the entire image, or convert it through a tool that introduces blur.",
          "Printing can change geometry. Ink may spread on absorbent paper, thermal printers can lose detail, folds can cross modules, and curved packaging can distort the grid. Matte surfaces are generally easier than glossy ones under strong light. For packaging or industrial use, involve the printer early and request a physical proof.",
        ],
        bullets: [
          "Prefer SVG for scalable print layouts.",
          "Keep every module square and aligned to the grid.",
          "Avoid gradients, low contrast, and transparent backgrounds.",
          "Do not place a fold, cut, hole, or seam through the symbol.",
          "Test the produced item, not only the design file.",
        ],
      },
      {
        heading: "Account for content and error correction",
        id: "density-and-correction",
        paragraphs: [
          "More content generally requires a higher QR version with more modules. At a fixed print width, those modules become smaller. Remove unnecessary URL parameters, avoid embedding long prose when a stable page will do, and use a purpose-built payload instead of improvised text where appropriate.",
          "Higher error correction adds recoverable redundancy and can help in demanding environments, but it also increases density. It is not permission to cover the code with a large logo or print it smaller. If you increase correction, re-evaluate the physical size and repeat the scan tests.",
        ],
      },
      {
        heading: "Final-size test protocol",
        id: "test-protocol",
        paragraphs: [
          "Export the actual payload and print a 100% scale proof. Test with multiple mainstream phones, from the intended distance and angle, in the lighting where the code will live. Scan repeatedly rather than accepting one lucky read, and confirm the destination after every major artwork revision.",
          "For a large run, test a production sample from the real printer and material. Keep the approved file and dimensions with the project record so later reprints do not accidentally crop the quiet zone or substitute a lower-quality source.",
        ],
      },
    ],
    slug: "qr-code-size-guide",
    sources: [
      {
        href: "https://www.qrcode.com/en/about/version.html",
        label: "DENSO WAVE: QR Code versions and module counts",
      },
      {
        href: "https://www.qrcode.com/en/howto/code.html/index.html",
        label: "DENSO WAVE: Code area and four-module quiet zone",
      },
      {
        href: "https://www.qrcode.com/en/howto/trouble.html",
        label: "DENSO WAVE: Common reading problems",
      },
    ],
    title: "QR Code Size Guide",
    updatedAt: "2026-09-02",
  },
  "how-to-add-a-logo-to-a-qr-code": {
    description:
      "Learn how to add a logo to a QR code without covering critical patterns, losing contrast, or making the finished code unreliable.",
    excerpt:
      "A logo can make a QR code recognizable, but only when its size, placement, error correction, and final testing protect the data underneath.",
    generators: [
      {
        description: "Upload a logo locally and export the finished design as PNG or SVG.",
        href: "/qr-code-generator",
        label: "Create a QR code with a logo",
      },
      {
        description: "Build a direct website QR code before applying brand styling.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Add a recognizable mark to a contact-sharing code.",
        href: "/vcard-qr-code-generator",
        label: "Create a vCard QR code",
      },
    ],
    image: {
      alt: "QR code with a centered logo, protected quiet zone, and safe-size guides",
      height: 630,
      src: "/images/blog/how-to-add-a-logo-to-a-qr-code.svg",
      width: 1200,
    },
    publishedAt: "2026-09-02",
    readingMinutes: 7,
    sections: [
      {
        heading: "Start with a working code",
        id: "start-with-working-code",
        paragraphs: [
          "Generate and test the QR code before adding any artwork. Confirm that its content is correct, that a URL is public and mobile friendly, and that the unstyled preview decodes quickly. This gives you a reliable baseline: if scanning becomes slower after customization, you know the design—not the payload—is responsible.",
          "A logo does not become part of the encoded destination. It is a visual layer placed over the center of the symbol. The data still lives in the surrounding modules, which means the logo must be treated as intentional damage that error correction may be able to recover from, not as a feature that scanners automatically ignore.",
        ],
      },
      {
        heading: "Use a simple, high-contrast logo file",
        id: "prepare-logo",
        paragraphs: [
          "Choose a compact square or nearly square mark with a clear silhouette. Detailed wordmarks, thin lettering, photographs, and wide horizontal logos become difficult to recognize at the small size available in a QR code. A transparent PNG or clean SVG source is ideal, although the final QR export format matters more than the upload format.",
          "Place the logo on a small solid backing shape when its colors could blend into the modules. The backing separates artwork from data and prevents a transparent logo from creating unpredictable edges. Keep the backing restrained: a large white disc can hide as much QR information as the artwork itself.",
        ],
        bullets: [
          "Use a simplified icon rather than a long wordmark.",
          "Remove unnecessary transparent padding around the artwork.",
          "Avoid tiny text that will disappear in print.",
          "Check that the mark remains recognizable in grayscale.",
        ],
      },
      {
        heading: "Keep the logo centered and conservatively sized",
        id: "safe-logo-size",
        paragraphs: [
          "The center is generally the safest location because it stays away from the three large finder patterns in the corners and the timing patterns that help a scanner understand the grid. Never cover a finder pattern, and avoid dragging artwork toward an edge simply to create a more unusual composition.",
          "There is no universal safe percentage for every QR code. Payload length, symbol version, error-correction level, module style, print size, and scanner quality all affect tolerance. Start smaller than the editor permits, increase only when necessary for recognition, and treat any logo-size warning as a reason to run more demanding tests rather than as a cosmetic suggestion.",
        ],
        note:
          "Qraftt keeps uploaded logos in the browser. The file is used to render your preview and export; it is not uploaded to a Qraftt account or media library.",
      },
      {
        heading: "Choose error correction deliberately",
        id: "logo-error-correction",
        paragraphs: [
          "Higher error correction stores more redundant information, giving a scanner a better chance of reconstructing data hidden by a central logo. For logo designs, Q or H is often a more appropriate starting point than L. Higher correction also creates a denser symbol, so the finished code may need to be physically larger.",
          "Error correction is not permission to cover arbitrary areas. Recovery estimates apply to damaged codewords, not to a perfectly convenient percentage of the visible square. A logo that crosses important structural patterns, a cropped quiet zone, or low contrast can still cause complete failure even at the highest level.",
        ],
      },
      {
        heading: "Protect contrast and quiet space",
        id: "contrast-and-quiet-zone",
        paragraphs: [
          "Keep dark data modules on a light, plain background and preserve the clear margin on every side. The logo should not introduce a large mid-tone area that makes nearby modules difficult to separate. If you also use a gradient or custom eye colors, verify that the lightest foreground area remains clearly darker than the background.",
          "Frames and calls to action belong outside the quiet zone. When a logo, frame, and decorative body style are combined, each choice consumes some of the reliability margin. Add them one at a time and test after every meaningful change instead of assuming that several individually acceptable options remain safe when stacked together.",
        ],
      },
      {
        heading: "Test the exported logo QR code",
        id: "test-logo-export",
        paragraphs: [
          "Scan the PNG and SVG exports, not only the live preview. Print at the final intended size and test ordinary phones from realistic angles and distances. Try bright and dim lighting, and include at least one older device when the code will serve a broad public audience.",
          "Confirm the decoded content on every test. A fast scan to the wrong destination is still a failed result. If performance is inconsistent, reduce the logo before changing several other settings at once. A smaller recognizable logo is more useful than prominent branding that makes the code unreliable.",
        ],
        bullets: [
          "Test without the logo to establish a baseline.",
          "Test both light and dark screen brightness when used digitally.",
          "Print a production proof on the actual material.",
          "Re-test after resizing or converting the exported artwork.",
        ],
      },
    ],
    slug: "how-to-add-a-logo-to-a-qr-code",
    sources: [
      {
        href: "https://www.qrcode.com/en/about/error_correction.html",
        label: "DENSO WAVE: QR Code error correction",
      },
      {
        href: "https://www.qrcode.com/en/howto/trouble.html",
        label: "DENSO WAVE: QR Code reading problems",
      },
    ],
    title: "How to Add a Logo to a QR Code Safely",
    updatedAt: "2026-09-02",
  },
  "qr-code-error-correction-guide": {
    description:
      "Understand QR error-correction levels L, M, Q, and H, what their recovery percentages mean, and how to choose a reliable level.",
    excerpt:
      "More error correction can help with dirt, damage, or a small logo—but it also increases density. Choose the level for the real environment.",
    generators: [
      {
        description: "Compare L, M, Q, and H while watching the live symbol update.",
        href: "/qr-code-generator",
        label: "Try QR error-correction levels",
      },
      {
        description: "Use a short destination to keep the symbol less dense.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Apply extra protection to a code used on tables or counters.",
        href: "/menu-qr-code-generator",
        label: "Create a menu QR code",
      },
    ],
    image: {
      alt: "Four QR error-correction levels from L to H restoring damaged modules",
      height: 630,
      src: "/images/blog/qr-code-error-correction-guide.svg",
      width: 1200,
    },
    publishedAt: "2026-09-02",
    readingMinutes: 7,
    sections: [
      {
        heading: "What error correction does",
        id: "what-error-correction-does",
        paragraphs: [
          "QR Codes include redundant data that can allow a scanner to reconstruct information when part of the symbol is dirty, scratched, faded, or obscured. This protection is built into the encoded symbol. It does not repair the printed material, and it cannot compensate for every kind of design or production problem.",
          "The four standard levels are L, M, Q, and H. DENSO WAVE describes approximate restoration capabilities of 7%, 15%, 25%, and 30% respectively. Those figures refer to codeword recovery and should not be interpreted as a safe instruction to cover that percentage of the visible QR area with a logo or illustration.",
        ],
      },
      {
        heading: "Compare L, M, Q, and H",
        id: "compare-levels",
        paragraphs: [
          "Level L uses the least redundancy and can produce a less dense code, making it useful in clean, controlled settings with an undamaged symbol. Level M is a balanced general-purpose default. Level Q adds more resilience for demanding print environments, while level H provides the most redundancy and is commonly considered when a conservative central logo is present.",
          "Increasing the level can force the data into a higher QR version with more modules. If the overall image stays the same physical size, every module becomes smaller. A higher level can therefore reduce reliability when a dense code is printed too small, even though it offers more theoretical damage recovery.",
        ],
        table: {
          caption: "QR error-correction levels and practical starting points",
          headers: ["Level", "Approximate recovery", "Typical starting point"],
          rows: [
            ["L", "About 7%", "Clean, controlled digital or print use"],
            ["M", "About 15%", "Balanced general use"],
            ["Q", "About 25%", "More demanding surfaces or a small logo"],
            ["H", "About 30%", "Maximum redundancy with careful sizing"],
          ],
        },
      },
      {
        heading: "Match the level to the environment",
        id: "match-environment",
        paragraphs: [
          "Consider how the code will be used. A digital code displayed at a generous size on a bright screen faces different risks from a label on outdoor equipment, a menu wiped several times a day, or packaging that can crease. Choose extra redundancy when partial physical damage is plausible, then increase print dimensions if the symbol becomes visibly denser.",
          "Error correction does not solve glare, weak foreground-to-background contrast, missing quiet space, camera blur, or a destination that no longer works. Those are separate layers of the scan experience. Address each directly rather than increasing the level and assuming the result is protected.",
        ],
      },
      {
        heading: "Use higher levels carefully with logos",
        id: "logos-and-levels",
        paragraphs: [
          "A centered logo hides modules in a concentrated area, so added redundancy may improve tolerance. Start with Q or H, keep the artwork small, and make sure it remains well away from finder, timing, and alignment patterns. A solid backing behind the logo can keep its edge visually distinct, but that backing also covers data and counts toward the obstruction.",
          "Do not estimate safety by measuring only the logo width. Two codes with the same visual logo percentage can have different versions, module layouts, and encoded lengths. The practical test is whether the complete exported design decodes consistently under realistic conditions.",
        ],
      },
      {
        heading: "Balance payload length, density, and size",
        id: "balance-density",
        paragraphs: [
          "Shorter payloads generally need fewer modules. For a web destination, remove unnecessary tracking parameters or use a stable path on a domain you control. For contact or calendar information, include the fields people genuinely need instead of filling every optional property. Do not use an untrusted shortener simply to shrink a code; the reliability of that redirect becomes part of the scan path.",
          "If a high correction level produces a dense symbol, allocate more physical space rather than forcing it into a small label. Export SVG for professional print so the module edges remain sharp, preserve the quiet zone, and avoid image-processing steps that introduce blur or antialiasing around the grid.",
        ],
      },
      {
        heading: "Validate the choice with real scans",
        id: "validate-level",
        paragraphs: [
          "Generate representative versions at M, Q, and H and print each at the planned dimensions. Test with multiple phones in the intended lighting and from the natural scanning distance. If all versions work, choose the simplest one that leaves a healthy reliability margin rather than automatically selecting the maximum.",
          "Repeat the test after applying a logo, frame, gradient, or unusual body pattern. Test the actual PNG or SVG placed in the final layout, because resizing and surrounding artwork can change the outcome. Error correction is useful engineering protection, but only end-to-end testing shows whether the complete design works.",
        ],
      },
    ],
    slug: "qr-code-error-correction-guide",
    sources: [
      {
        href: "https://www.qrcode.com/en/about/error_correction.html",
        label: "DENSO WAVE: Error correction feature",
      },
      {
        href: "https://www.qrcode.com/en/about/version.html",
        label: "DENSO WAVE: QR Code versions",
      },
    ],
    title: "QR Code Error Correction: L, M, Q, and H Explained",
    updatedAt: "2026-09-02",
  },
  "how-to-test-a-qr-code": {
    description:
      "Use a practical QR code testing checklist for content, phones, print size, lighting, placement, exports, and destination reliability.",
    excerpt:
      "A preview scan is only the first check. Test the exported code at final size, in its real setting, and on the devices your audience uses.",
    generators: [
      {
        description: "Create and export a code for the complete testing workflow.",
        href: "/qr-code-generator",
        label: "Create a QR code to test",
      },
      {
        description: "Verify a public destination and every redirect in its path.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Test joining with a device that has forgotten the network.",
        href: "/wifi-qr-code-generator",
        label: "Create a WiFi QR code",
      },
    ],
    image: {
      alt: "Phone testing a printed QR code under different sizes, angles, and lighting",
      height: 630,
      src: "/images/blog/how-to-test-a-qr-code.svg",
      width: 1200,
    },
    publishedAt: "2026-09-02",
    readingMinutes: 8,
    sections: [
      {
        heading: "Verify the payload before styling",
        id: "verify-payload",
        paragraphs: [
          "Start with the plain generated code and scan it using a camera or reader that lets you inspect the decoded value. Confirm every character, especially domain names, phone country codes, WiFi network names, email recipients, dates, and geographic coordinates. Validation can catch malformed input, but it cannot know whether a public destination is the one you intended.",
          "For a URL, open the complete path and let every redirect finish. Test while signed out or in a private browser window so your own account does not hide a permission problem. For structured actions such as SMS, phone, email, calendar, and vCard, check the prepared fields before approving the action on the device.",
        ],
      },
      {
        heading: "Test the exported PNG and SVG",
        id: "test-exports",
        paragraphs: [
          "The live preview proves that the current browser can render the design, but the downloaded file is what will actually be published. Open the PNG and SVG independently, scan both, and compare the colors, frame, logo, quiet zone, and encoded destination with the preview.",
          "Place the export in the real design application or document and test again. Some workflows rasterize SVG files, compress PNGs, trim transparent margins, or resample images when they are uploaded. A code that worked before layout can fail after those transformations, so treat the final composed asset as a separate test item.",
        ],
      },
      {
        heading: "Test at final physical size",
        id: "final-size",
        paragraphs: [
          "Print at 100% scale using the intended dimensions. Do not rely on zooming the image on a monitor, because a screen test does not reproduce printer resolution, ink spread, paper texture, lamination, folds, or curvature. Keep the required quiet margin intact and measure the final code after any trimming or finishing.",
          "Try the natural scanning distance. A business-card code is held close and steady; a poster may be scanned while walking or from several meters away. If the camera needs repeated attempts, increase the code size or simplify the payload and design before approving production.",
        ],
        bullets: [
          "Test the smallest planned reproduction, not only the largest.",
          "Use the real paper, label, screen, or packaging material.",
          "Check that no fold, seam, cut, or fixture crosses the symbol.",
          "Confirm surrounding artwork does not enter the quiet zone.",
        ],
      },
      {
        heading: "Cover devices, cameras, and apps",
        id: "device-coverage",
        paragraphs: [
          "Use more than one phone model and include both iOS and Android when they represent the audience. Older or lower-cost cameras can have more difficulty with dense modules, glare, autofocus, and low light. If the content relies on an installed app, also test what happens when that app is absent.",
          "Different scanners can interpret structured payloads differently. A calendar reader may display times in another zone, a contact app may rearrange fields, and a desktop computer may not have a phone or SMS handler. Define the supported experience before testing so platform limitations are not confused with an invalid QR symbol.",
        ],
      },
      {
        heading: "Reproduce the real environment",
        id: "real-environment",
        paragraphs: [
          "Evaluate bright sun, dim rooms, backlit displays, reflective surfaces, and likely viewing angles. Mount a full-size proof where it will live. A code behind glass can reflect overhead lights; one on a curved bottle may distort at the edges; one beside a queue may be difficult to approach without blocking other people.",
          "Check the network experience too. A code can decode perfectly while its destination loads too slowly on weak venue WiFi or mobile data. Compress web pages and linked files, avoid login-only content unless intentional, and make sure the landing page is usable at phone width.",
        ],
      },
      {
        heading: "Record and repeat the approval test",
        id: "approval-record",
        paragraphs: [
          "Document the payload, export filename, print dimensions, correction level, test devices, and approval date. Keep that record with the source artwork. It prevents a later edit from silently substituting a different URL, lower-resolution image, or cropped version during reprints.",
          "Retest whenever the destination, domain, print vendor, material, placement, or visual design changes. Permanent QR signs also need periodic destination checks. The pattern may remain readable for years while the linked page, shared file, account permission, or redirect changes underneath it.",
        ],
        note:
          "A test is complete only when the final artifact decodes the correct content and the destination or device action succeeds in the real use case.",
      },
    ],
    slug: "how-to-test-a-qr-code",
    sources: [
      {
        href: "https://www.qrcode.com/en/howto/trouble.html",
        label: "DENSO WAVE: QR Code reading problems",
      },
      {
        href: "https://www.qrcode.com/en/howto/code.html/index.html",
        label: "DENSO WAVE: QR Code area and margin",
      },
    ],
    title: "How to Test a QR Code Before Printing",
    updatedAt: "2026-09-02",
  },
  "qr-code-color-contrast-guide": {
    description:
      "Choose QR code foreground, background, and gradient colors that fit a brand while preserving contrast and reliable scanning.",
    excerpt:
      "QR codes do not have to be black and white, but color choices must keep modules distinct from the background in every final format.",
    generators: [
      {
        description: "Adjust foreground, background, and gradients with live contrast feedback.",
        href: "/qr-code-generator",
        label: "Customize QR code colors",
      },
      {
        description: "Create a branded direct-link code and test the destination.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Design a review code for signs, receipts, or counter cards.",
        href: "/google-review-qr-code-generator",
        label: "Create a Google Review QR code",
      },
    ],
    image: {
      alt: "QR code color swatches comparing safe high contrast with unsafe low contrast",
      height: 630,
      src: "/images/blog/qr-code-color-contrast-guide.svg",
      width: 1200,
    },
    publishedAt: "2026-09-02",
    readingMinutes: 7,
    sections: [
      {
        heading: "Preserve a dark-on-light relationship",
        id: "dark-on-light",
        paragraphs: [
          "A scanner must distinguish data modules from the spaces around them. The most dependable arrangement is a dark foreground on a light, plain background. Color is acceptable when that luminance relationship remains obvious, but two hues that look different to a person may still have similar brightness and produce weak machine-readable contrast.",
          "Avoid reversing the code to light modules on a dark field unless extensive testing proves the exact implementation works across the target devices. Some readers handle inversion, but broad public compatibility is stronger when the code follows the expected dark-on-light pattern.",
        ],
      },
      {
        heading: "Judge contrast across the whole design",
        id: "whole-design-contrast",
        paragraphs: [
          "Check the lightest part of the foreground against the darkest part of the background. This matters especially for gradients: a design can look strong at one corner while modules nearly disappear at another. Finder-pattern colors, inner eyes, outer eyes, and body modules all need to remain distinct.",
          "Screen brightness can disguise a weak palette. Test a screenshot or export on a dim phone, an ordinary office printer, and the intended material. If a grayscale version makes the modules blend into the background, the palette has little safety margin even if it scans under ideal conditions.",
        ],
      },
      {
        heading: "Use gradients conservatively",
        id: "safe-gradients",
        paragraphs: [
          "A simple gradient between two dark foreground colors is safer than one that crosses through pale or highly saturated areas. Keep the background uniform and light. Avoid gradients that create a bright stripe through a finder pattern or make one region of the data grid substantially weaker than the rest.",
          "Gradient direction changes which modules receive each color. Re-test whenever endpoints or direction change, and inspect the actual SVG as well as the raster PNG. Color-management and print conversion can shift values, especially when a design moves from an RGB screen workflow to commercial printing.",
        ],
      },
      {
        heading: "Keep the quiet zone visually quiet",
        id: "quiet-zone-color",
        paragraphs: [
          "The clear margin around a QR code helps a reader isolate the symbol. Give it the same plain light color as the QR background and keep patterns, photographs, text, borders, and shadows outside it. A decorative frame can surround the code, but the protected margin must remain between the data grid and that artwork.",
          "Transparency is unpredictable because the effective background changes wherever the code is placed. A transparent export may be readable on a white page and fail on a photograph or colored panel. Use a defined opaque background for public print unless every placement is controlled and tested.",
        ],
      },
      {
        heading: "Account for print and material changes",
        id: "print-color",
        paragraphs: [
          "Ink spread can make modules merge, while low toner or absorbent stock can soften their edges. Glossy lamination, metallic material, screens behind glass, and direct sunlight add reflections that reduce effective contrast. A palette approved on a calibrated monitor is not automatically approved for production.",
          "Request a physical proof at final size. Test under the actual lighting and from the expected distance. If the brand palette is too light, use a darker approved shade for the QR foreground rather than forcing the primary brand color into a technical role it cannot perform reliably.",
        ],
      },
      {
        heading: "Use a practical color approval checklist",
        id: "color-checklist",
        paragraphs: [
          "Start from black on white, change one design variable at a time, and scan after each change. Use the editor warning as an early signal, not a certification. The finished code still needs device and production testing because contrast calculations cannot model blur, glare, distance, or every scanner algorithm.",
          "Save the chosen color values with the source design and verify both PNG and SVG exports. If another person or printer modifies the artwork, compare the final values and scan again. Reliability depends on the delivered asset, not the version that originally passed in the browser.",
        ],
        bullets: [
          "Use dark modules on an opaque light background.",
          "Keep both gradient endpoints safely dark.",
          "Check the entire symbol in grayscale.",
          "Preserve the quiet zone on all four sides.",
          "Test the final material and lighting, not only the preview.",
        ],
      },
    ],
    slug: "qr-code-color-contrast-guide",
    sources: [
      {
        href: "https://www.qrcode.com/en/howto/trouble.html",
        label: "DENSO WAVE: QR Code reading problems",
      },
      {
        href: "https://www.qrcode.com/en/howto/code.html/index.html",
        label: "DENSO WAVE: QR Code area and margin",
      },
    ],
    title: "QR Code Color and Contrast Guide",
    updatedAt: "2026-09-02",
  },
  "how-to-create-a-google-review-qr-code": {
    description:
      "Learn how to create a Google Review QR code from an official review-request link, test it signed out, and place it responsibly.",
    excerpt:
      "Turn the correct Google Business Profile review link into a static QR code, then test the customer journey before printing it.",
    generators: [
      {
        description: "Encode an official Google review or supported Maps link directly.",
        href: "/google-review-qr-code-generator",
        label: "Create a Google Review QR code",
      },
      {
        description: "Link to a stable public page when a dedicated review link is unavailable.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
      {
        description: "Pair the review request with a digital menu for hospitality use.",
        href: "/menu-qr-code-generator",
        label: "Create a menu QR code",
      },
    ],
    image: {
      alt: "Customer phone opening a five-star Google review prompt from a counter QR code",
      height: 630,
      src: "/images/blog/how-to-create-a-google-review-qr-code.svg",
      width: 1200,
    },
    publishedAt: "2026-09-02",
    readingMinutes: 7,
    sections: [
      {
        heading: "Use the official review-request destination",
        id: "official-review-link",
        paragraphs: [
          "A direct review-request link is different from a normal Google Maps listing link. The review-request destination is intended to open the rating and review flow for the selected Business Profile, while a general Maps link may open the listing first and require the customer to find the review action.",
          "Retrieve the link from the Business Profile you manage or use an official review link already provided for that location. Qraftt accepts supported Google review and Maps URL formats and encodes the destination directly. It does not create, manage, or verify the Business Profile itself.",
        ],
      },
      {
        heading: "Confirm the business and location",
        id: "confirm-business",
        paragraphs: [
          "Open the link before generating the code and confirm the exact business name, address, and location. Multi-location organizations should keep a separate reviewed link for each branch; a valid Google URL can still point to the wrong listing if it was copied from another location.",
          "Test in a private browser window and on a phone that is not relying on your business-manager session. Customers must be signed in to a Google account to leave a Google review. The link may open in the Google Maps app or a browser depending on the device, installed apps, and user settings.",
        ],
      },
      {
        heading: "Create and customize the static code",
        id: "create-static-code",
        paragraphs: [
          "Paste the verified review link into the Google Review generator. The live QR is created in the browser, and the downloaded static symbol stores that Google destination directly. Scans do not pass through a Qraftt redirect, account, or subscription after the code is downloaded.",
          "Use a clear frame or short call to action so people know what the code does before scanning. Keep the modules dark, the background light, and the quiet zone unobstructed. A small logo can help recognition, but the design still needs to be tested at the intended print size.",
        ],
      },
      {
        heading: "Choose respectful placements",
        id: "review-placement",
        paragraphs: [
          "Place the code where a customer can respond voluntarily after a real interaction: a receipt, thank-you card, counter sign, appointment follow-up, table card, or post-service message. Provide enough space for a phone to focus without forcing someone to hold up a queue.",
          "Do not obstruct the review process, pressure people for a particular rating, or offer incentives that conflict with platform policies. A neutral request for honest feedback is clearer and more trustworthy than language that asks only satisfied customers to participate.",
        ],
        bullets: [
          "Use one code per location and label it clearly.",
          "Keep the code large enough for the expected scanning distance.",
          "Avoid glossy placements with direct overhead glare.",
          "Give customers context before they scan.",
        ],
      },
      {
        heading: "Test the complete review journey",
        id: "test-review-journey",
        paragraphs: [
          "Scan the exported PNG and SVG on both iOS and Android when possible. Confirm that the correct listing appears and that the review interface can be reached. Test signed out to understand the login prompt, then sign in with a non-manager account if you need to verify the complete customer flow.",
          "If the code opens only a listing, you may have encoded a general Maps link rather than the direct review-request link. If it opens the wrong business, retrieve a fresh link from the correct profile. If nothing loads, check network access, URL completeness, app updates, and whether Google has changed or disabled the destination.",
        ],
      },
      {
        heading: "Maintain printed review codes",
        id: "maintain-review-code",
        paragraphs: [
          "A static Google Review QR code cannot change its destination after printing. If the review URL, listing, business ownership, or location changes, generate a new code and replace the printed copies. Keep a simple inventory of every receipt template, sign, card, and digital file where the code appears.",
          "Scan permanent placements periodically and after any Business Profile change. The QR pattern does not expire by itself, but the external Google destination remains outside Qraftt's control. Regular checks catch renamed, merged, suspended, or otherwise changed listings before customers encounter a dead end.",
        ],
        note:
          "The QR code makes the correct destination easier to reach; it does not submit a rating, guarantee a review, or bypass Google account and policy requirements.",
      },
    ],
    slug: "how-to-create-a-google-review-qr-code",
    sources: [
      {
        href: "https://support.google.com/business/answer/3474122",
        label: "Google Business Profile Help: Get more reviews",
      },
      {
        href: "https://support.google.com/contributionpolicy/answer/7400114",
        label: "Google Maps: Prohibited and restricted content",
      },
    ],
    title: "How to Create a Google Review QR Code",
    updatedAt: "2026-09-02",
  },
  "how-to-create-a-whatsapp-qr-code-for-free": {
    description:
      "Learn how to create a WhatsApp QR code for free with no signup, format the international number correctly, add a prefilled message, and test every scan.",
    excerpt:
      "Create a free WhatsApp QR code that opens the right chat with an optional editable message—without an account or hosted redirect.",
    image: {
      alt: "Illustrated phone opening a WhatsApp chat after scanning a QR code",
      height: 630,
      src: "/images/blog/how-to-create-a-whatsapp-qr-code-for-free.svg",
      width: 1200,
    },
    generators: [
      {
        description:
          "Enter an international number, add an optional message, and download the finished QR code.",
        href: "/whatsapp-qr-code-generator",
        label: "Create a free WhatsApp QR code",
      },
      {
        description:
          "Explore all supported static QR formats in the same free, browser-based workspace.",
        href: "/qr-code-generator",
        label: "Open the free QR code generator",
      },
      {
        description:
          "Create a standard SMS draft when WhatsApp is not the right channel.",
        href: "/sms-qr-code-generator",
        label: "Create an SMS QR code",
      },
    ],
    publishedAt: "2026-09-03",
    readingMinutes: 7,
    sections: [
      {
        heading: "The quickest no-signup method",
        id: "direct-answer",
        paragraphs: [
          "To create a WhatsApp QR code for free, enter a WhatsApp-registered phone number in full international format, add an optional prefilled message, preview the result, and download PNG or SVG. Qraftt creates the static code locally in your browser, requires no signup, and encodes a direct wa.me destination rather than sending scanners through a Qraftt redirect.",
          "When someone scans the code, WhatsApp can open the matching conversation in the installed app or hand the link to WhatsApp Web or a browser. The message is placed in the compose field for review; scanning does not send it automatically. The recipient number must have an active WhatsApp account for the intended chat to open.",
        ],
        contextualLinks: [
          {
            description:
              "Enter the destination and optional message in Qraftt’s free browser-based tool.",
            href: "/whatsapp-qr-code-generator",
            label: "Open the WhatsApp QR generator",
          },
          {
            description:
              "Compare WhatsApp with every other supported static QR format.",
            href: "/qr-code-generator",
            label: "Explore the QR code generator",
          },
        ],
        note:
          "Ready to make one? Use the WhatsApp QR generator linked below, then test the downloaded file before publishing it.",
      },
      {
        heading: "How to create a WhatsApp QR code step by step",
        id: "step-by-step",
        paragraphs: [
          "First, choose the WhatsApp generator and enter the recipient number with its country code. Use digits only in the final destination: omit the plus sign, spaces, brackets, dashes, and a domestic trunk prefix that is not part of the international number. For example, the US number +1 (202) 555-0147 becomes 12025550147 in the wa.me destination.",
          "Second, write an optional opening message. Keep it short enough for a customer to understand and edit easily. Qraftt safely URL-encodes spaces, punctuation, line breaks, and other supported characters when it builds the wa.me link. Review names, dates, order references, and calls to action before generating printed material.",
          "Third, scan the live preview and confirm the correct conversation and draft appear. Customize the design without weakening contrast or covering the quiet zone, then download PNG for common digital uses or SVG for scalable print. Test the exported file on representative iPhone and Android devices whenever possible.",
        ],
        bullets: [
          "Enter a complete international phone number.",
          "Add a concise optional message that remains editable.",
          "Confirm the destination in the live preview.",
          "Download and test the final PNG or SVG at its intended size.",
        ],
      },
      {
        heading: "Useful WhatsApp QR code use cases",
        id: "use-cases",
        paragraphs: [
          "A WhatsApp QR code is most useful when a person sees something offline and needs a quick route into a specific conversation. A shop can place one near customer support information, a service professional can add one to a business card, and an event organizer can use one for attendee questions. The nearby wording should identify who receives the message and what kind of help is available.",
          "Prefilled text reduces repetitive typing without locking the sender into a final message. Restaurants can suggest a reservation request, sellers can identify a product enquiry, and appointment-based businesses can prompt a preferred date. Avoid placing confidential order details or personal information in a reusable public code because anyone can decode its number and message.",
        ],
        bullets: [
          "Customer-service and product-enquiry signs.",
          "Business cards, brochures, packaging, and invoices.",
          "Reservation, appointment, and availability requests.",
          "Event information desks and attendee support materials.",
        ],
      },
      {
        heading: "Common mistakes that stop WhatsApp QR codes working",
        id: "common-mistakes",
        paragraphs: [
          "The most common error is an incomplete or incorrectly formatted number. A local number without a country code may work only in familiar contexts, while leading zeros, punctuation, or a copied display format can produce the wrong wa.me destination. Format validation can catch obvious problems, but it cannot confirm that a number is real, active, or registered on WhatsApp.",
          "A correct link can still behave differently across devices. A phone may open the WhatsApp app, a desktop may offer WhatsApp Web, and a device without a compatible app may show a browser handoff or installation prompt. Private browsing, login state, organizational device restrictions, outdated software, and unsupported scanners can also interrupt the journey.",
          "Long messages create longer URLs and denser QR patterns. Extremely detailed drafts are harder to review and can reduce scanning tolerance when the code is printed too small. Shorten the message, use strong dark-on-light contrast, preserve clear space, and test the actual printed material rather than relying only on an on-screen preview.",
        ],
      },
      {
        heading: "Privacy, printing, and static QR code limits",
        id: "privacy-and-printing",
        paragraphs: [
          "The phone number and prefilled message are part of the encoded destination. Anyone who scans or decodes a publicly displayed QR code can read them, so use a business contact number where appropriate and exclude passwords, private customer data, or sensitive identifiers. Qraftt generates the payload locally and does not require an account to create or download it.",
          "Because the code is static, its number and message cannot be changed after printing. If the contact number changes, the WhatsApp account is removed, or the campaign needs different wording, generate a new QR code and replace every published copy. The QR pattern itself does not depend on Qraftt after download, but WhatsApp and internet access are still required to open the conversation.",
          "For print, keep a clear quiet zone on all four sides and use enough physical size for the expected scanning distance. Avoid folds, curved edges, reflective finishes, and low-contrast color combinations. Scan the final proof under realistic lighting before ordering a large print run.",
        ],
      },
      {
        heading: "WhatsApp QR code FAQ",
        id: "faq",
        paragraphs: [],
        faqs: [
          {
            question:
              "Is this WhatsApp QR code generator free and available without signup?",
            answer:
              "Yes. Qraftt lets you create, customize, and download a static WhatsApp QR code without an account, subscription, or mandatory payment.",
          },
          {
            question: "Does scanning send the WhatsApp message automatically?",
            answer:
              "No. The scan opens a chat with an optional prefilled draft. The person can review, edit, or discard the message before choosing to send it.",
          },
          {
            question: "Can I use a WhatsApp Business number?",
            answer:
              "Yes, provided the number is active on WhatsApp and entered in the correct international format. Test the finished code to confirm it opens the intended business conversation.",
          },
          {
            question: "Can I change the number or message after printing?",
            answer:
              "No. A static QR code stores its destination directly, so changing the number or draft requires a newly generated and reprinted code.",
          },
          {
            question:
              "Why does my WhatsApp QR code not open the intended chat?",
            answer:
              "Check the country code, remove spaces and punctuation, confirm the number is registered on WhatsApp, shorten malformed message text, and test the app or browser handoff on another device.",
          },
        ],
      },
    ],
    slug: "how-to-create-a-whatsapp-qr-code-for-free",
    sources: [
      {
        href: "https://faq.whatsapp.com/5913398998672934",
        label: "WhatsApp Help Center: How to use click to chat",
      },
      {
        href: "https://www.itu.int/rec/T-REC-E.164/en",
        label: "ITU-T E.164: International telephone numbering plan",
      },
    ],
    title: "How to Create a WhatsApp QR Code for Free",
    updatedAt: "2026-09-03",
  },
  "how-to-create-a-vcard-qr-code-for-a-digital-business-card": {
    description:
      "Learn how to create a vCard QR code for a digital business card, choose useful contact fields, protect private details, and export a reliable PNG or SVG.",
    excerpt:
      "Build a scannable digital business card that opens a saveable contact record—free, static, and created locally without signup.",
    image: {
      alt: "Digital business card with a vCard QR code and saveable contact details",
      height: 630,
      src: "/images/blog/how-to-create-a-vcard-qr-code-for-a-digital-business-card.svg",
      width: 1200,
    },
    generators: [
      {
        description:
          "Create a vCard 4.0 contact code with a name, mobile phone, email, company, title, and website.",
        href: "/vcard-qr-code-generator",
        label: "Create a free vCard QR code",
      },
      {
        description:
          "Compare vCard with every other supported static QR format in Qraftt.",
        href: "/qr-code-generator",
        label: "Open the free QR code generator",
      },
      {
        description:
          "Create a separate code that opens an editable email draft.",
        href: "/email-qr-code-generator",
        label: "Create an email QR code",
      },
    ],
    publishedAt: "2026-09-03",
    readingMinutes: 8,
    sections: [
      {
        heading: "Turn contact details into a saveable record",
        id: "direct-answer",
        paragraphs: [
          "To create a vCard QR code for a digital business card, enter the contact name and the professional details you want to share, review the generated record, customize the QR design, and download PNG or SVG. On compatible scanners, the code opens a contact record that the person can review and choose to save; scanning does not add the contact automatically.",
          "Qraftt creates a standards-based vCard 4.0 payload locally in the browser. The downloaded static QR code contains the contact data directly, so it does not need a Qraftt account, subscription, hosted profile, or redirect after download. That independence is useful for printed business cards, but it also means the encoded details cannot be edited later without generating a new code.",
        ],
        contextualLinks: [
          {
            description:
              "Build the contact record, preview it, and export a customized PNG or SVG.",
            href: "/vcard-qr-code-generator",
            label: "Open the vCard QR generator",
          },
          {
            description:
              "Explore all 30 static QR formats available without signup.",
            href: "/qr-code-generator",
            label: "Explore the QR code generator",
          },
        ],
        note:
          "A vCard QR code is a portable contact file, not a hosted digital profile. Test how the record appears before printing it.",
      },
      {
        heading: "How to create a vCard QR code step by step",
        id: "step-by-step",
        paragraphs: [
          "First, enter at least the first or last name exactly as it should appear in someone’s address book. Add only the mobile number, email address, company, job title, and website that belong to the intended contact. Use a role-based business email or public work number when the card will be distributed widely.",
          "Second, format the mobile phone with its international country code so it remains useful across regions. Qraftt accepts common visual separators and checks the allowed format and 7–15 digit length, but it cannot verify that the number is real, active, or owned by the named person. Open the website and send a test email before finalizing the record.",
          "Third, scan the live preview with more than one compatible camera or QR scanner. Confirm that the contact name, mobile label, organization, title, email, and website appear sensibly. Choose a high-contrast design, keep the quiet zone clear, then export PNG for common digital placement or SVG for scalable professional printing.",
        ],
        bullets: [
          "Enter the contact name as it should be saved.",
          "Add and verify only the fields you intend to publish.",
          "Test the contact preview on representative phones.",
          "Download the final file and test it at its printed size.",
        ],
      },
      {
        heading: "Choose the right contact fields",
        id: "contact-field-guidance",
        paragraphs: [
          "A useful digital business card is selective rather than exhaustive. The name identifies the record, while the organization and job title provide context. A mobile phone supports direct contact, an email address supports longer enquiries, and a website can lead to a portfolio, booking page, or company profile. Blank optional fields are omitted from Qraftt’s payload.",
          "The current Qraftt vCard uses the mobile-phone type for its phone field. Enter a complete international mobile number such as +44 7700 900123, then verify every digit. Use an HTTPS website address that opens publicly on mobile, and avoid editing, admin, intranet, or login-only links that recipients may not be able to access.",
          "Different contact and scanner apps can display vCard 4.0 fields in different orders or omit labels they do not support. Special characters are escaped in the payload, but rendering still depends on the receiving software. A logo added through Qraftt’s design controls decorates the QR artwork only; it does not become a photo inside the saved contact record.",
        ],
      },
      {
        heading: "Digital business card QR code use cases",
        id: "business-card-use-cases",
        paragraphs: [
          "A QR code business card can supplement printed details without forcing someone to type them. Place it on a physical card with a short label such as “Save my contact,” while keeping the human-readable name, role, and at least one contact method nearby. The printed text still helps when a camera is unavailable or a scanner handles the vCard differently.",
          "The same contact code can appear on conference badges, proposals, presentation closing slides, reception counters, product inserts, or professional portfolios. Use a person-specific vCard for individual networking and a role-based contact when staff turnover would otherwise make printed material obsolete quickly.",
        ],
        bullets: [
          "Printed cards for networking and client meetings.",
          "Conference badges, exhibitor signs, and speaker slides.",
          "Proposals, portfolios, invoices, and service documents.",
          "Reception desks and customer-facing contact displays.",
        ],
      },
      {
        heading: "Privacy and static QR code limitations",
        id: "privacy-and-static-limits",
        paragraphs: [
          "Every contact field is encoded directly inside the QR symbol. Anyone who photographs, scans, or decodes a publicly shared card can read those details, even if they never save the contact. Do not include a private home address, personal number, confidential note, password, or any information you would not publish openly.",
          "Generation happens locally in the browser, and the downloaded code does not depend on Qraftt. However, static independence removes remote editing: if the phone number, role, email, company, or website changes, the old printed code still contains the old record. Create a replacement and update every physical and digital placement you control.",
          "A vCard QR code can be read without internet access because the contact data is inside the symbol. Opening the encoded website, sending email, calling, or synchronizing the saved contact may still require connectivity and suitable device services.",
        ],
      },
      {
        heading: "Common vCard QR code mistakes",
        id: "common-mistakes",
        paragraphs: [
          "Incorrect phone digits and misspelled email addresses are the most damaging content errors because format validation cannot establish that a destination belongs to the intended person. Other common problems include local-only phone formatting, a private website, an outdated job title, and publishing more personal information than the situation requires.",
          "Design choices can also make a valid payload unreliable. Very small printing, weak foreground-to-background contrast, artwork inside the quiet zone, an oversized central logo, glossy material, or placement on a fold can slow or prevent recognition. Higher data density also requires more physical space, so remove unnecessary fields rather than shrinking a complex code.",
          "Do not assume one successful preview scan proves the final card. Test the exported PNG or SVG on iPhone and Android where possible, inspect the proposed contact before saving, and scan a physical proof under realistic lighting and distance. Repeat the check whenever the contact information or artwork changes.",
        ],
      },
      {
        heading: "vCard QR code FAQ",
        id: "faq",
        paragraphs: [],
        faqs: [
          {
            question: "Does a vCard QR code work on iPhone and Android?",
            answer:
              "Yes, on compatible scanners and contact apps. Field order, labels, and the save screen can differ between iPhone, Android, and third-party applications, so test the final code on representative devices.",
          },
          {
            question: "Does scanning save the contact automatically?",
            answer:
              "No. A compatible scanner opens a contact record for review, and the person normally chooses whether to save it.",
          },
          {
            question: "Can I change the contact details after printing?",
            answer:
              "No. The static QR code contains the vCard data directly. Changed contact details require a new code and replacement of existing printed copies.",
          },
          {
            question: "Can I include a photo or logo in the saved contact?",
            answer:
              "Not with Qraftt’s current vCard payload. A logo added in the design editor appears in the QR artwork but is not embedded as the saved contact’s photo.",
          },
          {
            question: "Is the contact information private?",
            answer:
              "No. Anyone who can scan or decode the QR code can read its embedded contact fields, so include only information intended for that audience.",
          },
        ],
      },
    ],
    slug: "how-to-create-a-vcard-qr-code-for-a-digital-business-card",
    sources: [
      {
        href: "https://www.rfc-editor.org/info/rfc6350/",
        label: "RFC 6350: vCard Format Specification",
      },
      {
        href: "https://www.qrcode.com/en/howto/",
        label: "DENSO WAVE: How to use QR Codes",
      },
    ],
    title: "How to Create a vCard QR Code for a Digital Business Card",
    updatedAt: "2026-09-03",
  },
  "how-to-create-a-qr-code-menu-for-a-restaurant": {
    description:
      "Learn how to create a restaurant menu QR code, choose between a mobile webpage and PDF, place it for reliable scanning, and download PNG or SVG free.",
    excerpt:
      "A practical guide to building a free QR code menu that guests can scan, read, and use comfortably on their phones.",
    image: {
      alt: "Restaurant table displaying a scannable menu QR code beside a mobile menu",
      height: 630,
      src: "/images/blog/how-to-create-a-qr-code-menu-for-a-restaurant.svg",
      width: 1200,
    },
    generators: [
      {
        description:
          "Link a public restaurant menu or ordering page and export a customized static code.",
        href: "/menu-qr-code-generator",
        label: "Create a free menu QR code",
      },
      {
        description:
          "Create a direct QR destination for a menu that is published as a public PDF file.",
        href: "/pdf-qr-code-generator",
        label: "Create a PDF QR code",
      },
      {
        description:
          "Compare all supported static QR formats in Qraftt’s browser-based workspace.",
        href: "/qr-code-generator",
        label: "Open the free QR code generator",
      },
    ],
    publishedAt: "2026-09-03",
    readingMinutes: 8,
    sections: [
      {
        heading: "Give guests a direct route to your current menu",
        id: "direct-answer",
        paragraphs: [
          "To create a QR code menu for a restaurant, publish the menu at a public mobile-friendly URL or PDF address, paste that destination into a menu QR generator, verify the live preview, customize the design, and download PNG or SVG. Place the finished code where guests can scan it comfortably and test the complete journey on real phones before printing in quantity.",
          "Qraftt creates the static restaurant menu QR code locally in your browser without signup. The downloaded symbol stores your menu URL directly and does not rely on a Qraftt redirect. Guests still need internet access to load the external menu, and the destination must remain public, available, and readable on their device.",
        ],
        contextualLinks: [
          {
            description:
              "Paste a public restaurant destination and customize the finished static code.",
            href: "/menu-qr-code-generator",
            label: "Open the Menu QR generator",
          },
          {
            description:
              "Use this when your menu destination is a directly accessible PDF file.",
            href: "/pdf-qr-code-generator",
            label: "Open the PDF QR generator",
          },
          {
            description:
              "Explore every static QR type available in Qraftt without an account.",
            href: "/qr-code-generator",
            label: "Explore the QR code generator",
          },
        ],
        note:
          "The QR code opens the address you provide; it does not upload, host, or automatically update the restaurant menu itself.",
      },
      {
        heading: "How to create a restaurant menu QR code step by step",
        id: "step-by-step",
        paragraphs: [
          "First, publish the menu on a page that anyone can open without an employee login, private sharing permission, or expiring access token. Open it in a private browser window and on mobile data to confirm that a guest outside your business network can reach it. Check current prices, availability, allergen notes, opening hours, and ordering instructions before creating the code.",
          "Second, paste the final HTTPS destination into Qraftt’s menu generator. Scan the live preview and follow every redirect until the menu loads. Confirm the restaurant name and location so a copied link from another branch, seasonal campaign, or editing dashboard does not send diners to the wrong information.",
          "Third, choose a restrained design with strong contrast and a clear quiet zone. Download PNG for many everyday layouts or SVG for scalable professional print. Add a short instruction such as “View menu,” print a physical proof, and scan from the distance and angle guests will actually use at the table, counter, window, or takeaway area.",
        ],
        bullets: [
          "Publish a current menu at a stable public address.",
          "Test the destination while signed out and on a phone.",
          "Generate and customize the static QR code.",
          "Test the exported file in its final placement before rollout.",
        ],
      },
      {
        heading: "Should your QR code menu open a webpage or PDF?",
        id: "pdf-vs-url",
        paragraphs: [
          "A responsive web menu is usually easier to read on a phone because text, columns, images, navigation, and buttons can adapt to the screen. Restaurant staff can update items behind the same public URL, so printed static QR codes may continue pointing to current information as long as that destination remains unchanged.",
          "A PDF menu preserves a designed page and is convenient when the restaurant already produces a print-ready document. However, multi-column pages, small typography, and large image-heavy files can force guests to zoom or wait on slow connections. Browser settings may display the PDF inline or download it, and access still depends on the file host’s permissions and response behavior.",
          "An online-ordering page is appropriate when the desired action is ordering rather than reading alone. Test the full mobile flow, including branch selection, item availability, fees, account prompts, checkout, and regional restrictions. The QR code only opens the destination; ordering and payment remain with the external platform.",
        ],
        bullets: [
          "Choose a mobile webpage for flexible layouts and frequent updates.",
          "Choose a PDF when preserving a document layout matters and mobile readability has been tested.",
          "Choose an ordering page when guests should proceed into a verified transaction flow.",
        ],
      },
      {
        heading: "Restaurant and hospitality use cases",
        id: "restaurant-use-cases",
        paragraphs: [
          "Dining tables are the obvious placement, but a restaurant menu QR code can also help guests decide before they sit down. Use it on an entrance display, takeaway counter, hotel room-service card, food-truck window, event table, delivery insert, or outdoor sign when the destination matches the service available at that location.",
          "Separate codes can serve genuinely different needs, such as breakfast and dinner menus, room service, drinks, catering, dietary information, or ordering. Label each purpose clearly and avoid presenting several visually identical codes without context. For multiple branches, verify that each code opens the correct venue, prices, hours, and ordering area.",
        ],
        bullets: [
          "Table cards and counter displays.",
          "Windows, waiting areas, and queue signage.",
          "Hotel rooms, event tables, and catering materials.",
          "Takeaway packaging and delivery inserts.",
        ],
      },
      {
        heading: "Print and place menu QR codes for reliable scanning",
        id: "print-and-placement",
        paragraphs: [
          "Size the code for the expected scanning distance rather than fitting it into leftover space. A tabletop card scanned at arm’s length can be smaller than a window sign viewed from several steps away. Preserve the blank quiet zone around all four sides and keep headlines, borders, illustrations, and trimming outside it.",
          "Use dark modules against a light solid background and avoid transparent placement over food photography or patterned materials. Matte surfaces are generally easier to scan than glossy laminates under direct lighting. Keep the code flat, away from folds and strongly curved containers, and place it where plates, glasses, condiments, or people’s hands are unlikely to cover it.",
          "Accessibility and service quality still matter. Keep at least one readable alternative available for guests who cannot or prefer not to scan a code, and do not make critical allergen or emergency information dependent on a single device. Staff should know where the code leads and how to help when connectivity or a guest’s camera fails.",
        ],
      },
      {
        heading: "Make the digital menu readable on mobile",
        id: "mobile-readability",
        paragraphs: [
          "A successful scan is only the first step. Use legible text, short sections, clear item names, visible prices, and enough spacing for touch controls. Avoid desktop-width tables, tiny embedded PDFs, automatic audio, intrusive pop-ups, or large uncompressed images that delay the first useful content on a mobile connection.",
          "Keep navigation predictable and make dietary labels, ingredient notes, language choices, ordering buttons, and contact details easy to find. Test common screen sizes, portrait orientation, browser zoom, dark mode where applicable, and slower connections. A fast, readable menu is more helpful than an elaborate page that makes guests pinch and scroll repeatedly.",
        ],
      },
      {
        heading: "Common QR code menu mistakes",
        id: "common-mistakes",
        paragraphs: [
          "Private cloud files, expired sharing links, login requirements, moved documents, changed domains, and branch-specific mistakes are common destination failures. A URL can be structurally valid while remaining inaccessible to guests, so always test while signed out and repeat the check after changes to hosting, permissions, menus, or ordering providers.",
          "Slow pages, oversized PDFs, weak venue connectivity, glare, low contrast, small printing, damaged table cards, and excessive scanning distance can make a working destination feel broken. Test under the venue’s actual lighting and network conditions instead of relying only on a desktop preview in the office.",
          "Do not assume a static code updates itself. You can revise content behind the same stable URL, but changing the destination requires generating and replacing the QR code. Maintain a list of where each code is printed and scan permanent placements regularly so outdated menus do not remain unnoticed.",
        ],
      },
      {
        heading: "Restaurant menu QR code FAQ",
        id: "faq",
        paragraphs: [],
        faqs: [
          {
            question: "Is the menu QR code generator free?",
            answer:
              "Yes. Qraftt creates customizable static menu QR codes without signup, a subscription, or a mandatory payment, and supports PNG and SVG downloads.",
          },
          {
            question: "Do guests need an app to scan a menu QR code?",
            answer:
              "Usually not. Most current phone camera apps can recognize a standard URL QR code, although older devices or restricted cameras may require a compatible scanner.",
          },
          {
            question: "Does scanning a restaurant menu require internet access?",
            answer:
              "Yes. The QR code contains the menu address, but the phone needs internet access to load the external webpage, PDF, or ordering platform.",
          },
          {
            question: "Should I use a webpage or PDF for my QR code menu?",
            answer:
              "A responsive webpage is generally easier to update and read on phones. A PDF can preserve a fixed design but should be optimized for mobile screens, file size, and public access.",
          },
          {
            question: "Can I update the menu after printing the QR code?",
            answer:
              "Yes, if you update content at the same public URL. If the destination address changes, the static QR code must be regenerated and reprinted.",
          },
          {
            question: "Why does my menu QR code not open?",
            answer:
              "Check for a private or expired link, login requirement, changed URL, unavailable host, redirect problem, weak connectivity, incompatible scanner, or damaged and undersized printing.",
          },
        ],
      },
    ],
    slug: "how-to-create-a-qr-code-menu-for-a-restaurant",
    sources: [
      {
        href: "https://www.qrcode.com/en/howto/",
        label: "DENSO WAVE: How to use QR Codes",
      },
      {
        href: "https://www.w3.org/WAI/standards-guidelines/mobile/",
        label: "W3C Web Accessibility Initiative: Mobile accessibility",
      },
    ],
    title: "How to Create a QR Code Menu for a Restaurant",
    updatedAt: "2026-09-03",
  },
  "how-to-create-a-qr-code-for-a-google-form": {
    description:
      "Learn how to create a QR code for a Google Form, copy the correct responder link, check access settings, and download a free customized PNG or SVG.",
    excerpt:
      "Share a survey, registration, quiz, or feedback form with a static QR code that opens the correct responder page.",
    image: {
      alt: "Phone scanning a QR code that opens a public Google Form for responses",
      height: 630,
      src: "/images/blog/how-to-create-a-qr-code-for-a-google-form.svg",
      width: 1200,
    },
    generators: [
      {
        description:
          "Validate a public Google Forms responder link and download a customized static code.",
        href: "/google-forms-qr-code-generator",
        label: "Create a free Google Forms QR code",
      },
      {
        description:
          "Explore every supported static QR format in Qraftt’s browser-based workspace.",
        href: "/qr-code-generator",
        label: "Open the free QR code generator",
      },
      {
        description:
          "Create a static event record when attendees need calendar details rather than a response form.",
        href: "/calendar-qr-code-generator",
        label: "Create a calendar QR code",
      },
    ],
    publishedAt: "2026-09-03",
    readingMinutes: 8,
    sections: [
      {
        heading: "Connect scanners to the responder form",
        id: "direct-answer",
        paragraphs: [
          "To create a QR code for a Google Form, publish the form, copy its responder link rather than its editor link, paste that URL into a Google Forms QR generator, scan the preview while signed out, and download PNG or SVG. The finished code should open the page where your intended audience can answer the form—not the private workspace used to build it.",
          "Qraftt validates supported forms.gle and public Google Forms destinations and generates the static code locally without signup. The downloaded QR stores the Google URL directly and does not depend on a Qraftt redirect. Respondents need internet access, and Google’s publishing, access, login, and response settings still determine who can open and submit the form.",
        ],
        contextualLinks: [
          {
            description:
              "Paste a responder URL, customize the design, and export PNG or SVG.",
            href: "/google-forms-qr-code-generator",
            label: "Open the Google Forms QR generator",
          },
          {
            description:
              "Compare Google Forms with all 30 supported static QR formats.",
            href: "/qr-code-generator",
            label: "Explore the QR code generator",
          },
        ],
        note:
          "A valid QR code cannot override a closed form, restricted audience, sign-in requirement, or missing responder permission.",
      },
      {
        heading: "How to create a Google Form QR code step by step",
        id: "step-by-step",
        paragraphs: [
          "First, finish the form’s questions, confirmation message, response settings, and audience permissions. Publish the form and choose who may respond. If it should be open broadly, verify that the selected access option allows the intended public or link-based audience rather than only named people, a school, or an organization.",
          "Second, use Google Forms’ Preview, Share, or Published controls to copy the responder link. A shortened forms.gle URL or a public viewform URL can be appropriate. Do not copy the browser address from the editing screen or share an editor/collaborator link, because it can expose the wrong interface or deny access to ordinary respondents.",
          "Third, paste the respondent destination into Qraftt and scan the live preview. Test in a private browser window or a signed-out profile, complete a sample response when appropriate, and confirm the expected submission message. Customize the code with strong contrast and a clear quiet zone, download the final file, and test the actual printed or displayed version.",
        ],
        bullets: [
          "Publish the form and configure responder access.",
          "Copy the responder link, not an editor or admin URL.",
          "Test access while signed out and on a mobile device.",
          "Download and verify the final PNG or SVG at its intended size.",
        ],
      },
      {
        heading: "Choose and verify the correct Google Forms link",
        id: "correct-form-link",
        paragraphs: [
          "Google Forms can expose different links for editing, collaborating, previewing, responding, and viewing prefilled answers. For a general QR code, use the responder destination copied from the form’s sharing or publishing controls. The URL commonly uses forms.gle or ends in a Google Forms viewform path, although Google may change the visible routing over time.",
          "A prefilled link is useful when selected answers or identifiers should already appear, but those values become part of the URL and therefore part of the QR code. Do not prefill confidential student, customer, health, payment, or attendance information in a code displayed publicly. Test that every prefilled value lands in the intended question after later form edits.",
          "Open the destination while signed out before printing. Confirm the form title, owner or organization context, intended audience, response availability, and submission behavior. If the page asks for access, displays an editing interface, or says the form is unpublished or closed, correct the Google settings or link before generating the final QR code.",
        ],
      },
      {
        heading: "Survey, registration, event, and school use cases",
        id: "use-cases",
        paragraphs: [
          "Surveys and feedback forms can be linked from receipts, service counters, product inserts, workshops, or community displays. Explain what feedback is being requested, who receives it, and roughly how long the form takes. A QR code makes the form easier to reach but should not disguise the destination or pressure someone to submit.",
          "Registration forms work on invitations, venue signs, flyers, and event check-in material when capacity, deadlines, eligibility, and confirmation details are clear. For schools, a code can open a quiz, permission form, resource request, or classroom survey, but access settings and privacy practices should match the age group, institution, and audience.",
          "For repeated campaigns, keep the form at the same responder URL when possible. You can update questions or instructions behind a stable link, but major edits may affect prefilled fields, collected responses, or audience expectations. Retest the complete flow after every meaningful form or permission change.",
        ],
        bullets: [
          "Customer feedback and post-service surveys.",
          "Event registration, attendance, and session questions.",
          "School quizzes, classroom check-ins, and permission workflows.",
          "Volunteer, membership, booking, and information requests.",
        ],
      },
      {
        heading: "Print and place the form QR code effectively",
        id: "print-and-placement",
        paragraphs: [
          "Match the physical size to the scanning distance. A handout or badge used at arm’s length can use a smaller code than a poster viewed across a room. Preserve the quiet zone, use dark modules on a light background, and keep the code away from folds, perforations, curved surfaces, reflective glare, and visually busy photography.",
          "Add concise context beside the code, such as “Register for the workshop” or “Complete the two-minute survey.” Include the closing date or eligibility requirement when relevant so people do not scan an expired campaign. Where participation is important, provide a short readable URL or accessible alternative for people who cannot scan.",
          "Test with the venue’s actual connectivity and representative phones. A valid code can appear broken when mobile reception is weak, guest WiFi requires another login, or a restricted device blocks Google services. Check permanent signs regularly and remove codes promptly when a form closes.",
        ],
      },
      {
        heading: "Privacy and static QR code limitations",
        id: "privacy-and-static-limits",
        paragraphs: [
          "The QR code contains the Google Form URL, including any prefilled query values. Anyone who can scan or decode a public code can read that destination, so do not embed secret access tokens or sensitive prefilled information. Responses are submitted to Google Forms under the form owner’s settings and policies; Qraftt does not receive or store them through the generator.",
          "Because the code is static, Qraftt cannot replace its destination after download. Editing questions behind the same responder URL may preserve a printed code, while changing to a different form or URL requires a new QR code. Qraftt does not provide dynamic redirects, response analytics, or control over Google’s access and retention behavior.",
          "Tell respondents what information is collected, why it is needed, who can access it, and whether signing in is required. Avoid collecting unnecessary personal data, especially from students or public-event attendees, and follow the privacy obligations that apply to your organization and audience.",
        ],
      },
      {
        heading: "Common Google Form QR code mistakes",
        id: "common-mistakes",
        paragraphs: [
          "The most common link mistake is encoding an editor, collaborator, or owner URL instead of the responder link. Other failures include an unpublished or closed form, organization-only access, a sign-in requirement the audience does not expect, removed responder permissions, and a deleted or replaced form.",
          "A valid destination can still become inaccessible after printing if the owner changes sharing settings, removes the form, changes the URL, closes responses, or reaches an organizational restriction. Prefilled links can also break semantically when questions are deleted or reorganized even if the page still opens.",
          "Weak contrast, an obstructed quiet zone, undersized printing, glare, damage, and poor connectivity can prevent or delay the journey. Test the exported QR rather than only the editor preview, complete a representative submission, and confirm the response reaches the correct form before distributing materials.",
        ],
      },
      {
        heading: "Google Form QR code FAQ",
        id: "faq",
        paragraphs: [],
        faqs: [
          {
            question: "Is the Google Forms QR code generator free?",
            answer:
              "Yes. Qraftt creates customizable static Google Forms QR codes without signup, a subscription, or a mandatory payment, with PNG and SVG export.",
          },
          {
            question: "Which Google Form link should I use?",
            answer:
              "Use the responder link copied from Preview, Share, or the published form controls. Do not use an editor, owner, or collaborator URL.",
          },
          {
            question: "Do prefilled Google Forms links work in QR codes?",
            answer:
              "Yes, supported public prefilled responder links can be encoded. Test every preset answer and remember that the URL values can be read by anyone who decodes a public QR code.",
          },
          {
            question: "Does scanning require internet access?",
            answer:
              "Yes. The QR code contains the Google Forms URL, but the device needs internet access to load and submit the external form.",
          },
          {
            question: "Do respondents need a Google account?",
            answer:
              "It depends on the form settings. Public forms may allow responses without signing in, while one-response limits, restricted audiences, file uploads, or organization policies can require a Google account.",
          },
          {
            question: "Why is my form unavailable or not accepting responses?",
            answer:
              "Check that the responder link is correct, the form is published and open, the audience has permission, sign-in requirements are expected, and the form has not been deleted, moved, or restricted.",
          },
        ],
      },
    ],
    slug: "how-to-create-a-qr-code-for-a-google-form",
    sources: [
      {
        href: "https://support.google.com/docs/answer/2839588",
        label: "Google Docs Editors Help: Publish and share a form with responders",
      },
      {
        href: "https://support.google.com/docs/answer/2917111",
        label: "Google Docs Editors Help: Share a form with collaborators",
      },
    ],
    title: "How to Create a QR Code for a Google Form",
    updatedAt: "2026-09-03",
  },
  "how-to-create-a-qr-code-for-a-pdf": {
    description:
      "Learn how to create a QR code for a public PDF for free, choose reliable hosting, optimize mobile readability, test the link, and download PNG or SVG.",
    excerpt:
      "A practical no-signup guide to linking a hosted PDF from a static QR code that remains clear, accessible, and easy to test.",
    image: {
      alt: "Printed QR code opening a public PDF document on a mobile phone",
      height: 630,
      src: "/images/blog/how-to-create-a-qr-code-for-a-pdf.svg",
      width: 1200,
    },
    generators: [
      {
        description:
          "Validate a direct public PDF address and export a customized static PNG or SVG.",
        href: "/pdf-qr-code-generator",
        label: "Create a free PDF QR code",
      },
      {
        description:
          "Compare PDF links with all other static QR formats available in Qraftt.",
        href: "/qr-code-generator",
        label: "Open the free QR code generator",
      },
      {
        description:
          "Use a general public web address when the destination is not a direct PDF file.",
        href: "/url-qr-code-generator",
        label: "Create a URL QR code",
      },
    ],
    publishedAt: "2026-09-03",
    readingMinutes: 8,
    sections: [
      {
        heading: "Link the QR code to a public PDF",
        id: "direct-answer",
        paragraphs: [
          "To create a QR code for a PDF for free, upload the document to a trusted host you control, make the file publicly accessible, copy its direct HTTPS address ending in .pdf, paste it into a PDF QR generator, test the preview, and download PNG or SVG. The PDF itself is not stored inside the QR code because a normal document is far larger than a practical QR payload.",
          "Qraftt creates the static code locally in your browser without signup and encodes the PDF URL directly. The downloaded symbol does not rely on a Qraftt redirect, account, or file library after export. Scanners still need internet access to retrieve the document, and the external host controls whether it previews, downloads, remains available, or requires permission.",
        ],
        contextualLinks: [
          {
            description:
              "Paste a public direct PDF URL, customize the code, and export PNG or SVG.",
            href: "/pdf-qr-code-generator",
            label: "Open the PDF QR generator",
          },
          {
            description:
              "Explore all 30 static QR formats available without creating an account.",
            href: "/qr-code-generator",
            label: "Explore the QR code generator",
          },
        ],
        note:
          "Qraftt links to a PDF you already host. It does not upload, copy, store, protect, or serve the document.",
      },
      {
        heading: "How to create a PDF QR code step by step",
        id: "step-by-step",
        paragraphs: [
          "First, prepare the final document and publish it with a stable file host, website, or content platform. Configure access so anyone in the intended audience can open it without your owner session, an employee login, or a temporary invitation. Use a descriptive filename and confirm that the public address ends in .pdf for Qraftt’s dedicated PDF validation.",
          "Second, open the link in a private browser window and on mobile data. Confirm that the correct document loads, every page is present, text remains readable, links work, and no account prompt blocks access. If the host creates an expiring or signed URL, choose a more durable public link before printing permanent material.",
          "Third, paste the verified address into Qraftt, scan the live preview, and customize the code without weakening contrast or covering its quiet zone. Download PNG for many common screen and document placements or SVG for scalable print. Test the exported file at its final physical size and follow the scan through to the document itself.",
        ],
        bullets: [
          "Host the finished PDF at a stable public HTTPS address.",
          "Test access while signed out and on a representative phone.",
          "Generate a readable static QR design.",
          "Verify the exported PNG or SVG in its final placement.",
        ],
      },
      {
        heading: "Choose reliable PDF hosting and links",
        id: "pdf-hosting-and-links",
        paragraphs: [
          "A suitable PDF URL should be public, durable, and owned or managed by someone who can maintain it. A direct link ending in .pdf is clearer for validation than a sharing page, preview wrapper, editing screen, or account dashboard. Cloud-storage links can work only when their permissions and response behavior allow the intended audience to open the file.",
          "The host determines whether a browser displays the PDF inline or downloads it. Response headers, browser settings, operating systems, and installed PDF apps can produce different behavior from the same URL. Test the experience rather than promising one universal action, and provide a clear document title near the QR code so either outcome makes sense.",
          "Static QR codes cannot repair a moved or deleted file. You may replace or revise the document behind the exact same stable URL if your host supports it, but changing the URL requires a new QR code. Keep a record of every printed placement and the destination it contains so future maintenance is manageable.",
        ],
      },
      {
        heading: "PDF QR code use cases",
        id: "use-cases",
        paragraphs: [
          "Restaurants can link a PDF menu when a fixed document layout is necessary, although a responsive web menu is often easier to read and update on phones. Brochures and product sheets can connect a concise printed piece to specifications, price lists, catalogs, accessibility information, or translated material without crowding the page.",
          "Equipment labels and packaging can link to manuals, setup guides, safety instructions, warranties, and maintenance documents. Event signs, tickets, badges, and programs can open schedules, maps, speaker notes, policies, or downloadable resources. In every case, label the code with the document’s purpose and keep the destination current.",
        ],
        bullets: [
          "Restaurant menus and hospitality information.",
          "Brochures, catalogs, reports, and product sheets.",
          "Manuals, instructions, safety documents, and warranties.",
          "Event programs, venue maps, schedules, and attendee resources.",
        ],
      },
      {
        heading: "Optimize PDF size and mobile readability",
        id: "mobile-file-size-readability",
        paragraphs: [
          "A successful QR scan can still lead to a poor experience when the document is too large or designed only for desktop printing. Compress images appropriately, remove unnecessary embedded assets, use searchable text where possible, and balance quality against download size. Test on slower mobile connections instead of assuming every visitor has fast WiFi.",
          "Use legible type, clear headings, sensible reading order, descriptive links, and enough contrast inside the PDF. A wide multi-column page may require repeated zooming on a phone, while a document designed around a narrower reading area is easier to navigate. Check portrait and landscape viewing, browser zoom, screen-reader behavior where relevant, and the readability of charts and captions.",
          "Very large manuals may be better served by a mobile web contents page that links to individual sections or files. The QR payload length depends on the URL rather than the PDF’s file size, but the document size directly affects loading time, data use, and whether the reader waits for it to open.",
        ],
      },
      {
        heading: "Print and place PDF QR codes reliably",
        id: "print-and-placement",
        paragraphs: [
          "Choose the QR code’s physical size according to scanning distance and payload density. Preserve a clear quiet zone on every side, keep modules dark against a light solid background, and avoid placing the code over photography, folds, seams, strongly curved packaging, or reflective surfaces that create glare.",
          "Include a short call to action and identify the file, such as “Open the instruction manual” or “View the event program.” Add the file size or language when that information helps users decide whether to open it. A readable short URL can provide a fallback for people who cannot scan.",
          "Print a proof using the actual material and finish. Scan from realistic distances under expected lighting with more than one phone, then open several pages of the PDF. Repeat this test after changing the document, hosting permissions, redirect rules, filename, or QR artwork.",
        ],
      },
      {
        heading: "Privacy and static QR code limitations",
        id: "privacy-and-static-limits",
        paragraphs: [
          "The PDF address is visible to anyone who scans or decodes a public QR code. Do not treat an obscure URL as access control, and do not use a public PDF QR code for confidential records, private customer files, internal manuals, or documents containing sensitive personal information. Apply appropriate permissions at the host when access must be restricted.",
          "Qraftt generates the link and image locally but does not control the external file. Your hosting provider may log visits, set cookies, require login, enforce download rules, or remove content under its own terms. Review that provider’s privacy and availability behavior before distributing the code.",
          "The static code keeps the original URL permanently. It cannot provide a Qraftt-managed redirect, replace the destination remotely, restore an expired link, or report scan analytics. If the destination changes, generate a new code and replace all affected copies.",
        ],
      },
      {
        heading: "Common PDF QR code mistakes",
        id: "common-mistakes",
        paragraphs: [
          "Private permissions, owner-only preview links, expired signed URLs, moved or deleted files, redirect loops, broken HTTPS certificates, and login walls are common destination problems. A link can work for the document owner while failing for everyone else, which is why signed-out and cross-device testing is essential.",
          "Qraftt’s dedicated PDF generator expects a public HTTP or HTTPS URL ending in .pdf. A webpage that merely contains a PDF viewer, an extensionless download endpoint, or a cloud sharing screen may not pass that validation even when it eventually serves a document. Use the general URL generator for a normal webpage or choose a direct PDF address.",
          "Large files, slow hosting, desktop-oriented page layouts, low QR contrast, small printing, damaged material, and missing quiet space can all create a poor result. Verify both halves of the journey: the camera must recognize the QR code, and the destination must deliver a usable document afterward.",
        ],
      },
      {
        heading: "PDF QR code FAQ",
        id: "faq",
        paragraphs: [],
        faqs: [
          {
            question: "Is this PDF QR code generator free without signup?",
            answer:
              "Yes. Qraftt creates customizable static PDF QR codes without signup, a subscription, or mandatory payment, with PNG and SVG export.",
          },
          {
            question: "Is the PDF embedded inside the QR code?",
            answer:
              "No. The QR code stores the public PDF URL, while the document remains on its external host.",
          },
          {
            question: "Do Google Drive and other cloud PDF links work?",
            answer:
              "They can work when the link is public, stable, accessible without login, and ends in .pdf for Qraftt’s PDF-specific validation. Sharing and preview pages may require the general URL generator instead.",
          },
          {
            question: "Does scanning require internet access?",
            answer:
              "Yes. A device needs internet access to retrieve the PDF from its external host after decoding the URL.",
          },
          {
            question: "Can I replace the PDF after printing?",
            answer:
              "Only if your host lets you replace the file while preserving exactly the same public URL. A different destination URL requires a new QR code.",
          },
          {
            question: "Why does my PDF not open?",
            answer:
              "Check public permissions, the .pdf URL, expired links, moved files, redirects, HTTPS errors, login requirements, hosting availability, file size, and browser or device compatibility.",
          },
        ],
      },
    ],
    slug: "how-to-create-a-qr-code-for-a-pdf",
    sources: [
      {
        href: "https://www.qrcode.com/en/howto/",
        label: "DENSO WAVE: How to use QR Codes",
      },
      {
        href: "https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF1",
        label: "W3C WAI: Text alternatives for images in PDF documents",
      },
    ],
    title: "How to Create a QR Code for a PDF for Free",
    updatedAt: "2026-09-03",
  },
};

const relatedArticleSlugs: Record<
  BlogArticleSlug,
  readonly BlogArticleSlug[]
> = {
  "how-to-create-a-qr-code": [
    "how-to-test-a-qr-code",
    "qr-code-size-guide",
    "how-to-add-a-logo-to-a-qr-code",
    "how-to-create-a-whatsapp-qr-code-for-free",
  ],
  "how-to-create-a-wifi-qr-code": [
    "how-to-test-a-qr-code",
    "qr-code-size-guide",
    "do-qr-codes-expire",
    "how-to-create-a-qr-code-menu-for-a-restaurant",
  ],
  "do-qr-codes-expire": [
    "static-vs-dynamic-qr-codes",
    "how-to-test-a-qr-code",
    "how-to-create-a-qr-code",
    "how-to-create-a-google-review-qr-code",
  ],
  "static-vs-dynamic-qr-codes": [
    "do-qr-codes-expire",
    "how-to-create-a-qr-code",
    "how-to-test-a-qr-code",
    "how-to-create-a-qr-code-for-a-google-form",
  ],
  "qr-code-size-guide": [
    "how-to-test-a-qr-code",
    "qr-code-error-correction-guide",
    "qr-code-color-contrast-guide",
    "how-to-create-a-vcard-qr-code-for-a-digital-business-card",
  ],
  "how-to-add-a-logo-to-a-qr-code": [
    "qr-code-error-correction-guide",
    "qr-code-color-contrast-guide",
    "how-to-test-a-qr-code",
  ],
  "qr-code-error-correction-guide": [
    "how-to-add-a-logo-to-a-qr-code",
    "qr-code-size-guide",
    "how-to-test-a-qr-code",
  ],
  "how-to-test-a-qr-code": [
    "qr-code-size-guide",
    "qr-code-color-contrast-guide",
    "do-qr-codes-expire",
    "how-to-create-a-qr-code-for-a-pdf",
  ],
  "qr-code-color-contrast-guide": [
    "how-to-add-a-logo-to-a-qr-code",
    "how-to-test-a-qr-code",
    "qr-code-size-guide",
  ],
  "how-to-create-a-google-review-qr-code": [
    "how-to-create-a-qr-code",
    "how-to-test-a-qr-code",
    "do-qr-codes-expire",
  ],
  "how-to-create-a-whatsapp-qr-code-for-free": [
    "how-to-create-a-qr-code",
    "how-to-test-a-qr-code",
    "qr-code-size-guide",
  ],
  "how-to-create-a-vcard-qr-code-for-a-digital-business-card": [
    "how-to-create-a-qr-code",
    "qr-code-size-guide",
    "how-to-test-a-qr-code",
  ],
  "how-to-create-a-qr-code-menu-for-a-restaurant": [
    "qr-code-size-guide",
    "how-to-test-a-qr-code",
    "qr-code-color-contrast-guide",
  ],
  "how-to-create-a-qr-code-for-a-google-form": [
    "how-to-create-a-qr-code",
    "how-to-test-a-qr-code",
    "qr-code-size-guide",
  ],
  "how-to-create-a-qr-code-for-a-pdf": [
    "qr-code-size-guide",
    "how-to-test-a-qr-code",
    "qr-code-color-contrast-guide",
  ],
};

export const blogArticleList = Object.values(blogArticles);

export function getBlogArticle(slug: string) {
  return blogArticles[slug as BlogArticleSlug];
}

export function getRelatedBlogArticles(slug: BlogArticleSlug) {
  return relatedArticleSlugs[slug].map((relatedSlug) => blogArticles[relatedSlug]);
}
