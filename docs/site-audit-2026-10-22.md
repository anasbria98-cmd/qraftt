# Qraftt pre-deployment audit — 22 October 2026

Follow-up status for the four remaining release gates is recorded in
[release-readiness-2026-10-22.md](release-readiness-2026-10-22.md). This report
retains the original audit findings rather than erasing the historical evidence.

**Release decision: NOT an unconditional deployment pass. Nothing was deployed.**

This report distinguishes observed browser results, direct HTTP/API results,
isolated automated tests, and work that remains blocked or unverified. It is not
a claim that every external integration or every possible content/style
combination has been tested. Production configuration, prices, subscriptions,
Supabase users, SMTP settings and DNS were not changed.

## 1. Issues found

1. Early AdSense `next/script` output was a direct child of `html`, causing invalid
   nesting/hydration errors across public pages. Merely moving it into `head`
   still allowed the SDK to replace Next's bootstrap placeholder before hydration.
2. The external footer badge had inconsistent rendered dimensions and produced
   a Next Image aspect-ratio warning.
3. `/pricing` was absent from the sitemap.
4. Custom body styling was applied to timing/alignment/format modules. Dots,
   circles, line, diamond and pill styles failed decoding in the audit case.
5. Square/diamond and rounded/diamond finder combinations failed decoding.
6. Development auth callbacks assumed port 3000 or a configured production
   origin rather than the actual local review port. The observed Google return
   landed on the production homepage; no local authenticated session was observed.
7. Public privacy/cookie/about copy predates server rendering and the account/
   billing system. It incorrectly says inputs are not sent to the application
   server and that there are no login/checkout cookies or subscriptions.
8. Consent-copy mismatch: the verification AdSense script initializes independently
   of the optional-consent-controlled advertising loader. Do not claim that *all*
   third-party scripts wait for acceptance. GA4 deliberately starts with denied
   Consent Mode defaults. Compliance and disclosure need owner review.
9. Calendar's native datetime controls did not commit values through the browser
   automation interface. Calendar payloads rendered/decoded through the API, but
   this audit did not complete a Calendar download through the UI. This is not
   established as an application defect; manual native date-picker testing remains.
10. Some machine-drafted localized headings are awkward. Coverage is not a
    linguistic-quality certification. Recent template names and local-only review
    notices may remain English.

## 2. Issues fixed locally

- AdSense verification now uses a standard asynchronous script inside `head`,
  without Next's bootstrap placeholder or `data-nscript` attribute. The configured
  script URL and publisher ID remain unchanged. GA4 consent defaults are unchanged.
- Footer badge has explicit proportional dimensions.
- Pricing is included in the sitemap; canonical routes are unchanged.
- Custom QR timing/alignment/format modules retain full square geometry.
- Custom diamond eyes use a scan-safe beveled core. Approved legacy templates
  are detected and retain their original output; existing 20 hash tests pass.
- Development auth-origin resolution accepts only HTTP loopback origins and
  preserves the actual request port. Production ignores request origins and keeps
  its configured origin. Supabase still must allow the requested callback.
- Added regression tests and repeatable local route/QR audit scripts.

Earlier local template fixes also remain: full-density premium previews, natural
canvas resolution, accurate selected-template identity, stale-preview protection.
The 10 approved Pro template designs were not removed or redesigned.

## 3. Unresolved / release gates

- Correct and review the outdated privacy/cookie/marketing statements in all
  applicable languages. This audit did not invent retention, legal or provider
  promises that have not been established operationally.
- Verify the intended pre-consent advertising behavior and align disclosures.
- Complete a real local authenticated session after the callback fix. If rejected
  by Supabase, add `http://localhost:3017/auth/callback` to the test redirect
  allowlist without changing the production Site URL. No allowlist was changed.
- Complete email signup/confirmation, recovery email, password change, email
  login, Google login, logout and authenticated persistence with a test account.
  Credentials/password entry and email-link steps require the account holder.
- Complete authenticated Free and Pro dashboard/account/billing browser checks.
  The user reported a Free login, but the audit browser continued to redirect to
  Login; that report alone was not treated as verified session evidence.
