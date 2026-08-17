import type { QrType } from "@/lib/qr/types";

type IconName =
  | "app"
  | "calendar"
  | "camera"
  | "card"
  | "chat"
  | "file"
  | "form"
  | "gamepad"
  | "image"
  | "link"
  | "location"
  | "mail"
  | "menu"
  | "music"
  | "pdf"
  | "phone"
  | "send"
  | "shopping"
  | "spark"
  | "spreadsheet"
  | "star"
  | "text"
  | "user"
  | "video"
  | "wallet"
  | "wifi";

const iconByType: Record<QrType, IconName> = {
  amazon: "shopping",
  "app-store": "app",
  "audio-url": "music",
  calendar: "calendar",
  discord: "gamepad",
  email: "mail",
  facebook: "user",
  "google-docs": "file",
  "google-forms": "form",
  "google-review": "star",
  "image-url": "image",
  instagram: "camera",
  linkedin: "card",
  location: "location",
  menu: "menu",
  paypal: "wallet",
  "pdf-link": "pdf",
  phone: "phone",
  sms: "chat",
  snapchat: "spark",
  spotify: "music",
  "spreadsheet-url": "spreadsheet",
  telegram: "send",
  text: "text",
  tiktok: "music",
  url: "link",
  vcard: "card",
  whatsapp: "chat",
  wifi: "wifi",
  youtube: "video",
};

const iconPaths: Record<IconName, string> = {
  app: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 3h4M9 17h6M12 9v5m-2-2 2 2 2-2",
  calendar: "M5 5h14v15H5V5Zm0 5h14M8 3v4m8-4v4M8 14h3m2 0h3m-8 3h3",
  camera: "M5 7h3l1.5-2h5L16 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm7 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
  card: "M3 5h18v14H3V5Zm0 4h18M7 15a2 2 0 1 1 4 0M15 13h3m-3 3h3",
  chat: "M4 5h16v11H8l-4 3V5Zm4 4h8m-8 3h5",
  file: "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6",
  form: "M6 3h12v18H6V3Zm3 5h1m3 0h3m-7 4h1m3 0h3m-7 4h1m3 0h3",
  gamepad: "M7 8h10a4 4 0 0 1 3.7 5.5l-1.3 3.2a2 2 0 0 1-3.2.7L14.5 16h-5l-1.7 1.4a2 2 0 0 1-3.2-.7l-1.3-3.2A4 4 0 0 1 7 8Zm1 3v4m-2-2h4m6-1h.01m2 2h.01",
  image: "M4 4h16v16H4V4Zm3 12 4-4 3 3 2-2 4 4M8 8h.01",
  link: "M9 12h6M10 7H8a5 5 0 0 0 0 10h2m4-10h2a5 5 0 0 1 0 10h-2",
  location: "M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
  menu: "M5 4v7m3-7v7M5 8h3m-1.5 3v9M15 4v16m0-9c4 0 4-7 0-7",
  music: "M9 18a3 3 0 1 1-3-3h3V6l9-2v11m0 0a3 3 0 1 1-3-3h3M9 9l9-2",
  pdf: "M6 3h8l4 4v14H6V3Zm8 0v5h4M8.5 16v-4h1.2a1.3 1.3 0 0 1 0 2.6H8.5m4 1.4v-4h1a2 2 0 0 1 0 4h-1Zm4 0v-4h2.5m-2.5 2h2",
  phone: "M7 3h4l1 5-3 2a15 15 0 0 0 5 5l2-3 5 1v4a4 4 0 0 1-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z",
  send: "M3 11 21 3l-7 18-3-7-8-3Zm8 3 4-4",
  shopping: "M5 8h14l-1 13H6L5 8Zm4 0a3 3 0 0 1 6 0",
  spark: "m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Zm6 11 .7 2.3L21 17l-2.3.7L18 20l-.7-2.3L15 17l2.3-.7L18 14ZM6 14l.7 2.3L9 17l-2.3.7L6 20l-.7-2.3L3 17l2.3-.7L6 14Z",
  spreadsheet: "M4 4h16v16H4V4Zm0 5h16M9 4v16m5-11v11m-10-5h16",
  star: "m12 3 2.7 5.4 6 .9-4.4 4.2 1.1 6-5.4-2.9L6 19.5l1-6-4.3-4.2 6-.9L12 3Z",
  text: "M5 5h14M12 5v14m-4 0h8",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  video: "M4 6h16v12H4V6Zm6 3 5 3-5 3V9Z",
  wallet: "M4 6h16v14H4V6Zm0 3h16m-5 4h5v4h-5a2 2 0 0 1 0-4Z",
  wifi: "M4 9a12 12 0 0 1 16 0M7 12a8 8 0 0 1 10 0m-7 3a4 4 0 0 1 4 0m-2 4h.01",
};

