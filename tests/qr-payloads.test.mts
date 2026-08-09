import assert from "node:assert/strict";
import test from "node:test";
import QRCode from "qrcode";
import { qrTypeOptions } from "../lib/qr/config.ts";
import { buildQrPayload } from "../lib/qr/payloads.ts";
import type { QrFormValues } from "../lib/qr/types.ts";

const values: QrFormValues = {
  amazon: "https://www.amazon.com/dp/B012345678",
  "app-store": "https://play.google.com/store/apps/details?id=com.example.qraft",
  "audio-url": "https://media.example.com/guides/welcome.mp3",
  calendarDescription: "Bring your ticket, notebook, and photo ID.",
  calendarEnd: "2026-09-12T11:30",
  calendarLocation: "Studio 4, Main Street",
  calendarStart: "2026-09-12T09:00",
  calendarTitle: "Qraft workshop",
  discord: "https://discord.gg/qraft",
  emailBody: "Line 1\nLine 2",
  emailSubject: "Hello & welcome",
  emailTo: "hello@example.com",
  facebook: "qraft.page",
  "google-review": "https://g.page/r/example-code/review",
  "google-docs": "https://docs.google.com/document/d/ExampleDocumentId123/view",
  "google-forms": "https://forms.gle/ExampleForm123",
  "image-url": "https://media.example.com/gallery/poster.png",
  instagram: "@qraft",
  linkedin: "linkedin.com/in/qraft",
  locationLatitude: "48.198634",
  locationLongitude: "16.371648",
  menu: "https://restaurant.example/menu",
  paypal: "https://paypal.me/Qraft/25USD",
  "pdf-link": "https://example.com/guides/menu.pdf",
  "presentation-url": "https://media.example.com/talks/keynote.pptx",
  reddit: "https://www.reddit.com/r/qraft/",
  phoneNumber: "+1 (202) 555-0147",
  smsMessage: "Hello! Meet at 5 & bring tea.",
  smsNumber: "+1 (202) 555-0147",
  spotify: "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6",
  "spreadsheet-url": "https://docs.google.com/spreadsheets/d/ExampleSheetId123/view",
  snapchat: "https://www.snapchat.com/add/qraft",
  telegram: "@qraft_bot",
  text: "Share this exactly",
  tiktok: "@qraft",
  url: "example.com/path",
  vcardEmail: "ada@example.com",
  vcardFirstName: "Ada",
  vcardLastName: "Lovelace",
  vcardOrganization: "Analytical Engines",
  vcardPhone: "+44 20 7183 8750",
  vcardTitle: "Mathematician",
  vcardWebsite: "example.com",
  whatsappMessage: "Hello there",
  whatsappNumber: "+1 (202) 555-0147",
  wifiEncryption: "WPA",
  wifiHidden: true,
  wifiPassword: "pass:word;123",
  wifiSsid: "Cafe;Guest",
  youtube: "https://youtube.com/@qraft",
};

test("normalizes safe URL destinations", () => {
  assert.equal(buildQrPayload("url", values).payload, "https://example.com/path");
  assert.match(
    buildQrPayload("url", { ...values, url: "javascript:alert(1)" }).error ?? "",
    /HTTP or HTTPS/,
  );
});

test("preserves plain text payloads", () => {
  assert.equal(buildQrPayload("text", values).payload, "Share this exactly");
});

test("escapes WiFi payload delimiters", () => {
  assert.equal(
    buildQrPayload("wifi", values).payload,
    "WIFI:T:WPA;S:Cafe\\;Guest;P:pass\\:word\\;123;H:true;;",
  );
});

test("creates a direct WhatsApp destination", () => {
  assert.equal(
    buildQrPayload("whatsapp", values).payload,
    "https://wa.me/12025550147?text=Hello%20there",
  );
});

test("creates an RFC 6068 mailto URI", () => {
  assert.equal(
    buildQrPayload("email", values).payload,
    "mailto:hello@example.com?subject=Hello%20%26%20welcome&body=Line%201%0D%0ALine%202",
  );
  assert.match(
    buildQrPayload("email", { ...values, emailTo: "not-an-email" }).error ?? "",
    /valid email address/,
  );
});

