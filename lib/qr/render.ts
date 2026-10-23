import QRCode from "qrcode";
import {
  defaultDesign,
  designTemplates,
  frameLabels,
  frameStructures,
  type QrDesignOptions,
  type QrFrame,
} from "./design.ts";
import { getQrArtworkLayout, renderQrArtwork } from "./artwork.ts";
import type { ErrorCorrectionLevel } from "./types.ts";
import { renderPremiumQrSvg } from "./premium-render.ts";
import { uploadedFrame, uploadedFramePath } from "./uploaded-frames.ts";

export const QUIET_ZONE_MODULES = 4;
const VIEWBOX_SIZE = 1_000;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isFinderModule(row: number, column: number, size: number) {
  const top = row < 7;
  const left = column < 7;
  const right = column >= size - 7;
  const bottom = row >= size - 7;
  return (top && left) || (top && right) || (bottom && left);
}

function renderBodyModule(
  x: number,
  y: number,
  moduleSize: number,
  style: QrDesignOptions["bodyStyle"],
  fill: string,
) {
  const centerX = x + moduleSize / 2;
  const centerY = y + moduleSize / 2;

  if (style === "dots") {
    const radius = moduleSize * 0.4;
    return `<circle data-qr-body="dots" cx="${centerX}" cy="${centerY}" r="${radius}" fill="${fill}"/>`;
  }

  if (style === "circles") {
    const radius = moduleSize * 0.47;
    return `<circle data-qr-body="circles" cx="${centerX}" cy="${centerY}" r="${radius}" fill="${fill}"/>`;
  }

  if (style === "line") {
    return `<rect data-qr-body="line" x="${x + moduleSize * 0.07}" y="${y + moduleSize * 0.28}" width="${moduleSize * 0.86}" height="${moduleSize * 0.44}" rx="${moduleSize * 0.22}" fill="${fill}"/>`;
  }

  if (style === "diamond") {
    const radius = moduleSize * 0.47;
    return `<path data-qr-body="diamond" d="M${centerX} ${centerY - radius} ${centerX + radius} ${centerY} ${centerX} ${centerY + radius} ${centerX - radius} ${centerY}Z" fill="${fill}"/>`;
  }

  const inset =
    style === "rounded" || style === "pill" ? moduleSize * 0.06 : 0;
  const radius =
    style === "soft"
      ? moduleSize * 0.48
      : style === "pill"
        ? moduleSize * 0.46
        : style === "connected"
          ? moduleSize * 0.16
      : style === "rounded"
        ? moduleSize * 0.28
        : 0;
  return `<rect data-qr-body="${style}" x="${x + inset}" y="${y + inset}" width="${moduleSize - inset * 2}" height="${moduleSize - inset * 2}" rx="${radius}" fill="${fill}"/>`;
}

