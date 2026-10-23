# Live billing cutover — 2026-10-23

Production deployment `dpl_2qQ2N2Yx4NhkqnMa9FVdXAwQoLrS` is Ready and promoted to `www.qraftt.com`.

- Monthly checkout: `P-2BS68552TL511541XNLNNNGA`, verified ACTIVE at USD 4.99/month.
- Yearly checkout: `P-0GK070360B7634223NLNNNGI`, verified ACTIVE at USD 19.99/year.
- Production legacy allowlist: `P-8G5554222G795842XNLLK43Y` (existing USD 2.00/month agreements, unchanged).

This is a billing-only CLI release from the existing production baseline `8866b73b39f461e07fcf764ebd9c80b7c7bdc952` plus scoped patches. No Git commit or push was made. Its release source is retained at `/private/tmp/qraftt-live-billing-0MJdQ6` (temporary location; not permanent source control).

Scope: current-checkout plan selection, Monthly/Yearly price verification, yearly checkout availability, pricing/billing interval UI, and retained legacy plan recognition with account ownership checks. No subscription was created, charged, revised or cancelled. No production Supabase migration or webhook setting changed.

Excluded: unrelated local saved-QR/storage/export and dependency work. Their existing local state remains intact and is not part of this deployment. Hosted storage migration verification and isolated payment/email provider E2E remain deferred.

Verification: lint, TypeScript, 176 isolated release tests and production build passed. PayPal plan metadata was read back without initiating checkout. The live pricing page showed USD 4.99/month and, after selecting Yearly, USD 19.99/year. Production environment IDs were read back after promotion. No real checkout was opened to verify prices.

Future Git-based deployments must retain this billing cutover and legacy allowlist; an old-main redeploy would restore older checkout/UI code. The main workspace contains additional unreleased changes, so do not blindly deploy the entire directory.