test("creates an RFC 6350 vCard 4.0 payload", () => {
  assert.equal(
    buildQrPayload("vcard", values).payload,
    [
      "BEGIN:VCARD",
      "VERSION:4.0",
      "FN:Ada Lovelace",
      "N:Lovelace;Ada;;;",
      "ORG:Analytical Engines",
      "TITLE:Mathematician",
      "TEL;VALUE=uri;TYPE=cell:tel:+442071838750",
      "EMAIL:ada@example.com",
      "URL:https://example.com/",
      "END:VCARD",
      "",
    ].join("\r\n"),
  );
});

test("escapes and folds vCard text without splitting UTF-8 characters", () => {
  const result = buildQrPayload("vcard", {
    ...values,
    vcardFirstName: "Zoë",
    vcardLastName: "Example, Jr.;",
    vcardOrganization: "A very long organization name with café teams across several international offices",
  });

  assert.match(result.payload, /FN:Zoë Example\\, Jr\.\\;/);
  assert.match(result.payload, /\r\n /);
  for (const line of result.payload.split("\r\n")) {
    assert.ok(new TextEncoder().encode(line).length <= 75);
  }
});

test("creates standards-based SMS, phone, and location URIs", () => {
  assert.equal(
    buildQrPayload("sms", values).payload,
    "sms:+12025550147?body=Hello%21%20Meet%20at%205%20%26%20bring%20tea.",
  );
  assert.equal(buildQrPayload("phone", values).payload, "tel:+12025550147");
  assert.equal(
    buildQrPayload("location", values).payload,
    "geo:48.198634,16.371648",
  );
});

test("creates a standards-compatible iCalendar event payload", () => {
  const result = buildQrPayload("calendar", values);
  assert.equal(result.error, null);
  assert.match(result.payload, /^BEGIN:VCALENDAR\r\nVERSION:2\.0\r\n/);
  assert.match(result.payload, /\r\nBEGIN:VEVENT\r\n/);
  assert.match(result.payload, /\r\nUID:[a-f\d]+@qraft\.local\r\n/);
  assert.match(result.payload, /\r\nDTSTAMP:\d{8}T\d{6}Z\r\n/);
  assert.match(result.payload, /\r\nDTSTART:20260912T090000\r\n/);
  assert.match(result.payload, /\r\nDTEND:20260912T113000\r\n/);
  assert.match(result.payload, /\r\nSUMMARY:Qraft workshop\r\n/);
  assert.match(result.payload, /\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n$/);
  assert.match(
    buildQrPayload("calendar", {
      ...values,
      calendarEnd: "2026-09-12T08:59",
    }).error ?? "",
    /end must be after the start/,
  );
});

test("creates direct official social platform destinations", () => {
  const expected = {
    amazon: "https://www.amazon.com/dp/B012345678",
    discord: "https://discord.gg/qraft",
    facebook: "https://www.facebook.com/qraft.page",
    instagram: "https://www.instagram.com/qraft",
    linkedin: "https://linkedin.com/in/qraft",
    reddit: "https://www.reddit.com/r/qraft/",
    snapchat: "https://www.snapchat.com/add/qraft",
    telegram: "https://t.me/qraft_bot",
    tiktok: "https://www.tiktok.com/@qraft",
    youtube: "https://youtube.com/@qraft",
  } as const;

  for (const [type, payload] of Object.entries(expected)) {
    assert.equal(buildQrPayload(type as keyof typeof expected, values).payload, payload);
  }
});

test("rejects invalid phone, coordinate, and platform destinations", () => {
  assert.match(
    buildQrPayload("phone", { ...values, phoneNumber: "123" }).error ?? "",
    /7–15 digit/,
  );
  assert.match(
    buildQrPayload("location", { ...values, locationLatitude: "91" }).error ?? "",
    /between -90 and 90/,
  );
  assert.match(
    buildQrPayload("youtube", {
      ...values,
      youtube: "https://youtube.com.evil.example/watch?v=123",
    }).error ?? "",
    /official youtube domain/,
  );
});

