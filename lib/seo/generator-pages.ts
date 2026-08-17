import type { QrType } from "@/lib/qr/types";

export interface GeneratorPageContent {
  badge: string;
  faq: ReadonlyArray<{ answer: string; question: string }>;
  guidance?: {
    description: string;
    items: ReadonlyArray<{ description: string; title: string }>;
    title: string;
  };
  h1: string;
  howTo: ReadonlyArray<{ description: string; title: string }>;
  introduction: string;
  label: string;
  metaDescription: string;
  related: ReadonlyArray<GeneratorPageSlug>;
  seoTitle: string;
  slug: GeneratorPageSlug;
  type: QrType;
  topic?: string;
  useCases: ReadonlyArray<{ description: string; title: string }>;
}

export type GeneratorPageSlug =
  | "qr-code-generator"
  | "wifi-qr-code-generator"
  | "whatsapp-qr-code-generator"
  | "vcard-qr-code-generator"
  | "url-qr-code-generator"
  | "text-qr-code-generator"
  | "email-qr-code-generator"
  | "sms-qr-code-generator"
  | "phone-qr-code-generator"
  | "location-qr-code-generator"
  | "instagram-qr-code-generator"
  | "facebook-qr-code-generator"
  | "youtube-qr-code-generator"
  | "tiktok-qr-code-generator"
  | "linkedin-qr-code-generator"
  | "telegram-qr-code-generator"
  | "google-review-qr-code-generator"
  | "menu-qr-code-generator"
  | "spotify-qr-code-generator"
  | "paypal-qr-code-generator"
  | "pdf-qr-code-generator"
  | "calendar-qr-code-generator"
  | "google-forms-qr-code-generator"
  | "google-docs-qr-code-generator"
  | "image-qr-code-generator"
  | "audio-qr-code-generator"
  | "spreadsheet-qr-code-generator"
  | "discord-qr-code-generator"
  | "amazon-qr-code-generator"
  | "snapchat-qr-code-generator"
  | "app-store-qr-code-generator";

