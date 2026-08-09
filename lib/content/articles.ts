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
  heading: string;
  id: string;
  note?: string;
  paragraphs: readonly string[];
  table?: ArticleTable;
}

export interface BlogArticle {
  description: string;
  excerpt: string;
  generators: ReadonlyArray<ContentLink>;
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
  | "qr-code-size-guide";

export const blogArticles: Record<BlogArticleSlug, BlogArticle> = {
  "how-to-create-a-qr-code": {
    description:
      "Learn how to create a reliable QR code, choose the right content type, test it properly, and export it for screens or print.",
    excerpt:
      "A practical start-to-finish guide to making a QR code that scans reliably and opens exactly what you intended.",
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
          "Paste or type the destination into the matching generator. Qraft validates common mistakes before rendering—for example, unsafe URL schemes, malformed email addresses, invalid coordinates, and incomplete phone numbers. Validation can confirm a format, but it cannot promise that an external page will stay online or that information on another service is correct.",
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
    updatedAt: "2026-08-09",
  },
  "how-to-create-a-wifi-qr-code": {
    description:
      "Create a WiFi QR code safely with the correct network name, security type, password handling, testing, and placement guidance.",
    excerpt:
      "Share guest-network access without making visitors type a long password—and avoid the setup mistakes that cause failed joins.",
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
          "Open the WiFi generator, enter the details, and watch the preview update. Qraft escapes punctuation that has a special meaning in WiFi QR payloads, such as semicolons and backslashes. The completed code is created in the browser; the network name and password are not sent to a Qraft database.",
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
    updatedAt: "2026-08-09",
  },
  "do-qr-codes-expire": {
    description:
      "Understand when QR codes stop working, why static codes do not expire on their own, and how destinations, redirects, and print quality affect lifespan.",
    excerpt:
      "The pattern usually is not the part that expires. Learn what actually breaks and how to make a QR code last.",
    generators: [
      {
        description: "Create a static code that stores the destination directly.",
        href: "/qr-code-generator",
        label: "Create a free static QR code",
      },
      {
        description: "Encode your final public URL without a Qraft redirect.",
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
    updatedAt: "2026-08-09",
  },
  "static-vs-dynamic-qr-codes": {
    description:
      "Compare static and dynamic QR codes by destination control, editing, analytics, privacy, cost, reliability, and long-term use.",
    excerpt:
      "Static and dynamic codes can look identical, but the link architecture behind them creates very different tradeoffs.",
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
    updatedAt: "2026-08-09",
  },
  "qr-code-size-guide": {
    description:
      "Choose a practical QR code size for labels, cards, menus, flyers, posters, and signs while protecting module clarity and quiet space.",
    excerpt:
      "There is no single correct QR size. Use payload density, print quality, distance, material, and testing to choose one that scans reliably.",
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
    updatedAt: "2026-08-09",
  },
};

export const blogArticleList = Object.values(blogArticles);

export function getBlogArticle(slug: string) {
  return blogArticles[slug as BlogArticleSlug];
}
