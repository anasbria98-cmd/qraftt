# PayPal-first Sandbox checkout

The pricing page remains public. Upgrade starts PayPal immediately. A signed-out
checkout has a random identifier in PayPal `custom_id`, and a private Supabase row.
Only a SHA-256 hash of a 256-bit browser secret is stored in the database. The
secret is kept in an HttpOnly, Secure (production), SameSite=Lax cookie, never in
URLs or localStorage. PayPal subscription IDs alone cannot claim access.

After approval, the server independently fetches PayPal's current subscription,
checks its plan and custom identifier, and requires ACTIVE status. It then asks
the visitor to authenticate. A verified sign-in after checkout creation is
required, preventing a pre-existing unrelated browser login from silently
receiving the subscription. Claiming is transactional and locks the pending row:
the same subscription cannot be linked to two accounts. Webhooks continue to
verify signatures, re-fetch current PayPal state and update the linked account.

## Required before deployment

1. Apply `supabase/migrations/202610180002_guest_checkout.sql` to the existing
   Supabase database. There are no anonymous/authenticated read/write grants on
   the new pending table or claim function.
2. Add a random server-only `CRON_SECRET` to Vercel production. Keep every PayPal
   variable unchanged, especially `PAYPAL_ENV=sandbox` and the $1 test plan.
3. Deploy `vercel.json` with the daily `/api/paypal/cleanup` job. Its authenticated
   handler cancels expired unclaimed subscriptions; failed cancellations remain
   retryable. Return verification and verified webhooks also enforce expiry.
4. Verify a signed-out buyer approval with a PayPal Sandbox personal account,
   followed by signup/email confirmation or login **in the same browser**, then
   the Pro dashboard. Do not use a real PayPal account or real money.

## Abandonment and recovery

Claims expire 24 hours after checkout creation. Daily cleanup cancels them after
expiry (not an exact 24-hour cancellation guarantee); webhooks and return checks
can cancel earlier. Cancellation and claiming serialize on the pending row, so
cleanup never cancels a successfully claimed subscription. Cancelled/expired
proof cannot be used to claim Pro. A user can explicitly cancel their unclaimed
checkout using the post-approval prompt or verification error controls.

If the browser proof is lost, access is not recovered merely by supplying a
subscription ID or matching an email address. Contact support for manual
ownership verification and Sandbox cancellation; do not pay a second time.

## Verification status

Unit/source security checks are not a substitute for a real Sandbox buyer
approval. Do not describe activation, signed webhook delivery or the complete
purchase flow as verified until those steps actually complete.
