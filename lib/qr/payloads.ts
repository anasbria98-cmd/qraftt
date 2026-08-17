import {
  isLinkQrType,
  isSocialQrType,
  socialQrConfig,
} from "./config.ts";
import type {
  LinkQrType,
  QrFormValues,
  QrPayloadResult,
  QrType,
  SocialQrType,
} from "./types";

const MAX_CONTENT_LENGTH = 2_000;
const EMAIL_PATTERN =
  /^[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)+$/i;

function invalid(error: string): QrPayloadResult {
  return { error, payload: "" };
}

function encodeUriComponentStrict(value: string) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function escapeWifiValue(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

function validateEmail(value: string) {
  const email = value.trim();
  const [localPart = ""] = email.split("@");
  const valid =
    email.length <= 254 &&
    localPart.length <= 64 &&
    !localPart.startsWith(".") &&
    !localPart.endsWith(".") &&
    !localPart.includes("..") &&
    EMAIL_PATTERN.test(email);

  return valid ? null : "Enter a valid email address.";
}

function normalizeHttpUrl(value: string): QrPayloadResult {
  const rawUrl = value.trim();

  if (!rawUrl) return invalid("Enter a destination URL.");
  if (rawUrl.length > MAX_CONTENT_LENGTH) return invalid("The URL is too long.");

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(rawUrl)
    ? rawUrl
    : `https://${rawUrl}`;

  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) {
      return invalid("Use an HTTP or HTTPS URL.");
    }
    return { error: null, payload: url.toString() };
  } catch {
    return invalid("Enter a valid URL, such as https://example.com.");
  }
}

function buildUrlPayload(value: string): QrPayloadResult {
  return normalizeHttpUrl(value);
}

function buildTextPayload(value: string): QrPayloadResult {
  if (!value.trim()) return invalid("Enter the text you want to share.");
  if (value.length > MAX_CONTENT_LENGTH) {
    return invalid(`Keep text under ${MAX_CONTENT_LENGTH.toLocaleString()} characters.`);
  }
  return { error: null, payload: value };
}

function buildWifiPayload(values: QrFormValues): QrPayloadResult {
  const ssid = values.wifiSsid.trim();
  const password = values.wifiPassword;

  if (!ssid) return invalid("Enter the WiFi network name.");
  if (ssid.length > 32) return invalid("The network name must be 32 characters or fewer.");

  if (values.wifiEncryption === "WPA") {
    const isStandardLength = password.length >= 8 && password.length <= 63;
    const isHexKey = /^[a-f\d]{64}$/i.test(password);
    if (!isStandardLength && !isHexKey) {
      return invalid("WPA passwords must be 8–63 characters, or a 64-character hex key.");
    }
  }

  if (values.wifiEncryption === "WEP" && !password) {
    return invalid("Enter the WiFi password.");
  }

  const passwordField =
    values.wifiEncryption === "nopass"
      ? ""
      : `P:${escapeWifiValue(password)};`;

  return {
    error: null,
    payload: `WIFI:T:${values.wifiEncryption};S:${escapeWifiValue(ssid)};${passwordField}H:${values.wifiHidden ? "true" : "false"};;`,
  };
}

function buildWhatsAppPayload(values: QrFormValues): QrPayloadResult {
  const number = values.whatsappNumber.trim();

  if (!number) return invalid("Enter a WhatsApp phone number.");
  if (!/^[+\d\s().-]+$/.test(number)) {
    return invalid("Use a valid phone number with country code.");
  }

  const digits = number.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return invalid("Use a 7–15 digit phone number including country code.");
  }

  const message = values.whatsappMessage.trim();
  const query = message ? `?text=${encodeURIComponent(message)}` : "";

  return { error: null, payload: `https://wa.me/${digits}${query}` };
}

