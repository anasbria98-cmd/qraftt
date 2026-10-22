# Local template review (not production)

Run `npm run dev:template-review`, then open http://localhost:3017/.

This binds to loopback only. The generator shows a LOCAL TEMPLATE REVIEW banner,
unlocks the approved 10 Pro templates and center-logo upload, and allows test
PNG/SVG exports without payments, account changes, or consuming download quota.
The 20 original Free templates and the template catalog are unchanged.

The server requires an explicit process flag, development mode, a loopback URL,
and absence of Vercel runtime markers. Production builds cannot enable this
capability, even with the flag. No environment files need editing.

Stop the process with Ctrl+C. Normal `npm run dev` has no review unlock.
Do not expose or tunnel this development server publicly. This is a local review
tool, not a way to grant Pro accounts. No production deployment is needed.
