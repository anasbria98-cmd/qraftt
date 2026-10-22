# Reference-based premium templates — local review

This replaces the rejected invented collection **locally only**. No production deployment was performed. The user confirmed ownership and commercial-use permission for the supplied reference images. No unrelated artwork was generated, recolored into Qraftt green, or substituted.

## Current result

- **10 selectable reference-based Pro templates**, using the actual supplied raster artwork, after the duplicate/near-duplicate review.
- **15 low-resolution designs deferred**: every cell of reference 02 (`_ (4).jpeg`, 406px total width, five rows × three columns). Individual high-resolution originals are needed; no small logos, lettering or characters were guessed.
- **1 technical draft deferred**: reference 11 (`QR4U 035.jpeg`, blue-eye finder composition). Its circular finder artwork has not passed the decoder suite reliably. It is shown in the comparison review, not sold as a working template, and its ID is rejected by server validation.
- Reference 05 retains two individually selectable designs: multicolor blocks (top-left) and black skull modules (bottom-left). The two splash variants were removed as redundant near-duplicates after quiet-zone clearing. They were not replaced with new designs.
- Mario, Batman and SpongeBob are not inputs and are not included.

## Review before approving

Open `work/reference-template-review/index.html` for **10 individual reference → generated comparisons**. The current approval preview excludes the two retired splash variants, the blue-eye draft and all 15 deferred low-resolution cells. The sample output encodes `https://example.com/art`, not the original reference's destination. Individual PNG, SVG and comparison PNG files sit beside the HTML. `final-10-template-preview.png` shows only the 10 retained output designs; older numbered previews are historical, not the current catalog.

These are not pixel-identical static copies. The exact supplied artwork remains the image layer, while new payload-dependent scan cores, valid finder/timing/alignment patterns, and a four-module quiet zone are imposed for usability. This visibly changes finder proportions and some artwork near protected patterns. It also clears decoration that overlaps the quiet zone. Finder detail is simplified where the source detail prevented decoding (notably icon-tile finder details and fine eye contours). Do not approve based on thumbnails alone.

After the fidelity pass and deduplication, data scan cores remain 25% of a module's width for nine designs. Reference 08 uses 40%, revealing more source artwork while passing the decoder checks. The navy-and-wood finders regain thin gold/teal contours positioned away from scanner-critical bar centers. Core colors are contrast-limited samples of the source. This is a specific technical adjustment, not a claim that every original pixel/color is unchanged. For the multicolor finders, the pale orange center is darkened to keep contrast. The original large skull, animals, Santa illustrations and Mona Lisa artwork have **not** been replaced with generic emblems or invented faces.

The blue-eye draft is not counted as completed. A further implementation pass is required if exact original finder details are mandatory where the comparisons show simplification. The review is the approval checkpoint; nothing is production-approved by this document.

## Selectable Pro templates

| ID | Source | Retained reference appearance |
| --- | --- | --- |
| pro-ref-01 | `_ (3).jpeg` | Navy, gold and teal organic blocks, red flecks and wood-grain inserts |
| pro-ref-03 | `_ (5).jpeg` | Large central horned skull, striped horns and black/white composition |
| pro-ref-04 | `_.jpeg` | Distributed black animal, bone and toy silhouettes |
| pro-ref-05-tl | `40 Creative and Beautiful QR Codes.jpeg`, top-left | Bright multicolor blocks |
| pro-ref-05-bl | same, bottom-left | Black modules with skull and red-dot details |
| pro-ref-06 | `ART-QR code - Le blog de EasyDoor.jpeg` | Jigsaw portrait texture, olive/gold palette and surrounding puzzle pieces |
| pro-ref-07 | `Custom QR Codes.jpeg` | Actual full-body Santa illustration and green QR composition |
| pro-ref-08 | `Gift-warp you QR Code.jpeg` | Actual Santa face, red/gold composition, octagonal gradient eyes |
| pro-ref-09 | vCard QR Code KIT image | Actual glossy communication-icon tile artwork |
| pro-ref-10 | `QR Codes criativos que funcionam.jpeg` | Actual halftone Mona Lisa portrait composition |

## Unchanged Free collection

The original template catalog and renderer output are guarded by the same 20 pre-change SVG SHA-256 snapshots. They remain Free for official 512px PNG exports, subject to the existing three-download daily limit:

Shopping Bag; Floral Bouquet; Envelope; Coffee; Heart / Love; Summer Drink; Travel Suitcase; Birthday / Celebration; Pasta Night; Wedding Arch; Executive; Reel Pop; Gold Label; Forest; Conference; Gift Box; Review Stars; WiFi; Quick Pay; Modern Creative.

## Security and export behavior

- New templates stay separate from the old Free gallery and show Pro badges.
- Free users can preview sample designs. Applying one opens the existing Upgrade prompt.
- Server entitlement checks are unchanged. Forged client Pro flags, rejected old premium IDs and the blocked blue-eye ID do not authorize exports.
- Center-logo upload remains Pro-only; raster sanitization, size limits, H error correction and protected function patterns remain enforced.
- New official SVG exports embed the source image once and are self-contained. The PNG renderer uses that same artwork, not a visually different preview.
- Reference master images are server-only in the export bundle; small generated preview PNGs are used by the gallery instead of shipping multi-megabyte base64 image strings in the client bundle.
- No authentication, PayPal, Supabase, SMTP, prices, QR content behavior, routes, SEO or analytics settings were changed. Only the pricing **template benefit count** changes to the current 10 locally.

## Duplicate review

All 12 previous outputs were compared side by side with their source mapping. A normalized image comparison checked all 66 pairs and found no exact duplicates; visual review identified two redundant same-family variants:

| Removed | Kept | Reason |
| --- | --- | --- |
| pro-ref-05-tr — Multicolor splashes | pro-ref-05-tl — Multicolor | Same colored block artwork/finder family; quiet-zone clearing removes most of the distinguishing surround. The plain version matches its source more closely. |
| pro-ref-05-br — Black skull splashes | pro-ref-05-bl — Black skulls | Same skull-module family with peripheral splashes. The plain version retains the source appearance better and needs less scan-core modification. |

The two Santa designs remain distinct (full-body green composition versus red/gold face composition), as do the two portrait designs (colored jigsaw texture versus monochrome halftone). The horned skull, small-skull module field, animal silhouettes, icon tiles, navy/wood and multicolor designs are separate visual concepts, not renamed copies. Regression tests compare source hashes and rendered pixel hashes, reject retired IDs server-side, and retain the 20 Free output snapshots. Historical source crops are archived locally, not left selectable or replaced with invented artwork.

## Verification scope

The decoder suite checks the actual new payload (not merely the existence of any readable QR), using URL, text and vCard at 512px and 1000px. Center-logo outputs are checked at 512px and as actual 2000px exports resampled to an 800px camera-sized image. These automated cases do not guarantee every print, camera, payload length or logo; scan the final file at its intended size.

Run `node scripts/prepare-reference-templates.mjs` only when the original supplied files are present, then `node scripts/review-reference-templates.mjs` to regenerate review artifacts. These are deterministic cropping/packaging/comparison scripts, not AI image-generation scripts.