function buildEmailPayload(values: QrFormValues): QrPayloadResult {
  const email = values.emailTo.trim();
  const emailError = validateEmail(email);
  if (emailError) return invalid(emailError);
  if (values.emailSubject.length > 200) {
    return invalid("Keep the subject under 200 characters.");
  }
  if (values.emailBody.length > 1_000) {
    return invalid("Keep the message under 1,000 characters.");
  }

  const atIndex = email.lastIndexOf("@");
  const address = `${encodeURIComponent(email.slice(0, atIndex))}@${email.slice(atIndex + 1)}`;
  const fields: string[] = [];

  if (values.emailSubject) {
    fields.push(`subject=${encodeURIComponent(values.emailSubject)}`);
  }
  if (values.emailBody) {
    const body = values.emailBody.replace(/\r?\n/g, "\r\n");
    fields.push(`body=${encodeURIComponent(body)}`);
  }

  return {
    error: null,
    payload: `mailto:${address}${fields.length ? `?${fields.join("&")}` : ""}`,
  };
}

function escapeVCardText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldVCardLine(line: string) {
  const encoder = new TextEncoder();
  const lines: string[] = [];
  let current = "";
  let maxBytes = 75;

  for (const character of line) {
    if (encoder.encode(current + character).length > maxBytes) {
      lines.push(current);
      current = character;
      maxBytes = 74;
    } else {
      current += character;
    }
  }

  lines.push(current);
  return lines.join("\r\n ");
}

function normalizePhone(value: string): QrPayloadResult {
  const phone = value.trim();
  if (!/^[+\d\s().-]+$/.test(phone)) {
    return invalid("Use a valid phone number with country code.");
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return invalid("Use a 7–15 digit phone number including country code.");
  }
  return { error: null, payload: `+${digits}` };
}

function buildSmsPayload(values: QrFormValues): QrPayloadResult {
  const phone = normalizePhone(values.smsNumber);
  if (phone.error) return phone;
  if (values.smsMessage.length > 1_000) {
    return invalid("Keep the SMS message under 1,000 characters.");
  }

  const body = values.smsMessage
    ? `?body=${encodeUriComponentStrict(values.smsMessage)}`
    : "";
  return { error: null, payload: `sms:${phone.payload}${body}` };
}

function buildPhonePayload(values: QrFormValues): QrPayloadResult {
  const phone = normalizePhone(values.phoneNumber);
  return phone.error
    ? phone
    : { error: null, payload: `tel:${phone.payload}` };
}

function normalizeCoordinate(
  value: string,
  minimum: number,
  maximum: number,
  label: string,
): QrPayloadResult {
  const coordinate = value.trim();
  if (!coordinate) return invalid(`Enter a ${label}.`);
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(coordinate)) {
    return invalid(`Enter a valid decimal ${label}.`);
  }

  const number = Number(coordinate);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    return invalid(`${label[0].toUpperCase()}${label.slice(1)} must be between ${minimum} and ${maximum}.`);
  }

  return { error: null, payload: Object.is(number, -0) ? "0" : String(number) };
}

function buildLocationPayload(values: QrFormValues): QrPayloadResult {
  const latitude = normalizeCoordinate(
    values.locationLatitude,
    -90,
    90,
    "latitude",
  );
  if (latitude.error) return latitude;

  const longitude = normalizeCoordinate(
    values.locationLongitude,
    -180,
    180,
    "longitude",
  );
  if (longitude.error) return longitude;

  return {
    error: null,
    payload: `geo:${latitude.payload},${longitude.payload}`,
  };
}

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function normalizeCalendarDate(value: string, label: string): QrPayloadResult {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return invalid(`Enter a valid ${label} date and time.`);

  const [, year, month, day, hour, minute] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  const valid =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day) &&
    date.getHours() === Number(hour) &&
    date.getMinutes() === Number(minute);

  return valid
    ? { error: null, payload: `${year}${month}${day}T${hour}${minute}00` }
    : invalid(`Enter a valid ${label} date and time.`);
}

function createStableCalendarId(value: string) {
  let hash = 2_166_136_261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return `${(hash >>> 0).toString(16)}@qraft.local`;
}