- Complete provider-approved billing activation/cancellation/webhook/claim tests
  in an isolated Sandbox environment. Current local PayPal mode is **live**;
  this audit did not create, approve, cancel or claim a payment/subscription.
- Manually verify Calendar datetime entry; finish keyboard/screen-reader audit
  and native-language proofreading. No blanket accessibility certification.

## 4. Pages and navigation tested

- HTTP crawl: **74 distinct page/query URLs**, **52 discovered linked assets**,
  no unexpected HTTP failures. Exact URL/status/canonical/H1/JSON-LD inventory:
  `work/site-audit/http.json`.
- Includes all **33 generator landing routes**, all **15 blog article routes**,
  blog index, homepage, pricing, about, contact, login, signup, forgot/reset
  password, privacy, terms, cookies, robots, sitemap, ads.txt and llms.txt.
- Browser navigation/render checks: homepage, QR generator landing page, pricing,
  blog index, about, contact, login, signup, forgot password, reset password,
  privacy, terms and cookies. Reset without recovery authentication redirects to
  Login rather than permitting an unauthenticated password change.
- All **11 protected paths** tested signed out: `/dashboard`, `/account`,
  `/dashboard/billing`, `/dashboard/my-qr-codes`, `/dashboard/statistics`,
  `/dashboard/import`, `/dashboard/archive`, `/dashboard/domains`,
  `/dashboard/api`, `/dashboard/support`, `/dashboard/faq`. All returned 307 to
  Login. This proves protection, not authenticated page behavior.
- Public header/footer links were inventoried by the crawler. Mobile header menu
  visibly exposes generator, pricing, blog, about, contact, login and create CTA.
  Upgrade modal opened; Escape closed it. Not every outbound destination, browser
  back-button path, hover state or article was manually exercised.
- Contact provides email support; no contact message/email was sent.
- Unimplemented dashboard features remain Coming Soon, not working backend features.

## 5. QR types and design coverage

All 30 types passed **actual local API PNG and SVG rendering and decoding**:
URL, WiFi, WhatsApp, Google Review, Menu, PDF, vCard, Instagram, Facebook,
YouTube, TikTok, LinkedIn, Telegram, Discord, Snapchat, Spotify, Email, SMS,
Phone, Google Docs, Google Forms, Image, Audio, Spreadsheet, Amazon, App Stores,
PayPal destination, Text, Location and Calendar.

**29 types were also selected, filled, previewed and downloaded through the actual
browser**, and all 29 downloaded PNG files decoded. Calendar is the exception
described above. Evidence with decoded contents: `work/site-audit/browser-qr.json`.

Direct render/decode matrix: **87 design cases** = 20 Free templates + 10 approved
Pro templates + 30 frames including no-frame + 9 body styles + 16 finder-eye
pairs + color and gradient cases. All pass after the fixes. Evidence:
`work/site-audit/qr.json`. This is not a Cartesian product of every possible QR
type × template × style × payload length.

All 20 original templates applied in the production-mode browser. All ten Pro
templates had already passed browser application/preview/download/decode in the
preceding local review and are included in the rerun API matrix. Center-logo
sanitization, protected padding, high correction and logo decoding are covered by
the automated template tests. Every frame/style was not separately clicked in
the browser. Invalid inputs and payload normalization have automated coverage;
every validation branch was not manually triggered in every locale.

## 6. Authentication result

**Partial / blocked**, not a pass. Public forms and protected redirects work.
Local callback construction was corrected and regression-tested. Real signup,
confirmation delivery, password recovery, Google callback completion, logout,
authenticated navigation/persistence and account isolation were not all verified
in a live authenticated browser. Existing tests exercise action behavior and
continuation/error handling with isolated fixtures, not real email delivery.

## 7. Free / Pro result

- Local production-mode session returned `pro:false`, `status:FREE`, remaining 3;
  no review capability.
- All ten actual render requests carrying forged `pro:true` and
  `templateReview:true` returned **403**. Paid SVG/high-resolution requests also
  returned **403**.
- Fresh isolated anonymous guest: official PNG statuses **200, 200, 200, 429**.
  Only test-guest download usage was consumed; no real user's plan was changed.