function renderEye(
  x: number,
  y: number,
  moduleSize: number,
  outerStyle: QrDesignOptions["outerEyeStyle"],
  innerStyle: QrDesignOptions["innerEyeStyle"],
  outerFill: string,
  innerFill: string,
  background: string,
  protectDiamond = false,
) {
  const centerX = x + moduleSize * 3.5;
  const centerY = y + moduleSize * 3.5;
  const outer =
    outerStyle === "circle"
      ? `<circle data-qr-outer-eye="circle" cx="${centerX}" cy="${centerY}" r="${moduleSize * 3.5}" fill="${outerFill}"/><circle cx="${centerX}" cy="${centerY}" r="${moduleSize * 2.5}" fill="${background}"/>`
      : (() => {
          const outerRadius =
            outerStyle === "soft"
              ? moduleSize * 2.1
              : outerStyle === "rounded"
                ? moduleSize * 1.25
                : 0;
          const middleRadius =
            outerStyle === "soft"
              ? moduleSize * 1.55
              : outerStyle === "rounded"
                ? moduleSize * 0.85
                : 0;
          return `<rect data-qr-outer-eye="${outerStyle}" x="${x}" y="${y}" width="${moduleSize * 7}" height="${moduleSize * 7}" rx="${outerRadius}" fill="${outerFill}"/><rect x="${x + moduleSize}" y="${y + moduleSize}" width="${moduleSize * 5}" height="${moduleSize * 5}" rx="${middleRadius}" fill="${background}"/>`;
        })();

  const innerSize = moduleSize * 3;
  const innerX = x + moduleSize * 2;
  const innerY = y + moduleSize * 2;
  let inner: string;
  if (innerStyle === "circle") {
    inner = `<circle data-qr-inner-eye="circle" cx="${centerX}" cy="${centerY}" r="${moduleSize * 1.5}" fill="${innerFill}"/>`;
  } else if (innerStyle === "diamond") {
    const cut = moduleSize * .35;
    inner = protectDiamond
      ? `<path data-qr-inner-eye="diamond" d="M${innerX + cut} ${innerY}H${innerX + innerSize - cut}L${innerX + innerSize} ${innerY + cut}V${innerY + innerSize - cut}L${innerX + innerSize - cut} ${innerY + innerSize}H${innerX + cut}L${innerX} ${innerY + innerSize - cut}V${innerY + cut}Z" fill="${innerFill}"/>`
      : `<path data-qr-inner-eye="diamond" d="M${centerX} ${innerY} ${innerX + innerSize} ${centerY} ${centerX} ${innerY + innerSize} ${innerX} ${centerY}Z" fill="${innerFill}"/>`;
  } else {
    const innerRadius = innerStyle === "rounded" ? moduleSize * 0.72 : 0;
    inner = `<rect data-qr-inner-eye="${innerStyle}" x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${innerRadius}" fill="${innerFill}"/>`;
  }
  return outer + inner;
}