function buildCalendarPayload(values: QrFormValues): QrPayloadResult {
  const title = values.calendarTitle.trim();
  if (!title) return invalid("Enter an event title.");
  if (title.length > 200) return invalid("Keep the event title under 200 characters.");
  if (values.calendarLocation.length > 300) {
    return invalid("Keep the event location under 300 characters.");
  }
  if (values.calendarDescription.length > 1_000) {
    return invalid("Keep the event description under 1,000 characters.");
  }

  const start = normalizeCalendarDate(values.calendarStart, "start");
  if (start.error) return start;
  const end = normalizeCalendarDate(values.calendarEnd, "end");
  if (end.error) return end;
  if (end.payload <= start.payload) {
    return invalid("The event end must be after the start.");
  }

  const identity = [title, start.payload, end.payload, values.calendarLocation].join("|");
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Qraft//Static QR Event//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${createStableCalendarId(identity)}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${start.payload}`,
    `DTEND:${end.payload}`,
    `SUMMARY:${escapeCalendarText(title)}`,
  ];

  if (values.calendarLocation.trim()) {
    lines.push(`LOCATION:${escapeCalendarText(values.calendarLocation.trim())}`);
  }
  if (values.calendarDescription.trim()) {
    lines.push(
      `DESCRIPTION:${escapeCalendarText(values.calendarDescription.trim())}`,
    );
  }
  lines.push("END:VEVENT", "END:VCALENDAR");

  return {
    error: null,
    payload: `${lines.map(foldVCardLine).join("\r\n")}\r\n`,
  };
}

function isClearlyPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host === "::1" || host.endsWith(".local")) {
    return true;
  }

  const octets = host.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet))) {
    return false;
  }

  return (
    octets[0] === 0 ||
    octets[0] === 10 ||
    octets[0] === 127 ||
    (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (octets[0] === 192 && octets[1] === 168)
  );
}

function isGoogleReviewUrl(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const path = url.pathname.toLowerCase();

  if (hostname === "g.page") {
    return path !== "/" && /\/review\/?$/.test(path);
  }
  if (hostname === "maps.app.goo.gl") return path !== "/";
  if (hostname === "goo.gl") return path.startsWith("/maps/");
  if (hostname === "search.google.com") {
    return path === "/local/writereview" && url.searchParams.has("placeid");
  }
  if (hostname === "maps.google.com") {
    return path !== "/" || url.searchParams.size > 0;
  }

  return (
    (hostname === "google.com" || hostname.endsWith(".google.com")) &&
    path.startsWith("/maps")
  );
}

function isSpotifyUrl(url: URL) {
  if (url.hostname.toLowerCase() !== "open.spotify.com") return false;

  const segments = url.pathname.split("/").filter(Boolean);
  if (/^intl-[a-z-]+$/i.test(segments[0] ?? "")) segments.shift();

  const supportedTypes = new Set([
    "track",
    "album",
    "playlist",
    "artist",
    "show",
    "episode",
  ]);
  return (
    segments.length === 2 &&
    supportedTypes.has(segments[0]) &&
    /^[a-z\d]{22}$/i.test(segments[1])
  );
}

function isPayPalUrl(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const path = url.pathname;
  const paypalMePath = /^\/[a-z\d]{1,20}(?:\/\d+(?:\.\d{1,2})?(?:[a-z]{3})?)?\/?$/i;

  if (hostname === "paypal.me") return paypalMePath.test(path);
  if (hostname !== "paypal.com") return false;

  if (/^\/paypalme\//i.test(path)) {
    return paypalMePath.test(path.replace(/^\/paypalme/i, ""));
  }
  if (/^\/ncp\/payment\/[a-z\d_-]+\/?$/i.test(path)) return true;
  if (/^\/checkoutnow\/?$/i.test(path)) return url.searchParams.has("token");
  if (/^\/donate\/?$/i.test(path)) {
    return url.searchParams.has("hosted_button_id");
  }
  if (/^\/cgi-bin\/webscr$/i.test(path)) {
    return (
      url.searchParams.has("cmd") &&
      (url.searchParams.has("hosted_button_id") ||
        url.searchParams.has("business"))
    );
  }

  return false;
}

function isGoogleFormsUrl(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  if (hostname === "forms.gle") return url.pathname !== "/";
  if (hostname !== "docs.google.com") return false;
  return /^\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[a-z\d_-]+\/(?:viewform|prefill|formresponse)\/?$/i.test(
    url.pathname,
  );
}

function isGoogleDocsUrl(url: URL) {
  return (
    url.hostname.toLowerCase() === "docs.google.com" &&
    /^\/document\/d\/(?:e\/)?[a-z\d_-]+(?:\/|$)/i.test(url.pathname)
  );
}

