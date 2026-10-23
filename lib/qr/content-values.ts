import type { QrFormValues, QrType } from "./types";

const fields: Partial<Record<QrType, readonly (keyof QrFormValues)[]>> = {
  wifi: ["wifiSsid", "wifiPassword", "wifiEncryption", "wifiHidden"],
  whatsapp: ["whatsappNumber", "whatsappMessage"],
  email: ["emailTo", "emailSubject", "emailBody"],
  sms: ["smsNumber", "smsMessage"],
  phone: ["phoneNumber"],
  location: ["locationLatitude", "locationLongitude"],
  calendar: ["calendarTitle", "calendarStart", "calendarEnd", "calendarLocation", "calendarDescription"],
  vcard: ["vcardFirstName", "vcardLastName", "vcardOrganization", "vcardTitle", "vcardPhone", "vcardEmail", "vcardWebsite"],
};
// Never save another QR type's hidden fields (for example, a previously entered
// WiFi password while the current design is a public URL).
export function qrContentValues(type: QrType, values: Partial<QrFormValues>): Partial<QrFormValues> {
  const keys = fields[type] ?? [type as keyof QrFormValues];
  return Object.fromEntries(keys.filter(key => Object.hasOwn(values, key) && !(type === "wifi" && key === "wifiPassword" && values.wifiEncryption === "nopass")).map(key => [key, values[key]]));
}
