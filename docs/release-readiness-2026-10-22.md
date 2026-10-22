# Remaining release gates — 22 October 2026

## Deployment addendum — explicitly authorized release

The user subsequently approved deploying the audited build while accepting the
two deferred verification gates below. The application was deployed and promoted
to `https://www.qraftt.com` on 2026-10-22. No additional application changes were
made for deployment.

- Deployment: `dpl_6yXC8kSiKxiZB4gAAPjzq8SQoMeK`
- Exact build URL: `https://qraft-eotucn5qb-anas-bria.vercel.app`
- Vercel target: production; build READY; production-domain alias verified via
  the Vercel API against the exact deployment ID.
- Source deployment from the current working tree, not merely Git HEAD
  `7139586`. All 193 application files under app/components/lib/public matched
  deployed SHA-1 file digests with zero missing files or mismatches. The dirty
  Git state does not mean those application files are local-only.
- Local template review unlock remains development/loopback-only and is disabled
  on Vercel. Staged production billing session returned Free, 3 remaining,
  sandboxMonthlyTest false, without templateReview capability.
- Actual public domain smoke checks: homepage, pricing, generator index, WiFi,
  Calendar, blog, about, contact, login, signup, forgot password, privacy, cookies,
  terms, sitemap and robots all returned 200. Anonymous dashboard redirected to
  Login (307), as intended. Updated privacy rendering disclosure was present.
- Actual browser production PNG download decoded to exactly
  `https://example.com/qraftt-release-20261022` at 512px.
- Existing-account Google login reached the production dashboard. Server session
  endpoint returned authenticated true; billing rendered the corrected 20-Free /
  10-additional-Pro template summary. No captured browser errors or warnings.
- No Live transaction was started and no subscription, user profile, password,
  webhook, SMTP, pricing or environment configuration was changed. Normal login
  session metadata and QR-download usage counters may update during smoke tests.

The following pre-deployment audit history remains for traceability. Its HOLD
decision was superseded only by explicit release authorization, **not** by passing
the isolated Sandbox or email signup/reset checks. Both remain unverified.

**Decision: HOLD deployment. Local authenticated Free-account checks now pass;
real isolated billing and email/password recovery verification remain open.**

This follow-up supersedes the four remaining-item statuses in
`site-audit-2026-10-22.md`. Nothing was deployed. No production environment,
subscription, pricing, Free/Pro rule, auth configuration or SMTP setting changed.
The previous application fixes were preserved.

| Requested item | Current result |
| --- | --- |
| Privacy and cookie disclosures | Completed locally and verified in browser |
| Authenticated account testing | Google login, confirmed Free account, account pages, reload, logout and re-login pass; real Pro account and email/password recovery remain unverified |
| Safe PayPal approval/webhook verification | Application-handler tests pass; real provider Sandbox flow blocked pending isolated configuration |
| Calendar browser-level test | Completed: native entry, validation, preview, PNG/SVG download and decode |

## 1. Disclosures completed

Changed only Privacy Policy and Cookie Policy content in
`lib/content/legal-pages.ts`; effective date is 2026-10-22. Terms and other pages
were not rewritten. No pricing or feature changes.

The pages now explain:

- Browser-prepared QR payloads, design options and selected logos are sent in
  POST bodies to `/api/qr/render` for previews and exports. WiFi/contact/event
  data is included when entered. Production transport uses HTTPS.
- The render handler does not save QR content, logos or resulting images to a
  database/library. This is distinguished from transient processing and possible
  hosting logs; no unverified zero-retention promise is made.
- Supabase identity/profile, subscription and download-counter data; PayPal
  approval/status records and secure pending-checkout linking; configured
  Supabase/Resend authentication email delivery.
- Session cookies and Remember me behavior; guest identifier and daily counts;
  pending-checkout browser proof, separate record expiry and return-path cookies.
