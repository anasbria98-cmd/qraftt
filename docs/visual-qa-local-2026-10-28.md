# Qraftt local 3D visual QA — 2026-10-28

Status: local review only. No commit, push, deployment, database write or production setting change.

## Corrections

- Consolidated page, section, panel, selectable-control and decorative-object elevation into levels 0–4. Shared upper-left lighting, lighter mint materials and consistent panel/card/control radii replace competing nested shadow treatments.
- Removed tilt from functional icons and whole marketing illustrations, and removed the second illustration shadow filter. Decorative hero objects share one perspective; unrelated small floating pieces were removed. Hero artwork is 56px tall inside the existing 67px desktop hero.
- Replaced full-width template/Standard Frame expand bars with square tiles inside their existing grids. Each collapsed grid has 11 designs plus its expand tile, giving complete rows at 2, 4 and 6 columns. All designs and their order remain available through expansion; all 10 decorative designs remain directly visible.
- Removed the QR-type View All dashed border and corrected its low-contrast plus icon. Selected gallery cards no longer have an extra persistent outline; keyboard focus outlines remain.
- Removed redundant framing around account facts/details. Account, auth, pricing, dropdown and dialog surfaces now use the shared elevation levels.
- Fixed the template-preview dialog's top-left positioning: centered auto margins, viewport-constrained height and overflow scrolling. Close action aligns with the content. Artwork size, proportions and content are unchanged.

## Browser evidence

21 requested page states at 390, 768 and 1440px: home, main QR generator, WiFi generator, pricing, about, contact, blog, a blog article, privacy, terms, cookie policy, dashboard, saved QR library, account/storage, profile, account FAQ, Statistics empty state, login, signup, forgot password, and reset password's unauthenticated redirect to login.

- 63 measured states: no document horizontal overflow, clipped visible control text or failed loaded images found.
- View All sizing additionally checked at 360, 1024, 1200 and 1920px. At 1440px both expand tiles and adjacent artwork tiles measure 114×114px; at 390px all measure 126×126px. Borders are solid.
- Both expand/collapse flows work. Expanded Free gallery exposes all 30 designs plus No template; Standard Frames exposes all 30 styles. Decorative gallery keeps all 10 designs visible.
- Preview dialog tested at 390×900, 768×900, 1440×900 and 844×390. Center error under 0.01px; all fit with at least 16px viewport clearance. Landscape content scrolls inside the dialog.
- Mobile header navigation, dashboard sidebar, live preview toggle, template preview dialog and Arabic RTL gallery were exercised; language restored to English.
- Header/hero, generator galleries, feature illustrations, step cards, footer, auth and dashboard screens visually reviewed. Transient capture artifacts during rapid viewport changes were recaptured at settled sizes rather than treated as application defects.

Local evidence folder: `/private/tmp/qraftt-visual-qa/` (screenshots, contact sheets, metrics and test output).

## Validation and boundaries

- Lint: passed.
- TypeScript: passed.
- Full suite: 206 passed, 0 failed, 0 skipped, including QR/export decoding checks.
- Production build: passed, 76 static pages generated.
- Logo source, QR renderer/export engine and template definitions/artwork unchanged. No new dependencies or WebGL.
- Existing local authenticated account remained signed in; no saved data or account settings were changed.
- Coverage limits: current saved library is empty, so populated rows were not visually exercised with live data. Recovery form needs a valid recovery session; only its unauthenticated redirect was checked. No signup, password reset, payments or data mutations were performed for this styling audit.

Ready for local visual approval, not deployed.

## Final 3D surface-completion pass

Extended the established materials to FAQ headers and open states, Free-plan header/rows, related-generator links, informational panels, footer interactions, secondary controls, the saved-QR name field/actions, dropdown items, dashboard navigation, storage disclosures and empty states. Interactive hover/pressed effects respect reduced motion. No new artwork, assets, dependencies or decorative objects were added.

This pass changed only CSS plus a regression test and this report. The JSX diff was checked against the start of the pass and is identical: structure, content, routes, logo and feature logic were not edited.

- Verified 30 unique page/viewport combinations: home, main generator, pricing, dashboard, account/storage, saved library, account FAQ, profile, login and signup at 390, 768 and 1440px. No body overflow, clipped controls or failed loaded images found.
- Verified accordion expansion, password visibility toggle, mobile preview, tabs, language menu, Arabic RTL and mobile account navigation. English and password masking restored afterward.
- Lint, TypeScript and final production build passed. Full suite: 207 passed, 0 failed, 0 skipped, including export/QR decoding checks.
- Responsive overrides were explicitly verified against the active review tab; stale/background-tab measurements were discarded rather than counted.
- Evidence: `/private/tmp/qraftt-3d-complete/` (verification JSON and public/auth/dashboard screenshots). Earlier coverage limits for populated saved rows and recovery sessions still apply.
- All work remains local. No commit, push, deployment, account-data write or production configuration change.

## Detached decoration removal — approved release

Removed both unused decorative hero SVG assets (QR/sliders and phone/download) and their pseudo-element display rules. No replacement objects, geometry, spacing or functional changes. Existing in-card illustrations and all dimensional UI surfaces remain intact.

- Code scan: no detached decoration references in public or account components.
- Browser checks: 24 route/viewport combinations across public pages and the authenticated dashboard at 1440, 768 and 390px; no floating assets, horizontal overflow or console errors. Hero pseudo-elements resolve to `content: none`.
- Lint, TypeScript, 207 tests (zero failed/skipped, including export decoding) and production build passed.
- User authorized commit, push and production deployment. No database, environment, payment or account-data changes are included.
