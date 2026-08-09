"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GeneratorCustomization } from "@/components/generator/generator-customization";
import { GeneratorFields } from "@/components/generator/generator-fields";
import { qrTypeOptions } from "@/lib/qr/config";
import { getDesignWarnings, type QrDesignOptions } from "@/lib/qr/design";
import { buildQrPayload } from "@/lib/qr/payloads";
import { drawSvgToCanvas, renderQrSvg } from "@/lib/qr/render";
import type {
  ErrorCorrectionLevel,
  QrFormValues,
  QrType,
} from "@/lib/qr/types";

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
  const [design, setDesign] = useState<QrDesignOptions>({
    background: "#ffffff",
    bodyStyle: "square",
    eyeStyle: "square",
    foreground: "#102a2a",
    frame: "none",
    gradientColor: null,
    logoDataUrl: null,
    logoSize: 16,
  });
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionLevel>("M");
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
    if (!artwork.svg || engineError) return;
    setDownloading("png");
    try {
      const canvas = document.createElement("canvas");
      await drawSvgToCanvas(canvas, artwork.svg, 1_024);
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
        new Blob([artwork.svg], { type: "image/svg+xml;charset=utf-8" }),
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

          <GeneratorCustomization
            design={design}
            errorCorrection={errorCorrection}
            onDesignChange={(updates) =>
              setDesign((current) => ({ ...current, ...updates }))
            }
            onErrorCorrectionChange={setErrorCorrection}
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
