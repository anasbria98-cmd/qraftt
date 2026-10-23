# Full approved release — 2026-10-23

Includes saved QR/account storage, Monthly/Yearly quotas, PNG/JPG/SVG/PDF/EPS exports, server-side Free/Pro restrictions, 20 unchanged Free and 10 Pro templates, Pro center logos, footer social links and approved UI work.

Production billing configuration is retained: Live Monthly `P-2BS68552TL511541XNLNNNGA` (USD 4.99), Yearly `P-0GK070360B7634223NLNNNGI` (USD 19.99), legacy allowlist `P-8G5554222G795842XNLLK43Y` (USD 2 Monthly). No subscriptions or PayPal settings were modified by this release.

## Database

The user explicitly authorized production migration. SQL preflight confirmed both saved-QR table and RPC were absent. The saved-QR migration was executed in a transaction with lock/statement timeouts through the production SQL Editor. Supabase reported success; REST verification returned HTTP 200 for the new table and exposed the RPC. Existing profile/subscription counts stayed at 7/6. No account or existing subscription rows were updated or deleted.

## Checks before deployment

- Lint: zero errors; one pre-existing internal navigation warning.
- TypeScript and production build: passed.
- Full suite: 185 tests passed, including export/QR decoding and SQL quota/ownership enforcement.
- Transaction-wrapped migration: its four focused saved-QR tests also passed.
- Production remains Live; Sandbox production test mode false; template-review unlock absent.
- Environment secrets remain gitignored and are not deployment source files.

This supersedes earlier documents describing the saved-QR schema as unapplied. Those documents record historical checks, not current migration status. Full real payment approval/webhook E2E remains deferred; do not create a real payment merely to verify deployment.
