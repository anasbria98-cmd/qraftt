# Same-URL interface localization

Production release is gated on lint, TypeScript, the full test suite, build, and browser checks.

## Architecture

- Root server rendering, metadata, structured data, canonicals, sitemap, and public routes stay English and unchanged.
- `LanguageProvider` resolves a saved `qraftt_language_v1` preference or a supported browser language after hydration.
- Only the selected static catalog is fetched, from `/locales/<locale>.json` on Qraftt itself.
- `T` translates explicit developer-owned display messages. Form values, QR payloads, exported content, user identifiers, and monetary values never pass through translation.
- The selector offers 20 locales with native language names. Arabic sets `lang=ar` and `dir=rtl`.
- Missing messages fall back to English. No runtime machine-translation API or DOM text rewriting is used.

## Completed locally

- Language selector, preference persistence, browser detection, English fallback, cancellation of stale locale loads.
- 108 common messages authored in each of 19 non-English catalogs, supplemented by static draft catalogs and reviewed corrections.
- Translation components integrated into static UI text and shared display labels.
- Local desktop/mobile Arabic direction and persistence checks.

## Validation and scope

- Catalog tests enforce every extracted UI key and exact interpolation-token preservation in all 19 packs.
- Local French and Arabic auth, Arabic mobile pricing, persistence, and unchanged mixed-language QR input have been checked. Arabic auth has no horizontal overflow at 390px.
- Editorial generator landing-page articles, blog posts, and legal prose remain English; the interface and homepage copy are localized. Metadata and structured data remain English.
- Draft translations are not a substitute for native-speaker editorial review of all 19 languages.

## External translation permission

The user explicitly approved one-time UI-copy translation using `translate.googleapis.com`; only developer-owned display copy was sent, not env files, credentials, visitor content, account records, or QR content. Backend-only diagnostics and technical payload literals are excluded from the inventory. Batch associations were validated, with individual translation for ambiguous marker responses. External requests stopped on HTTP 429; the final pricing labels were authored locally. Visitors never call a translation service.
Alternatively, finish the catalogs manually or import user-supplied translations. No external provider is needed to run the app.
