export const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "fr", name: "French", native: "Français" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "ro", name: "Romanian", native: "Română" },
] as const;
export type Locale = typeof languages[number]["code"];
export const languageStorageKey = "qraftt_language_v1";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && languages.some(language => language.code === value);
}
export function detectLocale(preferences: readonly string[]): Locale {
  for (const preference of preferences) {
    const primary = preference.trim().toLowerCase().split(/[-_]/)[0];
    if (isLocale(primary)) return primary;
  }
  return "en";
}
export function resolveLocale(saved: unknown, preferences: readonly string[]): Locale {
  return isLocale(saved) ? saved : detectLocale(preferences);
}
export function localeDirection(locale: Locale) { return locale === "ar" ? "rtl" : "ltr"; }

export type Messages = Readonly<Record<string, string>>;
// Only developer-owned message keys are translated; variables are inserted afterwards.
export function translate(messages: Messages, key: string, values: Readonly<Record<string, string | number>> = {}) {
  const template = Object.hasOwn(messages, key) ? messages[key] : key;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => Object.hasOwn(values, name) ? String(values[name]) : match);
}
