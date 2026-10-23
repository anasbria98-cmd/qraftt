# Local Free / Pro plans, exports and saved QR storage

Status: LOCAL ONLY. No commit, push, deployment, payment, subscription mutation,
production migration or production account creation was performed.

## Implemented

| Plan | Price | Downloads / exports | Saved QR / logical storage |
| --- | --- | --- | --- |
| Free | $0 | 3/day combined PNG/JPG, 512px | No new saved designs |
| Pro Monthly | $4.99/month | Unlimited PNG/JPG/SVG/PDF/EPS, up to 2000px raster | 100 / 250,000,000 bytes |
| Pro Yearly | $19.99/year | Same core Pro features | 500 / 1,000,000,000 bytes |

All 30 QR types remain available. The 20 original Free template definitions and
the 10 approved Pro template definitions/artwork are unchanged. Center logos,
premium templates, custom styling and paid exports remain server-gated. The
existing loopback-only development review flag does not grant a real Pro account
or unlock persisted storage.

All formats derive from the same generated SVG scene. PNG/JPG use the selected
raster size. SVG is self-contained. PDF is a printable 150mm square. EPS contains
PostScript vector QR geometry, not a renamed raster image. Uploaded logos and
reference illustrations remain embedded images. PDF/EPS embed small frame-caption
bands using the preview's font renderer to preserve non-Latin text; EPS also
flattens the jigsaw reference's translucent finder artwork locally. PostScript
image data is compressed to stay below serverless response-size limits. JPG and
EPS use white/paper for transparency. PDFKit runtime font/color-profile files are
explicitly included in the Next.js deployment trace.

Pricing, upgrade prompts and billing now share the final catalog and support
monthly/yearly selection. Existing Pro users are not sent into a second checkout
to change their interval.

## Saved QR backend

New migration: `supabase/migrations/202610220001_saved_qr.sql`.

- Account-owned JSON documents contain selected QR-type content, validated design,
  correction, export preferences and embedded logo. Unrelated hidden form fields
  (such as a WiFi password from another QR type) are removed on client and server.
- Usage comes from database-generated UTF-8 byte lengths of the persisted JSON
  document plus title. It is logical saved-document usage, not PostgreSQL disk,
  index, backup or TOAST-compressed physical storage. Export downloads are not
  counted as dashboard storage. This does not add PDF/image file hosting.
- A service-only database function resolves the active, allowlisted subscription
  and locks the account row before quota checks and mutations. Browser-supplied
  ownership, Pro flags, usage or limits are never used as authority.
- RLS and explicit account predicates protect ownership; anonymous/authenticated
  clients cannot write the table or invoke the service RPC directly.
- Library, editor loading, update, re-download and deletion UI/API are implemented.
  Count and byte limits apply to edits as well as new documents. Downgraded users
  can see retained document metadata and delete their documents; editing/loading
  for re-export requires Pro. Over-limit accounts must reduce usage before editing.
- If the database migration is absent/unreachable, UI explicitly reports storage
  unavailable. It does not invent zero usage or pretend saves succeeded.

## Verification

- ESLint: zero errors; one non-blocking Next.js navigation warning in the existing
  post-claim dashboard hard navigation. Its behavior was left unchanged.
- TypeScript: passed.
- Full automated suite with the independent vector decoder enabled: 183 passed,
  zero failed, zero skipped.
- Independent export matrix: 43 design scenarios × 5 formats = 215 decoded files.
  Includes all 20 Free templates, all 10 Pro templates, all 10 Pro templates with
  a logo, a plain center logo, gradient/frame styling and Arabic frame text.
  PDF/EPS are rasterized by Ghostscript and decoded locally; jsQR and ZXing-C++
  provide independent decoding. Files are also checked against response limits.
- Selected PNG/JPG raster sizes 512/1000/2000, mixed Free daily allowance,
  server-side paid-format/design gates and forged client entitlement rejection pass.
- Actual PostgreSQL migration tests run in disposable PGlite, not production:
  100/500 count limits, byte-limit rejection, replacement accounting, ownership,
  downgrade behavior and RPC/table privileges pass.
- Browser: actual local PNG/JPG/SVG/PDF/EPS downloads; the downloaded jigsaw EPS
  independently decodes to the entered destination. Free SVG/PDF/EPS open the
  existing upgrade modal; JPG remains selectable. Monthly/yearly pricing displays
  the correct price and limits. No export/pricing console errors observed.
- Responsive generator checks: 360, 390, 430, 768 and 1280px; no horizontal overflow.
  Desktop/yearly and mobile pricing reviewed visually.