function renderDecoration(design: QrDesignOptions) {
  if (design.decoration === "none") return "";

  const color = design.frameColor;
  const accent = design.frameTextColor;
  const common = `fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"`;

  switch (design.decoration) {
    case "botanical":
      return `<g opacity=".92" ${common}><path d="M88 790Q28 692 76 590M76 730l-38-30M67 668l40-35M65 610l-30-36M912 145q60 98 12 200M924 205l38 30M933 267l-40 35M935 325l30 36"/><path d="M45 700q-28-42 5-72 35 20 18 64M105 634q22-46 62-28 2 42-46 52M955 235q28 42-5 72-35-20-18-64M895 301q-22 46-62 28-2-42 46-52"/></g>`;
    case "floral":
      return `<g fill="${color}" opacity=".92"><circle cx="65" cy="150" r="18"/><circle cx="35" cy="150" r="18"/><circle cx="50" cy="122" r="18"/><circle cx="50" cy="178" r="18"/><circle cx="50" cy="150" r="9" fill="${accent}"/><circle cx="935" cy="760" r="18"/><circle cx="965" cy="760" r="18"/><circle cx="950" cy="732" r="18"/><circle cx="950" cy="788" r="18"/><circle cx="950" cy="760" r="9" fill="${accent}"/></g><path d="M62 180q30 55 12 110M938 730q-30-55-12-110" ${common} opacity=".8"/>`;
    case "hearts":
      return `<g fill="${color}" opacity=".9"><path d="M34 236c-30-34 20-76 48-38 28-38 78 4 48 38l-48 48Z"/><path d="M870 676c-30-34 20-76 48-38 28-38 78 4 48 38l-48 48Z"/><path d="M418 892c-20-24 14-52 34-26 20-26 54 2 34 26l-34 34Z"/></g>`;
    case "confetti":
      return `<g ${common} opacity=".9"><path d="M52 150l28 18M38 210l38-6M935 130l-24 24M954 205l-36-8M48 720l32-20M930 730l28 20M340 900l12 34M640 894l-18 34"/><circle cx="76" cy="330" r="10" fill="${accent}" stroke="none"/><circle cx="930" cy="420" r="10" fill="${accent}" stroke="none"/><circle cx="560" cy="920" r="10" fill="${accent}" stroke="none"/></g>`;
    case "stars":
      return `<g fill="${color}" opacity=".92"><path d="m55 145 12 28 30 3-23 20 7 30-26-16-26 16 7-30-23-20 30-3Z"/><path d="m934 668 12 28 30 3-23 20 7 30-26-16-26 16 7-30-23-20 30-3Z"/><path d="m500 882 9 20 22 2-17 15 5 22-19-12-19 12 5-22-17-15 22-2Z"/></g>`;
    case "holiday":
      return `<g ${common} opacity=".92"><path d="M52 130v108M8 184h88M20 148l64 72M84 148l-64 72M948 660v108M904 714h88M916 678l64 72M980 678l-64 72"/><path d="M380 906h240M415 874l-22 64M585 874l22 64"/></g>`;
    case "crescent":
      return `<path d="M60 170a70 70 0 1 0 72 108 58 58 0 1 1-72-108Z" fill="${color}"/><g fill="${accent}"><circle cx="934" cy="180" r="9"/><circle cx="906" cy="230" r="7"/><circle cx="950" cy="270" r="11"/><path d="m500 884 10 23 25 2-19 16 6 25-22-13-22 13 6-25-19-16 25-2Z"/></g>`;
    case "coffee":
      return `<g ${common}><path d="M34 676h82v60q0 42-41 42t-41-42Z"/><path d="M116 690q46 0 30 42-8 18-30 18M50 646q-18-22 0-44M82 646q-18-22 0-44"/><path d="M885 866q34-44 68 0-34 44-68 0Z"/></g>`;
    case "food":
      return `<g ${common}><circle cx="64" cy="704" r="45"/><circle cx="64" cy="704" r="24"/><path d="M930 650v132M902 650v46q0 28 28 28t28-28v-46M30 858h80M50 832v52M90 832v52"/></g>`;
    case "shopping":
      return `<g ${common}><path d="M22 656h96l-10 122H32Z"/><path d="M48 656q0-48 22-48t22 48M884 846h80l-8 92h-64Z"/><path d="M904 846q0-34 16-34t16 34"/></g>`;
    case "travel":
      return `<g fill="${color}" opacity=".94"><path d="m16 224 102-50 25 18-42 42 38 58-19 12-60-44-38 18Z"/><path d="m860 726 102-50 25 18-42 42 38 58-19 12-60-44-38 18Z"/></g><path d="M290 910q210 48 420-8" ${common} stroke-dasharray="18 20"/>`;
    case "beach":
      return `<g ${common}><circle cx="66" cy="180" r="40" fill="${accent}" stroke="none"/><path d="M18 750q40-30 80 0t80 0M820 750q40-30 80 0t80 0M330 910q60-42 120 0t120 0 120 0"/></g>`;
    case "geometric":
      return `<g ${common} opacity=".9"><path d="M20 130h75v75H20ZM905 650h75v75h-75ZM340 875l45 70 45-70ZM590 885h70l-35 60Z"/><circle cx="65" cy="320" r="30"/><circle cx="940" cy="360" r="30"/></g>`;
    case "playful":
      return `<g fill="${color}" opacity=".9"><circle cx="58" cy="150" r="34"/><rect x="18" y="260" width="72" height="72" rx="22"/><path d="m920 150 40 70h-80Z"/><circle cx="940" cy="700" r="32"/><rect x="380" y="875" width="54" height="54" rx="18"/><path d="m610 930 34-58 34 58Z"/></g>`;
    case "retro":
      return `<g ${common} opacity=".92"><path d="M12 220q80-90 160 0M26 242q66-66 132 0M842 720q70-82 140 0M858 742q54-58 108 0M330 930q170-120 340 0"/></g>`;
    case "abstract":
      return `<g fill="${color}" opacity=".82"><path d="M0 130q88-84 138 0t-58 140Q4 296 0 220Z"/><path d="M1000 610q-94-66-140 22t64 132q64 20 76-34Z"/><path d="M360 1000q30-130 150-80t170 80Z"/></g>`;
    case "badge":
      return `<g ${common}><circle cx="64" cy="210" r="44"/><circle cx="64" cy="210" r="25"/><path d="m40 246-10 52 34-20 34 20-10-52M900 708h80M940 668v80"/></g>`;
    case "premium":
      return `<g fill="${color}" opacity=".94"><path d="m65 135 42 42-42 42-42-42Z"/><path d="m935 660 42 42-42 42-42-42Z"/><path d="m500 870 36 36-36 36-36-36Z"/></g><path d="M28 310h72M900 520h72M350 952h300" ${common}/>`;
    case "sticker":
      return `<g fill="${color}" opacity=".9" stroke="${accent}" stroke-width="8"><rect x="12" y="150" width="104" height="76" rx="28" transform="rotate(-10 64 188)"/><circle cx="935" cy="710" r="48"/><path d="m410 900 52-32 54 28-12 58h-78Z"/></g>`;
    case "sparkles":
      return `<g fill="${color}"><path d="M65 120q8 45 45 53-37 8-45 53-8-45-45-53 37-8 45-53ZM934 630q8 45 45 53-37 8-45 53-8-45-45-53 37-8 45-53ZM500 870q7 38 38 45-31 7-38 45-7-38-38-45 31-7 38-45Z"/><circle cx="95" cy="280" r="10"/><circle cx="900" cy="290" r="10"/></g>`;
    default:
      return "";
  }
}

