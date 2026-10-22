"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isLocale, languageStorageKey, localeDirection, resolveLocale, translate, type Locale, type Messages } from "@/lib/i18n/locales";

type LanguageContextValue = {
  locale: Locale;
  loading: boolean;
  error: boolean;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, values?: Readonly<Record<string, string | number>>) => string;
};
const LanguageContext = createContext<LanguageContextValue>({ locale: "en", loading: false, error: false, setLocale: async () => {}, t: (key, values) => translate({}, key, values) });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // English is identical on server and first client render: no locale hydration mismatch.
  const [state, setState] = useState<{ locale: Locale; messages: Messages }>({ locale: "en", messages: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const request = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const change = useCallback(async (locale: Locale, persist: boolean) => {
    if (!isLocale(locale)) return;
    const revision = ++request.current;
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setLoading(true); setError(false);
    try {
      let messages: Messages = {};
      if (locale !== "en") {
        const response = await fetch(`/locales/${locale}.json`, { signal: current.signal });
        if (!response.ok) throw new Error("Language unavailable");
        const data: unknown = await response.json();
        if (!data || typeof data !== "object" || Array.isArray(data) || Object.values(data).some(value => typeof value !== "string")) throw new Error("Invalid language catalog");
        messages = data as Messages;
      }
      if (revision !== request.current || current.signal.aborted) return;
      setState({ locale, messages });
      document.documentElement.lang = locale;
      document.documentElement.dir = localeDirection(locale);
      if (persist) try { window.localStorage.setItem(languageStorageKey, locale); } catch { /* Current choice still works without storage. */ }
    } catch {
      if (revision === request.current && !current.signal.aborted) setError(true);
    } finally { if (revision === request.current && !current.signal.aborted) setLoading(false); }
  }, []);
  useEffect(() => {
    let saved: unknown;
    try { saved = window.localStorage.getItem(languageStorageKey); } catch { /* Browser language remains available. */ }
    // Resolve browser preferences after the matching English hydration has committed.
    const initial = window.setTimeout(() => { void change(resolveLocale(saved, navigator.languages ?? [navigator.language]), false); }, 0);
    const sync = (event: StorageEvent) => {
      if (event.key === languageStorageKey) void change(resolveLocale(event.newValue, navigator.languages ?? [navigator.language]), false);
    };
    window.addEventListener("storage", sync);
    return () => { window.clearTimeout(initial); controller.current?.abort(); window.removeEventListener("storage", sync); };
  }, [change]);
  const setLocale = useCallback((locale: Locale) => change(locale, true), [change]);
  const t = useCallback((key: string, values?: Readonly<Record<string, string | number>>) => translate(state.messages, key, values), [state.messages]);
  const value = useMemo(() => ({ locale: state.locale, loading, error, setLocale, t }), [state.locale, loading, error, setLocale, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
export function T({ text, values }: { text: string; values?: Readonly<Record<string, string | number>> }) {
  return useLanguage().t(text, values);
}