- Actual cookie durations in source: guest identifier up to one year, checkout
  proof cookie up to seven days, initial pending-record expiry 24 hours, billing
  intent/auth return cookies up to one day. Cookie expiry is not represented as
  deletion of database records or cancellation of a subscription.
- Language and consent local-storage names and absence of an application TTL.
- Existing GA4 denied defaults, possible cookieless requests, independently
  loaded AdSense verification, consent-controlled advertising loader and Vercel
  Analytics. There is no false promise that rejection blocks all provider traffic.

Both updated pages were opened and inspected in the local browser. Regression
tests reject the obsolete no-server/no-account/consent-only assertions.
These are implementation disclosures, not a jurisdiction-specific legal or
regulatory-compliance certification. Operational retention and provider settings
must remain consistent with the published statements.

Technical provider references used while checking this description:

- [Supabase server-side auth](https://supabase.com/docs/guides/auth/server-side)
  describes cookie-based session handling.
- [Google Consent Mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode)
  describes measurements without cookies while consent is denied.

## 2. Authenticated account testing — Free account verified

The earlier missing-session result is superseded. The user added
`http://localhost:3017/**` to Supabase Redirect URLs, leaving the production Site
URL and existing redirects unchanged. Before that addition, Qraftt requested the
correct localhost callback but OAuth returned to production. After the addition,
actual Google sign-in reached the local callback and `/dashboard` successfully.

Verified in the in-app browser against the local server and existing account:

- `/api/auth/session` returned `{"authenticated":true}`.
- `/dashboard` returned 200, stayed local, and survived reload. The real account
  is Free, with 3/3 daily downloads remaining; review-unlock is not treated as Pro.
- `/account` loaded the authenticated email, confirmed-email status, membership
  date, Free plan and optional display-name form (100-character constraint).
  No profile save, password change or email request was submitted.
- `/dashboard/billing` showed Free/current plan, unchanged monthly pricing and
  unavailable yearly checkout, a truthful storage placeholder and no fabricated
  payment records. No checkout/claim/manage-payment action was started.
- All eight sidebar destinations loaded after awaiting their actual headings:
  My QR Codes, Statistics, Import, Archive, Custom Domain, API Integration,
  Support and FAQ. Unimplemented tools clearly say they are unavailable on any
  plan. Storage details and the existing-payment FAQ accordion opened correctly.
- Header account links resolved to `/dashboard` after the session-status fetch.
- Mobile account navigation opened and followed the billing link, then closed
  on navigation. Billing had no horizontal overflow at actual viewport widths
  360, 390, 430, 768, 1440 and 1920px. Mobile and desktop screenshots inspected.
- Logout returned to local Login, session endpoint became false, and direct
  dashboard access redirected to `/login?next=/dashboard`. Google re-login
  restored the dashboard and `authenticated:true`. Session left signed in.
- No captured browser error/warning logs during the authenticated account audit.

One local presentation defect was fixed: the billing summary omitted the 20
original Free templates. It now reads template benefits from the existing shared
pricing data, showing 20 original Free and 20 original + 10 Pro for Pro. Benefit
rows now use the existing translation component. Regression assertions added.
No entitlement, subscription, price or checkout logic changed.

Still not verified with real browser/account/email data: a Pro account's billing
history/unlimited access, fresh email signup/confirmation, email-password login,
and delivered recovery link → password reset → login. Existing component and
handler fixtures are not a substitute. No passwords were created/reset and no
account or subscription status was forged to close those gates.

Evidence: `/private/tmp/qraftt-local-session-verified.png`,
`/private/tmp/qraftt-auth-mobile-billing.png`,
`/private/tmp/qraftt-auth-billing-audited.png`. Callback codes/tokens are not
included in this report.

## 3. PayPal — isolated handler verification completed; provider flow blocked

The existing local configuration is Live and points to production account data.
It was not used to create or approve a test payment. No existing subscription
was cancelled, claimed, switched, updated or reused by this follow-up.

Added isolated tests that execute the **actual confirm and webhook route
handlers**, replacing PayPal and Supabase dependencies with in-memory test
objects. They do not contact external services or load credentials. Verified:

1. Independently verified ACTIVE approval returns the guest auth/link step rather
   than granting Pro before authentication.
2. A confirmed, freshly authenticated test principal claims the pending record
   once; the stored owner is that principal. Re-verification does not re-claim it.
3. APPROVAL_PENDING status and missing browser proof cannot grant access.
4. Invalid webhook signatures return 401 without an entitlement mutation.
5. Verified suspension, cancellation, expiry and payment failure revoke active
   access in the handler integration. Retry processing is non-duplicating in the
   isolated store; existing backend tests cover the persisted ordering/idempotency.
6. Independent provider status wins over a misleading activation-event label.
7. Provider ownership mismatch returns a failure without changing entitlement.

These tests are **not** a real Sandbox approval/signature/network-delivery pass.
The real Sandbox gate requires separate Sandbox client credentials, a Sandbox
plan/webhook, a Sandbox buyer controlled by the user, and an isolated test database
with the current migrations. None were supplied for this follow-up. Secrets must
be placed directly in a separate test environment/file, not pasted into chat.

Once available, run the app against that test-only environment, approve only a
Sandbox subscription, return to the app, authenticate, claim it, and verify
account/entitlement state. A reachable, explicitly scoped test HTTPS endpoint is
needed for real webhook delivery. Do not expose the development review-unlock
server publicly or repoint production webhooks. Database configuration changes
and provider approval steps must be confirmed before proceeding.

## 4. Calendar — completed in the actual browser

The prior incomplete date-entry test was an automation-control issue. Native
accessibility date-field entry committed the existing controlled inputs. **No
Calendar implementation change was necessary.**

Observed results:

- Event title: `Release Review Workshop`.
- Native start: `2026-11-12T09:00`; native end initially `2026-11-12T10:00`.
- Location: `Review Studio`.
- Description: `Bring a notebook. Original content: café مرحبا.`
- Live preview rendered and PNG download completed in the browser.
- Downloaded PNG decoded to a VCALENDAR/VEVENT containing the exact title,
  start/end times, location and multilingual description.
- Setting the end to 08:00 displayed `The event end must be after the start.`
  and disabled downloading.
- Correcting the end to 10:30 restored generation. Browser SVG export decoded
  with `DTEND:20261112T103000`, proving updated native input reached the export.

Local evidence files:

- `/Users/macbookair/Downloads/qraftt-calendar-qr.png`
- `/Users/macbookair/Downloads/qraftt-calendar-qr.svg`
- `/private/tmp/qraftt-calendar-release-verified.png`
- `/private/tmp/qraftt-current-cookie-disclosures.png`

## Final checks

| Check | Result |
| --- | --- |
| Lint | Pass |
| TypeScript | Pass |
| Automated suite | **173 passed, 0 failed, 0 skipped** |
| Production build | Pass |
| Pricing and Free/Pro rules | Unchanged |
| Production deployment | Not performed |

These four technical checks were rerun after the authenticated audit and billing
summary correction. Logs are `/private/tmp/qraftt-auth-audit-{lint,types,tests,build}.log`.
The 173-test suite passed with zero failures or skips. Only application change in
this follow-up: `components/account/billing-plans.tsx`; corresponding assertions
updated in `tests/dashboard.test.mts`. All prior local fixes remain intact.

**Remaining gates: (1) real isolated PayPal Sandbox approval, webhook delivery,
and linked Pro account checks; (2) controlled email/password signup and recovery
end-to-end checks.** The previously blocked Google/Free-account audit now passes.
Compilation and mocked
integration tests do not close those external end-to-end gates. Do not call the
build fully release-ready or deploy it until those checks pass and deployment is
explicitly approved.
