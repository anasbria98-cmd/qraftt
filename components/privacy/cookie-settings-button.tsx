"use client";

import { openConsentPreferences } from "@/components/privacy/consent-provider";

export function CookieSettingsButton() {
  return (
    <button
      className="footer-cookie-button"
      onClick={openConsentPreferences}
      type="button"
    >
      Cookie settings
    </button>
  );
}
