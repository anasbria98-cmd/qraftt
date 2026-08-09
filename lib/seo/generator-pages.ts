import type { QrType } from "@/lib/qr/types";

export interface GeneratorPageContent {
  badge: string;
  faq: ReadonlyArray<{ answer: string; question: string }>;
  h1: string;
  howTo: ReadonlyArray<{ description: string; title: string }>;
  introduction: string;
  label: string;
  metaDescription: string;
  related: ReadonlyArray<GeneratorPageSlug>;
  seoTitle: string;
  slug: GeneratorPageSlug;
  type: QrType;
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
  | "pdf-qr-code-generator";

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
          "No. Qraft generates the QR code locally in your browser. Your link, message, WiFi password, or contact details are not sent to our server.",
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
      "Create a static QR code for links, messages, WiFi access, contact details, and more. Everything is generated in your browser, so the downloaded code points directly to your content without relying on Qraft after download.",
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
      "Create a free WiFi QR code for WPA, WEP, open, or hidden networks. Generate locally and download PNG or SVG without signup.",
    related: [
      "qr-code-generator",
      "url-qr-code-generator",
      "vcard-qr-code-generator",
    ],
    seoTitle: "Free WiFi QR Code Generator",
    slug: "wifi-qr-code-generator",
    type: "wifi",
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
        question: "Will the code work without Qraft?",
        answer:
          "Yes. The QR code contains a direct wa.me destination. Once downloaded, it does not redirect through or depend on Qraft.",
      },
    ],
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
      "Create a free WhatsApp QR code with an optional pre-filled message. Direct wa.me link, local generation, and PNG or SVG downloads.",
    related: [
      "qr-code-generator",
      "url-qr-code-generator",
      "vcard-qr-code-generator",
    ],
    seoTitle: "Free WhatsApp QR Code Generator",
    slug: "whatsapp-qr-code-generator",
    type: "whatsapp",
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
        title: "Event coordination",
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
          "Qraft generates a standards-based vCard 4.0 payload with properly escaped text, contact fields, and line formatting.",
      },
      {
        question: "Can I change the contact after printing?",
        answer:
          "A static vCard QR code cannot be updated after download. If contact details change, create and print a new code.",
      },
      {
        question: "Are my contact details stored by Qraft?",
        answer:
          "No. The vCard is assembled and encoded in your browser. The downloaded code contains the details directly and does not require a Qraft account or server.",
      },
    ],
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
      "Create a vCard QR code that lets people save structured contact details without typing them manually. Qraft builds a standards-compatible vCard 4.0 locally and embeds it directly in the static code.",
    label: "vCard QR Generator",
    metaDescription:
      "Create a free vCard QR code for names, phone, email, company, title, and website. Private local generation with PNG and SVG downloads.",
    related: [
      "qr-code-generator",
      "whatsapp-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free vCard QR Code Generator",
    slug: "vcard-qr-code-generator",
    type: "vcard",
    useCases: [
      {
        title: "Business cards",
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
        question: "Does Qraft track scans?",
        answer:
          "No. The code opens your URL directly without a Qraft redirect, so we do not receive scan data or add tracking parameters.",
      },
      {
        question: "Do I need to include https://?",
        answer:
          "You can enter a domain without the scheme and Qraft will add HTTPS. Always check the normalized destination in your browser before printing widely.",
      },
      {
        question: "Will a URL QR code expire?",
        answer:
          "The QR code itself does not expire. It will stop reaching useful content only if the destination page is removed, moved, blocked, or allowed to expire.",
      },
    ],
    h1: "Free URL QR Code Generator",
    howTo: [
      {
        title: "Paste the destination URL",
        description:
          "Enter the exact page you want to open. Qraft accepts HTTP or HTTPS and adds HTTPS to plain domains.",
      },
      {
        title: "Choose readable colors",
        description:
          "Keep strong contrast between foreground and background, then select error correction for the intended environment.",
      },
      {
        title: "Scan before publishing",
        description:
          "Test the preview and final file on more than one device before printing large quantities or permanent signage.",
      },
    ],
    introduction:
      "Convert any HTTP or HTTPS destination into a static URL QR code with no tracking redirect. The link is encoded directly in your browser, and the downloaded PNG or SVG remains independent of Qraft.",
    label: "URL QR Generator",
    metaDescription:
      "Create a free static URL QR code with no redirect or scan tracking. Generate locally, customize colors, and download PNG or SVG.",
    related: [
      "qr-code-generator",
      "whatsapp-qr-code-generator",
      "wifi-qr-code-generator",
      "vcard-qr-code-generator",
    ],
    seoTitle: "Free URL QR Code Generator — No Redirect",
    slug: "url-qr-code-generator",
    type: "url",
    useCases: [
      {
        title: "Menus and service pages",
        description:
          "Link table cards, room displays, or instructions directly to a mobile-friendly page.",
      },
      {
        title: "Product packaging",
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
        question: "Are email addresses or messages stored by Qraft?",
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
          "Include the international country code. Qraft accepts common spacing and punctuation, then creates a clean global number for the SMS destination.",
      },
      {
        question: "Can long pre-filled messages be used?",
        answer:
          "The generator allows up to 1,000 characters, but carriers may split longer messages and apply normal messaging charges. Short templates are usually clearer.",
      },
      {
        question: "Does SMS require internet access?",
        answer:
          "Opening the draft does not depend on Qraft or a web page. Sending still requires the device to have an available mobile messaging service.",
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
      "Build a static QR code that opens an SMS draft with a validated international number and optional message. Qraft creates the standards-based sms URI locally, with no redirect or server dependency after download.",
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
        question: "Does Qraft route or record calls?",
        answer:
          "No. The static QR code contains a direct tel URI. Qraft is not involved when the code is scanned or when a call is placed.",
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
      "Create a phone QR code that opens a device’s dialer with a validated international number ready to call. The static tel destination is encoded locally and works without a Qraft redirect or hosted landing page.",
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
        question: "Does Qraft track profile visits?",
        answer:
          "No. The static code stores a direct instagram.com destination and does not pass visitors through a Qraft redirect.",
      },
    ],
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
        title: "Style and download",
        description:
          "Choose readable colors and export PNG for digital material or scalable SVG for professional printing.",
      },
    ],
    introduction:
      "Create a static Instagram QR code from a username or official profile URL. The direct instagram.com destination is validated and encoded locally, making it easy to connect printed and physical material to your account.",
    label: "Instagram QR Generator",
    metaDescription:
      "Create a free Instagram QR code from a username or profile URL. Generate locally with a direct Instagram destination and download PNG or SVG.",
    related: [
      "facebook-qr-code-generator",
      "tiktok-qr-code-generator",
      "youtube-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Instagram QR Code Generator",
    slug: "instagram-qr-code-generator",
    type: "instagram",
    useCases: [
      {
        title: "Retail displays",
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
      "Generate a Facebook QR code from a username or public URL on an official Facebook domain. Qraft validates the direct destination and creates the static code locally without adding redirects or tracking parameters.",
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
          "No. Qraft encodes the official URL you provide and does not add a redirect, tracking service, or extra campaign parameters.",
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
      "Turn a public YouTube channel, video, playlist, Short, or live-stream URL into a static QR code. The official destination is validated and encoded directly in your browser with no Qraft redirect.",
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
      "Create a TikTok QR code from a username, profile URL, or official video link. The direct tiktok.com destination is checked and encoded locally, so the downloaded static code does not depend on Qraft.",
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
        question: "Does Qraft collect profile or scan data?",
        answer:
          "No. The official linkedin.com URL is encoded directly into the static QR code and is not routed through Qraft.",
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
      "Generate a LinkedIn QR code for a public profile, company page, post, or other official LinkedIn URL. Qraft validates and encodes the direct destination locally without adding a tracking redirect.",
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
          "It is optional when entering a public username. Qraft removes the symbol and creates the corresponding direct t.me destination.",
      },
      {
        question: "Can I use a private invitation link?",
        answer:
          "Yes, when you paste the complete official t.me invitation URL. Treat private invite QR codes carefully because anyone who receives one may be able to request or gain access.",
      },
      {
        question: "Does scanning depend on Qraft?",
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
      "Create a Telegram QR code for a public username, bot, channel, group, or official invitation URL. The direct t.me destination is generated in your browser and stored in a static code with no Qraft redirect.",
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
          "No. The code opens the Google destination you provide. Reviews are written and submitted on Google, not on Qraft.",
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
      "Turn an official Google review or Google Maps link into a static QR code customers can scan after a genuine visit. The validated destination is encoded locally and opens Google directly, without a Qraft redirect or review collection page.",
    label: "Google Review QR Generator",
    metaDescription:
      "Create a free Google review QR code from an official review or Maps URL. Generate locally and download PNG or SVG with no signup.",
    related: [
      "location-qr-code-generator",
      "url-qr-code-generator",
      "menu-qr-code-generator",
      "whatsapp-qr-code-generator",
    ],
    seoTitle: "Free Google Review QR Code Generator",
    slug: "google-review-qr-code-generator",
    type: "google-review",
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
        question: "Does Qraft host my restaurant menu?",
        answer:
          "No. Enter a public menu page that you already manage or use. The QR code stores that destination directly and Qraft does not upload or host menu files.",
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
        question: "Will guests pass through a Qraft page?",
        answer:
          "No. Scanning opens the restaurant or menu URL encoded in the static QR code, with no Qraft redirect in between.",
      },
    ],
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
      "Create a static menu QR code that sends guests straight to your restaurant’s public menu, ordering page, or hosted menu file. The destination is validated and encoded in the browser, so every scan opens your link without relying on Qraft.",
    label: "Menu QR Generator",
    metaDescription:
      "Create a free menu QR code for a restaurant website or public menu URL. Generate locally and download print-ready PNG or SVG files.",
    related: [
      "pdf-qr-code-generator",
      "google-review-qr-code-generator",
      "wifi-qr-code-generator",
      "url-qr-code-generator",
    ],
    seoTitle: "Free Menu QR Code Generator for Restaurants",
    slug: "menu-qr-code-generator",
    type: "menu",
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
        question: "Does Qraft copy or host Spotify audio?",
        answer:
          "No. Qraft stores only the official Spotify URL in the QR code. It does not download, stream, or host tracks or podcast episodes.",
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
      "Create a static Spotify QR code for a track, album, playlist, artist, podcast show, or episode. Qraft validates the official open.spotify.com destination and encodes it locally, so scans go straight to Spotify without an intermediate redirect.",
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
        question: "Does Qraft process the payment?",
        answer:
          "No. Qraft only places your validated PayPal URL in a static QR code. The person scanning reviews and completes any transaction on PayPal.",
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
        question: "Are PayPal fees included or changed by Qraft?",
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
      "Convert an official PayPal.Me or supported PayPal payment URL into a static QR code. The link is validated and generated locally; Qraft never handles money, account credentials, checkout details, or transaction data.",
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
        question: "Does Qraft upload or host my PDF?",
        answer:
          "No. The PDF must already be available at a public URL ending in .pdf. Qraft validates and encodes that link locally without uploading the file.",
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
      "Create a static QR code for a PDF that is already hosted at a public web address. Qraft requires a direct URL ending in .pdf and generates the code locally, without uploading, copying, storing, or serving your document.",
    label: "PDF QR Generator",
    metaDescription:
      "Create a free QR code for a direct public PDF URL. No file upload or hosting—generate locally and download a high-quality PNG or SVG.",
    related: [
      "menu-qr-code-generator",
      "url-qr-code-generator",
      "email-qr-code-generator",
      "vcard-qr-code-generator",
    ],
    seoTitle: "Free PDF QR Code Generator — No Upload",
    slug: "pdf-qr-code-generator",
    type: "pdf-link",
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
};

export const generatorPageList = Object.values(generatorPages);

export function getGeneratorPage(slug: string) {
  return generatorPages[slug as GeneratorPageSlug];
}