function renderFrame(design: QrDesignOptions) {
  if (design.frame === "none") return "";

  const label = escapeXml(
    design.frameLabel?.trim().slice(0, 32) || frameLabels[design.frame],
  );
  const structure = frameStructures[design.frame];
  const color = design.frameColor;
  const text = design.frameTextColor;
  const fontSize = Math.max(24, 42 - Math.max(0, label.length - 14) * 1.15);
  const labelText = (y: number, fill = text, size = fontSize) =>
    `<text x="500" y="${y}" text-anchor="middle" fill="${fill}" font-family="Arial, sans-serif" font-size="${size}" font-weight="800" letter-spacing="2">${label}</text>`;

  switch (structure) {
    case "pill-bottom":
      return `<path d="M150 838H850Q884 838 884 872V932Q884 966 850 966H150Q116 966 116 932V872Q116 838 150 838ZM455 838 500 794 545 838Z" fill="${color}" fill-rule="evenodd"/>${labelText(920)}`;
    case "menu-footer":
      return `<path d="M95 838H905V968H95Q70 968 70 943V863Q70 838 95 838Z" fill="${color}"/><path d="M130 870v60M150 870v60M130 894h20M850 870v60M870 870v60" stroke="${text}" stroke-width="8" stroke-linecap="round"/>${labelText(918)}`;
    case "wifi-header":
      return `<rect x="255" y="8" width="490" height="74" rx="37" fill="${color}"/><path d="M292 49q28-28 56 0M304 60q16-16 32 0" fill="none" stroke="${text}" stroke-width="7" stroke-linecap="round"/>${labelText(58, text, Math.min(fontSize, 32))}`;
    case "social-bubble":
      return `<path d="M250 856H750Q786 856 786 892V928Q786 964 750 964H470L430 994 438 964H250Q214 964 214 928V892Q214 856 250 856Z" fill="${color}"/>${labelText(925)}`;
    case "link-tab":
      return `<path d="M92 842H908V948Q908 972 884 972H116Q92 972 92 948Z" fill="${color}"/><circle cx="170" cy="905" r="30" fill="none" stroke="${text}" stroke-width="7"/><path d="m159 905 22-14v28Z" fill="${text}"/>${labelText(920)}`;
    case "payment-ticket":
      return `<path d="M82 42H918V370q-66 0-66 66t66 66v456H82V502q66 0 66-66t-66-66Z" fill="none" stroke="${color}" stroke-width="16" stroke-linejoin="round"/><path d="M116 782H884" stroke="${color}" stroke-width="9" stroke-dasharray="22 18"/><rect x="248" y="824" width="504" height="112" rx="18" fill="${color}"/>${labelText(896)}`;
    case "contact-rail":
      return `<rect x="18" y="120" width="78" height="690" rx="39" fill="${color}"/><circle cx="57" cy="180" r="20" fill="none" stroke="${text}" stroke-width="7"/><path d="M32 228q25-25 50 0M57 285v430" stroke="${text}" stroke-width="7" stroke-linecap="round"/>${labelText(925, color)}`;
    case "website-footer":
      return `<rect x="70" y="844" width="860" height="120" rx="26" fill="${color}"/><circle cx="140" cy="904" r="34" fill="none" stroke="${text}" stroke-width="7"/><path d="M106 904h68M140 870q20 34 0 68M140 870q-20 34 0 68" fill="none" stroke="${text}" stroke-width="5"/>${labelText(919)}`;
    case "event-ticket":
      return `<path d="M45 45H955V955H45V760a36 36 0 0 0 0-72Z" fill="none" stroke="${color}" stroke-width="10" stroke-dasharray="18 13"/><circle cx="955" cy="724" r="36" fill="${design.frameBackground}"/><path d="M200 852H800" stroke="${color}" stroke-width="6"/>${labelText(920, color)}`;
    case "audio-bars":
      return `<g fill="${color}"><rect x="135" y="884" width="12" height="42" rx="6"/><rect x="157" y="868" width="12" height="74" rx="6"/><rect x="179" y="878" width="12" height="54" rx="6"/><rect x="809" y="878" width="12" height="54" rx="6"/><rect x="831" y="868" width="12" height="74" rx="6"/><rect x="853" y="884" width="12" height="42" rx="6"/></g>${labelText(920, color)}`;
    case "map-pin":
      return `<path d="M145 858a45 45 0 0 0-45 45q0 34 45 76 45-42 45-76a45 45 0 0 0-45-45Z" fill="${color}"/><circle cx="145" cy="903" r="15" fill="${text}"/>${labelText(920, color)}`;
    case "profile-card":
      return `<rect x="72" y="842" width="856" height="130" rx="32" fill="${color}"/><circle cx="150" cy="907" r="40" fill="none" stroke="${text}" stroke-width="7"/><circle cx="150" cy="894" r="12" fill="${text}"/><path d="M126 930q24-30 48 0" fill="none" stroke="${text}" stroke-width="7"/>${labelText(922)}`;
    case "review-stars":
      return `<g fill="${color}"><path d="m330 858 10 22 24 2-18 16 5 24-21-13-21 13 5-24-18-16 24-2ZM415 858l10 22 24 2-18 16 5 24-21-13-21 13 5-24-18-16 24-2ZM500 858l10 22 24 2-18 16 5 24-21-13-21 13 5-24-18-16 24-2ZM585 858l10 22 24 2-18 16 5 24-21-13-21 13 5-24-18-16 24-2ZM670 858l10 22 24 2-18 16 5 24-21-13-21 13 5-24-18-16 24-2Z"/></g>${labelText(960, color, Math.min(fontSize, 28))}`;
    case "simple-square":
      return `<rect x="38" y="38" width="924" height="924" fill="none" stroke="${color}" stroke-width="10"/>${labelText(925, color)}`;
    case "rounded-square":
      return `<rect x="38" y="38" width="924" height="924" rx="86" fill="none" stroke="${color}" stroke-width="12"/>${labelText(925, color)}`;
    case "thin-outline":
      return `<rect x="54" y="54" width="892" height="892" rx="28" fill="none" stroke="${color}" stroke-width="4"/>${labelText(925, color)}`;
    case "thick-outline":
      return `<rect x="28" y="28" width="944" height="944" rx="34" fill="none" stroke="${color}" stroke-width="24"/>${labelText(925, color)}`;
    case "top-label":
      return `<rect x="250" y="8" width="500" height="70" rx="18" fill="${color}"/>${labelText(55, text, Math.min(fontSize, 30))}`;
    case "speech-top":
      return `<path d="M188 18H812Q858 18 858 64V112Q858 158 812 158H566L500 216 510 158H188Q142 158 142 112V64Q142 18 188 18Z" fill="${color}"/><circle cx="208" cy="88" r="25" fill="none" stroke="${text}" stroke-width="8"/><path d="m198 88 18-12v24Z" fill="${text}"/>${labelText(103, text, Math.min(fontSize, 32))}`;
    case "speech-bottom":
      return `<path d="M225 856H775Q805 856 805 886V926Q805 956 775 956H540L500 988 460 956H225Q195 956 195 926V886Q195 856 225 856Z" fill="${color}"/>${labelText(920)}`;
    case "scan-now":
      return `<path d="M38 238V96q0-58 58-58h142M762 38h142q58 0 58 58v142M38 684v142q0 58 58 58h142M762 884h142q58 0 58-58V684" fill="none" stroke="${color}" stroke-width="22" stroke-linecap="round"/><path d="M92 190V126q0-34 34-34h64M810 92h64q34 0 34 34v64M92 732v64q0 34 34 34h64M810 830h64q34 0 34-34v-64" fill="none" stroke="${color}" stroke-width="7" opacity=".55"/>${labelText(952, color, Math.min(fontSize, 28))}`;
    case "phone-card":
      return `<rect x="88" y="18" width="824" height="964" rx="104" fill="none" stroke="${color}" stroke-width="22"/><path d="M382 48h236q28 0 34 28l8 32H340l8-32q6-28 34-28Z" fill="${color}"/><circle cx="500" cy="927" r="34" fill="none" stroke="${color}" stroke-width="10"/>${labelText(868, color, Math.min(fontSize, 27))}`;
    case "poster":
      return `<rect x="36" y="24" width="928" height="952" rx="22" fill="none" stroke="${color}" stroke-width="12"/><path d="M36 92H964M36 838H964" stroke="${color}" stroke-width="10"/>${labelText(69, color, Math.min(fontSize, 30))}${labelText(920, color, Math.min(fontSize, 28))}`;
    case "badge-circle":
      return `<circle cx="500" cy="442" r="430" fill="none" stroke="${color}" stroke-width="22"/><circle cx="500" cy="442" r="394" fill="none" stroke="${color}" stroke-width="6" stroke-dasharray="16 14"/><path d="M350 852q150 88 300 0l-34 112-116-54-116 54Z" fill="${color}"/>${labelText(920, text, Math.min(fontSize, 24))}`;
    case "star-burst":
      return `<path d="m500 18 105 126 160-48 21 166 164 42-71 151 113 123-136 100 34 164-169 6-85 145-146-86-146 86-85-145-169-6 34-164L8 578l113-123-71-151 164-42 21-166 160 48Z" fill="${color}"/><path d="m500 72 89 108 138-42 18 143 141 36-61 130 97 106-116 86 29 141-146 5-73 125-116-69-116 69-73-125-146-5 29-141-116-86 97-106-61-130 141-36 18-143 138 42Z" fill="${design.frameBackground}"/>${labelText(942, color, Math.min(fontSize, 26))}`;
    case "corner-flourish":
      return `<path d="M26 210V80q0-54 54-54h130M790 26h130q54 0 54 54v130M26 680v130q0 54 54 54h130M790 864h130q54 0 54-54V680" fill="none" stroke="${color}" stroke-width="12"/><circle cx="80" cy="80" r="18" fill="${color}"/><circle cx="920" cy="80" r="18" fill="${color}"/>${labelText(930, color)}`;
    case "arrow-callout":
      return `<path d="M74 650q20-210 190-278 78-31 148-18" fill="none" stroke="${color}" stroke-width="26" stroke-linecap="round"/><path d="m360 292 98 72-112 49 36-52Z" fill="${color}"/><rect x="116" y="820" width="768" height="128" rx="64" fill="${color}"/><path d="M170 884h84" stroke="${text}" stroke-width="12" stroke-linecap="round"/>${labelText(900)}`;
    case "shop-now":
      return `<path d="M92 854h92l-10 102h-72Z" fill="none" stroke="${color}" stroke-width="9"/><path d="M116 854q0-42 22-42t22 42" fill="none" stroke="${color}" stroke-width="9"/><rect x="230" y="866" width="620" height="90" rx="45" fill="${color}"/>${labelText(924)}`;
    case "premium-plaque":
      return `<rect x="32" y="32" width="936" height="936" rx="42" fill="none" stroke="${color}" stroke-width="6"/><rect x="48" y="48" width="904" height="904" rx="32" fill="none" stroke="${color}" stroke-width="2"/><path d="m500 850 26 26-26 26-26-26Z" fill="${color}"/><rect x="260" y="902" width="480" height="62" rx="8" fill="${color}"/>${labelText(944, text, Math.min(fontSize, 26))}`;
    default:
      return "";
  }
}

