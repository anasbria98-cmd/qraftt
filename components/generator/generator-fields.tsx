"use client";

import type { QrFormValues, QrType, WifiEncryption } from "@/lib/qr/types";
import { T, useLanguage } from "@/components/i18n/language-provider";
import {
  isLinkQrType,
  isSocialQrType,
  linkQrConfig,
  socialQrConfig,
} from "@/lib/qr/config";

interface GeneratorFieldsProps {
  error: string | null;
  type: QrType;
  values: QrFormValues;
  onChange: <Key extends keyof QrFormValues>(
    key: Key,
    value: QrFormValues[Key],
  ) => void;
}

interface FieldProps {
  children: React.ReactNode;
  hint?: string;
  label: string;
}

function Field({ children, hint, label }: FieldProps) {
  return (
    <label className="generator-field">
      <span className="generator-label"><T text={label} /></span>
      {children}
      {hint ? <span className="generator-hint"><T text={hint} /></span> : null}
    </label>
  );
}

export function GeneratorFields({
  error,
  onChange,
  type,
  values,
}: GeneratorFieldsProps) {
  const { t } = useLanguage();
  const invalidProps = {
    "aria-describedby": error ? "generator-validation" : undefined,
    "aria-invalid": Boolean(error),
  };

  return (
    <div
      aria-labelledby="generator-selected-type-label"
      className="generator-fields"
      id="generator-fields-panel"
      role="tabpanel"
      tabIndex={-1}
    >
      {type === "url" ? (
        <Field label="Destination URL" hint="We’ll add https:// if you leave it out.">
          <input
            {...invalidProps}
            autoCapitalize="none"
            autoComplete="url"
            inputMode="url"
            onChange={(event) => onChange("url", event.target.value)}
            placeholder="https://example.com"
            type="url"
            value={values.url}
          />
        </Field>
      ) : null}

      {type === "text" ? (
        <Field label="Text" hint={t("{count} / 2,000 characters", { count: values.text.length.toLocaleString() })}>
          <textarea
            {...invalidProps}
            maxLength={2_000}
            onChange={(event) => onChange("text", event.target.value)}
            placeholder={t("Type the message you want to share")}
            rows={6}
            value={values.text}
          />
        </Field>
      ) : null}

      {type === "wifi" ? (
        <>
          <Field label="Network name (SSID)">
            <input
              {...invalidProps}
              autoComplete="off"
              maxLength={32}
              onChange={(event) => onChange("wifiSsid", event.target.value)}
              placeholder={t("Guest WiFi")}
              type="text"
              value={values.wifiSsid}
            />
          </Field>
          <div className="generator-field-row">
            <Field label="Security">
              <select
                onChange={(event) =>
                  onChange("wifiEncryption", event.target.value as WifiEncryption)
                }
                value={values.wifiEncryption}
              >
                <option value="WPA"><T text="WPA / WPA2" /></option>
                <option value="WEP"><T text="WEP" /></option>
                <option value="nopass"><T text="No password" /></option>
              </select>
            </Field>
            <label className="generator-checkbox">
              <input
                checked={values.wifiHidden}
                onChange={(event) => onChange("wifiHidden", event.target.checked)}
                type="checkbox"
              /><T text="Hidden network" /></label>
          </div>
          {values.wifiEncryption !== "nopass" ? (
            <Field
              label="Password"
              hint="The password is encoded only inside the downloaded QR code."
            >
              <input
                {...invalidProps}
                autoComplete="off"
                onChange={(event) => onChange("wifiPassword", event.target.value)}
                placeholder={t("Network password")}
                type="text"
                value={values.wifiPassword}
              />
            </Field>
          ) : null}
        </>
      ) : null}

      {type === "whatsapp" ? (
        <>
          <Field label="WhatsApp number" hint="Include the international country code.">
            <input
              {...invalidProps}
              autoComplete="tel"
              inputMode="tel"
              onChange={(event) => onChange("whatsappNumber", event.target.value)}
              placeholder={t("+1 202 555 0147")}
              type="tel"
              value={values.whatsappNumber}
            />
          </Field>
          <Field label="Pre-filled message" hint="Optional">
            <textarea
              maxLength={1_000}
              onChange={(event) => onChange("whatsappMessage", event.target.value)}
              placeholder={t("Hi! I’d like to know more.")}
              rows={4}
              value={values.whatsappMessage}
            />
          </Field>
        </>
      ) : null}

      {type === "email" ? (
        <>
          <Field label="Recipient email">
            <input
              {...invalidProps}
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => onChange("emailTo", event.target.value)}
              placeholder="hello@example.com"
              type="email"
              value={values.emailTo}
            />
          </Field>
          <Field label="Subject" hint="Optional">
            <input
              maxLength={200}
              onChange={(event) => onChange("emailSubject", event.target.value)}
              placeholder={t("A quick question")}
              type="text"
              value={values.emailSubject}
            />
          </Field>
          <Field label="Message" hint={t("{count} / 1,000 characters", { count: values.emailBody.length.toLocaleString() })}>
            <textarea
              maxLength={1_000}
              onChange={(event) => onChange("emailBody", event.target.value)}
              placeholder={t("Write a short pre-filled message")}
              rows={4}
              value={values.emailBody}
            />
          </Field>
        </>
      ) : null}

      {type === "vcard" ? (
        <>
          <div className="generator-two-fields">
            <Field label="First name">
              <input
                {...invalidProps}
                autoComplete="given-name"
                maxLength={100}
                onChange={(event) => onChange("vcardFirstName", event.target.value)}
                placeholder="Ada"
                type="text"
                value={values.vcardFirstName}
              />
            </Field>
            <Field label="Last name">
              <input
                {...invalidProps}
                autoComplete="family-name"
                maxLength={100}
                onChange={(event) => onChange("vcardLastName", event.target.value)}
                placeholder="Lovelace"
                type="text"
                value={values.vcardLastName}
              />
            </Field>
          </div>
          <Field label="Organization" hint="Optional">
            <input
              autoComplete="organization"
              maxLength={100}
              onChange={(event) => onChange("vcardOrganization", event.target.value)}
              placeholder={t("Company name")}
              type="text"
              value={values.vcardOrganization}
            />
          </Field>
          <Field label="Job title" hint="Optional">
            <input
              autoComplete="organization-title"
              maxLength={100}
              onChange={(event) => onChange("vcardTitle", event.target.value)}
              placeholder={t("Product designer")}
              type="text"
              value={values.vcardTitle}
            />
          </Field>
          <Field
            label="Mobile phone"
            hint="Optional · Include the international country code."
          >
            <input
              {...invalidProps}
              autoComplete="tel"
              inputMode="tel"
              onChange={(event) => onChange("vcardPhone", event.target.value)}
              placeholder={t("+44 7700 900123")}
              type="tel"
              value={values.vcardPhone}
            />
          </Field>
          <Field label="Email" hint="Optional">
            <input
              {...invalidProps}
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => onChange("vcardEmail", event.target.value)}
              placeholder="ada@example.com"
              type="email"
              value={values.vcardEmail}
            />
          </Field>
          <Field label="Website" hint="Optional">
            <input
              {...invalidProps}
              autoCapitalize="none"
              autoComplete="url"
              inputMode="url"
              onChange={(event) => onChange("vcardWebsite", event.target.value)}
              placeholder="https://example.com"
              type="url"
              value={values.vcardWebsite}
            />
          </Field>
        </>
      ) : null}

      {type === "sms" ? (
        <>
          <Field label="Mobile number" hint="Include the international country code.">
            <input
              {...invalidProps}
              autoComplete="tel"
              inputMode="tel"
              onChange={(event) => onChange("smsNumber", event.target.value)}
              placeholder={t("+1 202 555 0147")}
              type="tel"
              value={values.smsNumber}
            />
          </Field>
          <Field label="Pre-filled message" hint={t("{count} / 1,000 characters", { count: values.smsMessage.length.toLocaleString() })}>
            <textarea
              maxLength={1_000}
              onChange={(event) => onChange("smsMessage", event.target.value)}
              placeholder={t("Write an optional SMS message")}
              rows={4}
              value={values.smsMessage}
            />
          </Field>
        </>
      ) : null}

      {type === "phone" ? (
        <Field label="Phone number" hint="Include the international country code.">
          <input
            {...invalidProps}
            autoComplete="tel"
            inputMode="tel"
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            placeholder={t("+1 202 555 0147")}
            type="tel"
            value={values.phoneNumber}
          />
        </Field>
      ) : null}

      {type === "location" ? (
        <div className="generator-two-fields">
          <Field label="Latitude" hint="−90 to 90">
            <input
              {...invalidProps}
              inputMode="decimal"
              onChange={(event) => onChange("locationLatitude", event.target.value)}
              placeholder="48.198634"
              type="text"
              value={values.locationLatitude}
            />
          </Field>
          <Field label="Longitude" hint="−180 to 180">
            <input
              {...invalidProps}
              inputMode="decimal"
              onChange={(event) => onChange("locationLongitude", event.target.value)}
              placeholder="16.371648"
              type="text"
              value={values.locationLongitude}
            />
          </Field>
        </div>
      ) : null}

      {type === "calendar" ? (
        <>
          <Field label="Event title">
            <input
              {...invalidProps}
              maxLength={200}
              onChange={(event) => onChange("calendarTitle", event.target.value)}
              placeholder={t("Team workshop")}
              type="text"
              value={values.calendarTitle}
            />
          </Field>
          <div className="generator-two-fields">
            <Field label="Starts">
              <input
                {...invalidProps}
                onChange={(event) => onChange("calendarStart", event.target.value)}
                type="datetime-local"
                value={values.calendarStart}
              />
            </Field>
            <Field label="Ends">
              <input
                {...invalidProps}
                min={values.calendarStart || undefined}
                onChange={(event) => onChange("calendarEnd", event.target.value)}
                type="datetime-local"
                value={values.calendarEnd}
              />
            </Field>
          </div>
          <Field label="Location" hint="Optional">
            <input
              maxLength={300}
              onChange={(event) => onChange("calendarLocation", event.target.value)}
              placeholder={t("Conference room or address")}
              type="text"
              value={values.calendarLocation}
            />
          </Field>
          <Field
            label="Description"
            hint={t("{count} / 1,000 characters", { count: values.calendarDescription.length.toLocaleString() })}
          >
            <textarea
              maxLength={1_000}
              onChange={(event) =>
                onChange("calendarDescription", event.target.value)
              }
              placeholder={t("Add optional event details")}
              rows={4}
              value={values.calendarDescription}
            />
          </Field>
        </>
      ) : null}

      {isSocialQrType(type) ? (
        <Field
          label={socialQrConfig[type].fieldLabel}
          hint={socialQrConfig[type].hint}
        >
          <input
            {...invalidProps}
            autoCapitalize="none"
            autoComplete="url"
            maxLength={2_000}
            onChange={(event) => onChange(type, event.target.value)}
            placeholder={socialQrConfig[type].placeholder}
            type="text"
            value={values[type]}
          />
        </Field>
      ) : null}

      {isLinkQrType(type) ? (
        <>
          <Field label={linkQrConfig[type].fieldLabel} hint={linkQrConfig[type].hint}>
            <input
              {...invalidProps}
              autoCapitalize="none"
              autoComplete="url"
              inputMode="url"
              maxLength={2_000}
              onChange={(event) => onChange(type, event.target.value)}
              placeholder={linkQrConfig[type].placeholder}
              type="url"
              value={values[type]}
            />
          </Field>
          {type === "google-review" && error ? (
            <p
              aria-live="polite"
              className="generator-message error"
              id="generator-validation"
              role="alert"
            >
              <T text={error} />
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
