# Qraftt account foundation (local, Sandbox only)

## Setup

Use the existing Supabase project. Store `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. The server variable accepts the project's service-role JWT or secret API key. Never expose it to the browser.

Apply `supabase/migrations/202610180001_saas_foundation.sql` once through Supabase SQL Editor (transactional, does not replace existing tables). A server API key cannot run SQL migrations. Do not apply this migration over unrelated tables with the same names; inspect conflicts first.

In Supabase Auth URL Configuration set Site URL to `http://localhost:3000` for this local test and allow `http://localhost:3000/auth/callback`. Enable email/password signups and email confirmation. Use the normal confirmation email link in the same browser that signed up (PKCE). For an existing production Auth project, keep its Site URL and add the exact localhost callback to its redirect allowlist instead. Configure SMTP before a public launch; the built-in mail service is restricted/rate-limited.

The schema creates `profiles`, `subscriptions`, and server-only `download_usage` and `billing_webhook_events`. Users can read only their own profiles/subscriptions and update only their own display name. Users cannot change plan, email, subscription status, quota, or event records. Auth handles passwords and verified email ownership. Auth user creation/email changes synchronize profiles automatically. Billing RPCs are executable only by service_role, use atomic writes, deduplicate webhook events, reject older observations, and recalculate the user's plan.

`current_period_start` uses PayPal's last successful payment timestamp when supplied; `current_period_end` uses its next billing timestamp. Missing values stay null; dates are never invented.

## Test

1. Open `/signup`, create an account with a 12+ character password (maximum 72 UTF-8 bytes), and confirm the email.
2. Log in at `/login`; `/dashboard` and `/account` require a verified server-side session.
3. Open `/pricing` and select Monthly. The existing development-only $1 Sandbox display/checkout override remains; final prices stay $2.99/month and $19.99/year.
4. Select Upgrade. Use a different PayPal **Sandbox personal buyer** account to approve. No Live PayPal calls are supported.
5. Return to Qraftt. The server checks the subscription ID, stored user, PayPal custom_id, and plan ID against PayPal before enabling Pro. The dashboard should show ACTIVE; test SVG/customization. Pending approval never enables Pro.
6. Log out, then log in again (also from another browser). Supabase identity restores access from its subscription records, not the old anonymous cookie. Existing anonymous test subscriptions are deliberately not auto-claimed by email or cookie.
7. Test forgot/reset-password by email. After a successful reset, log in again.

## Webhooks

Localhost cannot receive PayPal webhooks directly. For lifecycle testing use a user-approved public HTTPS tunnel to `/api/paypal/webhook` and register that URL in the **Sandbox** app, then save `PAYPAL_WEBHOOK_ID` locally and restart the dev server. Required events: BILLING.SUBSCRIPTION.ACTIVATED, BILLING.SUBSCRIPTION.CANCELLED, BILLING.SUBSCRIPTION.SUSPENDED, BILLING.SUBSCRIPTION.EXPIRED, BILLING.SUBSCRIPTION.PAYMENT.FAILED, PAYMENT.SALE.COMPLETED. Incoming signatures are verified against PayPal and the subscription is fetched server-side before updating the database. Never accept simulated/unsigned events as proof of payment. Without an accessible registered webhook, return-from-checkout verification works but automatic lifecycle updates cannot be confirmed.

## Boundaries

Guest QR generation stays free; anonymous quotas remain cookie-bound and may reset if cookies are cleared. Signed-in quotas are keyed by Supabase user ID and use an atomic daily UTC counter. Legacy libSQL code/tests remain for compatibility but are not used by the active billing flow; no existing database or Vercel resource has been deleted or disconnected. The old `/api/paypal/sandbox-checkout` route now redirects to pricing rather than creating anonymous subscriptions. Saved QR, dynamic QR, scan analytics, teams, API access, and custom domains are not implemented. No deployment is part of this task.
