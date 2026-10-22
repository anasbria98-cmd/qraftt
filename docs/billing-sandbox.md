# Local Qraftt Free / Pro test

Run `npm run dev`, then open `http://localhost:3000/pricing`.

Free supports all 30 content types and a live black-and-white preview, with three
512px PNG downloads per customer per UTC day. Pro adds existing logo, color,
template, frame, pattern, eye, gradient and correction controls, SVG, higher
resolution and unlimited official downloads. Downloaded codes remain static.

Choose Monthly (USD 2.99) or Yearly (USD 19.99), click Upgrade and approve with a
PayPal Sandbox personal buyer account. PayPal returns to the local pricing page.
The server checks the subscription, its configured plan and customer ID before
granting access. Refresh or reopen the generator to see Pro customization.
Display currency conversion never changes the USD charge.

The server stores customer identifiers, hashed session tokens, optional PayPal
email, subscription IDs, plan IDs, interval, status, entitlement and timestamps.
Local records persist in the Git-ignored `.qraftt-billing.db` database. An opaque
HttpOnly cookie identifies returning visitors in the same browser; deleting the
cookie or using another browser loses this identity. Account recovery is not yet
implemented. Anonymous daily limits cannot reliably identify the same person
across browsers or cookie deletion, and a visible preview can be saved separately.

## Remaining webhook setup

PayPal cannot call localhost. Create a temporary HTTPS tunnel for local testing
and register `<tunnel URL>/api/paypal/webhook` under the same **Sandbox** REST app.
Set the registered webhook ID as `PAYPAL_WEBHOOK_ID` in `.env.local` and restart
the dev server. Subscribe to:

- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
- `PAYMENT.SALE.COMPLETED` (rechecks a recovered recurring payment)

Only successful PayPal server signature verification permits processing. Known
subscriptions are rechecked against PayPal; duplicate and older event IDs do not
override newer states. Cancellation, suspension, expiry and failed payments revoke
Pro. Initial checkout approval can grant Pro after server verification even before
the webhook is configured. Until webhook registration, lifecycle delivery is not
automatic. Test using actual Sandbox transactions, not unverified forged events.

## Before any future deployment

Configure a hosted libSQL/Turso database URL and auth token using
`BILLING_DATABASE_URL` and `BILLING_DATABASE_AUTH_TOKEN`. Local file databases are
rejected by production handlers because serverless files are not durable.
Local Sandbox credentials, plan IDs and webhook ID are also needed in that
environment. Keep `PAYPAL_ENV=sandbox`; no live mode exists in the client.
Production readiness also requires recovery/authentication, abuse protection,
and review of existing SEO/privacy copy that still describes fully local,
unlimited free customization. Those pages were intentionally left unchanged.