export const generatorPages: Record<GeneratorPageSlug, GeneratorPageContent> = {
  "qr-code-generator": {
    badge: "Free · Private · No signup",
    faq: [
      {
        question: "Are the QR codes really free?",
        answer:
          "Yes. You can create, customize, and download static QR codes without an account, subscription, watermark, or scan limit.",
      },
      {
        question: "Do static QR codes expire?",
        answer:
          "No. A static QR code stores its content directly, so it keeps working as long as the encoded destination or information remains valid.",
      },
      {
        question: "Is my information uploaded?",
        answer:
          "No. Qraftt generates the QR code locally in your browser. Your link, message, WiFi password, or contact details are not sent to our server.",
      },
      {
        question: "Should I download PNG or SVG?",
        answer:
          "PNG works well for websites, documents, and everyday sharing. SVG stays sharp at any size and is usually the better choice for professional printing.",
      },
    ],
    h1: "Free QR Code Generator",
    howTo: [
      {
        title: "Choose a QR format",
        description:
          "Select the type that matches what you want to share, such as a URL, WiFi network, WhatsApp chat, or vCard.",
      },
      {
        title: "Add and check your content",
        description:
          "Enter the destination or details. The live preview updates locally and validation catches common formatting problems.",
      },
      {
        title: "Customize and download",
        description:
          "Set foreground and background colors, choose error correction, test the preview, then export PNG or SVG.",
      },
    ],
    introduction:
      "Create a static QR code for links, messages, WiFi access, contact details, and more. Everything is generated in your browser, so the downloaded code points directly to your content without relying on Qraftt after download.",
    label: "QR Code Generator",
    metaDescription:
      "Create free static QR codes locally in your browser. Customize colors and download PNG or SVG with no signup, watermark, or scan limits.",
    related: [
      "url-qr-code-generator",
      "wifi-qr-code-generator",
      "whatsapp-qr-code-generator",
      "vcard-qr-code-generator",
    ],
    seoTitle: "Free QR Code Generator — PNG & SVG",
    slug: "qr-code-generator",
    type: "url",
    useCases: [
      {
        title: "Print and packaging",
        description:
          "Connect product labels, flyers, posters, and table displays to useful digital information.",
      },
      {
        title: "Guest access",
        description:
          "Share WiFi credentials or simple instructions without making people type long details.",
      },
      {
        title: "Direct conversations",
        description:
          "Open a WhatsApp chat, email draft, SMS message, or phone action from a single scan.",
      },
      {
        title: "Contact sharing",
        description:
          "Put a scannable vCard on badges, portfolios, counters, and printed business materials.",
      },
    ],
  },
  "wifi-qr-code-generator": {
    badge: "Fast guest WiFi access",
    faq: [
      {
        question: "Does a WiFi QR code reveal the password?",
        answer:
          "The password is stored inside the QR payload so a compatible device can join the network. Anyone who can scan or decode the QR code may be able to read it, so share it only where appropriate.",
      },
      {
        question: "Which WiFi security types are supported?",
        answer:
          "The generator supports WPA/WPA2, WEP, and open networks. Choose the setting that matches the network configuration exactly.",
      },
      {
        question: "Can I create a code for a hidden network?",
        answer:
          "Yes. Enable the hidden-network option before downloading. The network name must still be entered exactly, including capitalization and spaces.",
      },
      {
        question: "Does the QR code need internet access to work?",
        answer:
          "No server is needed to read the QR code. The device uses the embedded network details directly, although the WiFi network itself needs internet access if you expect it to provide an online connection.",
      },
    ],
    guidance: {
      title: "Check these details before printing a WiFi QR code",
      description:
        "A WiFi code is only useful when its network details match the router exactly and the finished design remains easy for guest devices to scan.",
      items: [
        {
          title: "Match the SSID exactly",
          description:
            "Preserve capitalization, spaces, punctuation, and the hidden-network setting shown in the router configuration.",
        },
        {
          title: "Use the correct security mode",
          description:
            "Choose WPA/WPA2, WEP, or no password based on the network itself; the wrong mode can prevent connection even with the right password.",
        },
        {
          title: "Test as a new guest",
          description:
            "Forget the network on a phone or use a device that has never joined it, then scan the final printed code and confirm access.",
        },
      ],
    },
    h1: "Free WiFi QR Code Generator",
    howTo: [
      {
        title: "Enter the network name",
        description:
          "Type the SSID exactly as it appears in the router settings, including spaces and capitalization.",
      },
      {
        title: "Choose security and password",
        description:
          "Select WPA/WPA2, WEP, or no password. Add the password and mark the network as hidden when needed.",
      },
      {
        title: "Test before displaying",
        description:
          "Scan the live preview with a phone that is not already connected, then download a clear PNG or scalable SVG.",
      },
    ],
    introduction:
      "Turn a network name and password into a scannable WiFi QR code so guests can connect without typing credentials. The network details are encoded locally and directly into the static QR code.",
    label: "WiFi QR Generator",
    metaDescription:
      "Create a free WiFi QR code for WPA/WPA2, WEP, open, or hidden networks. Encode the SSID and password locally, then download PNG or SVG.",
    related: [
      "qr-code-generator",
      "menu-qr-code-generator",
      "whatsapp-qr-code-generator",
      "text-qr-code-generator",
    ],
    seoTitle: "Free WiFi QR Code Generator — Share Network Access",
    slug: "wifi-qr-code-generator",
    type: "wifi",
    topic: "WiFi QR code",
    useCases: [
      {
        title: "Cafés and restaurants",
        description:
          "Place a code on menus, receipts, or counters so customers can join guest WiFi quickly.",
      },
      {
        title: "Holiday rentals",
        description:
          "Add the code to a welcome book or entry card and reduce repeated password questions.",
      },
      {
        title: "Offices and meeting rooms",
        description:
          "Give visitors access to the correct guest network without exposing staff-network credentials.",
      },
      {
        title: "Events and classrooms",
        description:
          "Help a group connect to a temporary or venue network with one consistent set of details.",
      },
    ],
  },
  "whatsapp-qr-code-generator": {
    badge: "Open a chat in one scan",
    faq: [
      {
        question: "Does scanning send the WhatsApp message automatically?",
        answer:
          "No. The code opens a chat with the optional message filled in. The person scanning can review or edit the message before sending it.",
      },
      {
        question: "How should I enter the phone number?",
        answer:
          "Use the full international number with country code. Spaces and common visual separators are accepted and removed from the final WhatsApp destination.",
      },
      {
        question: "Can I leave the message blank?",
        answer:
          "Yes. A blank message opens the conversation without pre-filling text, which is useful for general support or sales contact links.",
      },
      {
        question: "Will the code work without Qraftt?",
        answer:
          "Yes. The QR code contains a direct wa.me destination. Once downloaded, it does not redirect through or depend on Qraftt.",
      },
    ],
    guidance: {
      title: "Build a WhatsApp QR code people can trust",
      description:
        "A clear destination and a concise optional opener help people understand who they are contacting before they continue in WhatsApp.",
      items: [
        {
          title: "Include the country code",
          description:
            "Enter the complete international number so the wa.me destination works consistently for people scanning from different countries.",
        },
        {
          title: "Keep the opener useful",
          description:
            "Use a short message that gives context, such as the product, booking, or support topic, without collecting sensitive information.",
        },
        {
          title: "Confirm the receiving account",
          description:
            "Scan the finished code and verify the correct person or business appears before placing it on permanent materials.",
        },
      ],
    },
    h1: "Free WhatsApp QR Code Generator",
    howTo: [
      {
        title: "Add the WhatsApp number",
        description:
          "Enter the international country code and phone number for the WhatsApp account you want people to reach.",
      },
      {
        title: "Write an optional opener",
        description:
          "Pre-fill a concise message such as a product question, booking request, or support reference.",
      },
      {
        title: "Preview, scan, and export",
        description:
          "Test that the correct chat opens, choose readable colors, and download PNG or SVG for your material.",
      },
    ],
    introduction:
      "Create a QR code that opens a WhatsApp conversation with the correct international number and an optional pre-filled message. The static code links directly to WhatsApp and never routes through our server.",
    label: "WhatsApp QR Generator",
    metaDescription:
      "Create a free WhatsApp QR code for a phone number with an optional pre-filled message. Generate a direct wa.me link and download PNG or SVG.",
    related: [
      "phone-qr-code-generator",
      "sms-qr-code-generator",
      "vcard-qr-code-generator",
      "instagram-qr-code-generator",
    ],
    seoTitle: "Free WhatsApp QR Code Generator with Message",
    slug: "whatsapp-qr-code-generator",
    type: "whatsapp",
    topic: "WhatsApp QR code",
    useCases: [
      {
        title: "Customer support",
        description:
          "Put a direct help channel on packaging, receipts, equipment, or service-desk signage.",
      },
      {
        title: "Sales inquiries",
        description:
          "Turn brochures and product displays into conversations with a useful pre-filled question.",
      },
      {
        title: "Bookings and appointments",
        description:
          "Let visitors start a structured booking request from a poster, card, or front-desk display.",
      },
      {
        title: "Event questions and updates",
        description:
          "Give attendees a simple way to reach an organizer without manually saving a number first.",
      },
    ],
  },
  "vcard-qr-code-generator": {
    badge: "Share contact details instantly",
    faq: [
      {
        question: "What information can the vCard include?",
        answer:
          "You can include a first and last name, organization, job title, international phone number, email address, and website. Optional fields are omitted when left blank.",
      },
      {
        question: "Which vCard version is generated?",
        answer:
          "Qraftt generates a standards-based vCard 4.0 payload with properly escaped text, contact fields, and line formatting.",
      },
      {
        question: "Can I change the contact after printing?",
        answer:
          "A static vCard QR code cannot be updated after download. If contact details change, create and print a new code.",
      },
      {
        question: "Are my contact details stored by Qraftt?",
        answer:
          "No. The vCard is assembled and encoded in your browser. The downloaded code contains the details directly and does not require a Qraftt account or server.",
      },
    ],
    guidance: {
      title: "Make a vCard QR code easier to save correctly",
      description:
        "Complete, consistent contact details reduce cleanup after a scan and help recipients recognize whose information they are adding.",
      items: [
        {
          title: "Use a recognizable contact name",
          description:
            "Enter the name as it should appear in an address book, with the organization and job title only when they add useful context.",
        },
        {
          title: "Use durable contact details",
          description:
            "Choose a phone number, email address, and website that are likely to remain valid for the life of the printed code.",
        },
        {
          title: "Test the saved record",
          description:
            "Scan on both iPhone and Android when possible, save the contact, and inspect every field rather than checking only the preview.",
        },
      ],
    },
    h1: "Free vCard QR Code Generator",
    howTo: [
      {
        title: "Enter the contact name",
        description:
          "Add at least a first or last name, then include only the professional or personal details you want to share.",
      },
      {
        title: "Review phone, email, and website",
        description:
          "Check the international phone format and confirm every address before generating printed materials.",
      },
      {
        title: "Test the saved contact",
        description:
          "Scan the preview, verify how the contact appears on a phone, then download PNG or print-ready SVG.",
      },
    ],
    introduction:
      "Create a vCard QR code that lets people save structured contact details without typing them manually. Qraftt builds a standards-compatible vCard 4.0 locally and embeds it directly in the static code.",
    label: "vCard QR Generator",
    metaDescription:
      "Create a free vCard QR code for a name, phone, email, company, title, and website. Generate the contact locally and download PNG or SVG.",
    related: [
      "whatsapp-qr-code-generator",
      "email-qr-code-generator",
      "phone-qr-code-generator",
      "linkedin-qr-code-generator",
    ],
    seoTitle: "Free vCard QR Code Generator for Contact Details",
    slug: "vcard-qr-code-generator",
    type: "vcard",
    topic: "vCard contact QR code",
    useCases: [
      {
        title: "Contact-ready business cards",
        description:
          "Add a save-ready digital contact to a traditional card without crowding the printed layout.",
      },
      {
        title: "Conferences and badges",
        description:
          "Help new contacts capture accurate details during fast conversations and networking sessions.",
      },
      {
        title: "Portfolios and résumés",
        description:
          "Connect printed career material to a complete, easily saved professional identity.",
      },
      {
        title: "Counters and team profiles",
        description:
          "Make a representative or location contact easy to save from signage and staff materials.",
      },
    ],
  },
  "url-qr-code-generator": {
    badge: "Direct static link QR codes",
    faq: [
      {
        question: "Can I change the URL after downloading the QR code?",
        answer:
          "No. This generator creates a static code that stores the destination directly. To use a different URL, generate and distribute a new QR code.",
      },
      {
        question: "Does Qraftt track scans?",
        answer:
          "No. The code opens your URL directly without a Qraftt redirect, so we do not receive scan data or add tracking parameters.",
      },
      {
        question: "Do I need to include https://?",
        answer:
          "You can enter a domain without the scheme and Qraftt will add HTTPS. Always check the normalized destination in your browser before printing widely.",
      },
      {
        question: "Will a URL QR code expire?",
        answer:
          "The QR code itself does not expire. It will stop reaching useful content only if the destination page is removed, moved, blocked, or allowed to expire.",
      },
    ],
    guidance: {
      title: "Choose a URL that will keep working",
      description:
        "A static URL QR code cannot be edited after download, so destination quality matters as much as the visual design of the code itself.",
      items: [
        {
          title: "Use the final HTTPS address",
          description:
            "Encode the public canonical destination rather than a temporary preview, private dashboard, or session-specific sharing link.",
        },
        {
          title: "Check the mobile landing page",
          description:
            "Open the URL on a phone and confirm it loads quickly, presents the expected content, and does not require unintended access permissions.",
        },
        {
          title: "Scan the placed asset",
          description:
            "Test the exported code at the real print size, viewing distance, surface, and lighting before producing a large quantity.",
        },
      ],
    },
    h1: "Free URL QR Code Generator",
    howTo: [
      {
        title: "Paste the destination URL",
        description:
          "Enter the exact page you want to open. Qraftt accepts HTTP or HTTPS and adds HTTPS to plain domains.",
      },
      {
        title: "Choose readable colors",
        description:
          "Keep strong contrast between foreground and background, then select error correction for the intended environment.",
      },
      {
        title: "Verify the final destination",
        description:
          "Test the preview and final file on more than one device before printing large quantities or permanent signage.",
      },
    ],
    introduction:
      "Convert any HTTP or HTTPS destination into a static URL QR code with no tracking redirect. The link is encoded directly in your browser, and the downloaded PNG or SVG remains independent of Qraftt.",
    label: "URL QR Generator",
    metaDescription:
      "Create a free static URL QR code that opens a website directly with no Qraftt redirect or scan tracking. Customize it and download PNG or SVG.",
    related: [
      "qr-code-generator",
      "pdf-qr-code-generator",
      "google-forms-qr-code-generator",
      "app-store-qr-code-generator",
      "menu-qr-code-generator",
    ],
    seoTitle: "Free URL QR Code Generator — Direct Static Link",
    slug: "url-qr-code-generator",
    type: "url",
    topic: "URL QR code",
    useCases: [
      {
        title: "Menus and service pages",
        description:
          "Link table cards, room displays, or instructions directly to a mobile-friendly page.",
      },
      {
        title: "Product support destinations",
        description:
          "Connect physical products to setup guides, specifications, care instructions, or warranty pages.",
      },
      {
        title: "Posters and campaigns",
        description:
          "Give viewers a short path from offline creative to a focused landing or registration page.",
      },
      {
        title: "Documents and presentations",
        description:
          "Make sources, downloads, forms, and follow-up resources easy to open on another device.",
      },
    ],
  },
  "text-qr-code-generator": {
    badge: "Share text without a link",
    faq: [
      {
        question: "What happens when someone scans a text QR code?",
        answer:
          "The scanner displays the exact text stored in the code. The person can read or copy it without opening a website or contacting a server.",
      },
      {
        question: "Does a text QR code work offline?",
        answer:
          "Yes. The text is embedded directly in the QR code, so reading it does not require an internet connection after the code has been downloaded.",
      },
      {
        question: "How much text should I include?",
        answer:
          "Short content scans more reliably and produces a simpler pattern. The generator accepts up to 2,000 characters, but concise instructions or references usually work best.",
      },
      {
        question: "Can I edit the text after printing?",
        answer:
          "No. This is a static QR code. If the wording changes, create a new code and replace the old printed or digital version.",
      },
    ],
    h1: "Free Text QR Code Generator",
    howTo: [
      {
        title: "Write the text to share",
        description:
          "Enter a short note, instruction, reference number, or other plain text exactly as it should appear after scanning.",
      },
      {
        title: "Check readability",
        description:
          "Review spelling, line breaks, and length while the live QR preview updates locally in your browser.",
      },
      {
        title: "Test and download",
        description:
          "Scan the preview to confirm the full message appears, then export a PNG for everyday use or SVG for print.",
      },
    ],
    introduction:
      "Turn plain text into a static QR code that can be read without visiting a website. The message is encoded directly in your browser, making it useful for short instructions, references, and offline information.",
    label: "Text QR Generator",
    metaDescription:
      "Create a free text QR code that works offline. Encode notes or instructions locally and download a customized PNG or SVG without signup.",
    related: [
      "qr-code-generator",
      "url-qr-code-generator",
      "email-qr-code-generator",
      "sms-qr-code-generator",
    ],
    seoTitle: "Free Text QR Code Generator — Works Offline",
    slug: "text-qr-code-generator",
    type: "text",
    useCases: [
      {
        title: "Equipment instructions",
        description:
          "Place concise operating, cleaning, or safety notes where people need them without requiring connectivity.",
      },
      {
        title: "Reference numbers",
        description:
          "Make order IDs, serial references, locker codes, or internal labels easy to copy accurately.",
      },
      {
        title: "Event information",
        description:
          "Share a short agenda, room direction, access note, or check-in instruction from signs and badges.",
      },
      {
        title: "Classroom materials",
        description:
          "Attach definitions, prompts, answers, or brief context to worksheets and physical learning stations.",
      },
    ],
  },
  "email-qr-code-generator": {
    badge: "Open a ready-addressed email",
    faq: [
      {
        question: "Does scanning send the email automatically?",
        answer:
          "No. Scanning opens a draft in the person’s available email app. They can review, edit, or cancel it before choosing to send.",
      },
      {
        question: "Can the subject and message be left blank?",
        answer:
          "Yes. Only the recipient address is required. Optional subject and body text can make common requests faster and more consistent.",
      },
      {
        question: "Which email apps are supported?",
        answer:
          "The QR code uses a standard mailto destination. Behavior depends on the email application configured on the scanning device.",
      },
      {
        question: "Are email addresses or messages stored by Qraftt?",
        answer:
          "No. The mailto destination is assembled and encoded locally in your browser, then stored directly in the downloaded static QR code.",
      },
    ],
    h1: "Free Email QR Code Generator",
    howTo: [
      {
        title: "Enter the recipient",
        description:
          "Add the email address that should receive the message and check it carefully for spelling errors.",
      },
      {
        title: "Prepare optional content",
        description:
          "Add a useful subject and a short message template that scanners can edit before sending.",
      },
      {
        title: "Scan and verify the draft",
        description:
          "Open the preview on a phone, confirm each field appears correctly, then download PNG or SVG.",
      },
    ],
    introduction:
      "Create an email QR code that opens a new draft with the recipient, subject, and optional message already filled in. The standards-based mailto destination is generated locally and encoded directly in the static code.",
    label: "Email QR Generator",
    metaDescription:
      "Create a free email QR code with recipient, subject, and message. Generate a direct mailto code locally and download PNG or SVG.",
    related: [
      "qr-code-generator",
      "sms-qr-code-generator",
      "vcard-qr-code-generator",
      "phone-qr-code-generator",
    ],
    seoTitle: "Free Email QR Code Generator — Prefilled Draft",
    slug: "email-qr-code-generator",
    type: "email",
    useCases: [
      {
        title: "Support requests",
        description:
          "Pre-address messages and suggest a subject so customers can explain an issue from packaging or equipment.",
      },
      {
        title: "Feedback collection",
        description:
          "Place a simple email action on receipts, table cards, handouts, or service-area signage.",
      },
      {
        title: "Event follow-up",
        description:
          "Help attendees contact an organizer or speaker with the relevant event subject already included.",
      },
      {
        title: "Applications and inquiries",
        description:
          "Make a structured first contact easier from job listings, property signs, portfolios, and brochures.",
      },
    ],
  },
  "sms-qr-code-generator": {
    badge: "Start an SMS in one scan",
    faq: [
      {
        question: "Will scanning send the SMS immediately?",
        answer:
          "No. A compatible device opens its messaging app with the number and optional text filled in. The user must still review and send the message.",
      },
      {
        question: "How should I format the mobile number?",
        answer:
          "Include the international country code. Qraftt accepts common spacing and punctuation, then creates a clean global number for the SMS destination.",
      },
      {
        question: "Can long pre-filled messages be used?",
        answer:
          "The generator allows up to 1,000 characters, but carriers may split longer messages and apply normal messaging charges. Short templates are usually clearer.",
      },
      {
        question: "Does SMS require internet access?",
        answer:
          "Opening the draft does not depend on Qraftt or a web page. Sending still requires the device to have an available mobile messaging service.",
      },
    ],
    h1: "Free SMS QR Code Generator",
    howTo: [
      {
        title: "Add the mobile number",
        description:
          "Enter the destination in international format so the QR code works consistently across regions.",
      },
      {
        title: "Write an optional message",
        description:
          "Pre-fill a short keyword, request, reference, or reply that the person can edit before sending.",
      },
      {
        title: "Test on a mobile device",
        description:
          "Confirm the correct messaging app, number, and text appear, then download the final PNG or SVG.",
      },
    ],
    introduction:
      "Build a static QR code that opens an SMS draft with a validated international number and optional message. Qraftt creates the standards-based sms URI locally, with no redirect or server dependency after download.",
    label: "SMS QR Generator",
    metaDescription:
      "Create a free SMS QR code with a phone number and optional prefilled message. Local static generation with PNG and SVG downloads.",
    related: [
      "phone-qr-code-generator",
      "whatsapp-qr-code-generator",
      "email-qr-code-generator",
      "qr-code-generator",
    ],
    seoTitle: "Free SMS QR Code Generator — Prefilled Message",
    slug: "sms-qr-code-generator",
    type: "sms",
    useCases: [
      {
        title: "Keyword responses",
        description:
          "Pre-fill a campaign keyword or reference so people send the exact text your process expects.",
      },
      {
        title: "Appointment check-ins",
        description:
          "Let visitors notify a team of arrival from a doorway, parking area, or waiting-room sign.",
      },
      {
        title: "Service requests",
        description:
          "Put a ready-made maintenance, pickup, or assistance message on equipment and printed notices.",
      },
      {
        title: "Event participation",
        description:
          "Make contest entries, RSVPs, and audience responses faster without asking people to type a number.",
      },
    ],
  },
  "phone-qr-code-generator": {
    badge: "Open the dialer instantly",
    faq: [
      {
        question: "Does scanning call the number automatically?",
        answer:
          "No. The code opens the phone dialer with the number filled in. The person scanning must choose whether to place the call.",
      },
      {
        question: "Why is the country code required?",
        answer:
          "A global number is less ambiguous and more likely to work for people scanning from different regions or using devices configured in another country.",
      },
      {
        question: "Can I use a landline or business number?",
        answer:
          "Yes. The destination can be a mobile, landline, or business number as long as it is entered in a valid international format.",
      },
      {
        question: "Does Qraftt route or record calls?",
        answer:
          "No. The static QR code contains a direct tel URI. Qraftt is not involved when the code is scanned or when a call is placed.",
      },
    ],
    h1: "Free Phone Number QR Code Generator",
    howTo: [
      {
        title: "Enter the phone number",
        description:
          "Add the complete international number, including country code, and verify every digit.",
      },
      {
        title: "Customize for its setting",
        description:
          "Choose high-contrast colors and suitable error correction for a screen, card, sign, or label.",
      },
      {
        title: "Test the dialer action",
        description:
          "Scan the preview and confirm the correct number appears before downloading PNG or SVG.",
      },
    ],
    introduction:
      "Create a phone QR code that opens a device’s dialer with a validated international number ready to call. The static tel destination is encoded locally and works without a Qraftt redirect or hosted landing page.",
    label: "Phone QR Generator",
    metaDescription:
      "Create a free phone number QR code that opens the dialer. Generate a direct tel code locally and download PNG or SVG without signup.",
    related: [
      "sms-qr-code-generator",
      "whatsapp-qr-code-generator",
      "vcard-qr-code-generator",
      "qr-code-generator",
    ],
    seoTitle: "Free Phone Number QR Code Generator",
    slug: "phone-qr-code-generator",
    type: "phone",
    useCases: [
      {
        title: "Storefront contact",
        description:
          "Put a direct call action on windows, counters, and signs for questions during or after opening hours.",
      },
      {
        title: "Service and maintenance",
        description:
          "Attach the correct support number to machinery, rental items, vehicles, or building systems.",
      },
      {
        title: "Property inquiries",
        description:
          "Help viewers call an agent or manager directly from a listing sheet or property sign.",
      },
      {
        title: "Printed directories",
        description:
          "Make important department, reception, or assistance numbers easier to dial without transcription errors.",
      },
    ],
  },
  "location-qr-code-generator": {
    badge: "Share exact map coordinates",
    faq: [
      {
        question: "What information does a location QR code contain?",
        answer:
          "It contains latitude and longitude coordinates in a standard geo URI. A compatible scanner can pass those coordinates to a map or location app.",
      },
      {
        question: "How can I find latitude and longitude?",
        answer:
          "Most map services show coordinates when you drop a pin or inspect a place. Copy the decimal values carefully and keep latitude before longitude.",
      },
      {
        question: "What coordinate ranges are valid?",
        answer:
          "Latitude must be between -90 and 90. Longitude must be between -180 and 180. Positive and negative decimal values are supported.",
      },
      {
        question: "Does the QR code depend on one map provider?",
        answer:
          "No. It uses a standard geo destination rather than a Google Maps or Apple Maps link. The scanning device decides which compatible app handles it.",
      },
    ],
    h1: "Free Location QR Code Generator",
    howTo: [
      {
        title: "Find the coordinates",
        description:
          "Copy the decimal latitude and longitude for the exact entrance, landmark, meeting point, or site.",
      },
      {
        title: "Enter and validate the values",
        description:
          "Place latitude first and longitude second. The generator checks their numeric format and valid geographic ranges.",
      },
      {
        title: "Open the map preview",
        description:
          "Scan with a mobile device to confirm the pin is correct, then download a high-quality PNG or SVG.",
      },
    ],
    introduction:
      "Convert latitude and longitude into a static location QR code using a standard geo URI. The coordinates are validated and encoded directly in your browser, without tying the code to one map provider.",
    label: "Location QR Generator",
    metaDescription:
      "Create a free location QR code from latitude and longitude. Generate a standard geo URI locally and download PNG or SVG.",
    related: [
      "url-qr-code-generator",
      "text-qr-code-generator",
      "qr-code-generator",
    ],
    seoTitle: "Free Location QR Code Generator — Coordinates",
    slug: "location-qr-code-generator",
    type: "location",
    useCases: [
      {
        title: "Event meeting points",
        description:
          "Guide attendees to a precise gate, entrance, pickup area, or outdoor gathering point.",
      },
      {
        title: "Trails and outdoor sites",
        description:
          "Share a viewpoint, campsite, trailhead, survey marker, or field location where street addresses are limited.",
      },
      {
        title: "Deliveries and access",
        description:
          "Identify the correct loading bay, service entrance, parking area, or construction access point.",
      },
      {
        title: "Travel and tourism",
        description:
          "Add exact coordinates for landmarks and remote attractions to guides, tickets, and visitor materials.",
      },
    ],
  },
  "instagram-qr-code-generator": {
    badge: "Link directly to Instagram",
    faq: [
      {
        question: "Should I enter an Instagram username or full URL?",
        answer:
          "Either works. Enter a username for a straightforward profile link, or paste a public Instagram profile URL that you have already checked.",
      },
      {
        question: "Will the QR code open the Instagram app?",
        answer:
          "On devices with Instagram installed, the operating system may open the app. Otherwise the profile normally opens in a web browser.",
      },
      {
        question: "Can the code show a private Instagram profile?",
        answer:
          "It can link to the profile, but Instagram’s privacy rules still apply. People who are not approved followers will only see what the account allows.",
      },
      {
        question: "Does Qraftt track profile visits?",
        answer:
          "No. The static code stores a direct instagram.com destination and does not pass visitors through a Qraftt redirect.",
      },
    ],
    guidance: {
      title: "Prepare an Instagram QR code for public sharing",
      description:
        "The profile destination, account visibility, and final physical placement all affect whether a scan leads people to the account you intend.",
      items: [
        {
          title: "Confirm the exact username",
          description:
            "Open the profile from its public URL and check spelling, punctuation, and account identity before generating permanent material.",
        },
        {
          title: "Review profile visibility",
          description:
            "A private account can still be linked, but people who are not approved followers will only see what Instagram allows.",
        },
        {
          title: "Give the code context",
          description:
            "Label the placement so people know they are opening Instagram and understand why the account is relevant to them.",
        },
      ],
    },
    h1: "Free Instagram QR Code Generator",
    howTo: [
      {
        title: "Enter the profile",
        description:
          "Type the Instagram username with or without @, or paste the full public profile URL.",
      },
      {
        title: "Confirm the destination",
        description:
          "Check spelling and scan the live preview to make sure the intended account opens rather than a similar username.",
      },
      {
        title: "Prepare the profile code for placement",
        description:
          "Choose readable colors and export PNG for digital material or scalable SVG for professional printing.",
      },
    ],
    introduction:
      "Create a static Instagram QR code from a username or official profile URL. The direct instagram.com destination is validated and encoded locally, making it easy to connect printed and physical material to your account.",
    label: "Instagram QR Generator",
    metaDescription:
      "Create a free Instagram QR code from a username or official profile URL. Generate a direct profile link locally and download PNG or SVG.",
    related: [
      "facebook-qr-code-generator",
      "tiktok-qr-code-generator",
      "snapchat-qr-code-generator",
      "youtube-qr-code-generator",
    ],
    seoTitle: "Free Instagram QR Code Generator for Profiles",
    slug: "instagram-qr-code-generator",
    type: "instagram",
    topic: "Instagram profile QR code",
    useCases: [
      {
        title: "In-store profile discovery",
        description:
          "Connect shoppers to product photos, launches, and account updates from counters and packaging.",
      },
      {
        title: "Creator portfolios",
        description:
          "Add a direct profile path to media kits, event badges, prints, and physical creative work.",
      },
      {
        title: "Hospitality venues",
        description:
          "Invite guests to find a restaurant, hotel, studio, or attraction account from menus and signs.",
      },
      {
        title: "Event promotion",
        description:
          "Place the official account on posters, booths, tickets, and photo areas without asking people to search.",
      },
    ],
  },
  "facebook-qr-code-generator": {
    badge: "Open a Facebook page directly",
    faq: [
      {
        question: "Can I use a Facebook username or page URL?",
        answer:
          "Yes. Enter a valid username for a simple profile or page destination, or paste a public URL on an official Facebook domain.",
      },
      {
        question: "Will the Facebook app open after scanning?",
        answer:
          "The device may open the Facebook app when it is installed and associated with Facebook links. Otherwise the destination opens in a browser.",
      },
      {
        question: "Why can some people not see the destination?",
        answer:
          "Facebook visibility, age, region, login, and privacy settings still apply. Test the URL while signed out when the page is intended for the public.",
      },
      {
        question: "Can the destination be changed later?",
        answer:
          "The static code cannot be edited. It will continue pointing to the same Facebook URL, so create a new QR code if that destination changes.",
      },
    ],
    h1: "Free Facebook QR Code Generator",
    howTo: [
      {
        title: "Add the Facebook destination",
        description:
          "Enter the username or paste the public profile, page, group, event, or post URL you want to share.",
      },
      {
        title: "Check public access",
        description:
          "Open the destination outside your own logged-in session and verify that the intended audience can view it.",
      },
      {
        title: "Test and export",
        description:
          "Scan the live code on a phone, then download a high-resolution PNG or scalable SVG for placement.",
      },
    ],
    introduction:
      "Generate a Facebook QR code from a username or public URL on an official Facebook domain. Qraftt validates the direct destination and creates the static code locally without adding redirects or tracking parameters.",
    label: "Facebook QR Generator",
    metaDescription:
      "Create a free Facebook QR code for a profile, page, group, event, or post. Direct local generation with PNG and SVG downloads.",
    related: [
      "instagram-qr-code-generator",
      "linkedin-qr-code-generator",
      "youtube-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Facebook QR Code Generator",
    slug: "facebook-qr-code-generator",
    type: "facebook",
    useCases: [
      {
        title: "Local business pages",
        description:
          "Help visitors reach current updates, opening information, and community content from physical locations.",
      },
      {
        title: "Groups and communities",
        description:
          "Make a public group or community destination easy to find from newsletters, signs, and handouts.",
      },
      {
        title: "Events and fundraisers",
        description:
          "Link posters, invitations, and venue displays to a public event or campaign page.",
      },
      {
        title: "Campaign materials",
        description:
          "Connect print and packaging to a specific public post or page without requiring a manual search.",
      },
    ],
  },
  "youtube-qr-code-generator": {
    badge: "Share any public YouTube URL",
    faq: [
      {
        question: "Which YouTube links can I use?",
        answer:
          "You can use an official YouTube or youtu.be URL for a channel, video, Short, playlist, live stream, or other public destination.",
      },
      {
        question: "Does the video play automatically?",
        answer:
          "Scanning opens the YouTube destination. Playback behavior depends on the device, app, browser, and the URL itself; the QR code does not force autoplay.",
      },
      {
        question: "Can I link to an unlisted or private video?",
        answer:
          "An unlisted video can work for anyone who has the URL. Private videos remain limited to viewers authorized by the video owner.",
      },
      {
        question: "Is scan tracking added to the YouTube URL?",
        answer:
          "No. Qraftt encodes the official URL you provide and does not add a redirect, tracking service, or extra campaign parameters.",
      },
    ],
    h1: "Free YouTube QR Code Generator",
    howTo: [
      {
        title: "Copy the YouTube URL",
        description:
          "Open the channel, video, playlist, Short, or stream and copy its official youtube.com or youtu.be link.",
      },
      {
        title: "Paste and validate it",
        description:
          "Add the URL to the generator. Only official YouTube domains are accepted for this focused QR type.",
      },
      {
        title: "Scan before publishing",
        description:
          "Confirm the correct content opens on mobile, then customize and download the PNG or SVG file.",
      },
    ],
    introduction:
      "Turn a public YouTube channel, video, playlist, Short, or live-stream URL into a static QR code. The official destination is validated and encoded directly in your browser with no Qraftt redirect.",
    label: "YouTube QR Generator",
    metaDescription:
      "Create a free YouTube QR code for a channel, video, playlist, Short, or stream. Validate the direct URL and download PNG or SVG.",
    related: [
      "tiktok-qr-code-generator",
      "instagram-qr-code-generator",
      "facebook-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free YouTube QR Code Generator",
    slug: "youtube-qr-code-generator",
    type: "youtube",
    useCases: [
      {
        title: "Product tutorials",
        description:
          "Place setup, care, and demonstration videos on packaging, manuals, and equipment labels.",
      },
      {
        title: "Education and training",
        description:
          "Connect worksheets, slides, exhibits, and training stations to a focused video or playlist.",
      },
      {
        title: "Music and performance",
        description:
          "Link posters, programs, merchandise, and venue material to an official video or channel.",
      },
      {
        title: "Creator promotion",
        description:
          "Make a channel or current release easy to open from business cards, booths, and print campaigns.",
      },
    ],
  },
  "tiktok-qr-code-generator": {
    badge: "Link directly to TikTok",
    faq: [
      {
        question: "Can I enter a TikTok username instead of a URL?",
        answer:
          "Yes. Enter the username with or without @, or paste a public profile URL on the official TikTok domain.",
      },
      {
        question: "Will scanning open the TikTok app?",
        answer:
          "A device with TikTok installed may open the app. Other devices typically open the same official destination in a browser.",
      },
      {
        question: "Can I link directly to a TikTok video?",
        answer:
          "Yes. Paste the complete official TikTok video URL rather than a username when you want the code to open one specific post.",
      },
      {
        question: "What happens if the username changes?",
        answer:
          "The static QR code keeps its original destination. If that URL no longer resolves to the intended profile, generate and replace the code.",
      },
    ],
    h1: "Free TikTok QR Code Generator",
    howTo: [
      {
        title: "Enter a username or TikTok URL",
        description:
          "Use a handle for a profile destination or paste an official video or profile link for something specific.",
      },
      {
        title: "Check the account or video",
        description:
          "Scan the live preview and verify the correct public TikTok destination opens before distributing the code.",
      },
      {
        title: "Customize and export",
        description:
          "Keep strong contrast, choose error correction for the placement, and download PNG or print-ready SVG.",
      },
    ],
    introduction:
      "Create a TikTok QR code from a username, profile URL, or official video link. The direct tiktok.com destination is checked and encoded locally, so the downloaded static code does not depend on Qraftt.",
    label: "TikTok QR Generator",
    metaDescription:
      "Create a free TikTok QR code for a username, profile, or video. Direct local generation with customizable PNG and SVG downloads.",
    related: [
      "instagram-qr-code-generator",
      "youtube-qr-code-generator",
      "facebook-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free TikTok QR Code Generator",
    slug: "tiktok-qr-code-generator",
    type: "tiktok",
    useCases: [
      {
        title: "Creator merchandise",
        description:
          "Connect packaging, inserts, apparel tags, and physical products to a profile or featured video.",
      },
      {
        title: "Retail campaigns",
        description:
          "Move shoppers from displays and receipts to demonstrations, launches, and public brand content.",
      },
      {
        title: "Events and performances",
        description:
          "Share an official account or event video from posters, tickets, booths, and venue screens.",
      },
      {
        title: "Portfolio promotion",
        description:
          "Add a scannable path to short-form work on media kits, résumés, cards, and creative displays.",
      },
    ],
  },
  "linkedin-qr-code-generator": {
    badge: "Share a professional LinkedIn URL",
    faq: [
      {
        question: "Which LinkedIn URLs can I use?",
        answer:
          "Use an official public LinkedIn URL for a personal profile, company page, post, newsletter, or other destination you want to share.",
      },
      {
        question: "Why does the generator require the full URL?",
        answer:
          "LinkedIn uses different paths for profiles, companies, posts, and other content. The full URL preserves the exact destination instead of guessing.",
      },
      {
        question: "Will everyone see the same LinkedIn content?",
        answer:
          "Not always. LinkedIn may require login or apply visibility settings based on the account, content, region, and person viewing it.",
      },
      {
        question: "Does Qraftt collect profile or scan data?",
        answer:
          "No. The official linkedin.com URL is encoded directly into the static QR code and is not routed through Qraftt.",
      },
    ],
    h1: "Free LinkedIn QR Code Generator",
    howTo: [
      {
        title: "Copy the public LinkedIn URL",
        description:
          "Open the profile, company page, or post you want to share and copy its full official URL.",
      },
      {
        title: "Paste and verify it",
        description:
          "The generator confirms the destination uses an official LinkedIn domain before creating the preview.",
      },
      {
        title: "Test and download",
        description:
          "Scan while signed out when public access matters, then export PNG for digital use or SVG for print.",
      },
    ],
    introduction:
      "Generate a LinkedIn QR code for a public profile, company page, post, or other official LinkedIn URL. Qraftt validates and encodes the direct destination locally without adding a tracking redirect.",
    label: "LinkedIn QR Generator",
    metaDescription:
      "Create a free LinkedIn QR code for a profile, company, or post URL. Generate locally with a direct destination and download PNG or SVG.",
    related: [
      "vcard-qr-code-generator",
      "facebook-qr-code-generator",
      "instagram-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free LinkedIn QR Code Generator",
    slug: "linkedin-qr-code-generator",
    type: "linkedin",
    useCases: [
      {
        title: "Business cards",
        description:
          "Give new contacts a direct path to the professional profile that supports your printed details.",
      },
      {
        title: "Conference badges",
        description:
          "Make networking follow-up faster from badges, table signs, speaker slides, and booth materials.",
      },
      {
        title: "Recruiting materials",
        description:
          "Connect job-fair displays, company brochures, and candidate documents to a relevant LinkedIn page.",
      },
      {
        title: "Professional presentations",
        description:
          "Share a profile, company update, or source post at the end of a workshop or presentation.",
      },
    ],
  },
  "telegram-qr-code-generator": {
    badge: "Open Telegram destinations directly",
    faq: [
      {
        question: "What Telegram destinations are supported?",
        answer:
          "You can enter a public username or paste an official t.me or telegram.me URL for a user, bot, channel, group, or valid invite destination.",
      },
      {
        question: "Should I include the @ symbol?",
        answer:
          "It is optional when entering a public username. Qraftt removes the symbol and creates the corresponding direct t.me destination.",
      },
      {
        question: "Can I use a private invitation link?",
        answer:
          "Yes, when you paste the complete official t.me invitation URL. Treat private invite QR codes carefully because anyone who receives one may be able to request or gain access.",
      },
      {
        question: "Does scanning depend on Qraftt?",
        answer:
          "No. The static QR code points directly to Telegram. The Telegram app or website handles the destination after scanning.",
      },
    ],
    h1: "Free Telegram QR Code Generator",
    howTo: [
      {
        title: "Enter the Telegram destination",
        description:
          "Use a public username with or without @, or paste a complete official Telegram link.",
      },
      {
        title: "Check access and identity",
        description:
          "Scan the preview to confirm the correct user, bot, channel, group, or invitation appears.",
      },
      {
        title: "Customize and download",
        description:
          "Choose a high-contrast design, test it at the intended size, and export PNG or scalable SVG.",
      },
    ],
    introduction:
      "Create a Telegram QR code for a public username, bot, channel, group, or official invitation URL. The direct t.me destination is generated in your browser and stored in a static code with no Qraftt redirect.",
    label: "Telegram QR Generator",
    metaDescription:
      "Create a free Telegram QR code for a username, bot, channel, group, or t.me link. Generate locally and download PNG or SVG.",
    related: [
      "whatsapp-qr-code-generator",
      "sms-qr-code-generator",
      "instagram-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Telegram QR Code Generator",
    slug: "telegram-qr-code-generator",
    type: "telegram",
    useCases: [
      {
        title: "Public channels",
        description:
          "Promote an announcements or content channel from posters, packaging, handouts, and events.",
      },
      {
        title: "Community groups",
        description:
          "Help eligible people find a public group or use a carefully distributed invitation link.",
      },
      {
        title: "Bots and automated help",
        description:
          "Connect users to a public Telegram bot from instructions, service desks, and product materials.",
      },
      {
        title: "Direct contact",
        description:
          "Put a public Telegram username on cards, profiles, signs, and support documentation.",
      },
    ],
  },
  "google-review-qr-code-generator": {
    badge: "Direct Google review destination",
    faq: [
      {
        question: "Where do I get my Google review link?",
        answer:
          "Open your verified Google Business Profile, choose the option to get more reviews, and copy the link Google provides. Paste that exact link into the generator.",
      },
      {
        question: "Does the QR code collect or store reviews?",
        answer:
          "No. The code opens the Google destination you provide. Reviews are written and submitted on Google, not on Qraftt.",
      },
      {
        question: "Can I offer a reward for scanning and reviewing?",
        answer:
          "Google requires reviews to reflect genuine experiences and prohibits incentives in exchange for reviews. Use the code as a convenient, neutral request for honest feedback.",
      },
      {
        question: "Will the Google review QR code expire?",
        answer:
          "The static QR code itself does not expire. It continues to work while the Google review or Maps URL encoded in it remains available.",
      },
    ],
    guidance: {
      title: "Use a Google review QR code responsibly",
      description:
        "The code should make honest feedback easier without influencing what customers say or sending them to the wrong business profile.",
      items: [
        {
          title: "Use the business profile’s review link",
          description:
            "Copy the review-request destination supplied by the correct Google Business Profile and verify the business name after scanning.",
        },
        {
          title: "Ask for genuine feedback",
          description:
            "Present the code as a neutral invitation to share a real experience, without rewards, review gating, or pressure for a specific rating.",
        },
        {
          title: "Place it after a real interaction",
          description:
            "Use receipts, completion cards, or checkout material where verified customers can respond at an appropriate moment.",
        },
      ],
    },
    h1: "Free Google Review QR Code Generator",
    howTo: [
      {
        title: "Copy your Google review link",
        description:
          "Get the review-request link from your Google Business Profile or copy the correct public Google Maps destination.",
      },
      {
        title: "Paste and verify the destination",
        description:
          "Enter the official Google URL and scan the live preview to confirm that it opens the intended business profile or review flow.",
      },
      {
        title: "Download for customer touchpoints",
        description:
          "Choose a high-contrast design, export PNG or SVG, and test the final printed code before displaying it.",
      },
    ],
    introduction:
      "Turn an official Google review or Google Maps link into a static QR code customers can scan after a genuine visit. The validated destination is encoded locally and opens Google directly, without a Qraftt redirect or review collection page.",
    label: "Google Review QR Generator",
    metaDescription:
      "Create a free Google Review QR code from an official Business Profile review or Maps URL. Generate locally and download PNG or SVG.",
    related: [
      "location-qr-code-generator",
      "url-qr-code-generator",
      "menu-qr-code-generator",
      "whatsapp-qr-code-generator",
    ],
    seoTitle: "Free Google Review QR Code Generator for Business",
    slug: "google-review-qr-code-generator",
    type: "google-review",
    topic: "Google Review QR code",
    useCases: [
      {
        title: "Receipts and checkout counters",
        description:
          "Give recent customers a convenient way to reach the correct Google review destination after their visit.",
      },
      {
        title: "Appointment follow-up cards",
        description:
          "Add the code to a neutral thank-you card for clients who have completed an appointment or service.",
      },
      {
        title: "Hotel and rental materials",
        description:
          "Place a tested review link on checkout instructions or post-stay material where guests can find it easily.",
      },
      {
        title: "Service completion documents",
        description:
          "Include a direct review route on invoices, completion notes, and customer care handouts.",
      },
    ],
  },
  "menu-qr-code-generator": {
    badge: "Open a digital menu directly",
    faq: [
      {
        question: "Does Qraftt host my restaurant menu?",
        answer:
          "No. Enter a public menu page that you already manage or use. The QR code stores that destination directly and Qraftt does not upload or host menu files.",
      },
      {
        question: "Can the menu change after I print the QR code?",
        answer:
          "Yes, if you update the content at the same web address. Because the static code stores the URL, replacing menu content without changing that URL keeps the printed code useful.",
      },
      {
        question: "Can I link to a PDF menu?",
        answer:
          "Yes. For a direct public file ending in .pdf, the dedicated PDF QR generator provides more specific validation. A responsive web menu is often easier to read on phones.",
      },
      {
        question: "Will guests pass through a Qraftt page?",
        answer:
          "No. Scanning opens the restaurant or menu URL encoded in the static QR code, with no Qraftt redirect in between.",
      },
    ],
    guidance: {
      title: "Create a menu QR code guests can use comfortably",
      description:
        "A reliable menu destination, accessible mobile page, and well-tested table placement are more important than decorative styling alone.",
      items: [
        {
          title: "Link to a mobile-friendly menu",
          description:
            "Use readable text, current prices, clear dietary information, and navigation that works without pinching or downloading an app.",
        },
        {
          title: "Keep the destination stable",
          description:
            "Update content at the same public URL whenever possible so printed table cards do not need replacement after every menu change.",
        },
        {
          title: "Test the table environment",
          description:
            "Scan the printed code under actual lighting, at seated distance, and on the material used for tables, counters, or windows.",
        },
      ],
    },
    h1: "Free Menu QR Code Generator",
    howTo: [
      {
        title: "Publish a mobile-friendly menu",
        description:
          "Use a public restaurant page, ordering page, or menu file that guests can open without signing in.",
      },
      {
        title: "Paste and test the URL",
        description:
          "Enter the menu destination and scan the preview on a phone to check readability, loading speed, and current pricing.",
      },
      {
        title: "Download for tables and signs",
        description:
          "Export PNG or SVG, preserve strong color contrast, and test the code at the size and distance where guests will scan it.",
      },
    ],
    introduction:
      "Create a static menu QR code that sends guests straight to your restaurant’s public menu, ordering page, or hosted menu file. The destination is validated and encoded in the browser, so every scan opens your link without relying on Qraftt.",
    label: "Menu QR Generator",
    metaDescription:
      "Create a free restaurant menu QR code for a public digital menu or ordering URL. Generate locally and download print-ready PNG or SVG.",
    related: [
      "pdf-qr-code-generator",
      "google-review-qr-code-generator",
      "wifi-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Restaurant Menu QR Code Generator",
    slug: "menu-qr-code-generator",
    type: "menu",
    topic: "restaurant menu QR code",
    useCases: [
      {
        title: "Restaurant tables",
        description:
          "Help seated guests open a current food and drink menu without waiting for a printed copy.",
      },
      {
        title: "Takeaway counters",
        description:
          "Link signs and counter cards to a menu, pickup instructions, or an ordering destination.",
      },
      {
        title: "Hotel rooms and venues",
        description:
          "Connect room-service cards, event tables, and hospitality displays to the relevant menu page.",
      },
      {
        title: "Window and sidewalk displays",
        description:
          "Let passersby browse the menu before entering, provided the code is large and easy to scan safely.",
      },
    ],
  },
  "spotify-qr-code-generator": {
    badge: "Direct links to Spotify",
    faq: [
      {
        question: "Which Spotify links are supported?",
        answer:
          "Use a public open.spotify.com URL for a track, album, playlist, artist, podcast show, or podcast episode. The generator validates the resource type and Spotify ID.",
      },
      {
        question: "Does the QR code play audio automatically?",
        answer:
          "No. It opens the selected Spotify destination. Playback, availability, login requirements, and app behavior are controlled by Spotify and the scanner’s device.",
      },
      {
        question: "Does Qraftt copy or host Spotify audio?",
        answer:
          "No. Qraftt stores only the official Spotify URL in the QR code. It does not download, stream, or host tracks or podcast episodes.",
      },
      {
        question: "Can I use a Spotify URI instead of a web URL?",
        answer:
          "This generator accepts public open.spotify.com links so they can work across phones and browsers. Copy the share link for the item from Spotify before generating the code.",
      },
    ],
    h1: "Free Spotify QR Code Generator",
    howTo: [
      {
        title: "Copy the Spotify share URL",
        description:
          "Open the track, album, playlist, artist, show, or episode in Spotify and copy its public link.",
      },
      {
        title: "Paste and confirm the item",
        description:
          "Enter the open.spotify.com URL and scan the live preview to make sure it reaches the exact audio or profile you intend.",
      },
      {
        title: "Customize and export",
        description:
          "Choose readable colors, test the finished code on multiple devices, and download a PNG or scalable SVG.",
      },
    ],
    introduction:
      "Create a static Spotify QR code for a track, album, playlist, artist, podcast show, or episode. Qraftt validates the official open.spotify.com destination and encodes it locally, so scans go straight to Spotify without an intermediate redirect.",
    label: "Spotify QR Generator",
    metaDescription:
      "Create a free Spotify QR code for a track, album, playlist, artist, show, or episode. Generate locally and download PNG or SVG.",
    related: [
      "youtube-qr-code-generator",
      "instagram-qr-code-generator",
      "tiktok-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Spotify QR Code Generator",
    slug: "spotify-qr-code-generator",
    type: "spotify",
    useCases: [
      {
        title: "Release promotion",
        description:
          "Connect posters, postcards, merchandise, and listening-party signs to a specific track or album.",
      },
      {
        title: "Curated playlists",
        description:
          "Share event, shop, workout, classroom, or campaign playlists from physical materials.",
      },
      {
        title: "Podcast discovery",
        description:
          "Point conference slides, flyers, and printed notes to a show or a relevant episode.",
      },
      {
        title: "Artist profiles",
        description:
          "Make an official Spotify artist page easy to reach from press kits, programs, and venue displays.",
      },
    ],
  },
  "paypal-qr-code-generator": {
    badge: "Opens PayPal securely",
    faq: [
      {
        question: "Does Qraftt process the payment?",
        answer:
          "No. Qraftt only places your validated PayPal URL in a static QR code. The person scanning reviews and completes any transaction on PayPal.",
      },
      {
        question: "Which PayPal links can I use?",
        answer:
          "The generator accepts official PayPal.Me links and recognized PayPal payment, checkout, donation, or hosted-button URLs. It rejects unrelated domains and non-payment PayPal pages.",
      },
      {
        question: "Does scanning charge someone automatically?",
        answer:
          "No. A scan only opens the PayPal destination. The payer must confirm the recipient, amount, payment type, and funding method within PayPal.",
      },
      {
        question: "Are PayPal fees included or changed by Qraftt?",
        answer:
          "No. Any availability, account requirements, fees, buyer protections, or transaction terms are determined by PayPal and the parties to the payment.",
      },
    ],
    h1: "Free PayPal QR Code Generator",
    howTo: [
      {
        title: "Copy your official PayPal link",
        description:
          "Use your PayPal.Me profile or a payment, donation, checkout, or hosted-button link created by PayPal.",
      },
      {
        title: "Verify the recipient and flow",
        description:
          "Paste the URL, then scan the preview and carefully confirm the PayPal account, amount, currency, and payment purpose.",
      },
      {
        title: "Download and test again",
        description:
          "Export PNG or SVG, scan the final asset before publishing, and keep payment descriptions clear wherever it appears.",
      },
    ],
    introduction:
      "Convert an official PayPal.Me or supported PayPal payment URL into a static QR code. The link is validated and generated locally; Qraftt never handles money, account credentials, checkout details, or transaction data.",
    label: "PayPal QR Generator",
    metaDescription:
      "Create a free QR code for an official PayPal.Me or PayPal payment link. Generated locally with no signup; download PNG or SVG.",
    related: [
      "url-qr-code-generator",
      "email-qr-code-generator",
      "whatsapp-qr-code-generator",
      "menu-qr-code-generator",
    ],
    seoTitle: "Free PayPal QR Code Generator",
    slug: "paypal-qr-code-generator",
    type: "paypal",
    useCases: [
      {
        title: "Invoices and payment requests",
        description:
          "Place a verified PayPal destination on an invoice while keeping payment completion on PayPal.",
      },
      {
        title: "Market and event stalls",
        description:
          "Offer an official PayPal option on a clearly labeled counter sign alongside other payment methods.",
      },
      {
        title: "Donation materials",
        description:
          "Connect eligible fundraising displays to an official PayPal donation or nonprofit payment destination.",
      },
      {
        title: "Remote service documents",
        description:
          "Add a direct payment-request link to proposals, completion notes, or client handoff documents.",
      },
    ],
  },
  "pdf-qr-code-generator": {
    badge: "Direct links to public PDFs",
    faq: [
      {
        question: "Does Qraftt upload or host my PDF?",
        answer:
          "No. The PDF must already be available at a public URL ending in .pdf. Qraftt validates and encodes that link locally without uploading the file.",
      },
      {
        question: "What makes a PDF URL public?",
        answer:
          "People should be able to open it without your private network, device, login, or file permissions. Test the link in a private browser window before printing the QR code.",
      },
      {
        question: "Can I replace the PDF later?",
        answer:
          "Yes, if the replacement remains at exactly the same URL. Changing the file address requires a new static QR code because the original destination cannot be edited.",
      },
      {
        question: "Does the PDF QR code expire?",
        answer:
          "The QR code does not expire, but it stops reaching the document if the hosting provider removes the file, changes its URL, or restricts public access.",
      },
    ],
    guidance: {
      title: "Prepare a dependable PDF QR code",
      description:
        "The QR code can remain scannable for years, but the document is only useful while its direct URL stays public, stable, and readable on mobile devices.",
      items: [
        {
          title: "Use a direct HTTPS file URL",
          description:
            "Link to the PDF itself rather than a private dashboard, expiring preview, or page that requires the owner’s signed-in session.",
        },
        {
          title: "Optimize the document for phones",
          description:
            "Keep the file size reasonable, use legible typography, and add document accessibility features where the source format allows.",
        },
        {
          title: "Keep ownership of the destination",
          description:
            "Host the PDF somewhere you can maintain, then test the public link and final printed QR code from a separate device.",
        },
      ],
    },
    h1: "Free PDF QR Code Generator",
    howTo: [
      {
        title: "Host the PDF publicly",
        description:
          "Publish the document on a trusted website or file host and make sure anyone with the direct link can view it without signing in.",
      },
      {
        title: "Paste and verify the PDF URL",
        description:
          "Enter the direct HTTPS link ending in .pdf, then scan the preview on another device to confirm public access.",
      },
      {
        title: "Download for print or screens",
        description:
          "Use strong contrast, export PNG or SVG, and test the finished code at its intended physical or digital size.",
      },
    ],
    introduction:
      "Create a static QR code for a PDF that is already hosted at a public web address. Qraftt requires a direct URL ending in .pdf and generates the code locally, without uploading, copying, storing, or serving your document.",
    label: "PDF QR Generator",
    metaDescription:
      "Create a free PDF QR code for a direct public document URL. No file upload or hosting—generate locally and download a sharp PNG or SVG.",
    related: [
      "menu-qr-code-generator",
      "url-qr-code-generator",
      "google-docs-qr-code-generator",
      "spreadsheet-qr-code-generator",
    ],
    seoTitle: "Free PDF QR Code Generator — Direct Document Link",
    slug: "pdf-qr-code-generator",
    type: "pdf-link",
    topic: "PDF QR code",
    useCases: [
      {
        title: "Product manuals",
        description:
          "Link packaging, equipment labels, and setup cards to an up-to-date public instruction document.",
      },
      {
        title: "Reports and brochures",
        description:
          "Connect concise printed material to a longer report, catalog, specification sheet, or downloadable brochure.",
      },
      {
        title: "Event programs",
        description:
          "Share schedules, speaker notes, maps, or accessibility information from venue signs and attendee badges.",
      },
      {
        title: "Restaurant PDF menus",
        description:
          "Open a hosted menu file from table cards while keeping the PDF under the restaurant’s own control.",
      },
    ],
  },
  "calendar-qr-code-generator": {
    badge: "Standards-based calendar event",
    faq: [
      {
        question: "What does a calendar QR code contain?",
        answer:
          "It contains an iCalendar event with a title, start and end time, plus optional location and description. Compatible scanners can offer to add those details to a calendar app.",
      },
      {
        question: "Which time zone does the event use?",
        answer:
          "The event uses the local date and time you enter. Always scan the finished code on a device in the audience’s expected time zone and confirm the displayed time before sharing it.",
      },
      {
        question: "Can the event be edited after download?",
        answer:
          "No. The static QR code stores the event details directly. Create and replace the code if the schedule, venue, or description changes.",
      },
      {
        question: "Does Qraftt create or host a calendar invitation?",
        answer:
          "No. The standards-compatible event payload is generated locally. The scanning device decides which calendar application handles it.",
      },
    ],
    h1: "Free Calendar Event QR Code Generator",
    howTo: [
      {
        title: "Enter the event details",
        description:
          "Add a clear title, local start and end time, and any useful venue or attendance notes.",
      },
      {
        title: "Check the generated event",
        description:
          "Scan the live preview and confirm the calendar app shows the correct date, duration, location, and description.",
      },
      {
        title: "Customize and download",
        description:
          "Choose a readable design, export PNG or SVG, and test the final asset on the devices your audience is likely to use.",
      },
    ],
    introduction:
      "Create a static calendar QR code containing a standards-compatible iCalendar event. The title, local start and end time, location, and description are encoded directly in your browser without hosting an event page.",
    label: "Calendar QR Generator",
    metaDescription:
      "Create a free calendar event QR code with dates, times, location, and notes. Generate an iCalendar payload locally and download PNG or SVG.",
    related: [
      "location-qr-code-generator",
      "email-qr-code-generator",
      "url-qr-code-generator",
      "text-qr-code-generator",
    ],
    seoTitle: "Free Calendar Event QR Code Generator",
    slug: "calendar-qr-code-generator",
    type: "calendar",
    useCases: [
      {
        title: "Conference schedules",
        description:
          "Let attendees add a keynote, workshop, or networking session from badges, programs, and venue signs.",
      },
      {
        title: "Appointments",
        description:
          "Place confirmed dates and times on printed reminders, service cards, or client handoff documents.",
      },
      {
        title: "Classes and training",
        description:
          "Share a lesson, webinar, rehearsal, or training session with the essential timing and location included.",
      },
      {
        title: "Community events",
        description:
          "Make public meetings, performances, and local activities easy to add without retyping their details.",
      },
    ],
  },
  "google-forms-qr-code-generator": {
    badge: "Direct Google Forms link",
    faq: [
      {
        question: "Which Google Forms links are accepted?",
        answer:
          "Use an official forms.gle short link or a public Google Forms response URL. Editing and administration links are not intended for respondents.",
      },
      {
        question: "Does Qraftt collect form responses?",
        answer:
          "No. Scanning opens Google Forms directly. Form access, responses, storage, and account requirements remain entirely with Google and the form owner.",
      },
      {
        question: "Can a form require sign-in?",
        answer:
          "Yes. Google Forms settings may restrict respondents to an organization or require a Google account. Test the link while signed out when public access is required.",
      },
      {
        question: "Can I change the form after printing the QR code?",
        answer:
          "Yes, when the response URL stays the same. If you replace the form or its link changes, generate a new static QR code.",
      },
    ],
    h1: "Free Google Forms QR Code Generator",
    howTo: [
      {
        title: "Copy the respondent link",
        description:
          "Open the form’s Send panel and copy its public response URL or official forms.gle short link.",
      },
      {
        title: "Test access and settings",
        description:
          "Paste the link, scan the preview, and confirm the intended audience can open and submit the form.",
      },
      {
        title: "Download for your touchpoint",
        description:
          "Export a high-contrast PNG or SVG and test the final code at its intended print or display size.",
      },
    ],
    introduction:
      "Turn an official Google Forms respondent link into a static QR code for surveys, registrations, feedback, and check-ins. The validated destination is encoded locally and opens Google Forms directly.",
    label: "Google Forms QR Generator",
    metaDescription:
      "Create a free Google Forms QR code from an official public form link. Generate locally with no signup and download PNG or SVG.",
    related: [
      "google-docs-qr-code-generator",
      "calendar-qr-code-generator",
      "url-qr-code-generator",
      "google-review-qr-code-generator",
    ],
    seoTitle: "Free Google Forms QR Code Generator",
    slug: "google-forms-qr-code-generator",
    type: "google-forms",
    useCases: [
      {
        title: "Event registration",
        description:
          "Connect posters, invitations, and venue displays to the correct attendee registration form.",
      },
      {
        title: "Customer feedback",
        description:
          "Invite structured feedback from receipts, table cards, product inserts, or completion notes.",
      },
      {
        title: "Attendance and check-in",
        description:
          "Give participants a quick route to a controlled sign-in or attendance form at the venue.",
      },
      {
        title: "Education surveys",
        description:
          "Link worksheets, slides, and classroom displays to quizzes, polls, or course feedback forms.",
      },
    ],
  },
  "google-docs-qr-code-generator": {
    badge: "Shareable Google Docs link",
    faq: [
      {
        question: "Which Google Docs URLs work?",
        answer:
          "Use an official docs.google.com/document link. The document’s sharing settings must allow the intended audience to view it.",
      },
      {
        question: "Does Qraftt copy or store the document?",
        answer:
          "No. Only the Google Docs URL is placed in the QR code. The document stays in Google Drive under the owner’s access controls.",
      },
      {
        question: "Can I update the document later?",
        answer:
          "Yes. Edits made to the same Google document remain available through the printed QR code because its URL has not changed.",
      },
      {
        question: "Why do some scanners see an access request?",
        answer:
          "Google applies the document’s current sharing policy. Check link access in a private browser window before distributing the code publicly.",
      },
    ],
    h1: "Free Google Docs QR Code Generator",
    howTo: [
      {
        title: "Choose the right document access",
        description:
          "Review Google Docs sharing settings and copy the link intended for viewers rather than an internal workspace shortcut.",
      },
      {
        title: "Paste and scan the document link",
        description:
          "Enter the official URL and test the preview while signed out if anonymous viewing should be possible.",
      },
      {
        title: "Export the QR asset",
        description:
          "Customize with strong contrast, then download PNG for digital use or SVG for crisp professional printing.",
      },
    ],
    introduction:
      "Create a static QR code for a shareable Google Docs document. Qraftt validates the official docs.google.com destination and generates the code in your browser without copying, uploading, or hosting the file.",
    label: "Google Docs QR Generator",
    metaDescription:
      "Create a free QR code for a shareable Google Docs URL. Validate the official link, generate locally, and download PNG or SVG.",
    related: [
      "google-forms-qr-code-generator",
      "pdf-qr-code-generator",
      "spreadsheet-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Google Docs QR Code Generator",
    slug: "google-docs-qr-code-generator",
    type: "google-docs",
    useCases: [
      {
        title: "Living instructions",
        description:
          "Link equipment, rooms, and printed guides to instructions that can be updated at the same document URL.",
      },
      {
        title: "Meeting notes",
        description:
          "Share agendas, minutes, and collaborative notes from table tents, whiteboards, or presentation slides.",
      },
      {
        title: "Class resources",
        description:
          "Connect worksheets and classroom displays to reading material, assignments, or shared reference notes.",
      },
      {
        title: "Public information",
        description:
          "Offer policies, schedules, and service details through a maintained document with appropriate public access.",
      },
    ],
  },
  "image-qr-code-generator": {
    badge: "Direct public image links",
    faq: [
      {
        question: "Does Qraftt upload or host images?",
        answer:
          "No. The image must already have a public direct URL. Qraftt encodes that address locally and never receives or stores the image file.",
      },
      {
        question: "Which image formats are accepted?",
        answer:
          "Use a direct URL ending in PNG, JPG, JPEG, WebP, GIF, or AVIF. A webpage containing an image is not the same as a direct image URL.",
      },
      {
        question: "What happens if the image URL changes?",
        answer:
          "The static QR code keeps the original address. Replace the image at that same URL or generate a new code for a different destination.",
      },
      {
        question: "How do I verify that an image is public?",
        answer:
          "Open the direct URL in a private browser window or on another device. It should load without a login, private network, or expiring session link.",
      },
    ],
    h1: "Free Image and PNG QR Code Generator",
    howTo: [
      {
        title: "Publish the image at a stable URL",
        description:
          "Use your website or a trusted file host and obtain a direct public link ending in a supported image extension.",
      },
      {
        title: "Paste and verify the image",
        description:
          "Enter the URL, scan the preview, and make sure the intended image opens without authentication.",
      },
      {
        title: "Download and test the QR code",
        description:
          "Export PNG or SVG, then scan the final asset at the size and distance planned for its placement.",
      },
    ],
    introduction:
      "Create a static QR code for a PNG, JPG, WebP, GIF, or AVIF image that is already hosted at a public URL. The direct link is validated and encoded locally without uploading or storing your image.",
    label: "Image QR Generator",
    metaDescription:
      "Create a free QR code for a direct public PNG, JPG, WebP, GIF, or AVIF URL. No uploads—generate locally and download PNG or SVG.",
    related: [
      "pdf-qr-code-generator",
      "audio-qr-code-generator",
      "url-qr-code-generator",
      "google-docs-qr-code-generator",
    ],
    seoTitle: "Free Image and PNG QR Code Generator",
    slug: "image-qr-code-generator",
    type: "image-url",
    useCases: [
      {
        title: "Photo exhibits",
        description:
          "Connect captions, labels, and printed programs to a full-resolution image hosted by the creator.",
      },
      {
        title: "Product diagrams",
        description:
          "Link packaging and equipment labels to a detailed diagram, reference image, or visual instruction.",
      },
      {
        title: "Event galleries",
        description:
          "Share a selected public poster, map, schedule graphic, or downloadable event image.",
      },
      {
        title: "Digital portfolios",
        description:
          "Point cards and printed work to a specific public visual without routing scans through Qraftt.",
      },
    ],
  },
  "audio-qr-code-generator": {
    badge: "Direct public audio links",
    faq: [
      {
        question: "Does Qraftt upload or stream audio?",
        answer:
          "No. The audio file stays on the public host you choose. Qraftt only encodes its direct URL locally inside the QR code.",
      },
      {
        question: "Which audio formats are accepted?",
        answer:
          "Direct URLs ending in MP3, WAV, OGG, M4A, AAC, FLAC, or WebM are supported. Streaming service pages should use their relevant platform generator instead.",
      },
      {
        question: "Will audio start playing automatically?",
        answer:
          "Usually not. The scanner opens the audio destination, while playback behavior depends on the device, browser, file host, and user settings.",
      },
      {
        question: "Can I replace the audio later?",
        answer:
          "Yes, if the replacement remains public at exactly the same URL. A changed address requires a new static QR code.",
      },
    ],
    h1: "Free Audio URL QR Code Generator",
    howTo: [
      {
        title: "Host the audio publicly",
        description:
          "Publish the file on a reliable HTTPS host and copy a direct URL ending in a supported audio extension.",
      },
      {
        title: "Test playback access",
        description:
          "Paste the link and scan the preview on another device to confirm the file opens without a private login.",
      },
      {
        title: "Customize and export",
        description:
          "Choose a high-contrast design, download PNG or SVG, and test the placed code before distribution.",
      },
    ],
    introduction:
      "Generate a static QR code for an MP3, WAV, OGG, M4A, AAC, FLAC, or WebM file already available at a public URL. Qraftt validates the direct link without uploading, hosting, or streaming audio.",
    label: "Audio QR Generator",
    metaDescription:
      "Create a free audio QR code for a direct public MP3, WAV, OGG, M4A, AAC, FLAC, or WebM URL. No upload; download PNG or SVG.",
    related: [
      "spotify-qr-code-generator",
      "image-qr-code-generator",
      "url-qr-code-generator",
      "youtube-qr-code-generator",
    ],
    seoTitle: "Free Audio URL QR Code Generator",
    slug: "audio-qr-code-generator",
    type: "audio-url",
    useCases: [
      {
        title: "Museum audio guides",
        description:
          "Place a direct narration or sound clip beside an exhibit without requiring a custom application.",
      },
      {
        title: "Language learning",
        description:
          "Connect worksheets, flashcards, and classroom displays to pronunciation or listening exercises.",
      },
      {
        title: "Music samples",
        description:
          "Link programs, portfolios, and physical releases to a public preview or creator-hosted recording.",
      },
      {
        title: "Accessible instructions",
        description:
          "Offer spoken directions or explanations alongside printed signs, guides, and service materials.",
      },
    ],
  },
  "spreadsheet-qr-code-generator": {
    badge: "Public spreadsheet links",
    faq: [
      {
        question: "Which spreadsheet links are supported?",
        answer:
          "Use a public Excel, CSV, ODS, or official Google Sheets URL. The generator checks the file extension or recognized Google Sheets destination.",
      },
      {
        question: "Does Qraftt read or store spreadsheet data?",
        answer:
          "No. Only the destination URL is encoded. Qraftt does not fetch the workbook, inspect its cells, or upload it to another service.",
      },
      {
        question: "Can I update the spreadsheet after printing?",
        answer:
          "Yes, if the public URL stays unchanged. Updates to the same Google Sheet or replacement file remain available through the code.",
      },
      {
        question: "Why does a scanner see a permission screen?",
        answer:
          "The host still controls access. Test the link in a private browser window and remove unintended sign-in restrictions before public distribution.",
      },
    ],
    h1: "Free Excel and Spreadsheet QR Code Generator",
    howTo: [
      {
        title: "Prepare a public spreadsheet link",
        description:
          "Use a shareable Google Sheets URL or host an Excel, CSV, or ODS file where the audience can open it.",
      },
      {
        title: "Verify access and mobile usability",
        description:
          "Paste the destination, scan the preview, and check permissions plus readability on a phone.",
      },
      {
        title: "Export the finished QR code",
        description:
          "Choose safe colors, download PNG or SVG, and test the final placement before sharing it widely.",
      },
    ],
    introduction:
      "Create a static QR code for a public Excel, CSV, ODS, or Google Sheets destination. The validated spreadsheet URL is encoded directly in your browser without fetching, reading, or hosting the file.",
    label: "Spreadsheet QR Generator",
    metaDescription:
      "Create a free QR code for Excel, CSV, ODS, or Google Sheets URLs. Generate locally without file uploads and download PNG or SVG.",
    related: [
      "google-docs-qr-code-generator",
      "image-qr-code-generator",
      "pdf-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Excel and Spreadsheet QR Code Generator",
    slug: "spreadsheet-qr-code-generator",
    type: "spreadsheet-url",
    useCases: [
      {
        title: "Inventory and checklists",
        description:
          "Connect workstations, storage areas, and field materials to a maintained tracking sheet.",
      },
      {
        title: "Schedules and rosters",
        description:
          "Share an approved public timetable, assignment list, or event roster from printed notices.",
      },
      {
        title: "Published data",
        description:
          "Link reports, exhibits, and research materials to a downloadable public dataset or workbook.",
      },
      {
        title: "Price and order sheets",
        description:
          "Give authorized audiences quick access to current lists while retaining control of the hosted file.",
      },
    ],
  },
  "discord-qr-code-generator": {
    badge: "Official Discord destinations",
    faq: [
      {
        question: "Which Discord URLs can I use?",
        answer:
          "Use an official discord.gg invite, discord.com/invite link, or a discord.com server/channel destination. Invalid lookalike domains are rejected.",
      },
      {
        question: "Can a Discord invite expire?",
        answer:
          "Yes. Invite behavior is controlled by the server and may include an expiration date, usage limit, or revocation. Create a non-expiring invite when appropriate and permitted.",
      },
      {
        question: "Does Qraftt join or manage the server?",
        answer:
          "No. The QR code only opens Discord. Membership approval, community rules, moderation, and account requirements remain with Discord and the server administrators.",
      },
      {
        question: "Will the Discord app open automatically?",
        answer:
          "A compatible device may open the installed Discord app; otherwise the official destination normally opens in a browser.",
      },
    ],
    h1: "Free Discord QR Code Generator",
    howTo: [
      {
        title: "Copy the official Discord destination",
        description:
          "Create or select the appropriate invite, server, or channel link and review its access and expiration settings.",
      },
      {
        title: "Paste and verify the link",
        description:
          "Enter the URL and scan the preview while signed out or with a separate account to confirm the intended experience.",
      },
      {
        title: "Customize and export",
        description:
          "Use strong contrast, download PNG or SVG, and test the final code before displaying it publicly.",
      },
    ],
    introduction:
      "Create a static Discord QR code for an official invite, server, or channel URL. The destination is validated and encoded directly in your browser, with no Qraftt redirect or community management layer.",
    label: "Discord QR Generator",
    metaDescription:
      "Create a free Discord QR code for an official invite, server, or channel URL. Generate locally and download customizable PNG or SVG.",
    related: [
      "telegram-qr-code-generator",
      "facebook-qr-code-generator",
      "url-qr-code-generator",
      "instagram-qr-code-generator",
    ],
    seoTitle: "Free Discord QR Code Generator",
    slug: "discord-qr-code-generator",
    type: "discord",
    useCases: [
      {
        title: "Gaming communities",
        description:
          "Place a managed invite on event signs, team materials, streams, and physical community merchandise.",
      },
      {
        title: "Course discussion spaces",
        description:
          "Share the correct server or channel from approved classroom and workshop materials.",
      },
      {
        title: "Event coordination",
        description:
          "Help attendees reach a dedicated community or support channel from badges and venue displays.",
      },
      {
        title: "Product communities",
        description:
          "Connect packaging, documentation, and booths to an official support or enthusiast server.",
      },
    ],
  },
  "amazon-qr-code-generator": {
    badge: "Official Amazon destinations",
    faq: [
      {
        question: "Which Amazon links can I use?",
        answer:
          "Use a public product or storefront URL on a supported official Amazon country domain, or an official amzn.to short link.",
      },
      {
        question: "Does Qraftt sell or fulfill products?",
        answer:
          "No. Qraftt only encodes the Amazon URL. Product information, availability, pricing, purchases, returns, and accounts are handled by Amazon and the seller.",
      },
      {
        question: "Can product prices change after printing?",
        answer:
          "Yes. The code opens the current Amazon page, whose price, seller, inventory, and availability may change independently.",
      },
      {
        question: "Are affiliate links supported?",
        answer:
          "A valid official Amazon URL can retain its existing query parameters. Anyone using affiliate links remains responsible for required disclosures and program rules.",
      },
    ],
    h1: "Free Amazon QR Code Generator",
    howTo: [
      {
        title: "Copy the Amazon destination",
        description:
          "Open the intended product or storefront on the correct regional Amazon site and copy its public URL.",
      },
      {
        title: "Verify product and region",
        description:
          "Paste the link, scan the preview, and confirm the correct listing, seller context, and country store open.",
      },
      {
        title: "Download the finished code",
        description:
          "Customize for clear scanning, export PNG or SVG, and test the final asset before distribution.",
      },
    ],
    introduction:
      "Create a static QR code for a public Amazon product or storefront on an official regional domain. The direct destination is validated and generated locally; Qraftt does not sell products or process purchases.",
    label: "Amazon QR Generator",
    metaDescription:
      "Create a free Amazon QR code for an official product or storefront URL. Generate locally with no redirects and download PNG or SVG.",
    related: [
      "url-qr-code-generator",
      "image-qr-code-generator",
      "paypal-qr-code-generator",
      "google-review-qr-code-generator",
    ],
    seoTitle: "Free Amazon Product QR Code Generator",
    slug: "amazon-qr-code-generator",
    type: "amazon",
    useCases: [
      {
        title: "Product packaging",
        description:
          "Connect inserts and labels to the matching official product detail page or storefront listing.",
      },
      {
        title: "Retail displays",
        description:
          "Offer an online product destination from a shelf card or demonstration while clearly identifying the retailer.",
      },
      {
        title: "Author and creator promotion",
        description:
          "Link event cards, books, and merchandise materials to an official Amazon listing or store page.",
      },
      {
        title: "Product comparison handouts",
        description:
          "Give readers a direct route to a referenced listing while allowing Amazon to show current availability.",
      },
    ],
  },
  "snapchat-qr-code-generator": {
    badge: "Official Snapchat links",
    faq: [
      {
        question: "Which Snapchat links can I use?",
        answer:
          "Use an official snapchat.com URL for a profile, shared destination, Lens, Spotlight item, or other supported public Snapchat path.",
      },
      {
        question: "Is this the same as a Snapcode?",
        answer:
          "No. This is a standard QR code containing an official Snapchat URL. Snapchat controls its separate Snapcode format and in-app behavior.",
      },
      {
        question: "Will scanning open the Snapchat app?",
        answer:
          "A compatible device may open Snapchat when installed. Otherwise the destination typically opens through a browser or app-install flow.",
      },
      {
        question: "Does Qraftt access my Snapchat account?",
        answer:
          "No. No login or account connection is used. The public Snapchat URL is validated and encoded locally in the static QR code.",
      },
    ],
    h1: "Free Snapchat QR Code Generator",
    howTo: [
      {
        title: "Copy the Snapchat destination",
        description:
          "Use Snapchat’s sharing tools to copy the official profile, Lens, Spotlight, or shared-content URL.",
      },
      {
        title: "Paste and test the link",
        description:
          "Scan the live preview on a phone and confirm the intended public destination opens correctly.",
      },
      {
        title: "Customize and export",
        description:
          "Choose a readable design, then download PNG for digital material or SVG for scalable print use.",
      },
    ],
    introduction:
      "Create a static Snapchat QR code for an official profile, Lens, Spotlight, or shared destination URL. The link is validated and encoded locally without connecting to your Snapchat account.",
    label: "Snapchat QR Generator",
    metaDescription:
      "Create a free Snapchat QR code for an official profile or shared destination URL. Generate locally and download PNG or SVG.",
    related: [
      "instagram-qr-code-generator",
      "tiktok-qr-code-generator",
      "discord-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Snapchat QR Code Generator",
    slug: "snapchat-qr-code-generator",
    type: "snapchat",
    useCases: [
      {
        title: "Creator promotion",
        description:
          "Connect portfolio cards, event materials, and merchandise to an official public Snapchat destination.",
      },
      {
        title: "Brand campaigns",
        description:
          "Link packaging and displays to a profile, Lens, or approved shared experience on Snapchat.",
      },
      {
        title: "Events and venues",
        description:
          "Make an official profile or event-related destination easy to open from posters and photo areas.",
      },
      {
        title: "Printed profiles",
        description:
          "Add a direct Snapchat route to cards, media kits, and other materials without asking people to search.",
      },
    ],
  },
  "app-store-qr-code-generator": {
    badge: "Official app listing links",
    faq: [
      {
        question: "Which app store links are accepted?",
        answer:
          "Use an official apps.apple.com Apple App Store listing or a play.google.com/store/apps/details Google Play listing with a valid app identifier.",
      },
      {
        question: "Can one QR code choose the store automatically?",
        answer:
          "This static generator encodes one direct store URL. Use the listing appropriate for your audience, or create separate Apple and Google Play codes.",
      },
      {
        question: "Does Qraftt install or distribute the app?",
        answer:
          "No. Scanning opens the official store listing. Installation, purchases, subscriptions, compatibility, and account requirements stay with Apple, Google, and the app publisher.",
      },
      {
        question: "Will the QR code expire when the app updates?",
        answer:
          "Usually not if the store listing URL remains the same. The destination can stop working if the app is removed or its official listing changes.",
      },
    ],
    h1: "Free App Store and Google Play QR Code Generator",
    howTo: [
      {
        title: "Copy the official app listing",
        description:
          "Open the app in Apple’s App Store or Google Play and copy its public store URL.",
      },
      {
        title: "Verify the app and platform",
        description:
          "Paste the link and scan the preview to confirm the correct publisher, app, region, and store open.",
      },
      {
        title: "Download for promotion",
        description:
          "Customize with strong contrast, export PNG or SVG, and test the final code on the target platform.",
      },
    ],
    introduction:
      "Create a static QR code for an official Apple App Store or Google Play app listing. The store destination is validated and encoded directly in your browser without an account, redirect, or app-install service.",
    label: "App Store QR Generator",
    metaDescription:
      "Create a free QR code for an Apple App Store or Google Play app listing. Validate the official URL and download PNG or SVG.",
    related: [
      "url-qr-code-generator",
      "google-forms-qr-code-generator",
      "youtube-qr-code-generator",
      "image-qr-code-generator",
    ],
    seoTitle: "Free App Store and Google Play QR Generator",
    slug: "app-store-qr-code-generator",
    type: "app-store",
    useCases: [
      {
        title: "Product packaging",
        description:
          "Help customers reach the correct companion app from setup cards, labels, and manuals.",
      },
      {
        title: "Retail and event displays",
        description:
          "Promote an official app listing from booths, posters, counters, and demonstration areas.",
      },
      {
        title: "Print campaigns",
        description:
          "Connect flyers, magazines, and direct mail to the relevant Apple or Google store destination.",
      },
      {
        title: "Onboarding material",
        description:
          "Place the correct installation link on welcome packs, training guides, and device setup instructions.",
      },
    ],
  },
};

export const generatorPageList = Object.values(generatorPages);

export function getGeneratorPage(slug: string) {
  return generatorPages[slug as GeneratorPageSlug];
}
