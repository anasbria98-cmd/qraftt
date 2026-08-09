import type { QrType } from "@/lib/qr/types";

type IconName =
  | "app"
  | "calendar"
  | "camera"
  | "card"
  | "chat"
  | "community"
  | "file"
  | "form"
  | "gamepad"
  | "image"
  | "link"
  | "location"
  | "mail"
  | "menu"
  | "music"
  | "phone"
  | "presentation"
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
  "pdf-link": "file",
  phone: "phone",
  "presentation-url": "presentation",
  reddit: "community",
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
  community: "M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a5 5 0 0 1 10 0m-2 0a5 5 0 0 1 10 0",
  file: "M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6",
  form: "M6 3h12v18H6V3Zm3 5h1m3 0h3m-7 4h1m3 0h3m-7 4h1m3 0h3",
  gamepad: "M7 8h10a4 4 0 0 1 3.7 5.5l-1.3 3.2a2 2 0 0 1-3.2.7L14.5 16h-5l-1.7 1.4a2 2 0 0 1-3.2-.7l-1.3-3.2A4 4 0 0 1 7 8Zm1 3v4m-2-2h4m6-1h.01m2 2h.01",
  image: "M4 4h16v16H4V4Zm3 12 4-4 3 3 2-2 4 4M8 8h.01",
  link: "M9 12h6M10 7H8a5 5 0 0 0 0 10h2m4-10h2a5 5 0 0 1 0 10h-2",
  location: "M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
  menu: "M5 4v7m3-7v7M5 8h3m-1.5 3v9M15 4v16m0-9c4 0 4-7 0-7",
  music: "M9 18a3 3 0 1 1-3-3h3V6l9-2v11m0 0a3 3 0 1 1-3-3h3M9 9l9-2",
  phone: "M7 3h4l1 5-3 2a15 15 0 0 0 5 5l2-3 5 1v4a4 4 0 0 1-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z",
  presentation: "M4 4h16v12H4V4Zm8 12v5m-4 0h8M8 12l3-3 2 2 3-3",
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

interface QrTypeIconProps {
  type: QrType;
}

export function QrTypeIcon({ type }: QrTypeIconProps) {
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
        strokeWidth="1.7"
      />
    </svg>
  );
}
