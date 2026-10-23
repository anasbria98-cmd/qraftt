# Project Rules

- This is a free QR Code Generator SaaS.
- Do not add subscriptions, payments, or a mandatory account system.
- Future monetization is Google AdSense.
- Treat SEO and performance as top priorities.
- Use Next.js App Router, TypeScript, and Tailwind CSS.
- Prefer Server Components except where interactivity requires Client Components.
- Keep dependencies minimal.
- Avoid duplicated code.
- QR generator types must use reusable configuration and components.
- Generate static QR codes locally whenever possible.
- Do not copy ME-QR branding, text, assets, or exact UI.
- Preserve existing working functionality unless the task explicitly requires changing it.
- Never make unrelated redesigns or refactors.
- Before finishing coding tasks, run relevant tests and builds, and fix errors introduced by the changes.
- Keep final responses concise: changed files, result, and any remaining issue.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