function renderBrandQrTypeIcon(type: QrType) {
  const sharedProps = {
    "aria-hidden": true,
    className: "qr-type-icon qr-type-icon-brand",
    focusable: false,
    viewBox: "0 0 24 24",
  } as const;

  switch (type) {
    case "whatsapp":
      return (
        <svg {...sharedProps} fill="none">
          <path d="m5.2 19.2 1-3A8.2 8.2 0 1 1 9 18.4l-3.8.8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M9 8.2c.4-.4.8-.2 1 .2l.8 1.7c.2.4.1.7-.2 1l-.5.5a8 8 0 0 0 2.4 2.4l.6-.7c.3-.3.6-.3 1-.1l1.6.8c.4.2.6.6.3 1-1 1.5-2.3 1.7-4.5.6-2.3-1.1-4.2-3.2-4.6-5-.2-1 .4-1.9 1-2.4Z" fill="currentColor" />
        </svg>
      );
    case "google-review":
      return (
        <svg {...sharedProps} fill="none">
          <path d="M19 12.2h-7" stroke="#4285f4" strokeWidth="2.4" />
          <path d="M19 12.2a7 7 0 0 1-2.1 5" stroke="#4285f4" strokeLinecap="round" strokeWidth="2.4" />
          <path d="M16.9 17.2A7.5 7.5 0 0 1 6 15.5" stroke="#34a853" strokeLinecap="round" strokeWidth="2.4" />
          <path d="M6 15.5A7.4 7.4 0 0 1 5 10" stroke="#fbbc05" strokeLinecap="round" strokeWidth="2.4" />
          <path d="M5 10A7.4 7.4 0 0 1 16.8 6.1" stroke="#ea4335" strokeLinecap="round" strokeWidth="2.4" />
          <path d="m19 3 .65 1.35L21 5l-1.35.65L19 7l-.65-1.35L17 5l1.35-.65L19 3Z" fill="#fbbc05" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...sharedProps} fill="none">
          <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.9" />
          <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...sharedProps}>
          <path d="M14.1 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4A23 23 0 0 0 15 3.8c-2.4 0-4 1.4-4 4.1V10H8.3v3H11v8h3.1Z" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...sharedProps} fill="none">
          <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...sharedProps}>
          <path d="M14.2 3h3c.2 1.8 1.2 3.1 3 3.7v3A9 9 0 0 1 17.3 9v6.4A5.6 5.6 0 1 1 12 9.8v3.1a2.5 2.5 0 1 0 2.2 2.5V3Z" fill="currentColor" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...sharedProps}>
          <rect x="4" y="9" width="3.2" height="11" rx=".6" fill="currentColor" />
          <circle cx="5.6" cy="5.5" r="1.9" fill="currentColor" />
          <path d="M10 9h3v1.5c1-1.3 2.2-1.8 3.8-1.8 2.8 0 4.2 1.8 4.2 5V20h-3.3v-5.8c0-1.6-.6-2.6-2.1-2.6-1.6 0-2.3 1.1-2.3 3V20H10V9Z" fill="currentColor" />
        </svg>
      );
    case "telegram":
      return (
        <svg {...sharedProps}>
          <path d="M21 4.2 17.9 20c-.2 1.1-.9 1.4-1.8.9l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.4-.1-.6-.6-.3L5.7 13.9 1 12.4c-1-.3-1-1 .2-1.5L19.5 3.8c.9-.3 1.7.2 1.5.4Z" fill="currentColor" />
        </svg>
      );
    case "discord":
      return (
        <svg {...sharedProps}>
          <path d="M8.2 5.2 9 7a12 12 0 0 1 6 0l.8-1.8A14 14 0 0 1 20 7.3c1.5 2.2 2.2 4.7 2 7.2-1.7 1.3-3.4 2.1-5.1 2.6l-1.2-1.6c.7-.3 1.3-.7 1.9-1.1-3.6 1.7-7.6 1.7-11.2 0 .6.4 1.2.8 1.9 1.1L7 17.1a15 15 0 0 1-5-2.6c-.2-2.5.5-5 2-7.2a14 14 0 0 1 4.2-2.1ZM8.5 11c-1 0-1.8.9-1.8 2s.8 2 1.8 2 1.8-.9 1.8-2-.8-2-1.8-2Zm7 0c-1 0-1.8.9-1.8 2s.8 2 1.8 2 1.8-.9 1.8-2-.8-2-1.8-2Z" fill="currentColor" />
        </svg>
      );
    case "snapchat":
      return (
        <svg {...sharedProps} fill="none">
          <path d="M12 3.5c3 0 4.6 2.4 4.6 5.3 0 1.1-.2 2.1-.2 2.8.3.8 1.2 1 2.1 1.4.6.3.4 1-.2 1.2-.7.3-1.4.4-2 .5-.4 1-1.1 1.8-2.2 2.3-.8.4-1.1 1.6-2.1 1.6s-1.3-1.2-2.1-1.6a5 5 0 0 1-2.2-2.3c-.6-.1-1.3-.2-2-.5-.6-.2-.8-.9-.2-1.2.9-.4 1.8-.6 2.1-1.4 0-.7-.2-1.7-.2-2.8 0-2.9 1.6-5.3 4.6-5.3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "spotify":
      return (
        <svg {...sharedProps} fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M7.2 9.1c3.7-1 7.3-.6 10.3.9M7.9 12.2c3-.7 6.1-.4 8.7.8M8.5 15.2c2.4-.5 4.8-.2 6.9.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "google-docs":
      return (
        <svg {...sharedProps} fill="none">
          <path d="M6 2.5h8l4 4V21.5H6v-19Z" fill="currentColor" />
          <path d="M14 2.5v4h4M9 11h6M9 14h6M9 17h4.5" stroke="#4285f4" strokeLinecap="round" strokeWidth="1.35" />
        </svg>
      );
    case "google-forms":
      return (
        <svg {...sharedProps} fill="none">
          <path d="M6 2.5h8l4 4V21.5H6v-19Z" fill="currentColor" />
          <path d="M14 2.5v4h4" stroke="#7248b9" strokeWidth="1.3" />
          <circle cx="9.3" cy="11" r=".9" fill="#7248b9" />
          <circle cx="9.3" cy="15" r=".9" fill="#7248b9" />
          <path d="M12 11h3M12 15h3" stroke="#7248b9" strokeLinecap="round" strokeWidth="1.3" />
        </svg>
      );
    case "amazon":
      return (
        <svg {...sharedProps} fill="none">
          <path d="M8 9.2c.4-2 1.8-3 4.1-3 2.7 0 4.1 1.2 4.1 3.7v5.3c0 1 .2 1.7.8 2.4h-3.1l-.5-1.2c-1.1 1-2.4 1.5-3.8 1.5-2 0-3.3-1.2-3.3-3 0-2.3 1.8-3.5 5.4-3.5h1.5v-1c0-1.1-.5-1.7-1.5-1.7-.9 0-1.4.4-1.6 1.2L8 9.2Zm5.2 4.1H12c-1.7 0-2.5.4-2.5 1.3 0 .7.5 1.1 1.3 1.1 1 0 1.8-.5 2.4-1.3v-1.1Z" fill="currentColor" />
          <path d="M5 19.2c4.5 2 9 2 13.6-.2" stroke="#ff9900" strokeLinecap="round" strokeWidth="1.4" />
          <path d="m17.2 18.3 1.8.6-.7 1.7" stroke="#ff9900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
        </svg>
      );
    case "app-store":
      return (
        <svg {...sharedProps} fill="none">
          <path d="M7.3 8.2c.8 0 1.4-.4 1.9-1 .5-.6.8-1.3.7-2-.7 0-1.5.5-2 1-.4.5-.7 1.3-.6 2Zm3.6 7.6c-.5 1.1-1.2 2.5-2.4 2.5-1 0-1.3-.6-2.5-.6s-1.6.6-2.5.6c-1.2 0-2.1-1.3-2.7-2.4-1.5-2.8-1.6-6 .1-7.1.9-.6 2.1-.7 3.1-.2.7.3 1.3.6 2 .6.6 0 1.1-.3 1.9-.6 1-.4 2.2-.3 3 .4-2.2 1.4-1.8 4.5.4 5.3-.1.4-.2.9-.4 1.5Z" fill="currentColor" />
          <path d="m14 6.5 7 5.5-7 5.5v-11Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "paypal":
      return (
        <svg {...sharedProps}>
          <path d="M7.1 3h7.2c3.5 0 5.2 1.8 4.6 5-.7 3.6-3.2 5-6.4 5H10l-1.1 6H5.2L7.1 3Z" fill="#003087" />
          <path d="M10 7h5.1c3.1 0 4.6 1.6 4 4.4-.6 3.2-2.8 4.6-5.8 4.6h-1.8l-.9 5H7.1L10 7Z" fill="#009cde" fillOpacity=".9" />
        </svg>
      );
    default:
      return null;
  }
}

interface QrTypeIconProps {
  type: QrType;
}

export function QrTypeIcon({ type }: QrTypeIconProps) {
  const brandIcon = renderBrandQrTypeIcon(type);
  if (brandIcon) return brandIcon;

  return (
    <svg
      aria-hidden="true"
      className="qr-type-icon"
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d={iconPaths[iconByType[type]]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}
