export type SocialQrType =
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "telegram"
  | "discord"
  | "reddit"
  | "amazon"
  | "snapchat";

export type LinkQrType =
  | "google-review"
  | "menu"
  | "spotify"
  | "paypal"
  | "pdf-link"
  | "google-forms"
  | "google-docs"
  | "image-url"
  | "audio-url"
  | "spreadsheet-url"
  | "presentation-url"
  | "app-store";

export type QrType =
  | "url"
  | "text"
  | "wifi"
  | "whatsapp"
  | "email"
  | "vcard"
  | "sms"
  | "phone"
  | "location"
  | "calendar"
  | LinkQrType
  | SocialQrType;

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface QrFormValues {
  amazon: string;
  "app-store": string;
  "audio-url": string;
  calendarDescription: string;
  calendarEnd: string;
  calendarLocation: string;
  calendarStart: string;
  calendarTitle: string;
  discord: string;
  emailBody: string;
  emailSubject: string;
  emailTo: string;
  facebook: string;
  "google-review": string;
  "google-docs": string;
  "google-forms": string;
  "image-url": string;
  instagram: string;
  linkedin: string;
  locationLatitude: string;
  locationLongitude: string;
  menu: string;
  paypal: string;
  "pdf-link": string;
  "presentation-url": string;
  reddit: string;
  phoneNumber: string;
  smsMessage: string;
  smsNumber: string;
  spotify: string;
  "spreadsheet-url": string;
  snapchat: string;
  telegram: string;
  text: string;
  tiktok: string;
  url: string;
  vcardEmail: string;
  vcardFirstName: string;
  vcardLastName: string;
  vcardOrganization: string;
  vcardPhone: string;
  vcardTitle: string;
  vcardWebsite: string;
  whatsappMessage: string;
  whatsappNumber: string;
  wifiEncryption: WifiEncryption;
  wifiHidden: boolean;
  wifiPassword: string;
  wifiSsid: string;
  youtube: string;
}

export interface QrPayloadResult {
  error: string | null;
  payload: string;
}
