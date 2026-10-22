export const siteConfig = {
  name: "Qraftt",
  url: "https://www.qraftt.com",
  description:
    "Qraftt is a free browser-based static QR code generator. Downloaded QR codes encode their destination or content directly and do not depend on Qraftt redirects.",
  navigation: [
    ["QR Generators", "/qr-code-generator"],
    ["Pricing", "/pricing"],
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
