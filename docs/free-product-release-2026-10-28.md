# Free product release — 2026-10-28

## Product policy

All QR types, original/uploaded/decorative templates, Standard Frames, center-logo upload, colors, gradients, shapes, eyes, correction levels, PNG/JPG/SVG/PDF/EPS and all existing resolutions are free. Downloads have no daily allowance. Authentication is required only for private account features such as saved designs.

Every account has 100 saved QR codes and 250,000,000 measured storage bytes. Historical subscription status and interval do not affect access or limits. Existing over-limit records are retained. New saves are blocked at the count cap; storage growth is blocked above the capacity cap. Existing designs can still be read, deleted or reduced. Persisted JSON, embedded logos and titles count toward storage; downloads and externally hosted destinations do not.

## Payment safety

Former subscription, confirmation, Sandbox checkout, abandonment and cleanup endpoints return HTTP 410 without provider/database calls. The scheduled PayPal cleanup is removed. Auth no longer resumes or claims checkout state. Historical webhook signature/ownership verification and status reconciliation are retained, but cannot claim or cancel an agreement. Historical subscription rows remain read-only in the account UI. Existing agreements are NOT automatically cancelled; the account page links to PayPal's automatic-payment management for previous subscribers.

No PayPal plan, recurring agreement, production environment credential or user account was changed by this release. Subscription records and earlier migrations remain intact.

## Database migration

`202610280001_free_account_quota.sql` replaces only the service-only saved-QR function. It preserves owner scoping, per-account row locking, measured generated-column bytes and grants. No account, subscription or saved-design data is migrated or deleted.

Production application succeeded in one transaction. Verified function-body MD5: `8b57b50b827810af833a87d7ada2d75a`, matching the local migration. All ten existing accounts returned 100 / 250,000,000 limits. Before/after account count: 10; historical subscriptions: 9; saved codes: 0; subscription ID/status aggregate checksum unchanged. The later disposable browser-audit record was deleted, restoring zero saved codes/bytes.

## Verification

- Lint and TypeScript passed.
- Full automated suite: 199 passed, 0 failed, 0 skipped, including independent Ghostscript PDF/EPS interpretation and QR decoding across all formats, templates, center logos and captions.
- Production build passed, 76 static pages generated.
- Real browser: authenticated free dashboard; center-logo upload; PNG/JPG/SVG/PDF/EPS downloads at 2000 px; saved create/reload/edit; library storage display. Persisted edited content was re-exported and decoded successfully. Deleting only the disposable QA record released exactly its measured 930 bytes and one saved slot.
- Browser: all ten decorative templates apply and render without upgrade prompts. Mobile/tablet/desktop checks at 360, 390, 768 and 1440 px show no horizontal overflow, PRO badges or open paywalls. Console error check clean.
- PostgreSQL integration: all-account quota equality, ownership isolation, count and byte caps, retained over-limit data, edit/shrink/delete behavior and service-only RPC permissions passed.

The existing QR artwork, rendering geometry and export implementation are unchanged. Existing public URLs are preserved; retired purchase URLs are intentionally unavailable.