export function renderQrSvg(
  payload: string,
  errorCorrectionLevel: ErrorCorrectionLevel,
  design: QrDesignOptions,
  referenceImage?: string,
): string {
  if (design.premiumTemplateId) return renderPremiumQrSvg(payload, design, referenceImage);
  if (design.uploadedFrameId) {
    const frame = uploadedFrame(design.uploadedFrameId);
    if (!frame) throw new Error("Invalid uploaded frame.");
    const [x, y, right, bottom] = frame.bounds;
    const core = renderQrSvg(payload, errorCorrectionLevel, {
      ...design, uploadedFrameId: null, artwork: "none", frame: "none", decoration: "none",
    }).replace('<svg ', `<svg x="${x}" y="${y}" `)
      .replace('width="1000" height="1000"', `width="${right - x}" height="${bottom - y}"`);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="white"/><g transform="scale(${1000 / 1254})"><image href="${referenceImage ?? uploadedFramePath(frame.id)}" width="1254" height="1254"/>${core}</g></svg>`;
  }
  const qr = QRCode.create(payload, { errorCorrectionLevel: design.logoDataUrl ? "H" : errorCorrectionLevel });
  const matrixSize = qr.modules.size;
  const illustrated = design.artwork !== "none";
  const framed =
    design.frame !== "none" || design.decoration !== "none" || illustrated;
  const artworkLayout = getQrArtworkLayout(design.artwork);
  const qrBoxSize = illustrated
    ? artworkLayout.size
    : framed
      ? 770
      : VIEWBOX_SIZE;
  const qrBoxX = illustrated
    ? artworkLayout.x
    : (VIEWBOX_SIZE - qrBoxSize) / 2;
  const qrBoxY = illustrated ? artworkLayout.y : framed ? 64 : 0;
  const moduleSize =
    qrBoxSize / (matrixSize + QUIET_ZONE_MODULES * 2);
  const originX = qrBoxX + QUIET_ZONE_MODULES * moduleSize;
  const originY = qrBoxY + QUIET_ZONE_MODULES * moduleSize;
  const fill = design.gradientColor ? "url(#qr-gradient)" : design.foreground;
  const body: string[] = [];
  // Keep approved legacy templates byte-identical. For custom styles, timing,
  // alignment and format modules must retain their full square scan geometry.
  const legacyTemplate = designTemplates.some(template => Object.entries(template.design).every(([key, value]) => design[key as keyof QrDesignOptions] === value));

  for (let row = 0; row < matrixSize; row += 1) {
    for (let column = 0; column < matrixSize; column += 1) {
      if (!qr.modules.get(row, column) || isFinderModule(row, column, matrixSize)) {
        continue;
      }
      body.push(
        renderBodyModule(
          originX + column * moduleSize,
          originY + row * moduleSize,
          moduleSize,
          !legacyTemplate && qr.modules.isReserved(row, column) ? "square" : design.bodyStyle,
          fill,
        ),
      );
    }
  }

  const eyePositions = [
    [0, 0],
    [matrixSize - 7, 0],
    [0, matrixSize - 7],
  ] as const;
  const eyes = eyePositions
    .map(([column, row]) =>
      renderEye(
        originX + column * moduleSize,
        originY + row * moduleSize,
        moduleSize,
        design.outerEyeStyle,
        design.innerEyeStyle,
        design.outerEyeColor,
        design.innerEyeColor,
        design.background,
        !legacyTemplate,
      ),
    )
    .join("");

  const gradient = design.gradientColor
    ? `<linearGradient id="qr-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${design.foreground}"/><stop offset="1" stop-color="${design.gradientColor}"/></linearGradient>`
    : "";
  const frame = renderFrame(design);
  const decoration = renderDecoration(design);
  const artworkContent = renderQrArtwork(design);
  const artwork = artworkContent
    ? `<g data-qr-artwork="${design.artwork}">${artworkContent}</g>`
    : "";

  let logo = "";
  if (design.logoDataUrl) {
    const size = (qrBoxSize * Math.min(design.logoSize, 18)) / 100;
    const centerX = qrBoxX + qrBoxSize / 2;
    const centerY = qrBoxY + qrBoxSize / 2;
    const padding = Math.max(10, size * 0.12);
    logo = `<rect x="${centerX - size / 2 - padding}" y="${centerY - size / 2 - padding}" width="${size + padding * 2}" height="${size + padding * 2}" rx="${padding}" fill="${design.background}"/><image href="${escapeXml(design.logoDataUrl)}" x="${centerX - size / 2}" y="${centerY - size / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  const canvasBackground = framed
    ? design.frameTransparent
      ? "transparent"
      : design.frameBackground
    : design.background;
  const protectedPatterns: string[] = [];
  if (design.logoDataUrl) {
    const matrix = qr.modules as typeof qr.modules & { isReserved(row: number, col: number): boolean };
    for (let row = 0; row < matrixSize; row++) for (let col = 0; col < matrixSize; col++) {
      if (!matrix.isReserved(row, col) || isFinderModule(row, col, matrixSize)) continue;
      protectedPatterns.push(`<rect x="${originX + col * moduleSize}" y="${originY + row * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${matrix.get(row, col) ? design.foreground : design.background}"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX_SIZE}" height="${VIEWBOX_SIZE}" viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}" role="img" aria-label="QR code"><defs>${gradient}</defs><rect width="${VIEWBOX_SIZE}" height="${VIEWBOX_SIZE}" fill="${canvasBackground}"/>${artwork}${decoration}${frame}<rect x="${qrBoxX}" y="${qrBoxY}" width="${qrBoxSize}" height="${qrBoxSize}" rx="${framed ? 28 : 0}" fill="${design.background}"/>${body.join("")}${eyes}${logo}${protectedPatterns.join("")}</svg>`;
}

export function renderFramePreviewSvg(frame: QrFrame) {
  const design: QrDesignOptions = {
    ...defaultDesign,
    frame,
    frameBackground: "#f8fafc",
    frameColor: "#6b7280",
    frameTextColor: "#ffffff",
  };
  const frameArtwork = renderFrame(design);
  const structure = frameStructures[frame];
  const neutral = `fill="#ffffff" stroke="#d1d5db" stroke-width="7"`;
  let center = `<rect x="180" y="145" width="640" height="640" rx="28" ${neutral}/>`;
  if (frame === "none") {
    center = `<rect x="180" y="150" width="640" height="640" rx="30" fill="#ffffff" stroke="#cbd5e1" stroke-width="8" stroke-dasharray="24 18"/><path d="M310 280 690 660M690 280 310 660" stroke="#cbd5e1" stroke-width="10" stroke-linecap="round"/>`;
  } else if (structure === "speech-top") {
    center = `<rect x="210" y="245" width="580" height="525" rx="28" ${neutral}/>`;
  } else if (structure === "pill-bottom") {
    center = `<rect x="190" y="125" width="620" height="620" rx="24" ${neutral}/>`;
  } else if (structure === "phone-card") {
    center = `<rect x="245" y="160" width="510" height="610" rx="58" ${neutral}/>`;
  } else if (structure === "scan-now") {
    center = `<rect x="205" y="190" width="590" height="590" rx="18" fill="#ffffff" stroke="#d1d5db" stroke-width="5" stroke-dasharray="22 18"/>`;
  } else if (structure === "arrow-callout") {
    center = `<rect x="405" y="225" width="390" height="480" rx="26" ${neutral}/>`;
  } else if (structure === "badge-circle") {
    center = `<circle cx="500" cy="442" r="300" ${neutral}/>`;
  } else if (structure === "star-burst") {
    center = `<circle cx="500" cy="492" r="265" ${neutral}/>`;
  } else if (structure === "payment-ticket") {
    center = `<rect x="215" y="150" width="570" height="565" rx="22" ${neutral}/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX_SIZE}" height="${VIEWBOX_SIZE}" viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}" role="img" aria-label="${escapeXml(frameLabels[frame] || "No frame")}"><rect width="${VIEWBOX_SIZE}" height="${VIEWBOX_SIZE}" fill="#f8fafc"/><g data-frame-preview="${structure}">${center}${frameArtwork}</g></svg>`;
}

export function setSvgDimensions(svg: string, size: number) {
  return svg
    .replace(/width="\d+"/, `width="${size}"`)
    .replace(/height="\d+"/, `height="${size}"`);
}

export function drawSvgToCanvas(
  canvas: HTMLCanvasElement,
  svg: string,
  size: number,
) {
  return new Promise<void>((resolve, reject) => {
    const blobUrl = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    );
    const image = new Image();
    image.onload = () => {
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, size, size);
      context?.drawImage(image, 0, 0, size, size);
      URL.revokeObjectURL(blobUrl);
      resolve();
    };
    image.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Unable to render QR design."));
    };
    image.src = blobUrl;
  });
}