- Production build: passed; trace includes PDFKit's 14 AFM files and ICC profile.

The optional decoder tools were installed outside this repository. To reproduce
the full vector matrix, install `@jspawn/ghostscript-wasm` and `zxing-wasm` into
the same temporary npm prefix, then set `QRAFTT_GHOSTSCRIPT_PATH` to that prefix's
`node_modules/@jspawn/ghostscript-wasm` directory when running `npm test`.
They are not application/runtime dependencies.

## Required before production activation

1. Apply the saved-QR migration to an isolated Supabase test project and verify
   browser save → list → reopen → edit → re-download → delete using authenticated
   Monthly/Yearly test accounts. No isolated Supabase target was supplied. The
   connected project is production, so its schema/users were deliberately left
   untouched. The current local browser therefore reports storage unavailable;
   SQL/backend tests are not presented as a completed hosted Supabase E2E test.
2. Read-only provider inspection found a pricing/configuration blocker. Local and
   Vercel Production use Live mode and monthly plan
   `P-8G5554222G795842XNLLK43Y`. PayPal reports ACTIVE, USD 2.00 every month,
   no setup fee, and no additional tax. This is NOT the required USD 4.99/month.
   Production has no `PAYPAL_PRO_YEARLY_PLAN_ID`; a yearly variable exists only
   for Preview. The local yearly ID `P-1X5251666D9224722NLGT6GA` returns HTTP 404
   from Live PayPal, so its actual price cannot be verified. Correct plans/config
   need separate approval before changing anything. Only OAuth token acquisition
   and GET plan metadata were used; no checkout, payment or subscription mutation
   was performed. New Live checkout fails closed on a catalog mismatch.
3. If replacing plan IDs, retain existing same-environment IDs in the comma-separated
   server-only `PAYPAL_LIVE_LEGACY_PLAN_IDS` or `PAYPAL_SANDBOX_LEGACY_PLAN_IDS`.
   This preserves existing subscription entitlements and pending approved claims;
   it does not modify subscriptions or authorize cross-environment records.
4. The previously deferred isolated PayPal approval/webhook/activation and email
   signup/confirmation/reset provider E2E tests remain unverified.
5. Hosted saved-QR and provider end-to-end checks remain required. The user
   explicitly confirmed there is no isolated Supabase environment and requested
   that this migration remain unverified rather than touching production.

## Security follow-up

- Updated Next.js and its ESLint plugin from 16.2.11 to 16.4.2, staying on major 16.
  Updated Sharp 0.34.5 to 0.35.5 because the patched native image stack requires that
  pre-1.0 minor line. Compatible vulnerable transitive dependencies were updated
  without `npm audit fix --force` or an unrelated major framework upgrade.
- Relevant runtime surfaces include public App Router Server Actions, the
  ImageResponse icon, Next image handling, and Sharp QR/logo rendering. This does
  not mean every advisory was demonstrated exploitable: Windows-specific issues
  do not apply to the Linux deployment, and no app `use cache` usage was found.
- Before: npm audit reported 19 affected packages. After: production dependency
  audit reports ZERO vulnerabilities. The full audit reports four high-severity
  affected development packages, all from one remaining advisory:
  `braces@3.0.3` via micromatch → fast-glob → the Next ESLint plugin
  (GHSA-vfj7-8cjw-p6xm). No patched braces release was available at inspection.
  npm's forced proposal would downgrade the Next ESLint plugin to major 14;
  that breaking downgrade was deliberately not performed. These tools operate on
  repository lint patterns, not public request patterns. None appears in the
  generated deployment NFT traces.
- The post-update full suite passes all 183 tests, zero failures/skips, including
  the 215-file independent export/decode matrix. TypeScript and production build
  pass. The fresh local server renders the reference jigsaw and downloads PDF;
  no browser console errors were observed in that check.
- The migration has only been exercised in disposable PostgreSQL-compatible
  PGlite tests. Hosted Supabase auth/RLS integration and browser CRUD/re-download
  remain UNVERIFIED; offline tests are not a substitute for that release gate.

Primary security references:
- https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r
- https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j
- https://sharp.pixelplumbing.com/changelog/v0.35.5/

Release decision: NOT READY for activation of the complete new system. The hosted
storage verification and PayPal price/configuration blockers remain. All changes
are local and uncommitted; no push or deployment was performed. No production
schema, users, subscriptions, webhook settings or environment variables changed.

Nothing in this document authorizes applying a production migration or deployment.
