export type SocialQrType =
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "telegram";

export type LinkQrType =
  | "google-review"
  | "menu"
  | "spotify"
  | "paypal"
  | "pdf-link";

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
  | LinkQrType
  | SocialQrType;

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface QrFormValues {
  emailBody: string;
  emailSubject: string;
  emailTo: string;
  facebook: string;
  "google-review": string;
  instagram: string;
  linkedin: string;
  locationLatitude: string;
  locationLongitude: string;
  menu: string;
  paypal: string;
  "pdf-link": string;
  phoneNumber: string;
  smsMessage: string;
  smsNumber: string;
  spotify: string;
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
