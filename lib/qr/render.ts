import QRCode from "qrcode";
import { frameLabels, type QrDesignOptions } from "./design.ts";
import type { ErrorCorrectionLevel } from "./types.ts";

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
  if (style === "dots") {
    const radius = moduleSize * 0.42;
    return `<circle cx="${x + moduleSize / 2}" cy="${y + moduleSize / 2}" r="${radius}" fill="${fill}"/>`;
  }

  const inset = style === "rounded" ? moduleSize * 0.06 : 0;
  const radius = style === "rounded" ? moduleSize * 0.28 : 0;
  return `<rect x="${x + inset}" y="${y + inset}" width="${moduleSize - inset * 2}" height="${moduleSize - inset * 2}" rx="${radius}" fill="${fill}"/>`;
}

function renderEye(
  x: number,
  y: number,
  moduleSize: number,
  style: QrDesignOptions["eyeStyle"],
  fill: string,
  background: string,
) {
  if (style === "circle") {
    const centerX = x + moduleSize * 3.5;
    const centerY = y + moduleSize * 3.5;
    return [
      `<circle data-qr-eye="circle" cx="${centerX}" cy="${centerY}" r="${moduleSize * 3.5}" fill="${fill}"/>`,
      `<circle cx="${centerX}" cy="${centerY}" r="${moduleSize * 2.5}" fill="${background}"/>`,
      `<circle cx="${centerX}" cy="${centerY}" r="${moduleSize * 1.5}" fill="${fill}"/>`,
    ].join("");
  }

  const outerRadius = style === "rounded" ? moduleSize * 1.25 : 0;
  const middleRadius = style === "rounded" ? moduleSize * 0.85 : 0;
  const innerRadius = style === "rounded" ? moduleSize * 0.55 : 0;
  return [
    `<rect data-qr-eye="${style}" x="${x}" y="${y}" width="${moduleSize * 7}" height="${moduleSize * 7}" rx="${outerRadius}" fill="${fill}"/>`,
    `<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${moduleSize * 5}" height="${moduleSize * 5}" rx="${middleRadius}" fill="${background}"/>`,
    `<rect x="${x + moduleSize * 2}" y="${y + moduleSize * 2}" width="${moduleSize * 3}" height="${moduleSize * 3}" rx="${innerRadius}" fill="${fill}"/>`,
  ].join("");
}

export function renderQrSvg(
  payload: string,
  errorCorrectionLevel: ErrorCorrectionLevel,
  design: QrDesignOptions,
) {
  const qr = QRCode.create(payload, { errorCorrectionLevel });
  const matrixSize = qr.modules.size;
  const framed = design.frame !== "none";
  const qrBoxSize = framed ? 790 : VIEWBOX_SIZE;
  const qrBoxX = (VIEWBOX_SIZE - qrBoxSize) / 2;
  const qrBoxY = framed ? 42 : 0;
  const moduleSize =
    qrBoxSize / (matrixSize + QUIET_ZONE_MODULES * 2);
  const originX = qrBoxX + QUIET_ZONE_MODULES * moduleSize;
  const originY = qrBoxY + QUIET_ZONE_MODULES * moduleSize;
  const fill = design.gradientColor ? "url(#qr-gradient)" : design.foreground;
  const body: string[] = [];

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
          design.bodyStyle,
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
        design.eyeStyle,
        fill,
        design.background,
      ),
    )
    .join("");

  const gradient = design.gradientColor
    ? `<linearGradient id="qr-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${design.foreground}"/><stop offset="1" stop-color="${design.gradientColor}"/></linearGradient>`
    : "";
  const frame = framed
    ? `<rect x="20" y="20" width="960" height="960" rx="42" fill="none" stroke="${design.foreground}" stroke-width="14"/><text x="500" y="925" text-anchor="middle" fill="${design.foreground}" font-family="Arial, sans-serif" font-size="52" font-weight="700" letter-spacing="4">${escapeXml(frameLabels[design.frame])}</text>`
    : "";

  let logo = "";
  if (design.logoDataUrl) {
    const size = (qrBoxSize * design.logoSize) / 100;
    const centerX = qrBoxX + qrBoxSize / 2;
    const centerY = qrBoxY + qrBoxSize / 2;
    const padding = Math.max(10, size * 0.12);
    logo = `<rect x="${centerX - size / 2 - padding}" y="${centerY - size / 2 - padding}" width="${size + padding * 2}" height="${size + padding * 2}" rx="${padding}" fill="${design.background}"/><image href="${escapeXml(design.logoDataUrl)}" x="${centerX - size / 2}" y="${centerY - size / 2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${VIEWBOX_SIZE}" height="${VIEWBOX_SIZE}" viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}" role="img" aria-label="QR code"><defs>${gradient}</defs><rect width="${VIEWBOX_SIZE}" height="${VIEWBOX_SIZE}" fill="${design.background}"/>${frame}<rect x="${qrBoxX}" y="${qrBoxY}" width="${qrBoxSize}" height="${qrBoxSize}" rx="${framed ? 20 : 0}" fill="${design.background}"/>${body.join("")}${eyes}${logo}</svg>`;
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
