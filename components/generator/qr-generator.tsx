"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode, { type QRCodeRenderersOptions } from "qrcode";
import { GeneratorFields } from "@/components/generator/generator-fields";
import { qrTypeOptions } from "@/lib/qr/config";
import { buildQrPayload } from "@/lib/qr/payloads";
import type {
  ErrorCorrectionLevel,
  QrFormValues,
  QrType,
} from "@/lib/qr/types";

const correctionLevels: Array<{
  label: string;
  value: ErrorCorrectionLevel;
}> = [
  { label: "Low · 7%", value: "L" },
  { label: "Medium · 15%", value: "M" },
  { label: "Quartile · 25%", value: "Q" },
  { label: "High · 30%", value: "H" },
];

const initialValues: QrFormValues = {
  emailBody: "",
  emailSubject: "",
  emailTo: "",
  facebook: "",
  "google-review": "",
  instagram: "",
  linkedin: "",
  locationLatitude: "",
  locationLongitude: "",
  menu: "",
  paypal: "",
  "pdf-link": "",
  phoneNumber: "",
  smsMessage: "",
  smsNumber: "",
  spotify: "",
  telegram: "",
  text: "",
  tiktok: "",
  url: "https://example.com",
  vcardEmail: "",
  vcardFirstName: "",
  vcardLastName: "",
  vcardOrganization: "",
  vcardPhone: "",
  vcardTitle: "",
  vcardWebsite: "",
  whatsappMessage: "",
  whatsappNumber: "",
  wifiEncryption: "WPA",
  wifiHidden: false,
  wifiPassword: "",
  wifiSsid: "",
  youtube: "",
};

function addAlpha(hex: string) {
  return `${hex}ff`;
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

interface QrGeneratorProps {
  initialType?: QrType;
}

export function QrGenerator({ initialType = "url" }: QrGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState<QrType>(initialType);
  const [values, setValues] = useState<QrFormValues>(initialValues);
  const [foreground, setForeground] = useState("#102a2a");
  const [background, setBackground] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionLevel>("M");
  const [engineError, setEngineError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"png" | "svg" | null>(null);

  const result = useMemo(() => buildQrPayload(type, values), [type, values]);
  const colorError =
    foreground.toLowerCase() === background.toLowerCase()
      ? "Foreground and background colors must be different."
      : null;
  const validationError = result.error ?? colorError;
  const payload = validationError ? "" : result.payload;

  const renderOptions = useMemo<QRCodeRenderersOptions>(
    () => ({
      color: {
        dark: addAlpha(foreground),
        light: addAlpha(background),
      },
      errorCorrectionLevel: errorCorrection,
      margin: 4,
      width: 640,
    }),
    [background, errorCorrection, foreground],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!payload) {
      context?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let active = true;
    QRCode.toCanvas(canvas, payload, renderOptions)
      .then(() => {
        if (active) setEngineError(null);
      })
      .catch(() => {
        if (active) {
          setEngineError(
            "This content is too large for the selected error correction level.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [payload, renderOptions]);

  function updateValue<Key extends keyof QrFormValues>(
    key: Key,
    value: QrFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleTabKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % qrTypeOptions.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + qrTypeOptions.length) % qrTypeOptions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = qrTypeOptions.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const nextType = qrTypeOptions[nextIndex].value;
    setType(nextType);
    document.getElementById(`generator-tab-${nextType}`)?.focus();
  }

  async function downloadPng() {
    if (!payload || engineError) return;
    setDownloading("png");
    try {
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, payload, { ...renderOptions, width: 1_024 });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("PNG export failed");
      saveBlob(blob, `qraft-${type}-qr.png`);
    } catch {
      setEngineError("PNG export failed. Try reducing the content length.");
    } finally {
      setDownloading(null);
    }
  }

  async function downloadSvg() {
    if (!payload || engineError) return;
    setDownloading("svg");
    try {
      const svg = await QRCode.toString(payload, {
        ...renderOptions,
        type: "svg",
        width: 1_024,
      });
      saveBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `qraft-${type}-qr.svg`);
    } catch {
      setEngineError("SVG export failed. Try reducing the content length.");
    } finally {
      setDownloading(null);
    }
  }

  const currentError = validationError ?? engineError;
  const canDownload = Boolean(payload) && !engineError && !downloading;

  return (
    <section className="generator-shell" aria-labelledby="generator-title">
      <div className="generator-heading">
        <div>
          <p className="generator-kicker">QR workspace</p>
          <h2 id="generator-title">Create your code</h2>
        </div>
        <span className="local-badge">Local only</span>
      </div>

      <div
        aria-label="QR code type"
        aria-orientation="horizontal"
        className="generator-tabs"
        role="tablist"
      >
        {qrTypeOptions.map((item, index) => (
          <button
            aria-controls="generator-fields-panel"
            aria-selected={type === item.value}
            className={type === item.value ? "active" : undefined}
            id={`generator-tab-${item.value}`}
            key={item.value}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            onClick={() => setType(item.value)}
            role="tab"
            tabIndex={type === item.value ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="generator-main">
        <div className="generator-controls">
          <GeneratorFields
            error={currentError}
            onChange={updateValue}
            type={type}
            values={values}
          />

          <div className="generator-customize">
            <div className="color-controls">
              <label>
                <span className="generator-label">Foreground</span>
                <span className="color-input-wrap">
                  <input
                    aria-label="QR foreground color"
                    onChange={(event) => setForeground(event.target.value)}
                    type="color"
                    value={foreground}
                  />
                  <span>{foreground.toUpperCase()}</span>
                </span>
              </label>
              <label>
                <span className="generator-label">Background</span>
                <span className="color-input-wrap">
                  <input
                    aria-label="QR background color"
                    onChange={(event) => setBackground(event.target.value)}
                    type="color"
                    value={background}
                  />
                  <span>{background.toUpperCase()}</span>
                </span>
              </label>
            </div>
            <label className="generator-field">
              <span className="generator-label">Error correction</span>
              <select
                onChange={(event) =>
                  setErrorCorrection(event.target.value as ErrorCorrectionLevel)
                }
                value={errorCorrection}
              >
                {correctionLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            aria-live="polite"
            className={currentError ? "generator-message error" : "generator-message"}
            id="generator-validation"
          >
            {currentError ?? "QR preview is ready and updates automatically."}
          </div>
        </div>

        <div className="generator-preview-panel">
          <div className="generator-preview-heading">
            <span>Live preview</span>
            <span>{errorCorrection} correction</span>
          </div>
          <div className="generator-canvas-wrap">
            <canvas
              aria-label={`Live ${type} QR code preview`}
              className={!payload || engineError ? "is-empty" : undefined}
              ref={canvasRef}
              role="img"
            />
            {!payload || engineError ? (
              <p>Complete the fields to preview your QR code.</p>
            ) : null}
          </div>
          <p className="generator-privacy-note">
            Generated in your browser. Nothing is uploaded.
          </p>
          <div className="generator-downloads">
            <button
              className="button button-primary"
              disabled={!canDownload}
              onClick={downloadPng}
              type="button"
            >
              {downloading === "png" ? "Preparing…" : "Download PNG"}
            </button>
            <button
              className="button button-secondary"
              disabled={!canDownload}
              onClick={downloadSvg}
              type="button"
            >
              {downloading === "svg" ? "Preparing…" : "Download SVG"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