function hasFileExtension(url: URL, extensions: readonly string[]) {
  const pathname = url.pathname.toLowerCase();
  return extensions.some((extension) => pathname.endsWith(`.${extension}`));
}

function isGoogleSheetsUrl(url: URL) {
  return (
    url.hostname.toLowerCase() === "docs.google.com" &&
    /^\/spreadsheets\/d\/[a-z\d_-]+(?:\/|$)/i.test(url.pathname)
  );
}

function isAppStoreUrl(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  if (hostname === "apps.apple.com" || hostname === "itunes.apple.com") {
    return /\/app(?:\/[^/]+)?\/id\d+(?:\/|$)/i.test(url.pathname);
  }
  return (
    hostname === "play.google.com" &&
    url.pathname === "/store/apps/details" &&
    /^[a-z\d_.]+$/i.test(url.searchParams.get("id") ?? "")
  );
}

function buildLinkPayload(
  type: LinkQrType,
  values: QrFormValues,
): QrPayloadResult {
  const normalized = normalizeHttpUrl(values[type]);
  if (normalized.error) return invalid("Enter a valid public HTTP or HTTPS URL.");

  const url = new URL(normalized.payload);
  if (url.username || url.password || isClearlyPrivateHostname(url.hostname)) {
    return invalid("Use a public URL without embedded credentials.");
  }

  switch (type) {
    case "google-review":
      return isGoogleReviewUrl(url)
        ? normalized
        : invalid("Use an official Google review or Google Maps URL.");
    case "spotify":
      return isSpotifyUrl(url)
        ? normalized
        : invalid(
            "Use an open.spotify.com track, album, playlist, artist, show, or episode URL.",
          );
    case "paypal":
      return isPayPalUrl(url)
        ? normalized
        : invalid("Use an official PayPal.Me or PayPal payment URL.");
    case "pdf-link":
      return /\.pdf$/i.test(url.pathname)
        ? normalized
        : invalid("Use a direct public URL ending in .pdf.");
    case "google-forms":
      return isGoogleFormsUrl(url)
        ? normalized
        : invalid("Use a public URL on forms.gle or Google Forms.");
    case "google-docs":
      return isGoogleDocsUrl(url)
        ? normalized
        : invalid("Use an official Google Docs document URL.");
    case "image-url":
      return hasFileExtension(url, ["png", "jpg", "jpeg", "webp", "gif", "avif"])
        ? normalized
        : invalid("Use a direct public PNG, JPG, WebP, GIF, or AVIF URL.");
    case "audio-url":
      return hasFileExtension(url, ["mp3", "wav", "ogg", "m4a", "aac", "flac", "webm"])
        ? normalized
        : invalid("Use a direct public MP3, WAV, OGG, M4A, AAC, FLAC, or WebM URL.");
    case "spreadsheet-url":
      return isGoogleSheetsUrl(url) ||
        hasFileExtension(url, ["xls", "xlsx", "csv", "ods"])
        ? normalized
        : invalid("Use a public Excel, CSV, ODS, or Google Sheets URL.");
    case "app-store":
      return isAppStoreUrl(url)
        ? normalized
        : invalid("Use an official Apple App Store or Google Play app URL.");
    case "menu":
      return normalized;
  }
}

function hasValidPlatformPath(url: URL, type: SocialQrType) {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const path = url.pathname;

  if (type === "discord") {
    if (hostname === "discord.gg") return /^\/[a-z\d-]+\/?$/i.test(path);
    return (
      /^\/invite\/[a-z\d-]+\/?$/i.test(path) ||
      /^\/channels\/\d+(?:\/\d+)?\/?$/i.test(path)
    );
  }
  if (type === "amazon") {
    return path !== "/";
  }
  if (type === "snapchat") {
    return /^\/(?:add|t|lens|spotlight|p)\//i.test(path);
  }
  return true;
}

function normalizePlatformUrl(
  value: string,
  type: SocialQrType,
): QrPayloadResult {
  const normalized = normalizeHttpUrl(value);
  const config = socialQrConfig[type];
  if (normalized.error) return invalid(`Enter a valid ${type} URL.`);

  const url = new URL(normalized.payload);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  const allowed = config.allowedHosts.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );

  if (
    !allowed ||
    url.username ||
    url.password ||
    (url.pathname === "/" && !url.search) ||
    !hasValidPlatformPath(url, type)
  ) {
    return invalid(`Use a public URL on an official ${type} domain.`);
  }

  return { error: null, payload: url.toString() };
}

