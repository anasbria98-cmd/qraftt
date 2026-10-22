# Reference-based premium rebuild — pre-implementation review

Status: superseded pre-implementation review. The user subsequently confirmed ownership and commercial-use permission for the supplied images. See `premium-template-collection.md` for the current local rebuild and technical deferrals. Local only. No deployment authorized.

The previous 28-design collection is rejected. Its invented motifs, palette substitutions, names and simplified center emblems are not an approved source for the rebuild. The original 20 Free templates must remain unchanged.

## Inventory

Reviewed all 11 supplied images directly. Total: **28 individual designs** = 9 single-design images + 15 cells in reference 02 + 4 cells in reference 05. Each is mapped below to one separate selectable Pro template, not one collage template. IDs are source coordinates, not invented concepts.

| Source | Replacement ID | Required visual match | Flag before commercial inclusion |
| --- | --- | --- | --- |
| 01 — `_ (3).jpeg` | REF-01 | Navy connected hand-drawn modules; thin yellow and teal contours; orange/red flecks; wood-grain inserts; irregular rounded square eyes | No specific recognizable franchise identified |
| 02 row 1 col 1 | REF-02-R1C1 | Green pixel field, orange finder borders, clover-shaped finder centers, small illustrated green/orange mascot below center | Mascot identity/permission needs confirmation; do not substitute a sprout |
| 02 row 1 col 2 | REF-02-R1C2 | Golden/orange angular modules, red square finder outlines, gold lettering/emblem in center | Center lettering is too small to identify confidently; obtain a clearer crop/source |
| 02 row 1 col 3 | REF-02-R1C3 | Cyan/blue connected pixel modules, white channels, cyan square eyes | No specific recognizable mark identified |
| 02 row 2 col 1 | REF-02-R2C1 | Multicolor organic blocks with colored nested square eyes; pale blue surrounding details | No specific recognizable mark identified |
| 02 row 2 col 2 | REF-02-R2C2 | Black pixel matrix with a large red five-part burst in the center; black square finders | Resembles the Yelp mark; explicit decision needed, no compass replacement |
| 02 row 2 col 3 | REF-02-R2C3 | Purple organic modules, original cartoon character centered high, green sparkles and small colored decorations | Recognizable cartoon-style character; identity/permission needs confirmation, no owl replacement |
| 02 row 3 col 1 | REF-02-R3C1 | Dark purple/black thin maze-like linework, detailed square finder structures | No specific recognizable mark identified |
| 02 row 3 col 2 | REF-02-R3C2 | Deep blue broad connected angular modules with white channels and blue nested square finders | No specific recognizable mark identified |
| 02 row 3 col 3 | REF-02-R3C3 | Light and medium green filled mosaic, pink squares, black/yellow finder centers and pale highlights | No specific recognizable mark identified |
| 02 row 4 col 1 | REF-02-R4C1 | Mustard/gold background, rust-red modules and finder outlines, central “Ajiro” lettering | Named wordmark; permission/omission decision needed, no invented label |
| 02 row 4 col 2 | REF-02-R4C2 | Pale olive green connected blocks, white background and square finder rings | No specific recognizable mark identified |
| 02 row 4 col 3 | REF-02-R4C3 | Black stepped interwoven modules; black square eyes | No specific recognizable mark identified |
| 02 row 5 col 1 | REF-02-R5C1 | Dense black QR field around a large central black bird silhouette | Resembles the former Twitter mark; permission/omission decision needed, no different bird |
| 02 row 5 col 2 | REF-02-R5C2 | Gray/black QR field and black-outlined white hexagonal/cube center with blue/red marks | Central brand-like emblem unidentified; clearer source/permission decision needed, no prism replacement |
| 02 row 5 col 3 | REF-02-R5C3 | Cyan modules, pink outer finder rings, yellow finder centers, upright product bottle near lower center | Product label/brand unreadable at supplied resolution; clearer source/permission decision needed |
| 03 — `_ (5).jpeg` | REF-03 | Large central black/white horned skull, detailed striped curling horns, angular black modules, partially interrupted finder outlines | No specific franchise identified from this image; retain skull rather than generic emblem |
| 04 — `_.jpeg` | REF-04 | Numerous black dog/cat/toy/bone silhouettes forming the data field, white engraved details, large simple black square finders | No specific franchise identified; preserve distributed animal composition |
| 05 top left | REF-05-TL | Bright multicolor hand-drawn connected blocks, small light highlights, colored eye outlines and contrasting colored eye centers | Separate selectable design |
| 05 top right | REF-05-TR | Same multicolor block composition with black splash surround and blue/gray dots | Separate selectable design; do not merge into top-left template |
| 05 bottom left | REF-05-BL | Black hand-drawn modules, small gray skull details inside finder centers and field, red/gray dot clusters | Separate selectable design |
| 05 bottom right | REF-05-BR | Black/skull composition with black splash surround and red/blue/gray dots | Separate selectable design; do not merge into bottom-left template |
| 06 — `ART-QR code - Le blog de EasyDoor.jpeg` | REF-06 | Photo-textured jigsaw modules forming a large Mona Lisa-style portrait, olive/gold/black palette, scattered puzzle pieces around perimeter | Source carries an artist monogram; do not silently copy/remove attribution. Source artwork permission needs confirmation |
| 07 — `Custom QR Codes.jpeg` | REF-07 | Green rounded connected modules and eyes; large red/white full-body Santa centered over QR, arm extending left and hand at hat | Santa subject is generic; supplied illustration still requires source-use confirmation for exact asset reuse |
| 08 — `Gift-warp you QR Code.jpeg` | REF-08 | Deep red/black modules with yellow/gold rim/glow, beveled/octagonal finder eyes, large centered Santa face in red/gold linework | Supplied illustration source-use confirmation for exact asset reuse |
| 09 — vCard QR Code KIT image | REF-09 | Glossy black square tiles containing small white communication/media pictograms, including finder borders and centers | Review individual pictograms for recognizable brand marks; no generic plain-square replacement |
| 10 — `QR Codes criativos que funcionam.jpeg` | REF-10 | Large black/white halftone Mona Lisa portrait integrated across the QR matrix, classic black finder patterns | Preserve portrait identity and scale; do not substitute a different face |
| 11 — `QR4U 035.jpeg` | REF-11 | Organic black modules, blue iris finder eyes, central black lettering/eye, feather-like lower-right creature detail | “SETOR” artist signature and central lettering; source-use/attribution decision needed, no unrelated creature |

