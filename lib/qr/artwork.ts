import type { QrArtwork, QrDesignOptions } from "./design.ts";

export interface QrArtworkLayout {
  size: number;
  x: number;
  y: number;
}

const compactArtwork = new Set<QrArtwork>([
  "wedding-envelope",
  "birthday-cake",
  "gift-box",
  "crescent-lantern",
  "pasta-plate",
  "coffee-cup",
  "lemonade-glass",
  "shopping-bag",
  "parcel-box",
  "briefcase",
  "social-phone",
  "travel-suitcase",
  "watermelon-summer",
  "retro-tv",
  "brunch-plate",
  "tea-pot",
]);

const wideArtwork = new Set<QrArtwork>([
  "editorial-card",
  "menu-board",
  "browser-window",
  "contact-card",
  "business-card",
  "event-pass",
  "payment-card",
  "portrait-card",
  "network-card",
  "review-card",
  "wallet-card",
  "conference-badge",
  "creator-studio",
  "video-screen",
  "grid-poster",
  "torn-poster",
]);

const ornamentalArtwork = new Set<QrArtwork>([
  "leaf-wreath",
  "social-burst",
  "leaf-badge",
  "citrus-slices",
  "minimal-grid",
  "headphones",
  "map-route",
  "review-stars",
  "wifi-router",
  "botanical-arch",
  "wildflower-corners",
  "heart-emblem",
  "party-popper",
  "sun-rays",
  "candy-swirls",
  "pastel-clouds",
  "luxury-curtain",
  "gold-crest",
  "night-sky",
  "geometric-stack",
  "building-blocks",
  "aurora-ribbons",
  "ink-brushes",
  "round-seal",
  "sticker-collage",
  "baby-mobile",
]);

export function getQrArtworkLayout(artwork: QrArtwork): QrArtworkLayout {
  if (artwork === "none") return { size: 1_000, x: 0, y: 0 };
  switch (artwork) {
    case "shopping-bag":
      return { size: 520, x: 240, y: 300 };
    case "wildflower-corners":
      return { size: 520, x: 240, y: 225 };
    case "wedding-envelope":
      return { size: 520, x: 240, y: 285 };
    case "coffee-cup":
      return { size: 470, x: 225, y: 300 };
    case "heart-emblem":
      return { size: 500, x: 250, y: 235 };
    case "lemonade-glass":
      return { size: 460, x: 250, y: 285 };
    case "travel-suitcase":
      return { size: 520, x: 240, y: 285 };
    case "birthday-cake":
      return { size: 460, x: 270, y: 330 };
  }
  if (compactArtwork.has(artwork)) return { size: 440, x: 280, y: 205 };
  if (wideArtwork.has(artwork)) return { size: 540, x: 230, y: 170 };
  if (ornamentalArtwork.has(artwork)) return { size: 600, x: 200, y: 145 };
  return { size: 540, x: 230, y: 180 };
}

