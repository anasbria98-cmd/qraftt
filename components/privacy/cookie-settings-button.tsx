"use client";

import { T } from "@/components/i18n/language-provider";
import { openConsentPreferences } from "@/components/privacy/consent-provider";

export function CookieSettingsButton() {
  return (
    <button
      className="footer-cookie-button"
      onClick={openConsentPreferences}
      type="button"
    ><T text="Cookie settings" /></button>
  );
}
