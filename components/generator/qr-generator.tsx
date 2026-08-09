"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GeneratorCustomization } from "@/components/generator/generator-customization";
import { GeneratorFields } from "@/components/generator/generator-fields";
import { QrTypeSelector } from "@/components/generator/qr-type-selector";
import {
  defaultDesign,
  getDesignWarnings,
  type QrDesignOptions,
} from "@/lib/qr/design";
import { buildQrPayload } from "@/lib/qr/payloads";
import {
  drawSvgToCanvas,
  renderQrSvg,
  setSvgDimensions,
} from "@/lib/qr/render";
import type {
  ErrorCorrectionLevel,
  QrFormValues,
  QrType,
} from "@/lib/qr/types";

const initialValues: QrFormValues = {
  amazon: "",
  "app-store": "",
  "audio-url": "",
  calendarDescription: "",
  calendarEnd: "",
  calendarLocation: "",
  calendarStart: "",
  calendarTitle: "",
  discord: "",
  emailBody: "",
  emailSubject: "",
  emailTo: "",
  facebook: "",
  "google-review": "",
  "google-docs": "",
  "google-forms": "",
  "image-url": "",
  instagram: "",
  linkedin: "",
  locationLatitude: "",
  locationLongitude: "",
  menu: "",
  paypal: "",
  "pdf-link": "",
  "presentation-url": "",
  reddit: "",
  phoneNumber: "",
  smsMessage: "",
  smsNumber: "",
  spotify: "",
  "spreadsheet-url": "",
  snapchat: "",
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

const exportSizes = [512, 1_000, 2_000] as const;
type ExportSize = (typeof exportSizes)[number];

export function QrGenerator({ initialType = "url" }: QrGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState<QrType>(initialType);
  const [values, setValues] = useState<QrFormValues>(initialValues);
  const [design, setDesign] = useState<QrDesignOptions>(defaultDesign);
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionLevel>("M");
  const [exportSize, setExportSize] = useState<ExportSize>(1_000);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"png" | "svg" | null>(null);

  const result = useMemo(() => buildQrPayload(type, values), [type, values]);
  const designSafety = useMemo(() => getDesignWarnings(design), [design]);
  const designError =
    designSafety.minimumContrast < 2.5
      ? "Increase the contrast between the QR foreground and background colors."
      : null;
  const validationError = result.error ?? designError;
  const payload = validationError ? "" : result.payload;
  const effectiveCorrection = design.logoDataUrl ? "H" : errorCorrection;
  const artwork = useMemo(() => {
    if (!payload) return { error: null, svg: "" };
    try {
      return {
        error: null,
        svg: renderQrSvg(payload, effectiveCorrection, design),
      };
    } catch {
      return {
        error: "This content is too large for the selected error correction level.",
        svg: "",
      };
    }
  }, [design, effectiveCorrection, payload]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!artwork.svg) {
      context?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let active = true;
    drawSvgToCanvas(canvas, artwork.svg, 640)
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
  }, [artwork.svg]);

  function updateValue<Key extends keyof QrFormValues>(
    key: Key,
    value: QrFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function downloadPng() {
    if (!artwork.svg || engineError) return;
    setDownloading("png");
    try {
      const canvas = document.createElement("canvas");
      await drawSvgToCanvas(canvas, artwork.svg, exportSize);
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
    if (!artwork.svg || engineError) return;
    setDownloading("svg");
    try {
      saveBlob(
        new Blob([setSvgDimensions(artwork.svg, exportSize)], {
          type: "image/svg+xml;charset=utf-8",
        }),
        `qraft-${type}-qr.svg`,
      );
    } catch {
      setEngineError("SVG export failed. Try reducing the content length.");
    } finally {
      setDownloading(null);
    }
  }

  const currentError = validationError ?? artwork.error ?? engineError;
  const canDownload = Boolean(artwork.svg) && !engineError && !downloading;

  return (
    <section className="generator-shell" aria-labelledby="generator-title">
      <div className="generator-heading">
        <div>
          <p className="generator-kicker">QR workspace</p>
          <h2 id="generator-title">Create your code</h2>
        </div>
        <span className="local-badge">Local only</span>
      </div>

      <QrTypeSelector onSelect={setType} selectedType={type} />

      <div className="generator-main">
        <div className="generator-controls">
          <GeneratorFields
            error={currentError}
            onChange={updateValue}
            type={type}
            values={values}
          />

          <GeneratorCustomization
            design={design}
            errorCorrection={errorCorrection}
            onDesignChange={(updates) =>
              setDesign((current) => ({ ...current, ...updates }))
            }
            onErrorCorrectionChange={setErrorCorrection}
            onReset={() => {
              setDesign(defaultDesign);
              setErrorCorrection("M");
            }}
            warnings={designSafety.warnings}
          />

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
            <span>{effectiveCorrection} correction</span>
          </div>
          <div className="generator-canvas-wrap">
            <canvas
              aria-label={`Live ${type} QR code preview`}
              className={!artwork.svg || engineError ? "is-empty" : undefined}
              ref={canvasRef}
              role="img"
            />
            {!artwork.svg || engineError ? (
              <p>Complete the fields to preview your QR code.</p>
            ) : null}
          </div>
          <p className="generator-privacy-note">
            Generated in your browser. Nothing is uploaded.
          </p>
          <label className="export-size-field">
            <span>Export size</span>
            <select
              aria-label="Export resolution"
              onChange={(event) =>
                setExportSize(Number(event.target.value) as ExportSize)
              }
              value={exportSize}
            >
              {exportSizes.map((size) => (
                <option key={size} value={size}>
                  {size} × {size} px
                </option>
              ))}
            </select>
          </label>
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
