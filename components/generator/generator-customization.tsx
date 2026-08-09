"use client";

import NextImage from "next/image";
import { useRef, useState } from "react";
import {
  bodyStyleOptions,
  defaultDesign,
  designTemplates,
  eyeStyleOptions,
  frameOptions,
  type QrDesignOptions,
  type QrDesignTemplate,
} from "@/lib/qr/design";
import { renderQrSvg } from "@/lib/qr/render";
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

function previewUrl(design: QrDesignOptions) {
  const svg = renderQrSvg("https://qraft.app", "H", design);
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;
}

const templatePreviews = Object.fromEntries(
  designTemplates.map((item) => [
    item.id,
    previewUrl({ ...item.design, logoDataUrl: null, logoSize: 16 }),
  ]),
) as Record<string, string>;

const framePreviews = Object.fromEntries(
  frameOptions.map((item) => [
    item.value,
    previewUrl({ ...defaultDesign, frame: item.value }),
  ]),
) as Record<string, string>;

function isTemplateActive(
  design: QrDesignOptions,
  template: QrDesignTemplate,
) {
  return Object.entries(template.design).every(
    ([key, value]) =>
      design[key as keyof QrDesignOptions] === value,
  );
}

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
  onReset: () => void;
  warnings: string[];
}

export function GeneratorCustomization({
  design,
  errorCorrection,
  onDesignChange,
  onErrorCorrectionChange,
  onReset,
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

  function resetDesign() {
    setLogoName("");
    setUploadError(null);
    onReset();
  }

  return (
    <div className="generator-customize">
      <div className="customize-heading customize-title-row">
        <div>
          <span className="generator-label">Design studio</span>
          <p>Templates and controls update the preview instantly.</p>
        </div>
        <button className="reset-design-button" onClick={resetDesign} type="button">
          Reset design
        </button>
      </div>

      <fieldset className="design-fieldset">
        <legend>Template gallery</legend>
        <div className="design-template-gallery">
          {designTemplates.map((template) => {
            const active = isTemplateActive(design, template);
            return (
              <button
                aria-pressed={active}
                className={active ? "design-gallery-card active" : "design-gallery-card"}
                key={template.id}
                onClick={() => onDesignChange(template.design)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="design-gallery-preview"
                  style={{ backgroundImage: templatePreviews[template.id] }}
                />
                <span className="design-gallery-copy">
                  <strong>{template.name}</strong>
                  <small>{template.description}</small>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="design-style-grid">
        <fieldset className="design-fieldset">
          <legend>QR body pattern</legend>
          <div className="design-choice-grid pattern-choices">
            {bodyStyleOptions.map((option) => (
              <button
                aria-pressed={design.bodyStyle === option.value}
                className={design.bodyStyle === option.value ? "active" : undefined}
                key={option.value}
                onClick={() => onDesignChange({ bodyStyle: option.value })}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="pattern-swatch"
                  data-body-style={option.value}
                />
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="design-fieldset">
          <legend>Corner style</legend>
          <div className="design-choice-grid eye-choices">
            {eyeStyleOptions.map((option) => (
              <button
                aria-pressed={design.eyeStyle === option.value}
                className={design.eyeStyle === option.value ? "active" : undefined}
                key={option.value}
                onClick={() => onDesignChange({ eyeStyle: option.value })}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="eye-swatch"
                  data-eye-style={option.value}
                />
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset className="design-fieldset color-fieldset">
        <legend>Colors</legend>
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
        <div className="gradient-control-row">
          <label className="generator-checkbox gradient-toggle">
            <input
              checked={Boolean(design.gradientColor)}
              onChange={(event) =>
                onDesignChange({
                  gradientColor: event.target.checked ? "#287a54" : null,
                })
              }
              type="checkbox"
            />
            Foreground gradient
          </label>
          <button
            className="text-button"
            onClick={() =>
              onDesignChange({
                background: defaultDesign.background,
                foreground: defaultDesign.foreground,
                gradientColor: null,
              })
            }
            type="button"
          >
            Reset colors
          </button>
        </div>
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
      </fieldset>

      <fieldset className="design-fieldset">
        <legend>Frame gallery</legend>
        <div className="frame-gallery">
          {frameOptions.map((option) => (
            <button
              aria-pressed={design.frame === option.value}
              className={design.frame === option.value ? "frame-gallery-card active" : "frame-gallery-card"}
              key={option.value}
              onClick={() => onDesignChange({ frame: option.value })}
              type="button"
            >
              <span
                aria-hidden="true"
                className="frame-gallery-preview"
                style={{ backgroundImage: framePreviews[option.value] }}
              />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
        {design.frame !== "none" ? (
          <div className="color-controls frame-color-controls">
            <label>
              <span className="generator-label">Frame background</span>
              <span className="color-input-wrap">
                <input
                  aria-label="Frame background color"
                  onChange={(event) =>
                    onDesignChange({ frameBackground: event.target.value })
                  }
                  type="color"
                  value={design.frameBackground}
                />
                <span>{design.frameBackground.toUpperCase()}</span>
              </span>
            </label>
            <label>
              <span className="generator-label">Frame text</span>
              <span className="color-input-wrap">
                <input
                  aria-label="Frame text color"
                  onChange={(event) =>
                    onDesignChange({ frameTextColor: event.target.value })
                  }
                  type="color"
                  value={design.frameTextColor}
                />
                <span>{design.frameTextColor.toUpperCase()}</span>
              </span>
            </label>
          </div>
        ) : null}
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
          {design.logoDataUrl ? (
            <span className="logo-preview">
              <NextImage
                alt="Uploaded logo preview"
                height={48}
                src={design.logoDataUrl}
                unoptimized
                width={48}
              />
            </span>
          ) : null}
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
          {logoName ? <span className="logo-file-name" title={logoName}>{logoName}</span> : null}
        </div>
        {uploadError ? <p className="customize-error">{uploadError}</p> : null}
        {design.logoDataUrl ? (
          <label className="logo-size-field">
            <span>
              <span className="generator-label">Logo size</span>
              <output>{design.logoSize}%</output>
            </span>
            <input
              max="18"
              min="10"
              onChange={(event) => onDesignChange({ logoSize: Number(event.target.value) })}
              type="range"
              value={design.logoSize}
            />
            <small>Centered with a safe cutout. High correction is applied automatically.</small>
          </label>
        ) : null}
      </div>

      <label className="generator-field correction-field">
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
