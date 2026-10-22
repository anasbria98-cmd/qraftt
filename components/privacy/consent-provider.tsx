"use client";

import { T } from "@/components/i18n/language-provider";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import Script from "next/script";
import { adSenseClientId } from "@/lib/integrations";

type ConsentChoice = "accepted" | "rejected";

interface ConsentContextValue {
  adsReady: boolean;
  optionalServicesAllowed: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_STORAGE_KEY = "qraft_optional_consent_v1";
const OPEN_CONSENT_EVENT = "qraft:open-consent";
const ConsentContext = createContext<ConsentContextValue>({
  adsReady: false,
  optionalServicesAllowed: false,
});

function readStoredChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

function subscribeToHydration() {
  return () => undefined;
}

function updateGoogleConsent(choice: ConsentChoice) {
  if (!window.gtag) return;
  const value = choice === "accepted" ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_personalization: value,
    ad_storage: value,
    ad_user_data: value,
    analytics_storage: value,
  });
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<ConsentChoice | null>(readStoredChoice);
  const [bannerOpen, setBannerOpen] = useState(
    () => readStoredChoice() === null,
  );
  const [adsReady, setAdsReady] = useState(false);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const optionalServicesAllowed = hydrated && choice === "accepted";

  useEffect(() => {
    function openPreferences() {
      setBannerOpen(true);
    }

    window.addEventListener(OPEN_CONSENT_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openPreferences);
  }, []);

  useEffect(() => {
    if (!hydrated || choice === null) return;
    updateGoogleConsent(choice);
  }, [choice, hydrated]);

  function saveChoice(nextChoice: ConsentChoice) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, nextChoice);
    } catch {
      // Consent still applies for this page when storage is unavailable.
    }
    setChoice(nextChoice);
    setBannerOpen(false);
    updateGoogleConsent(nextChoice);
  }

  const contextValue = useMemo(
    () => ({ adsReady, optionalServicesAllowed }),
    [adsReady, optionalServicesAllowed],
  );

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}

      {optionalServicesAllowed && adSenseClientId ? (
        <Script
          crossOrigin="anonymous"
          id="qraft-google-adsense"
          onLoad={() => setAdsReady(true)}
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClientId}`}
          strategy="afterInteractive"
        />
      ) : null}

      {hydrated && bannerOpen ? (
        <section
          aria-describedby="consent-description"
          aria-labelledby="consent-title"
          className="consent-banner"
          role="dialog"
        >
          <div>
            <strong id="consent-title"><T text="Optional cookies and services" /></strong>
            <p id="consent-description"><T text="Core QR tools work without optional tracking. With permission, configured analytics and advertising services may load. You can change this choice later in the footer." /></p>
            <Link href="/cookie-policy"><T text="Read the cookie policy" /></Link>
          </div>
          <div className="consent-actions">
            <button
              className="button button-secondary"
              onClick={() => saveChoice("rejected")}
              type="button"
            ><T text="Reject optional" /></button>
            <button
              className="button button-primary"
              onClick={() => saveChoice("accepted")}
              type="button"
            ><T text="Accept optional" /></button>
          </div>
        </section>
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
