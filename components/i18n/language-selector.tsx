"use client";

import { useEffect, useRef, useState } from "react";
import { languages } from "@/lib/i18n/locales";
import { useLanguage } from "./language-provider";
import styles from "./language-selector.module.css";

export function LanguageSelector() {
  const { locale, loading, error, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  return <div ref={root} className={styles.root}>
    <button ref={trigger} type="button" className={styles.trigger} aria-label={t("Language")} aria-expanded={open} aria-busy={loading} onClick={() => setOpen(value => !value)}>
      <span>{locale.toUpperCase()}</span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open ? <div className={styles.panel}>
      <p className={styles.heading}>{t("Choose language")}</p>
      <ul aria-label={t("Language")}>
        {languages.map(language => <li key={language.code}><button type="button" lang={language.code} dir="auto" aria-pressed={locale === language.code} disabled={loading} onClick={async () => { await setLocale(language.code); setOpen(false); trigger.current?.focus(); }}>
          <span>{language.native}</span><small>{language.code.toUpperCase()}</small>{locale === language.code ? <span aria-hidden="true">✓</span> : null}
        </button></li>)}
      </ul>
    </div> : null}
    {error ? <span className={styles.error} role="status">{t("Language could not be loaded. Please try again.")}</span> : null}
  </div>;
}
