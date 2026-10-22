import type { GeneratorPageSlug } from "./generator-pages.ts";

export interface TechnicalCitation {
  name: string;
  url: `https://${string}`;
}

export const generatorTechnicalCitations: Partial<
  Record<GeneratorPageSlug, ReadonlyArray<TechnicalCitation>>
> = {
  "audio-qr-code-generator": [
    {
      name: "IANA Media Types Registry — Audio",
      url: "https://www.iana.org/assignments/media-types/media-types.xhtml#audio",
    },
  ],
  "calendar-qr-code-generator": [
    {
      name: "RFC 5545 — Internet Calendaring and Scheduling Core Object Specification",
      url: "https://www.rfc-editor.org/info/rfc5545/",
    },
  ],
  "event-qr-code-generator": [
    {
      name: "RFC 5545 — Internet Calendaring and Scheduling Core Object Specification",
      url: "https://www.rfc-editor.org/info/rfc5545/",
    },
  ],
  "email-qr-code-generator": [
    {
      name: "RFC 6068 — The mailto URI Scheme",
      url: "https://www.rfc-editor.org/info/rfc6068/",
    },
  ],
  "image-qr-code-generator": [
    {
      name: "IANA Media Types Registry — Image",
      url: "https://www.iana.org/assignments/media-types/media-types.xhtml#image",
    },
  ],
  "location-qr-code-generator": [
    {
      name: "RFC 5870 — A URI for Geographic Locations",
      url: "https://www.rfc-editor.org/info/rfc5870/",
    },
  ],
  "pdf-qr-code-generator": [
    {
      name: "IANA Media Type Registration — application/pdf",
      url: "https://www.iana.org/assignments/media-types/application/pdf",
    },
  ],
  "phone-qr-code-generator": [
    {
      name: "RFC 3966 — The tel URI for Telephone Numbers",
      url: "https://www.rfc-editor.org/info/rfc3966/",
    },
  ],
  "sms-qr-code-generator": [
    {
      name: "RFC 5724 — URI Scheme for SMS",
      url: "https://www.rfc-editor.org/info/rfc5724/",
    },
  ],
  "spreadsheet-qr-code-generator": [
    {
      name: "RFC 4180 — Common Format and MIME Type for CSV Files",
      url: "https://www.rfc-editor.org/info/rfc4180/",
    },
    {
      name: "IANA Media Types Registry",
      url: "https://www.iana.org/assignments/media-types/media-types.xhtml",
    },
  ],
  "url-qr-code-generator": [
    {
      name: "RFC 3986 — Uniform Resource Identifier Generic Syntax",
      url: "https://www.rfc-editor.org/info/rfc3986/",
    },
  ],
  "vcard-qr-code-generator": [
    {
      name: "RFC 6350 — vCard Format Specification",
      url: "https://www.rfc-editor.org/info/rfc6350/",
    },
  ],
  "wifi-qr-code-generator": [
    {
      name: "ZXing Barcode Contents — Wi-Fi Network Configuration",
      url: "https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11",
    },
  ],
};

export function getGeneratorTechnicalCitations(slug: GeneratorPageSlug) {
  return generatorTechnicalCitations[slug] ?? [];
}
