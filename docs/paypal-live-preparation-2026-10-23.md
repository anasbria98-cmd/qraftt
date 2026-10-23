# Live PayPal catalog preparation — 2026-10-23

Catalog plans created and independently read back from the Live PayPal API:

| Purpose | Plan ID | Verified recurring price | Status |
| --- | --- | --- | --- |
| New Monthly (staged, not checkout) | `P-2BS68552TL511541XNLNNNGA` | USD 4.99 every month | ACTIVE |
| New Yearly (staged, not checkout) | `P-0GK070360B7634223NLNNNGI` | USD 19.99 every year | ACTIVE |
| Existing legacy Monthly | `P-8G5554222G795842XNLLK43Y` | USD 2.00 every month | ACTIVE, unchanged |

New plans have one unlimited regular billing cycle, no trial and zero setup fee.
The preparation script compared the legacy plan response before and after creation; it was unchanged.

## Local compatibility preparation

- `.env.local` retains its existing current-checkout plan IDs. The new IDs above are intentionally documented only, not selected for checkout.
- `PAYPAL_LIVE_LEGACY_PLAN_IDS` locally includes the old Monthly ID.
- Account-linked confirmation accepts a stored, independently verified plan from the current Live allowlist, including legacy IDs, rather than requiring the latest checkout ID. Stored plan equality, verified PayPal custom ID and account ownership remain required.
- Regression coverage exercises direct and guest-origin legacy agreements, new plans, wrong owners/custom IDs/plans, and Sandbox/unknown plan rejection using isolated mocks only.

## Explicit non-actions

No subscription was created, revised, cancelled or charged. No existing recurring agreement was modified. No production Supabase records, webhooks, Vercel environment settings or checkout plan selections were changed. No commit, push or deployment was performed.

Production cutover requires separate approval: deploy compatible legacy recognition and retain the legacy ID in the Production allowlist before selecting the staged new checkout IDs. Do not update the legacy plan's price in place. Full isolated approval → webhook → Pro activation verification remains deferred; this catalog preparation does not establish that end-to-end result.

## Verification

- PayPal API read-back: both new plans ACTIVE with the requested USD price/frequency; legacy metadata unchanged.
- Read-only Vercel Production check: `PAYPAL_ENV=live`; Monthly checkout still selects `P-8G5554222G795842XNLLK43Y`.
- Lint: no errors, one pre-existing pricing navigation warning.
- TypeScript: passed.
- Full tests: 184 passed, including export decoding and legacy ownership/environment regression coverage.
- Local production build: passed. Nothing deployed.
