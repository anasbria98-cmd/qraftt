# Local review: ten reference templates

Verified against http://localhost:3017/ (local review capability; no production deployment).

## Findings and fixes

- Preview API rasterized artwork at 256px, then the browser forced it through a
  second 256px canvas. Nine templates failed QR decoding for at least one tested
  long URL or multilingual payload. Premium preview responses now retain 1000px
  detail and canvases retain the returned image's natural resolution. CSS still
  controls the responsive display size. Red-gold Santa passed the original matrix.
- Active-template comparison ignored premium template identity, so the Free
  "No template" card incorrectly remained selected alongside every Pro template.
  Identity is now checked before comparing design properties.
- Previous artwork remained visible and download stayed enabled while a newly
  selected design/content was rendering. Preview state now carries the exact
  payload/design/correction key; stale results are hidden and downloading waits
  for the matching preview. Obsolete image callbacks cannot repaint the canvas.
- The temporary unlock is not a Pro account and was not responsible for these
  failures. Its strict development/loopback/Vercel guards and production gating
  tests remain intact. No accounts, prices, billing settings or templates changed.

## Per-template results

Each row passed browser application, live preview with changed URL, actual PNG
download, and decoding of that downloaded PNG to the exact entered URL.
All source images and thumbnail images returned HTTP 200. No console warnings or
errors were recorded during the final browser checks.

| Template | Original low-resolution preview failure | Final checks |
| --- | --- | --- |
| Navy & wood | Yes, long URL | Pass |
| Horned skull | Yes | Pass |
| Animal silhouettes | Yes | Pass |
| Multicolor | Yes, long URL | Pass |
| Black skulls | Yes, long URL | Pass |
| Portrait jigsaw | Yes | Pass |
| Green Santa | Yes | Pass |
| Red-gold Santa | Not reproduced | Pass |
| Communication tiles | Yes | Pass |
| Halftone portrait | Yes | Pass |

Regression tests additionally decode all ten preview responses using a 170-character
URL and multilingual text. Existing tests cover Free/Pro enforcement, excluded
IDs, all 20 original Free template hashes, and center-logo safety. Lint,
TypeScript, all 164 tests and production build passed. Desktop and mobile preview
layouts were checked. These checks cover the tested payloads, not a guarantee
that any arbitrarily long content is scannable at any printed/display size.