- UI premium selection opens the upgrade modal; original templates remain usable.
- Pro unlimited downloads, revoked states and persistence pass isolated backend
  tests; an actual signed-in Pro account was not browser-tested here.
- Review unlock remains development/loopback only and disabled in production and
  Vercel runtimes. Center-logo remains paid outside review mode.

## 8. Billing result

**Partial / provider flow not executed.** Pricing and upgrade modal render;
existing checkout-entry URL preserves monthly selection and advertises PayPal
before auth. Current code offers monthly $2; yearly is not offered by the current
configuration. No pricing changed. No checkout-entry link was followed far enough
to create a new subscription. PayPal auth, new approvals, real webhook delivery,
activation, cancellation and pending claim require controlled provider testing.
Existing automated tests cover signed webhooks, replay/order handling, ownership,
expiry and single-claim logic. They do not establish live provider correctness.

## 9. Localization result

All 20 choices were clicked in the browser: EN, FR, AR, ES, DE, IT, PT, NL,
TR, RU, ZH, JA, KO, HI, ID, MS, VI, PL, UK and RO. HTML language/heading
changed and Arabic used RTL. Arabic persisted after reload. A hydrated form's
entered URL stayed unchanged while switching languages. Catalog tests verify
nonempty extracted-message entries and matching interpolation tokens; browser
language detection and English fallback pass pure tests, not a fresh OS/browser
language-profile experiment. No separate localized routes were created.
Not every string on every route was linguistically reviewed; English fallback
can conceal newer uncatalogued messages. Raw early-hydration automation input
was excluded from the preservation assertion and retested after hydration.

## 10. Responsive result

Homepage, pricing, login, blog and contact checked at **360, 390, 430, 768, 1280,
1920px**. Measured document width matched viewport width in all 30 cases, with
no horizontal overflow. Mobile navigation and Arabic RTL inspected visually.
This is not exhaustive visual approval for all articles, protected screens,
modal combinations, device browsers or zoom levels. Evidence:
`/private/tmp/qraftt-audit-responsive.json` and saved mobile screenshots.

## 11. Console / network / security / SEO / performance

- Original hydration errors and badge warning reproduced and fixed. A fresh
  post-fix browser tab recorded no error/warning entries during the checked load.
  Historical errors remain in old tabs; there is no claim that every third-party
  network request can never fail.
- Route and discovered-asset crawl: no unexpected 4xx/5xx. Expected authorization
  and quota responses are 403/429. All protected redirects were 307.
- Configured private secret-value scan of production client chunks: two private
  values checked, no matches in 17 client JS chunks. Values were not printed.
  This targeted check is not a penetration test or a proof against all exposures.
- Server gates, logo reencoding, input allowlists and RLS migration constraints
  covered by tests/source inspection. RLS was not independently revalidated
  against two live authenticated Supabase users.
- Canonicals, sitemap, robots, H1 count and presence of JSON-LD inventoried.
  No crawled HTML had multiple H1s. Pricing sitemap omission fixed. Auth pages
  intentionally have no public canonical and are noindex. Rich-result/search
  indexing outcomes not certified.
- GA4 denied defaults and consent update implementation retained; real GA4
  dashboard ingestion not verified. AdSense initialization caveat remains above.
- Largest discovered non-framework page asset was the ~189KB promo WebP. Largest
  production JS chunk measured ~353KB uncompressed. Premium preview response
  images are not bundled as the server-only reference data map in client JS.
  No Lighthouse/Core Web Vitals or real-user performance score was measured;
  dev compilation times are not production performance measurements.

## 12–15. Final automated checks

| Check | Result |
| --- | --- |
| ESLint | Pass |
| TypeScript `tsc --noEmit` | Pass |
| Automated tests | **167 passed, 0 failed, 0 skipped** |
| Production `next build` | Pass |

The build includes local fixes and the disabled-by-default review facility.
No Vercel deployment or production environment change was made.

## 16. Deployment decision / next steps

**Do not label this exact local build fully audited or unconditionally safe to
deploy yet.** Compilation and the observed QR/gating/public-route checks pass,
but the privacy/cookie inconsistency is a release blocker and authenticated /
provider workflows still need the tests listed in section 3. Keep the build
local until those gates are addressed and the owner explicitly approves release.
