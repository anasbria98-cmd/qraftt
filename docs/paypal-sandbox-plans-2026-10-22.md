# Local Sandbox plan verification

Status: LOCAL ONLY. No commit, push or deployment.

| Interval | Sandbox plan ID | PayPal status | PayPal price |
| --- | --- | --- | --- |
| Monthly | P-3B963546XC399024JNLNM76Y | ACTIVE | USD 4.99 every MONTH |
| Yearly | P-76G21377D0913050UNLNJ47Y | ACTIVE | USD 19.99 every YEAR |

Both have one regular unlimited billing cycle, interval count 1, zero setup fee,
no trial and no additional tax. Authenticated Sandbox GET requests read back the
actual details after creation. No existing plan was edited.

Monthly price updated locally on 2026-10-23. The previous USD 2.99 Sandbox plan
`P-1E4990301H7295529NLNJ47A` remains unchanged and is retained in the local
Sandbox legacy allowlist for existing records. Yearly is unchanged. No Live plan,
Live environment configuration, subscription, webhook or payment was modified.

Credentials and IDs are in gitignored `.env.sandbox.local`. Next.js does not
automatically load that filename: use `npm run dev:sandbox` for the explicit
Sandbox-only process on localhost:3017. This leaves `.env.local` and all Vercel
configuration unchanged. Stop the existing local server before using that port.
The Sandbox file clears the inherited legacy monthly test override and Live
webhook ID; Sandbox webhooks are deliberately not configured by this task.

Verification:
- Sandbox OAuth succeeds; both provider plan details match the table.
- The application's real plan resolver selects the correct ID for monthly/yearly,
  including with `.env.local` loaded first and Sandbox overrides loaded last.
- 12 PayPal unit/mock tests pass, including endpoint isolation and lifecycle
  verification. No real subscription creation was used in these tests.
- Catalog setup script is hardcoded to Sandbox and refuses any other mode.

PayPal catalog/configuration is ready for testing. Full Qraftt checkout → approval
→ webhook → Pro activation remains unverified and is NOT cleared for execution
against the current production-connected Supabase project. An isolated test DB
and Sandbox webhook setup are still needed. No checkout endpoint was invoked,
subscription created, buyer approval performed, or payment charged. No production
database, user, subscription, Live PayPal plan, webhook or environment changed.

Only Sandbox product/plan catalog objects were created remotely. Rotate the
Sandbox app secret exposed in the user's screenshot after testing and update the
local credentials directly, never via chat.
