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
  catalogFirst?: boolean;
  initialType?: QrType;
}

const exportSizes = [512, 1_000, 2_000] as const;
type ExportSize = (typeof exportSizes)[number];
type ExportFormat = "png" | "svg";

export function QrGenerator({
  catalogFirst = false,
  initialType = "url",
}: QrGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<QrType>(initialType);
  const [values, setValues] = useState<QrFormValues>(initialValues);
  const [design, setDesign] = useState<QrDesignOptions>(defaultDesign);
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionLevel>("M");
  const [exportSize, setExportSize] = useState<ExportSize>(1_000);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [engineError, setEngineError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<"png" | "svg" | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

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
    const canvases = [canvasRef.current, mobileCanvasRef.current].filter(
      (canvas): canvas is HTMLCanvasElement => Boolean(canvas),
    );
    if (!canvases.length) return;

    if (!artwork.svg) {
      for (const canvas of canvases) {
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let active = true;
    Promise.all(
      canvases.map((canvas) => drawSvgToCanvas(canvas, artwork.svg, 640)),
    )
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
  }, [artwork.svg, mobilePreviewOpen]);

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
      saveBlob(blob, `qraftt-${type}-qr.png`);
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
        `qraftt-${type}-qr.svg`,
      );
    } catch {
      setEngineError("SVG export failed. Try reducing the content length.");
    } finally {
      setDownloading(null);
    }
  }

  function downloadSelectedFormat() {
    return exportFormat === "png" ? downloadPng() : downloadSvg();
  }

  const currentError = validationError ?? artwork.error ?? engineError;
  const canDownload = Boolean(artwork.svg) && !engineError && !downloading;

  return (
    <section
      className={catalogFirst ? "generator-shell generator-home-workflow" : "generator-shell"}
      aria-labelledby="generator-title"
    >
      {catalogFirst ? (
        <h2 className="visually-hidden" id="generator-title">
          Create your QR code
        </h2>
      ) : null}
      {!catalogFirst ? (
        <div className="generator-heading">
          <div>
            <p className="generator-kicker">QR workspace</p>
            <h2 id="generator-title">Create your code</h2>
          </div>
          <span className="local-badge">Local only</span>
        </div>
      ) : null}

      <QrTypeSelector
        onSelect={setType}
        selectedType={type}
        showSelectedSummary={!catalogFirst}
      />

      <div className="generator-main">
        <div className="generator-controls">
          <div className="generator-stage-heading">
            <span>1</span>
            <div>
              <h3>Add Content</h3>
              <p>Enter exactly what the selected QR code should contain.</p>
            </div>
          </div>

          <GeneratorFields
            error={currentError}
            onChange={updateValue}
            type={type}
            values={values}
          />

          <div className="generator-stage-heading customization-stage-heading">
            <span>2</span>
            <div>
              <h3>Customize QR</h3>
              <p>Apply a template or shape the details while previewing every change.</p>
            </div>
          </div>

          <aside className={mobilePreviewOpen ? "mobile-preview-dock open" : "mobile-preview-dock"}>
            <button
              aria-expanded={mobilePreviewOpen}
              className="mobile-preview-toggle"
              onClick={() => setMobilePreviewOpen((current) => !current)}
              type="button"
            >
              <span>Live preview</span>
              <strong>{mobilePreviewOpen ? "Hide" : "View QR"}</strong>
            </button>
            {mobilePreviewOpen ? (
              <div className="mobile-preview-content">
                <div className="mobile-preview-canvas">
                  <canvas
                    aria-label={`Compact live ${type} QR code preview`}
                    className={!artwork.svg || engineError ? "is-empty" : undefined}
                    ref={mobileCanvasRef}
                    role="img"
                  />
                  {!artwork.svg || engineError ? <span>Complete the fields</span> : null}
                </div>
                <div>
                  <span>{effectiveCorrection} correction</span>
                  <button
                    onClick={() => {
                      setMobilePreviewOpen(false);
                      previewPanelRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    type="button"
                  >
                    Preview &amp; download
                  </button>
                </div>
              </div>
            ) : null}
          </aside>

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

        <div className="generator-preview-panel" ref={previewPanelRef}>
          <div className="generator-preview-heading">
            <div className="generator-stage-heading preview-stage-heading">
              <span>3</span>
              <div>
                <h3>Generate &amp; download QR</h3>
                <small>Every design detail is included in your file.</small>
              </div>
            </div>
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
          <div className="generator-download-settings">
            <label className="export-select-field">
              <span>Format</span>
              <select
                aria-label="Export format"
                onChange={(event) =>
                  setExportFormat(event.target.value as ExportFormat)
                }
                value={exportFormat}
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
            </label>
            <label className="export-select-field">
              <span>Size</span>
              <select
                aria-label="Export resolution"
                onChange={(event) =>
                  setExportSize(Number(event.target.value) as ExportSize)
                }
                value={exportSize}
              >
                {exportSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} × {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            className="button button-primary generator-download-button"
            disabled={!canDownload}
            onClick={() => void downloadSelectedFormat()}
            type="button"
          >
            {downloading
              ? "Preparing download…"
              : `Download ${exportFormat.toUpperCase()}`}
          </button>
          <p className="generator-export-note">
            Static file · no account · no server dependency
          </p>
        </div>
      </div>
    </section>
  );
}