Reference 02 is `_ (4).jpeg` (5 rows × 3 columns). Reference 05 is `40 Creative and Beautiful QR Codes.jpeg` (2 × 2).

Mario, Batman and SpongeBob are excluded. No excluded file is a rebuild input.

## Implementation constraints and acceptance gates

- Remove rejected designs from the local selectable catalog and renderer when implementing their replacements. Do not deploy this removal or rebuild without approval.
- Preserve original colors, eye construction, illustration placement, surrounding details and relative scale. Do not recolor into Qraftt green.
- Do not replace flagged marks/characters with invented art. Resolve permission or leave the specific source design out, clearly documented.
- Request higher-resolution cells where the supplied 406px-wide collage cannot resolve the original artwork/lettering. Do not fabricate unreadable details.
- The user content must generate the actual QR data matrix. A static copy of a reference QR is not a usable template for arbitrary content.
- Preserve finder/timing/alignment structures and a true quiet zone. Assess large central artwork per design and payload; error correction H is not a guarantee that any arbitrary 30% overlay will scan.
- If faithful composition cannot decode reliably, show the failed comparison and identify the minimum required adjustment. Do not silently shrink the artwork or replace it with a tiny emblem.
- Each finished design needs a labeled **reference crop → generated template** comparison, same displayed scale, plus decode tests on actual PNG exports with multiple payload lengths.
- Verify Free preview, Pro-only apply/export, center-logo Pro gate, unchanged Free template snapshots, desktop/mobile, lint, TypeScript, tests and build.
- Update pricing feature counts only after the approved, implemented reference inventory is known; do not change prices or billing.

## Current boundary

Only this review document was added in this pass. Application files and production were not changed. Implementation is paused for the specific marked-artwork/source decisions above, not replaced with invented designs.