test("creates direct validated destination-link payloads", () => {
  const expected = {
    "app-store": "https://play.google.com/store/apps/details?id=com.example.qraft",
    "audio-url": "https://media.example.com/guides/welcome.mp3",
    "google-docs": "https://docs.google.com/document/d/ExampleDocumentId123/view",
    "google-forms": "https://forms.gle/ExampleForm123",
    "google-review": "https://g.page/r/example-code/review",
    "image-url": "https://media.example.com/gallery/poster.png",
    menu: "https://restaurant.example/menu",
    spotify: "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6",
    paypal: "https://paypal.me/Qraft/25USD",
    "pdf-link": "https://example.com/guides/menu.pdf",
    "presentation-url": "https://media.example.com/talks/keynote.pptx",
    "spreadsheet-url": "https://docs.google.com/spreadsheets/d/ExampleSheetId123/view",
  } as const;

  for (const [type, payload] of Object.entries(expected)) {
    assert.equal(buildQrPayload(type as keyof typeof expected, values).payload, payload);
  }
});

test("rejects unsupported or non-public destination-link URLs", () => {
  assert.match(
    buildQrPayload("google-review", {
      ...values,
      "google-review": "https://google.example/maps/review",
    }).error ?? "",
    /official Google/,
  );
  assert.match(
    buildQrPayload("spotify", {
      ...values,
      spotify: "https://open.spotify.com/user/not-a-supported-item",
    }).error ?? "",
    /open\.spotify\.com/,
  );
  assert.match(
    buildQrPayload("paypal", {
      ...values,
      paypal: "https://www.paypal.com/us/home",
    }).error ?? "",
    /PayPal payment URL/,
  );
  assert.match(
    buildQrPayload("pdf-link", {
      ...values,
      "pdf-link": "https://example.com/document.html",
    }).error ?? "",
    /ending in \.pdf/,
  );
  assert.match(
    buildQrPayload("menu", {
      ...values,
      menu: "http://localhost/menu",
    }).error ?? "",
    /public URL/,
  );
  const invalidNewDestinations = [
    ["google-forms", "https://docs.google.com/forms/d/example/edit", /Google Forms/],
    ["google-docs", "https://docs.google.com/spreadsheets/d/example/view", /Google Docs/],
    ["image-url", "https://example.com/image.svg", /PNG, JPG/],
    ["audio-url", "https://example.com/listen", /direct public MP3/],
    ["spreadsheet-url", "https://example.com/report.pdf", /spreadsheet|Excel/],
    ["presentation-url", "https://example.com/slides.pdf", /presentation|PPT/],
    ["app-store", "https://play.google.com/store/books/details?id=example", /App Store|Google Play/],
  ] as const;

  for (const [type, destination, errorPattern] of invalidNewDestinations) {
    assert.match(
      buildQrPayload(type, { ...values, [type]: destination }).error ?? "",
      errorPattern,
    );
  }
  assert.match(
    buildQrPayload("discord", {
      ...values,
      discord: "https://discord.com/download",
    }).error ?? "",
    /official discord domain/,
  );
  assert.match(
    buildQrPayload("reddit", {
      ...values,
      reddit: "https://reddit.example/r/qraft",
    }).error ?? "",
    /official reddit domain/,
  );
  assert.match(
    buildQrPayload("amazon", {
      ...values,
      amazon: "https://amazon.example/dp/B012345678",
    }).error ?? "",
    /official amazon domain/,
  );
  assert.match(
    buildQrPayload("snapchat", {
      ...values,
      snapchat: "https://snapchat.com/about",
    }).error ?? "",
    /official snapchat domain/,
  );
});

test("every configured type renders standalone SVG and PNG QR codes", async () => {
  for (const { value: type } of qrTypeOptions) {
    const result = buildQrPayload(type, values);
    assert.equal(result.error, null, `${type} payload should be valid`);

    const [svg, png] = await Promise.all([
      QRCode.toString(result.payload, { type: "svg" }),
      QRCode.toBuffer(result.payload, { type: "png" }),
    ]);

    assert.match(svg, /^<svg/, `${type} should render an SVG`);
    assert.match(svg, /<path/, `${type} SVG should contain modules`);
    assert.equal(
      png.subarray(0, 8).toString("hex"),
      "89504e470d0a1a0a",
      `${type} should render a PNG`,
    );
  }
});
