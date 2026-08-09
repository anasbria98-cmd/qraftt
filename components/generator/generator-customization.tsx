"use client";

import { useRef, useState } from "react";
import {
  bodyStyleOptions,
  designPresets,
  eyeStyleOptions,
  frameOptions,
  type QrDesignOptions,
} from "@/lib/qr/design";
import type { ErrorCorrectionLevel } from "@/lib/qr/types";

const correctionLevels: Array<{
  label: string;
  value: ErrorCorrectionLevel;
}> = [
  { label: "Low · 7%", value: "L" },
  { label: "Medium · 15%", value: "M" },
  { label: "Quartile · 25%", value: "Q" },
  { label: "High · 30%", value: "H" },
];

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read this image."));
    reader.readAsDataURL(file);
  });
}

async function processLogo(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose a PNG, JPEG, WebP, or other browser-readable image.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Keep logo files under 5 MB.");
  }

  const source = await readFileAsDataUrl(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("This image could not be processed."));
    element.src = source;
  });
  const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

interface GeneratorCustomizationProps {
  design: QrDesignOptions;
  errorCorrection: ErrorCorrectionLevel;
  onDesignChange: (updates: Partial<QrDesignOptions>) => void;
  onErrorCorrectionChange: (level: ErrorCorrectionLevel) => void;
  warnings: string[];
}

export function GeneratorCustomization({
  design,
  errorCorrection,
  onDesignChange,
  onErrorCorrectionChange,
  warnings,
}: GeneratorCustomizationProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logoName, setLogoName] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleLogo(file: File | undefined) {
    if (!file) return;
    try {
      const dataUrl = await processLogo(file);
      setLogoName(file.name);
      setUploadError(null);
      onDesignChange({ logoDataUrl: dataUrl });
      onErrorCorrectionChange("H");
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Unable to process this logo.",
      );
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeLogo() {
    setLogoName("");
    setUploadError(null);
    onDesignChange({ logoDataUrl: null });
  }

  return (
    <div className="generator-customize">
      <div className="customize-heading">
        <span className="generator-label">Design presets</span>
        <span>Free · applied instantly</span>
      </div>
      <div className="design-choice-grid design-presets">
        {designPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onDesignChange(preset.design)}
            type="button"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="design-style-grid">
        <fieldset className="design-fieldset">
          <legend>QR body</legend>
          <div className="design-choice-grid">
            {bodyStyleOptions.map((option) => (
              <button
                aria-pressed={design.bodyStyle === option.value}
                className={design.bodyStyle === option.value ? "active" : undefined}
                key={option.value}
                onClick={() => onDesignChange({ bodyStyle: option.value })}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="design-fieldset">
          <legend>QR eyes</legend>
          <div className="design-choice-grid">
            {eyeStyleOptions.map((option) => (
              <button
                aria-pressed={design.eyeStyle === option.value}
                className={design.eyeStyle === option.value ? "active" : undefined}
                key={option.value}
                onClick={() => onDesignChange({ eyeStyle: option.value })}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="color-controls">
        <label>
          <span className="generator-label">Foreground</span>
          <span className="color-input-wrap">
            <input
              aria-label="QR foreground color"
              onChange={(event) => onDesignChange({ foreground: event.target.value })}
              type="color"
              value={design.foreground}
            />
            <span>{design.foreground.toUpperCase()}</span>
          </span>
        </label>
        <label>
          <span className="generator-label">Background</span>
          <span className="color-input-wrap">
            <input
              aria-label="QR background color"
              onChange={(event) => onDesignChange({ background: event.target.value })}
              type="color"
              value={design.background}
            />
            <span>{design.background.toUpperCase()}</span>
          </span>
        </label>
      </div>
      <label className="generator-checkbox gradient-toggle">
        <input
          checked={Boolean(design.gradientColor)}
          onChange={(event) =>
            onDesignChange({ gradientColor: event.target.checked ? "#287a54" : null })
          }
          type="checkbox"
        />
        Use a simple foreground gradient
      </label>
      {design.gradientColor ? (
        <label className="gradient-color-field">
          <span className="generator-label">Gradient end</span>
          <span className="color-input-wrap">
            <input
              aria-label="QR gradient end color"
              onChange={(event) => onDesignChange({ gradientColor: event.target.value })}
              type="color"
              value={design.gradientColor}
            />
            <span>{design.gradientColor.toUpperCase()}</span>
          </span>
        </label>
      ) : null}

      <fieldset className="design-fieldset">
        <legend>Frame</legend>
        <div className="design-choice-grid frame-choices">
          {frameOptions.map((option) => (
            <button
              aria-pressed={design.frame === option.value}
              className={design.frame === option.value ? "active" : undefined}
              key={option.value}
              onClick={() => onDesignChange({ frame: option.value })}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="logo-controls">
        <div className="customize-heading">
          <span className="generator-label">Logo</span>
          <span>Processed locally</span>
        </div>
        <input
          accept="image/*"
          className="visually-hidden"
          onChange={(event) => void handleLogo(event.target.files?.[0])}
          ref={inputRef}
          type="file"
        />
        <div className="logo-actions">
          <button
            className="button button-secondary"
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            {design.logoDataUrl ? "Replace logo" : "Upload logo"}
          </button>
          {design.logoDataUrl ? (
            <button className="text-button" onClick={removeLogo} type="button">
              Remove
            </button>
          ) : null}
          {logoName ? <span title={logoName}>{logoName}</span> : null}
        </div>
        {uploadError ? <p className="customize-error">{uploadError}</p> : null}
        {design.logoDataUrl ? (
          <label className="logo-size-field">
            <span>
              <span className="generator-label">Logo size</span>
              <output>{design.logoSize}%</output>
            </span>
            <input
              max="20"
              min="10"
              onChange={(event) => onDesignChange({ logoSize: Number(event.target.value) })}
              type="range"
              value={design.logoSize}
            />
            <small>High error correction is locked while a logo is used.</small>
          </label>
        ) : null}
      </div>

      <label className="generator-field">
        <span className="generator-label">Error correction</span>
        <select
          disabled={Boolean(design.logoDataUrl)}
          onChange={(event) =>
            onErrorCorrectionChange(event.target.value as ErrorCorrectionLevel)
          }
          value={design.logoDataUrl ? "H" : errorCorrection}
        >
          {correctionLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </label>

      {warnings.length ? (
        <ul className="design-warnings" aria-label="QR design warnings">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