function buildSocialPayload(
  type: SocialQrType,
  values: QrFormValues,
): QrPayloadResult {
  const config = socialQrConfig[type];
  const value = values[type].trim();

  if (!value) return invalid(`Enter a ${config.fieldLabel.toLowerCase()}.`);

  const looksLikeUrl =
    config.urlOnly ||
    /^[a-z][a-z\d+.-]*:/i.test(value) ||
    value.includes("/");
  if (looksLikeUrl) return normalizePlatformUrl(value, type);

  const username = value.replace(/^@/, "");
  const validLength =
    username.length >= (config.minLength ?? 1) &&
    username.length <= (config.maxLength ?? Number.POSITIVE_INFINITY);
  const validCharacters = config.usernamePattern?.test(username) ?? false;
  const validDots = !username.startsWith(".") && !username.endsWith(".");

  if (!validLength || !validCharacters || !validDots || !config.baseUrl) {
    return invalid(`Enter a valid ${type} username or official URL.`);
  }

  return {
    error: null,
    payload: `${config.baseUrl}${config.pathPrefix ?? ""}${username}`,
  };
}

function buildVCardPayload(values: QrFormValues): QrPayloadResult {
  const firstName = values.vcardFirstName.trim();
  const lastName = values.vcardLastName.trim();

  if (!firstName && !lastName) {
    return invalid("Enter at least a first or last name.");
  }
  if (firstName.length > 100 || lastName.length > 100) {
    return invalid("Keep each name under 100 characters.");
  }
  if (values.vcardOrganization.length > 100 || values.vcardTitle.length > 100) {
    return invalid("Keep organization and title under 100 characters.");
  }
  if (values.vcardEmail && validateEmail(values.vcardEmail)) {
    return invalid("Enter a valid contact email address.");
  }

  const phone = values.vcardPhone
    ? normalizePhone(values.vcardPhone)
    : { error: null, payload: "" };
  if (phone.error) return phone;

  const website = values.vcardWebsite
    ? normalizeHttpUrl(values.vcardWebsite)
    : { error: null, payload: "" };
  if (website.error) return invalid("Enter a valid contact website URL.");

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:4.0",
    `FN:${escapeVCardText(fullName)}`,
    `N:${escapeVCardText(lastName)};${escapeVCardText(firstName)};;;`,
  ];

  if (values.vcardOrganization.trim()) {
    lines.push(`ORG:${escapeVCardText(values.vcardOrganization.trim())}`);
  }
  if (values.vcardTitle.trim()) {
    lines.push(`TITLE:${escapeVCardText(values.vcardTitle.trim())}`);
  }
  if (phone.payload) {
    lines.push(`TEL;VALUE=uri;TYPE=cell:tel:${phone.payload}`);
  }
  if (values.vcardEmail.trim()) {
    lines.push(`EMAIL:${values.vcardEmail.trim()}`);
  }
  if (website.payload) {
    lines.push(`URL:${website.payload}`);
  }
  lines.push("END:VCARD");

  return {
    error: null,
    payload: `${lines.map(foldVCardLine).join("\r\n")}\r\n`,
  };
}

export function buildQrPayload(
  type: QrType,
  values: QrFormValues,
): QrPayloadResult {
  switch (type) {
    case "url":
      return buildUrlPayload(values.url);
    case "text":
      return buildTextPayload(values.text);
    case "wifi":
      return buildWifiPayload(values);
    case "whatsapp":
      return buildWhatsAppPayload(values);
    case "email":
      return buildEmailPayload(values);
    case "vcard":
      return buildVCardPayload(values);
    case "sms":
      return buildSmsPayload(values);
    case "phone":
      return buildPhonePayload(values);
    case "location":
      return buildLocationPayload(values);
    case "calendar":
      return buildCalendarPayload(values);
    default:
      if (isLinkQrType(type)) return buildLinkPayload(type, values);
      if (isSocialQrType(type)) return buildSocialPayload(type, values);
      return invalid("Choose a supported QR code type.");
  }
}