export function renderQrArtwork(design: QrDesignOptions) {
  if (design.artwork === "none") return "";

  const primary = design.frameColor;
  const light = design.background;
  const dark = design.foreground;
  const accent = design.gradientColor ?? design.foreground;
  const stroke = `fill="none" stroke="${primary}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"`;
  const fine = `fill="none" stroke="${primary}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"`;
  const line = (width: number) =>
    `fill="none" stroke="${primary}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`;

  switch (design.artwork) {
    case "leaf-wreath":
      return `<g ${stroke}><path d="M180 730Q70 530 170 290M820 730Q930 530 830 290"/><path d="M145 650q-86-20-70-92 82 2 92 76M125 535q-80-42-44-106 76 24 68 94M148 410q-62-62-8-112 64 46 34 106M855 650q86-20 70-92-82 2-92 76M875 535q80-42 44-106-76 24-68 94M852 410q62-62 8-112-64 46-34 106" fill="${primary}" stroke="none"/></g><path d="M360 850q140 70 280 0" ${fine}/>`;
    case "ocean-wave":
      return `<circle cx="840" cy="190" r="72" fill="${primary}" opacity=".9"/><path d="M40 760q90-84 180 0t180 0 180 0 180 0 180 0v190H40Z" fill="${primary}" opacity=".88"/><path d="M40 815q90-72 180 0t180 0 180 0 180 0 180 0" ${stroke}/><path d="m125 180 34 22 40-8-10 40 26 32-40 8-22 35-26-34-40-8 22-34Z" fill="${light}"/>`;
    case "editorial-card":
      return `<g transform="rotate(-4 500 500)"><rect x="145" y="105" width="710" height="790" rx="28" fill="${light}" stroke="${primary}" stroke-width="10"/><path d="M190 145h210M190 175h128M690 825h110M690 855h110" stroke="${dark}" stroke-width="12" stroke-linecap="round"/><circle cx="780" cy="170" r="28" fill="${primary}"/></g>`;
    case "menu-board":
      return `<path d="M130 110h740v790H130Z" fill="${light}" stroke="${primary}" stroke-width="18"/><path d="M165 155h150M685 155h150M170 845h180M650 845h180" stroke="${dark}" stroke-width="12" stroke-linecap="round"/><g fill="${primary}"><circle cx="170" cy="205" r="18"/><circle cx="830" cy="205" r="18"/><path d="M165 785h40v40h-40ZM795 785h40v40h-40Z"/></g>`;
    case "social-burst":
      return `<g fill="${primary}"><circle cx="110" cy="250" r="44"/><circle cx="885" cy="255" r="34"/><circle cx="130" cy="740" r="30"/><circle cx="870" cy="730" r="48"/><path d="m500 55 24 54 58 6-44 38 13 58-51-30-51 30 13-58-44-38 58-6Z"/></g><g ${fine}><path d="M145 330q-90 160 0 320M855 330q90 160 0 320M315 855q185 80 370 0"/></g>`;
    case "leaf-badge":
      return `<path d="M500 55 635 105 780 95 810 240 905 350 840 485 860 630 730 700 650 825 500 790 350 825 270 700 140 630 160 485 95 350 190 240 220 95 365 105Z" fill="${primary}" opacity=".96"/><path d="M120 210q100-80 190-40M880 210q-100-80-190-40M130 780q100 75 200 25M870 780q-100 75-200 25" ${fine}/>`;
    case "browser-window":
      return `<rect x="110" y="100" width="780" height="800" rx="36" fill="${light}" stroke="${primary}" stroke-width="14"/><path d="M110 205h780" stroke="${primary}" stroke-width="14"/><circle cx="165" cy="155" r="16" fill="${dark}"/><circle cx="215" cy="155" r="16" fill="${accent}"/><circle cx="265" cy="155" r="16" fill="${primary}"/><rect x="650" y="130" width="185" height="48" rx="24" fill="${primary}"/>`;
    case "contact-card":
      return `<rect x="95" y="120" width="810" height="760" rx="54" fill="${light}" stroke="${primary}" stroke-width="14"/><circle cx="165" cy="205" r="50" fill="${primary}"/><circle cx="165" cy="187" r="16" fill="${dark}"/><path d="M132 230q33-40 66 0" ${fine}/><path d="M735 765h105M735 805h105M735 845h70" stroke="${dark}" stroke-width="12" stroke-linecap="round"/>`;
    case "business-card":
      return `<g transform="rotate(3 500 500)"><rect x="80" y="150" width="840" height="700" rx="28" fill="${light}" stroke="${primary}" stroke-width="10"/><path d="M80 700h840v150H80Z" fill="${primary}"/><path d="M135 750h180M135 790h120M690 750h165M735 790h120" stroke="${dark}" stroke-width="12" stroke-linecap="round"/></g>`;
    case "citrus-slices":
      return `<g fill="${primary}" stroke="${light}" stroke-width="10"><circle cx="125" cy="240" r="90"/><circle cx="860" cy="260" r="70"/><circle cx="145" cy="735" r="65"/><circle cx="840" cy="720" r="92"/></g><g ${fine}><path d="M125 150v180M35 240h180M62 177l126 126M62 303l126-126M840 628v184M748 720h184M775 655l130 130M775 785l130-130"/></g>`;
    case "event-pass":
      return `<path d="M145 100h710v800H145V735q55 0 55-55t-55-55V100Z" fill="${light}" stroke="${primary}" stroke-width="14"/><path d="M855 625q-55 0-55 55t55 55M190 760h620" ${fine} stroke-dasharray="16 14"/><circle cx="500" cy="125" r="28" fill="${primary}"/><path d="M500 30v95" ${stroke}/>`;
    case "minimal-grid":
      return `<g ${fine} opacity=".8"><path d="M75 250h110M75 250v110M925 250H815M925 250v110M75 750h110M75 750V640M925 750H815M925 750V640"/><path d="M300 80v90M700 80v90M300 830v90M700 830v90"/></g>`;
    case "payment-card":
      return `<rect x="90" y="120" width="820" height="760" rx="70" fill="${light}" stroke="${primary}" stroke-width="16"/><rect x="125" y="175" width="750" height="90" rx="18" fill="${primary}"/><circle cx="780" cy="815" r="38" fill="${dark}"/><circle cx="830" cy="815" r="38" fill="${accent}" opacity=".75"/><path d="M150 815h190" stroke="${dark}" stroke-width="14" stroke-linecap="round"/>`;
    case "headphones":
      return `<path d="M120 560V430q0-380 380-380t380 380v130" ${line(40)}/><rect x="70" y="500" width="150" height="260" rx="60" fill="${primary}"/><rect x="780" y="500" width="150" height="260" rx="60" fill="${primary}"/><path d="M815 760q0 120-165 120" ${stroke}/><circle cx="635" cy="880" r="24" fill="${primary}"/>`;
    case "map-route":
      return `<path d="M95 170 300 90l200 85 205-85 200 90v690l-200-90-205 90-200-85-205 85Z" fill="${light}" stroke="${primary}" stroke-width="12"/><path d="m300 90v695M500 175v695M705 90v690" ${fine}/><path d="M150 750q80-160 170-90t145-60 170 10 205-190" fill="none" stroke="${accent}" stroke-width="16" stroke-dasharray="24 18"/><path d="M840 350a52 52 0 0 0-52 52q0 40 52 90 52-50 52-90a52 52 0 0 0-52-52Z" fill="${primary}"/>`;
    case "portrait-card":
      return `<rect x="120" y="75" width="760" height="850" rx="72" fill="${light}" stroke="${primary}" stroke-width="14"/><circle cx="500" cy="145" r="68" fill="${primary}"/><circle cx="500" cy="125" r="23" fill="${dark}"/><path d="M450 180q50-62 100 0" ${stroke}/><path d="M270 850h460" stroke="${primary}" stroke-width="18" stroke-linecap="round"/>`;
    case "review-stars":
      return `<g fill="${primary}"><path d="m120 120 18 40 44 4-34 29 10 44-38-23-38 23 10-44-34-29 44-4ZM880 120l18 40 44 4-34 29 10 44-38-23-38 23 10-44-34-29 44-4ZM120 760l18 40 44 4-34 29 10 44-38-23-38 23 10-44-34-29 44-4ZM880 760l18 40 44 4-34 29 10 44-38-23-38 23 10-44-34-29 44-4Z"/></g><path d="M300 870h400" stroke="${primary}" stroke-width="18" stroke-linecap="round"/>`;
    case "wifi-router":
      return `<rect x="110" y="720" width="780" height="180" rx="54" fill="${primary}"/><circle cx="210" cy="810" r="18" fill="${dark}"/><circle cx="270" cy="810" r="18" fill="${dark}"/><path d="M410 790q90-90 180 0M450 830q50-50 100 0" fill="none" stroke="${dark}" stroke-width="16" stroke-linecap="round"/><path d="M180 720V600M820 720V600" ${stroke}/>`;
    case "botanical-arch":
      return `<path d="M150 820V360Q150 90 500 90t350 270v460" ${line(24)}/><g fill="${primary}"><path d="M150 680q-120-70-100-170 120 10 140 130M175 480Q60 390 105 300q110 35 105 145M850 680q120-70 100-170-120 10-140 130M825 480q115-90 70-180-110 35-105 145"/></g>`;
    case "wildflower-corners":
      return `<path d="M500 92C380 12 258 74 244 205c-104-70-208-4-180 114-83 45-71 169 24 197-44 111 51 208 156 156 36 135 180 171 256 62 76 109 220 73 256-62 105 52 200-45 156-156 95-28 107-152 24-197 28-118-76-184-180-114C742 74 620 12 500 92Z" fill="${light}" stroke="${primary}" stroke-width="16"/><g fill="${primary}"><circle cx="222" cy="196" r="72"/><circle cx="778" cy="196" r="72"/><circle cx="136" cy="448" r="64"/><circle cx="864" cy="448" r="64"/><circle cx="250" cy="760" r="76"/><circle cx="750" cy="760" r="76"/></g><g fill="${accent}"><circle cx="222" cy="196" r="30"/><circle cx="778" cy="196" r="30"/><circle cx="136" cy="448" r="27"/><circle cx="864" cy="448" r="27"/><circle cx="250" cy="760" r="32"/><circle cx="750" cy="760" r="32"/></g><g fill="${dark}" opacity=".82"><path d="M190 300q-130-20-146-126 126-8 170 92M810 300q130-20 146-126-126-8-170 92M205 665Q62 676 42 790q135 4 190-88M795 665q143 11 163 125-135 4-190-88"/></g>`;
    case "wedding-envelope":
      return `<path d="M84 308 500 54l416 254v554H84Z" fill="${primary}"/><path d="m84 308 416 306 416-306-160-98H244Z" fill="${accent}" opacity=".88"/><path d="M105 856 392 570q108-108 216 0l287 286Z" fill="${light}" stroke="${primary}" stroke-width="16"/><path d="M94 322 370 98h260l276 224-242 188q-164 128-328 0Z" fill="${light}" stroke="${primary}" stroke-width="16"/><path d="M308 150h384M352 205h296" stroke="${dark}" stroke-width="14" stroke-linecap="round" opacity=".35"/>`;
    case "heart-emblem":
      return `<path d="M500 932C102 690 24 386 171 199 286 53 446 104 500 240c54-136 214-187 329-41 147 187 69 491-329 733Z" fill="${primary}"/><path d="M500 846C184 646 126 411 228 275c80-106 204-64 272 67 68-131 192-173 272-67 102 136 44 371-272 571Z" fill="${light}"/><path d="M188 204c62-66 142-87 217-47-99 8-157 69-188 166-42-34-51-82-29-119Z" fill="${accent}" opacity=".85"/><circle cx="820" cy="295" r="34" fill="${accent}"/><circle cx="160" cy="610" r="22" fill="${accent}"/>`;
    case "birthday-cake":
      return `<g fill="${primary}"><ellipse cx="160" cy="210" rx="92" ry="116"/><ellipse cx="838" cy="230" rx="86" ry="110"/><ellipse cx="272" cy="128" rx="74" ry="94"/></g><g fill="${accent}"><ellipse cx="725" cy="125" rx="76" ry="96"/><ellipse cx="100" cy="430" rx="60" ry="78"/></g><path d="M160 326q45 170 150 284M838 340Q805 500 700 620M272 222q65 138 110 260M725 220q-45 150-105 255M100 508q65 90 135 125" ${fine}/><path d="M132 392q28 18 56 0M810 410q28 18 56 0M246 286q26 18 52 0M700 282q25 18 50 0" stroke="${light}" stroke-width="8"/><rect x="190" y="300" width="620" height="620" rx="28" fill="${light}" stroke="${primary}" stroke-width="18"/><path d="M190 385h620" stroke="${primary}" stroke-width="26"/><path d="M500 300v620" stroke="${primary}" stroke-width="24"/><path d="M500 300q-210-8-184-124 24-92 184 124M500 300q210-8 184-124-24-92-184 124" fill="none" stroke="${accent}" stroke-width="26"/>`;
    case "party-popper":
      return `<path d="m80 850 180-250 100 100-250 180Z" fill="${primary}"/><path d="m920 850-180-250-100 100 250 180Z" fill="${primary}"/><g fill="${light}"><circle cx="160" cy="220" r="28"/><circle cx="820" cy="260" r="34"/><circle cx="260" cy="380" r="20"/><circle cx="760" cy="410" r="22"/></g><g ${stroke}><path d="M180 600 80 430M260 620l-20-230M820 600l100-170M740 620l20-230"/></g>`;
    case "gift-box":
      return `<rect x="125" y="365" width="750" height="520" rx="20" fill="${light}" stroke="${primary}" stroke-width="14"/><rect x="90" y="300" width="820" height="145" rx="26" fill="${primary}"/><path d="M500 300v585" stroke="${primary}" stroke-width="36"/><path d="M500 300q-210-20-190-150 20-100 190 150M500 300q210-20 190-150-20-100-190 150" fill="none" stroke="${primary}" stroke-width="28"/>`;
    case "crescent-lantern":
      return `<path d="M155 140a160 160 0 1 0 175 245 135 135 0 1 1-175-245Z" fill="${primary}"/><path d="M820 80v180M745 260h150l-25 150H770Z" ${stroke}/><path d="M785 310h70M500 50v95M450 145h100l-20 90h-60Z" ${fine}/><g fill="${light}"><circle cx="760" cy="500" r="14"/><circle cx="875" cy="545" r="11"/><circle cx="160" cy="610" r="13"/></g>`;
    case "pasta-plate":
      return `<ellipse cx="500" cy="525" rx="440" ry="420" fill="${light}" stroke="${primary}" stroke-width="18"/><ellipse cx="500" cy="525" rx="350" ry="330" fill="none" stroke="${primary}" stroke-width="10"/><path d="M100 190v650M60 190v170q0 70 40 70t40-70V190M900 190v650M850 190q100 110 0 220" ${stroke}/>`;
    case "coffee-cup":
      return `<ellipse cx="480" cy="885" rx="390" ry="74" fill="${primary}" opacity=".28"/><path d="M128 245h690v480q0 178-178 178H306q-178 0-178-178Z" fill="${light}" stroke="${primary}" stroke-width="24"/><path d="M818 365q176-5 162 154-12 142-162 150" fill="${light}" stroke="${primary}" stroke-width="34"/><ellipse cx="473" cy="245" rx="345" ry="62" fill="${dark}"/><ellipse cx="473" cy="244" rx="292" ry="36" fill="${accent}" opacity=".75"/><path d="M304 178q-78-84 0-166M480 178q-78-84 0-166M656 178q-78-84 0-166" ${line(20)}/>`;
    case "lemonade-glass":
      return `<path d="M170 182h660L750 930H250Z" fill="${light}" stroke="${primary}" stroke-width="22"/><path d="M216 430h568l-50 480H266Z" fill="${accent}" opacity=".48"/><path d="M220 430q280 105 560 0" ${stroke}/><path d="M705 42 555 385" ${line(30)}/><circle cx="790" cy="238" r="126" fill="${accent}" stroke="${primary}" stroke-width="16"/><circle cx="790" cy="238" r="88" fill="${light}"/><path d="M790 150v176M702 238h176M728 176l124 124M728 300l124-124" ${fine}/><g fill="${primary}" opacity=".55"><circle cx="320" cy="820" r="18"/><circle cx="685" cy="770" r="14"/><circle cx="315" cy="485" r="12"/></g>`;
    case "shopping-bag":
      return `<path d="M92 252h816l-72 680H164Z" fill="${primary}"/><path d="M138 300h724l-54 582H192Z" fill="${light}"/><path d="M302 286Q302 64 500 64t198 222" fill="none" stroke="${primary}" stroke-width="38" stroke-linecap="round"/><path d="M342 286Q342 112 500 112t158 174" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><circle cx="286" cy="305" r="26" fill="${accent}"/><circle cx="714" cy="305" r="26" fill="${accent}"/><path d="M164 785 92 252h134M836 785l72-533H774" fill="none" stroke="${dark}" stroke-width="12" opacity=".22"/><path d="m166 785 88 147h492l90-147" fill="${accent}" opacity=".3"/>`;
    case "parcel-box":
      return `<path d="M110 320 500 120l390 200v500L500 930 110 820Z" fill="${light}" stroke="${primary}" stroke-width="16"/><path d="m110 320 390 220 390-220M500 540v390M300 220l400 220M700 220 300 440" ${stroke}/><rect x="700" y="650" width="130" height="80" rx="12" fill="${primary}"/>`;
    case "briefcase":
      return `<rect x="90" y="270" width="820" height="600" rx="60" fill="${light}" stroke="${primary}" stroke-width="20"/><path d="M330 270v-90q0-80 80-80h180q80 0 80 80v90" ${line(28)}/><path d="M90 520h820" stroke="${primary}" stroke-width="24"/><rect x="450" y="485" width="100" height="90" rx="16" fill="${primary}"/>`;
    case "creator-studio":
      return `<rect x="95" y="120" width="810" height="760" rx="42" fill="${light}" stroke="${primary}" stroke-width="14"/><circle cx="180" cy="205" r="48" fill="${primary}"/><path d="M255 185h210M255 225h145" stroke="${dark}" stroke-width="12" stroke-linecap="round"/><path d="M760 780h80l-40-70Z" fill="${primary}"/><circle cx="800" cy="745" r="70" fill="none" stroke="${primary}" stroke-width="12"/>`;
    case "social-phone":
      return `<rect x="245" y="45" width="510" height="910" rx="85" fill="${light}" stroke="${primary}" stroke-width="22"/><rect x="410" y="70" width="180" height="18" rx="9" fill="${primary}"/><g fill="${primary}"><path d="M120 240c-45-50 30-110 72-55 42-55 117 5 72 55l-72 72Z"/><circle cx="840" cy="350" r="62"/><path d="m820 350 35-22v44Z"/><path d="M80 720h170l-85 110Z"/></g>`;
    case "video-screen":
      return `<rect x="70" y="100" width="860" height="650" rx="40" fill="${light}" stroke="${primary}" stroke-width="18"/><path d="M390 750h220M350 900h300M450 750l-30 150M550 750l30 150" ${stroke}/><circle cx="500" cy="175" r="40" fill="${primary}"/><path d="m485 175 30-20v40Z" fill="${dark}"/>`;
    case "network-card":
      return `<rect x="100" y="130" width="800" height="740" rx="52" fill="${light}" stroke="${primary}" stroke-width="14"/><path d="M330 190q170-160 340 0M385 240q115-105 230 0M450 290q50-50 100 0" ${stroke}/><circle cx="500" cy="310" r="20" fill="${primary}"/><path d="M180 795h640" stroke="${primary}" stroke-width="18" stroke-linecap="round"/>`;
    case "review-card":
      return `<rect x="95" y="110" width="810" height="780" rx="48" fill="${light}" stroke="${primary}" stroke-width="14"/><g fill="${primary}"><path d="m300 165 13 29 32 3-24 21 7 31-28-17-28 17 7-31-24-21 32-3ZM400 165l13 29 32 3-24 21 7 31-28-17-28 17 7-31-24-21 32-3ZM500 165l13 29 32 3-24 21 7 31-28-17-28 17 7-31-24-21 32-3ZM600 165l13 29 32 3-24 21 7 31-28-17-28 17 7-31-24-21 32-3ZM700 165l13 29 32 3-24 21 7 31-28-17-28 17 7-31-24-21 32-3Z"/></g><path d="M220 815h560" stroke="${primary}" stroke-width="16" stroke-linecap="round"/>`;
    case "wallet-card":
      return `<rect x="95" y="180" width="810" height="650" rx="70" fill="${light}" stroke="${primary}" stroke-width="18"/><path d="M95 320h810" stroke="${primary}" stroke-width="22"/><rect x="660" y="485" width="280" height="180" rx="38" fill="${primary}"/><circle cx="730" cy="575" r="22" fill="${dark}"/><path d="M150 735h220" stroke="${dark}" stroke-width="14" stroke-linecap="round"/>`;
    case "conference-badge":
      return `<path d="M210 120h580v800H210Z" fill="${light}" stroke="${primary}" stroke-width="16"/><path d="M370 120V40h260v80" ${stroke}/><rect x="400" y="35" width="200" height="60" rx="20" fill="${primary}"/><path d="M260 820h480" stroke="${primary}" stroke-width="16"/><circle cx="500" cy="865" r="24" fill="${primary}"/>`;
    case "travel-suitcase":
      return `<path d="M324 250v-98q0-92 92-92h168q92 0 92 92v98" ${line(34)}/><rect x="86" y="224" width="828" height="690" rx="92" fill="${primary}"/><rect x="128" y="266" width="744" height="606" rx="58" fill="${light}"/><path d="M230 244v650M770 244v650" stroke="${accent}" stroke-width="24"/><path d="M112 470h108M780 680h108" stroke="${dark}" stroke-width="18" stroke-linecap="round" opacity=".42"/><circle cx="260" cy="928" r="34" fill="${dark}"/><circle cx="740" cy="928" r="34" fill="${dark}"/><g transform="rotate(-12 760 300)"><rect x="700" y="250" width="150" height="92" rx="14" fill="${accent}"/><path d="M725 280h100M725 310h64" stroke="${light}" stroke-width="10" stroke-linecap="round"/></g>`;
    case "sun-rays":
      return `<circle cx="500" cy="500" r="410" fill="${primary}"/><g stroke="${light}" stroke-width="22" stroke-linecap="round"><path d="M500 20v80M500 900v80M20 500h80M900 500h80M160 160l58 58M782 782l58 58M840 160l-58 58M218 782l-58 58"/></g>`;
    case "watermelon-summer":
      return `<path d="M90 560q410 500 820 0Z" fill="${primary}"/><path d="M150 590q350 390 700 0Z" fill="${light}"/><path d="M220 620q280 285 560 0Z" fill="${accent}" opacity=".85"/><g fill="${dark}"><ellipse cx="340" cy="700" rx="14" ry="26"/><ellipse cx="500" cy="750" rx="14" ry="26"/><ellipse cx="660" cy="700" rx="14" ry="26"/></g><circle cx="820" cy="190" r="90" fill="${primary}"/>`;
    case "candy-swirls":
      return `<g ${stroke}><circle cx="145" cy="250" r="105"/><path d="M70 250q75-100 150 0t-150 0M145 145q100 75 0 150t0-150"/><circle cx="855" cy="720" r="105"/><path d="M780 720q75-100 150 0t-150 0M855 615q100 75 0 150t0-150"/></g><path d="M300 95q200 80 400 0M300 900q200-80 400 0" ${fine}/>`;
    case "pastel-clouds":
      return `<g fill="${primary}" opacity=".92"><path d="M40 280q20-90 105-70 35-95 125-25 100-20 115 95Z"/><path d="M610 760q20-90 105-70 35-95 125-25 100-20 115 95Z"/><path d="M285 85q18-70 80-52 30-72 95-16 80-16 92 68Z"/></g><g fill="${light}"><circle cx="130" cy="350" r="18"/><circle cx="865" cy="620" r="18"/></g>`;
    case "luxury-curtain":
      return `<path d="M0 40h300q-10 330-170 520 145 170 120 400H0ZM1000 40H700q10 330 170 520-145 170-120 400h250Z" fill="${primary}"/><path d="M55 90q120 300 15 700M945 90q-120 300-15 700" ${fine}/><path d="M280 60q220 100 440 0" ${stroke}/>`;
    case "gold-crest":
      return `<path d="M500 45 645 115 805 105 845 265 950 385 870 525 875 690 725 755 620 885 500 820 380 885 275 755 125 690 130 525 50 385 155 265 195 105 355 115Z" fill="none" stroke="${primary}" stroke-width="26"/><path d="M500 85 620 145 755 138 790 278 880 385 812 505 818 645 690 700 600 810 500 755 400 810 310 700 182 645 188 505 120 385 210 278 245 138 380 145Z" fill="none" stroke="${primary}" stroke-width="8"/>`;
    case "night-sky":
      return `<path d="M80 240a150 150 0 1 0 160 235A125 125 0 1 1 80 240Z" fill="${primary}"/><g fill="${primary}"><path d="m820 120 14 32 35 3-27 23 8 35-30-18-30 18 8-35-27-23 35-3ZM175 720l10 23 25 2-19 16 6 25-22-13-22 13 6-25-19-16 25-2ZM845 720l10 23 25 2-19 16 6 25-22-13-22 13 6-25-19-16 25-2Z"/><circle cx="700" cy="90" r="13"/><circle cx="910" cy="420" r="16"/></g>`;
    case "grid-poster":
      return `<rect x="105" y="85" width="790" height="830" fill="${light}" stroke="${primary}" stroke-width="10"/><g stroke="${primary}" stroke-width="5" opacity=".75"><path d="M105 250h790M105 750h790M270 85v830M730 85v830"/></g><rect x="140" y="120" width="130" height="80" fill="${primary}"/><rect x="730" y="800" width="130" height="80" fill="${primary}"/>`;
    case "geometric-stack":
      return `<g fill="${primary}" opacity=".9"><path d="M40 230 190 80l150 150-150 150Z"/><circle cx="835" cy="210" r="135"/><path d="m80 790 125-215 125 215Z"/><rect x="740" y="650" width="210" height="210" rx="40" transform="rotate(12 845 755)"/></g><path d="M330 90h340M330 910h340" ${fine}/>`;
    case "building-blocks":
      return `<g fill="${primary}" stroke="${light}" stroke-width="8"><rect x="55" y="180" width="170" height="170" rx="24"/><circle cx="140" cy="180" r="30"/><rect x="775" y="180" width="170" height="170" rx="24"/><circle cx="860" cy="180" r="30"/><rect x="90" y="700" width="190" height="190" rx="24"/><circle cx="150" cy="700" r="28"/><circle cx="220" cy="700" r="28"/><rect x="720" y="700" width="190" height="190" rx="24"/><circle cx="780" cy="700" r="28"/><circle cx="850" cy="700" r="28"/></g>`;
    case "retro-tv":
      return `<rect x="110" y="180" width="780" height="650" rx="90" fill="${light}" stroke="${primary}" stroke-width="22"/><path d="M350 180 250 45M650 180 750 45" ${stroke}/><circle cx="800" cy="370" r="34" fill="${primary}"/><circle cx="800" cy="470" r="34" fill="${primary}"/><path d="M300 830 250 930M700 830l50 100" ${line(28)}/>`;
    case "aurora-ribbons":
      return `<path d="M0 240q180-180 360 0t360 0 280 0v140q-100 90-260-10t-360 0T0 390Z" fill="${primary}" opacity=".8"/><path d="M0 650q180-180 360 0t360 0 280 0v160q-110 95-270-5t-350 0T0 820Z" fill="${light}" opacity=".75"/><path d="M80 120q420 150 840 0" ${fine}/>`;
    case "ink-brushes":
      return `<path d="M0 180q180-120 300-20l-60 140Q100 240 0 350ZM1000 690q-180-120-300-20l60 140q140-60 240 50Z" fill="${primary}"/><path d="M60 780q160 70 250 10M690 170q150-80 250 10M330 80l-40 95M710 825l35 100" ${stroke}/>`;
    case "round-seal":
      return `<circle cx="500" cy="500" r="455" fill="none" stroke="${primary}" stroke-width="24"/><circle cx="500" cy="500" r="410" fill="none" stroke="${primary}" stroke-width="5" stroke-dasharray="14 12"/><path d="m500 25 24 54 58 6-44 38 13 58-51-30-51 30 13-58-44-38 58-6ZM500 819l24 54 58 6-44 38 13 58-51-30-51 30 13-58-44-38 58-6Z" fill="${primary}"/>`;
    case "torn-poster":
      return `<path d="M120 80 890 120l-25 160 35 120-30 160 40 140-45 220-760-35 30-190-25-150 35-160-30-145Z" fill="${light}" stroke="${primary}" stroke-width="12"/><path d="M120 80 80 35M890 120l45-55M105 885l-55 45M865 920l55 45" ${stroke}/>`;
    case "sticker-collage":
      return `<g fill="${primary}" stroke="${light}" stroke-width="10"><rect x="35" y="170" width="220" height="150" rx="60" transform="rotate(-12 145 245)"/><circle cx="850" cy="240" r="120"/><path d="m90 790 110-160 110 160Z"/><rect x="720" y="690" width="230" height="150" rx="35" transform="rotate(10 835 765)"/></g><path d="M360 65q140 65 280 0M360 920q140-65 280 0" ${fine}/>`;
    case "brunch-plate":
      return `<circle cx="500" cy="535" r="420" fill="${light}" stroke="${primary}" stroke-width="18"/><circle cx="500" cy="535" r="335" fill="none" stroke="${primary}" stroke-width="10"/><circle cx="770" cy="230" r="90" fill="${primary}"/><circle cx="770" cy="230" r="45" fill="${light}"/><path d="M90 170v720M45 170v180q0 70 45 70t45-70V170M910 170v720" ${stroke}/>`;
    case "tea-pot":
      return `<path d="M185 330h570v430q0 155-155 155H340q-155 0-155-155Z" fill="${light}" stroke="${primary}" stroke-width="18"/><path d="M755 420q190 0 170 165-10 115-170 115M185 430Q20 390 45 570q20 100 140 90" ${line(30)}/><path d="M330 330q0-130 170-130t170 130M440 200v-70h120v70" ${stroke}/><path d="M430 115h140" stroke="${primary}" stroke-width="22" stroke-linecap="round"/>`;
    case "baby-mobile":
      return `<path d="M250 150q250-180 500 0" ${stroke}/><path d="M500 45v300M330 120v180M670 120v180" ${fine}/><g fill="${primary}"><path d="M330 300q12 60 62 72-50 12-62 72-12-60-62-72 50-12 62-72Z"/><path d="M670 300a70 70 0 1 0 75 108 58 58 0 1 1-75-108Z"/><circle cx="500" cy="350" r="48"/></g><path d="M115 760q60-90 120 0t120 0M645 760q60-90 120 0t120 0" ${fine}/>`;
    default:
      return "";
  }
}
