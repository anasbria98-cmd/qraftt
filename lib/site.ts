export const siteConfig = {
  name: "Qraft",
  url: "https://qraft.app",
  description:
    "Create polished QR codes for links, WiFi, WhatsApp, contact details, and more. Free, private, and no signup required.",
  navigation: [
    ["QR generators", "/qr-code-generator"],
    ["Blog", "/blog"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ],
  legalNavigation: [
    ["Privacy", "/privacy-policy"],
    ["Terms", "/terms"],
    ["Cookies", "/cookie-policy"],
  ],
} as const;
