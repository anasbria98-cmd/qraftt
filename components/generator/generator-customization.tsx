"use client";

import { T, useLanguage } from "@/components/i18n/language-provider";
import NextImage from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ProBadge } from "@/components/generator/pro-badge";
import { QrTypeIcon } from "@/components/generator/qr-type-icon";
import {
  bodyStyleOptions,
  defaultDesign,
  designTemplates,
  frameOptions,
  innerEyeStyleOptions,
  noTemplate,
  outerEyeStyleOptions,
  type QrDesignOptions,
  type QrDesignTemplate,
} from "@/lib/qr/design";
import { renderFramePreviewSvg, renderQrSvg } from "@/lib/qr/render";
import type { ErrorCorrectionLevel } from "@/lib/qr/types";
import { premiumTemplates } from "@/lib/qr/premium-templates";

const correctionLevels: Array<{
  description: string;
  label: string;
  value: ErrorCorrectionLevel;
}> = [
  { description: "Best for simple codes displayed clearly.", label: "Low · 7%", value: "L" },
  { description: "Safe default for everyday use.", label: "Medium · 15%", value: "M" },
  { description: "More recovery for print and handling.", label: "Quartile · 25%", value: "Q" },
  { description: "Maximum recovery and required for logos.", label: "High · 30%", value: "H" },
];

type CustomizationTab = "frames" | "shapes" | "logo" | "level";

const customizationTabs: Array<{ label: string; value: CustomizationTab }> = [
  { label: "Frames", value: "frames" },
  { label: "Shapes", value: "shapes" },
  { label: "Logo", value: "logo" },
  { label: "Level", value: "level" },
];

const INITIAL_TEMPLATE_COUNT = 12;
const INITIAL_FRAME_COUNT = 10;

function previewUrl(design: QrDesignOptions) {
  const svg = renderQrSvg("https://qraftt.com", "H", design);
  return svgPreviewUrl(svg);
}

function svgPreviewUrl(svg: string) {
  return `url("${URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))}")`;
}

function subscribeToHydration() {
  return () => undefined;
}

const templatePreviewCache = new Map<string, string>();
const framePreviewCache = new Map<string, string>();

function getTemplatePreview(template: QrDesignTemplate) {
  if (template.design.premiumTemplateId) return `url("/images/qr-references/${template.id.replace("pro-", "")}-preview.png")`;
  const cached = templatePreviewCache.get(template.id);
  if (cached) return cached;
  const preview = previewUrl({
    ...template.design,
    logoDataUrl: null,
    logoSize: 16,
  });
  templatePreviewCache.set(template.id, preview);
  return preview;
}

function getFramePreview(frame: (typeof frameOptions)[number]) {
  const cached = framePreviewCache.get(frame.value);
  if (cached) return cached;
  const preview = svgPreviewUrl(renderFramePreviewSvg(frame.value));
  framePreviewCache.set(frame.value, preview);
  return preview;
}

function isTemplateActive(
  design: QrDesignOptions,
  template: QrDesignTemplate,
) {
  if ((design.premiumTemplateId ?? null) !== (template.design.premiumTemplateId ?? null)) return false;
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

interface ColorControlProps {
  ariaLabel: string;
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

function ColorControl({
  ariaLabel,
  disabled = false,
  label,
  onChange,
  value,
}: ColorControlProps) {
  const { t } = useLanguage();
  return (
    <label className={disabled ? "is-disabled" : undefined}>
      <span className="generator-label"><T text={label} /></span>
      <span className="color-input-wrap">
        <input
          aria-label={t(ariaLabel)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          type="color"
          value={value}
        />
        <span>{value.toUpperCase()}</span>
      </span>
    </label>
  );
}

interface GeneratorCustomizationProps {
  pro?: boolean;
  onRequestPro?: () => void;
  design: QrDesignOptions;
  errorCorrection: ErrorCorrectionLevel;
  onDesignChange: (updates: Partial<QrDesignOptions>) => void;
  onErrorCorrectionChange: (level: ErrorCorrectionLevel) => void;
  onReset: () => void;
  warnings: string[];
}

export function GeneratorCustomization({
  pro = true,
  onRequestPro,
  design,
  errorCorrection,
  onDesignChange,
  onErrorCorrectionChange,
  onReset,
  warnings,
}: GeneratorCustomizationProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<CustomizationTab>("frames");
  const [framesExpanded, setFramesExpanded] = useState(false);
  const [logoName, setLogoName] = useState("");
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [premiumExpanded, setPremiumExpanded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stylePreview, setStylePreview] = useState<{ name: string; image: string; free?: boolean } | null>(null);
  const previewsReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  async function handleLogo(file: File | undefined) {
    if (!file) return;
    if (!pro) { onRequestPro?.(); return; }
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

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = customizationTabs.findIndex(
      (tab) => tab.value === activeTab,
    );
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % customizationTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + customizationTabs.length) % customizationTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = customizationTabs.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextTab = customizationTabs[nextIndex];
    setActiveTab(nextTab.value);
    tabListRef.current
      ?.querySelector<HTMLButtonElement>(`#customize-tab-${nextTab.value}`)
      ?.focus();
  }

  const effectiveLevel = design.logoDataUrl ? "H" : errorCorrection;
  const hasContrastWarning = warnings.some((warning) =>
    warning.startsWith("Low color contrast"),
  );
  const visibleTemplates = templatesExpanded
    ? [noTemplate, ...designTemplates]
    : [noTemplate, ...designTemplates.slice(0, INITIAL_TEMPLATE_COUNT - 1)];
  const visibleFrames = framesExpanded
    ? frameOptions
    : frameOptions.slice(0, INITIAL_FRAME_COUNT);

  function applyTemplate(template: QrDesignTemplate) {
    if (template.id === noTemplate.id) { onReset(); return; }
    if (template.design.premiumTemplateId && !pro) { onRequestPro?.(); return; }
    onDesignChange({ ...template.design, premiumTemplateId: template.design.premiumTemplateId ?? null, logoDataUrl: pro ? design.logoDataUrl : null, logoSize: pro ? design.logoSize : 16 });
    if (pro) onErrorCorrectionChange(template.errorCorrection);
  }

  return (
    <div className="generator-customize">
      <div className="qr-mode-choices" role="group" aria-label={t("QR style")}>
        <button type="button" className="qr-mode-choice" aria-pressed={activeTab !== "logo" && !design.logoDataUrl}
          onClick={() => { if (design.logoDataUrl) removeLogo(); setActiveTab("frames"); }}>
          <span className="qr-mode-indicator" aria-hidden="true" />
          <strong><T text="Classic QR" /></strong>
          <span className="qr-mode-thumbnails" aria-hidden="true">
            {designTemplates.slice(0, 3).map(template => <span key={template.id} className="qr-mode-thumbnail" style={previewsReady ? { backgroundImage: getTemplatePreview(template) } : undefined} />)}
          </span>
        </button>
        <button type="button" className="qr-mode-choice qr-mode-logo" aria-pressed={activeTab === "logo" || Boolean(design.logoDataUrl)}
          onClick={() => { if (!pro) { onRequestPro?.(); return; } setActiveTab("logo"); }}>
          <span className="qr-mode-indicator" aria-hidden="true" />
          <strong><T text="Logo QR" /></strong><span className="qr-mode-badge"><ProBadge /></span>
          <span className="qr-mode-thumbnails" aria-hidden="true">
            <span className="qr-mode-thumbnail qr-mode-brand"><NextImage src="/images/brand/google-g.svg" width={24} height={24} alt="" /></span>
            <span className="qr-mode-thumbnail qr-mode-brand qr-mode-instagram"><QrTypeIcon type="instagram" /></span>
            <span className="qr-mode-thumbnail qr-mode-brand qr-mode-youtube"><QrTypeIcon type="youtube" /></span>
          </span>
        </button>
      </div>
      <div className="customization-toolbar">
        <div
          aria-label={t("QR customization sections")}
          className="customization-tabs"
          ref={tabListRef}
          role="tablist"
        >
          {customizationTabs.map((tab) => (
            <button
              aria-controls={`customize-panel-${tab.value}`}
              aria-selected={activeTab === tab.value}
              className={activeTab === tab.value ? "active" : undefined}
              id={`customize-tab-${tab.value}`}
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              onKeyDown={handleTabKeyDown}
              role="tab"
              tabIndex={activeTab === tab.value ? 0 : -1}
              type="button"
            >
              <T text={tab.label} />
              {tab.value !== "frames" ? <ProBadge /> : null}
            </button>
          ))}
        </div>
        <button className="reset-design-button" onClick={resetDesign} type="button"><T text="Reset design" /></button>
      </div>

      {activeTab === "frames" ? (
        <div
          aria-labelledby="customize-tab-frames"
          className="customization-panel"
          id="customize-panel-frames"
          role="tabpanel"
        >
          <section className="editor-section">
            <div className="editor-section-heading">
              <div>
                <h3><T text="Free templates" /></h3>
                <p><T text="All 20 original designs stay free. Choose a design and download a basic PNG." /></p>
              </div>
              <span>{designTemplates.length}{" "}<T text="designs" /></span>
            </div>
            <div className="design-template-gallery design-library-grid">
              {visibleTemplates.map((template) => {
                const active = isTemplateActive(design, template);
                return (
                  <div key={template.id}>
                  <button
                    style={{ width: "100%" }}
                    aria-pressed={active}
                    className={active ? "design-gallery-card active" : "design-gallery-card"}
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="design-gallery-preview"
                      style={
                        previewsReady
                          ? { backgroundImage: getTemplatePreview(template) }
                          : undefined
                      }
                    />
                    <span className="design-gallery-copy">
                      <strong><T text={template.name} /></strong>
                      <small><T text={template.description} /></small>
                    </span>
                  </button>
                  {template.id !== noTemplate.id ? <button className="text-button" type="button" aria-label={t("Preview {name}", { name: t(template.name) })} onClick={() => setStylePreview({ name: template.name, image: getTemplatePreview(template), free: true })}><T text="Preview" /></button> : null}
                  </div>
                );
              })}
            </div>
            <button
              aria-expanded={templatesExpanded}
              className="library-expand-button"
              onClick={() => setTemplatesExpanded((current) => !current)}
              type="button"
            >
              {templatesExpanded
                ? t("Show fewer templates")
                : t("View all {count} templates", { count: designTemplates.length })}
            </button>
          </section>

          <section className="editor-section premium-template-section" aria-label="New Pro templates">
            <div className="editor-section-heading">
              <div><h3><T text="New Pro templates" /> <ProBadge /></h3><p>Reference-based artwork. Preview each design; Pro unlocks applying and exporting.</p></div>
              <span>{premiumTemplates.length} <T text="designs" /></span>
            </div>
            <div className="design-template-gallery design-library-grid">
              {(premiumExpanded ? premiumTemplates : premiumTemplates.slice(0, 8)).map((template) => (
                <div key={template.id}>
                  <button type="button" style={{ width: "100%" }} className={isTemplateActive(design, template) ? "design-gallery-card active" : "design-gallery-card"} aria-pressed={isTemplateActive(design, template)} onClick={() => applyTemplate(template)}>
                    <span aria-hidden="true" className="design-gallery-preview" style={previewsReady ? { backgroundImage: getTemplatePreview(template) } : undefined} />
                    <span className="premium-template-badge"><ProBadge /></span>
                    <span className="design-gallery-copy"><strong><T text={template.name} /></strong><small><T text={template.description} /></small></span>
                  </button>
                  <button type="button" className="text-button" aria-label={t("Preview {name}", { name: template.name })} onClick={() => setStylePreview({ name: template.name, image: getTemplatePreview(template) })}><T text="Preview" /></button>
                </div>
              ))}
            </div>
            <button type="button" className="library-expand-button" aria-expanded={premiumExpanded} onClick={() => setPremiumExpanded((value) => !value)}>{premiumExpanded ? <T text="Show fewer Pro templates" /> : <T text="View all {count} Pro templates" values={{ count: premiumTemplates.length }} />}</button>
          </section>

          <section className="editor-section">
            <div className="editor-section-heading">
              <div>
                <h3><T text="Standard frames" />{" "}<ProBadge /></h3>
                <p><T text="Choose a distinct structure, then customize its call to action." /></p>
              </div>
              <span>{frameOptions.length}{" "}<T text="styles" /></span>
            </div>
            <div className="frame-gallery design-library-grid">
              {visibleFrames.map((option) => (
                <div key={option.value}>
                <button
                  style={{ width: "100%" }}
                  aria-pressed={design.frame === option.value}
                  className={design.frame === option.value ? "frame-gallery-card active" : "frame-gallery-card"}
                  key={option.value}
                  onClick={() => onDesignChange({ frame: option.value })}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="frame-gallery-preview"
                    style={
                      previewsReady
                        ? { backgroundImage: getFramePreview(option) }
                        : undefined
                    }
                  />
                  <span><T text={option.label} />{option.value !== "none" ? <ProBadge /> : null}</span>
                </button>
                {option.value !== "none" ? <button className="text-button" type="button" aria-label={t("Preview {name} frame", { name: t(option.label) })} onClick={() => setStylePreview({ name: option.label, image: getFramePreview(option) })}><T text="Preview" /></button> : null}
                </div>
              ))}
            </div>
            <button
              aria-expanded={framesExpanded}
              className="library-expand-button"
              onClick={() => setFramesExpanded((current) => !current)}
              type="button"
            >
              {framesExpanded
                ? t("Show fewer frames")
                : t("View all {count} frames", { count: frameOptions.length })}
            </button>
          </section>

          <section className="editor-section frame-background-section">
            <div className="editor-section-heading">
              <div>
                <h3><T text="Frame background" />{" "}<ProBadge /></h3>
                <p><T text="The QR quiet zone remains solid for reliable scanning." /></p>
              </div>
            </div>
            <div className="color-controls frame-color-controls">
              <ColorControl
                ariaLabel="Frame background color"
                disabled={pro && (design.frame === "none" || design.frameTransparent)}
                label="Background"
                onChange={(value) => onDesignChange({ frameBackground: value })}
                value={design.frameBackground}
              />
              <ColorControl
                ariaLabel="Frame accent color"
                disabled={pro && design.frame === "none"}
                label="Frame"
                onChange={(value) => onDesignChange({ frameColor: value })}
                value={design.frameColor}
              />
              <ColorControl
                ariaLabel="Frame text color"
                disabled={pro && design.frame === "none"}
                label="Frame text"
                onChange={(value) => onDesignChange({ frameTextColor: value })}
                value={design.frameTextColor}
              />
            </div>
            <label className="generator-field frame-label-field">
              <span className="generator-label"><T text="Call-to-action text" /></span>
              <input
                disabled={pro && design.frame === "none"}
                maxLength={32}
                onChange={(event) =>
                  onDesignChange({ frameLabel: event.target.value || null })
                }
                placeholder={t("Use the frame default")}
                type="text"
                value={design.frameLabel ?? ""}
              />
              <small><T text="Up to 32 characters. Leave blank to use the frame label." /></small>
            </label>
            <label className="generator-checkbox frame-transparency-toggle">
              <input
                checked={design.frameTransparent}
                disabled={pro && design.frame === "none"}
                onChange={(event) =>
                  onDesignChange({ frameTransparent: event.target.checked })
                }
                type="checkbox"
              /><T text="Transparent outer frame background" /></label>
            {design.frame === "none" ? (
              <p className="editor-setting-note"><T text="Choose a frame to enable its background controls." /></p>
            ) : null}
          </section>
        </div>
      ) : null}

      {activeTab === "shapes" ? (
        <div
          aria-labelledby="customize-tab-shapes"
          className="customization-panel"
          id="customize-panel-shapes"
          role="tabpanel"
        >
          <section className="editor-section">
            <div className="editor-section-heading">
              <div>
                <h3><T text="QR patterns" />{" "}<ProBadge /></h3>
                <p><T text="Style the modules and corners without changing the encoded content." /></p>
              </div>
            </div>
            <div className="design-style-grid">
              <fieldset className="design-fieldset">
                <legend><T text="QR body pattern" /></legend>
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
                      <T text={option.label} />
                      {option.value !== "square" ? <ProBadge /> : null}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="design-fieldset">
                <legend><T text="Outer Eye" /></legend>
                <div className="design-choice-grid eye-choices">
                  {outerEyeStyleOptions.map((option) => (
                    <button
                      aria-pressed={design.outerEyeStyle === option.value}
                      className={design.outerEyeStyle === option.value ? "active" : undefined}
                      key={option.value}
                      onClick={() => onDesignChange({ outerEyeStyle: option.value })}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="eye-swatch"
                        data-eye-style={option.value}
                      />
                      <T text={option.label} />
                      {option.value !== "square" ? <ProBadge /> : null}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="design-fieldset">
                <legend><T text="Inner Eye" /></legend>
                <div className="design-choice-grid eye-choices">
                  {innerEyeStyleOptions.map((option) => (
                    <button
                      aria-pressed={design.innerEyeStyle === option.value}
                      className={design.innerEyeStyle === option.value ? "active" : undefined}
                      key={option.value}
                      onClick={() => onDesignChange({ innerEyeStyle: option.value })}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="inner-eye-swatch"
                        data-eye-style={option.value}
                      />
                      <T text={option.label} />
                      {option.value !== "square" ? <ProBadge /> : null}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          <section className="editor-section color-fieldset">
            <div className="editor-section-heading">
              <div>
                <h3><T text="QR colors" />{" "}<ProBadge /></h3>
                <p><T text="Use a dark foreground and a light background for dependable scanning." /></p>
              </div>
              <button
                className="text-button"
                onClick={() =>
                  onDesignChange({
                    background: defaultDesign.background,
                    foreground: defaultDesign.foreground,
                    gradientColor: null,
                    innerEyeColor: defaultDesign.innerEyeColor,
                    outerEyeColor: defaultDesign.outerEyeColor,
                  })
                }
                type="button"
              ><T text="Reset colors" /></button>
            </div>
            <div className="color-controls">
              <ColorControl
                ariaLabel="QR foreground color"
                label="Foreground"
                onChange={(value) =>
                  onDesignChange({
                    foreground: value,
                    innerEyeColor:
                      design.innerEyeColor === design.foreground
                        ? value
                        : design.innerEyeColor,
                    outerEyeColor:
                      design.outerEyeColor === design.foreground
                        ? value
                        : design.outerEyeColor,
                  })
                }
                value={design.foreground}
              />
              <ColorControl
                ariaLabel="QR background color"
                label="Background"
                onChange={(value) => onDesignChange({ background: value })}
                value={design.background}
              />
              <ColorControl
                ariaLabel="Outer eye color"
                label="Outer Eye"
                onChange={(value) => onDesignChange({ outerEyeColor: value })}
                value={design.outerEyeColor}
              />
              <ColorControl
                ariaLabel="Inner eye color"
                label="Inner Eye"
                onChange={(value) => onDesignChange({ innerEyeColor: value })}
                value={design.innerEyeColor}
              />
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
                /><T text="Foreground gradient" /></label>
              {design.gradientColor || !pro ? (
                <div className="gradient-color-field">
                  <ColorControl
                    ariaLabel="QR gradient end color"
                    label="Gradient end"
                    onChange={(value) => onDesignChange({ gradientColor: value })}
                    value={design.gradientColor ?? "#287a54"}
                  />
                </div>
              ) : null}
            </div>
            <div className={hasContrastWarning ? "contrast-status warning" : "contrast-status"}>
              <span aria-hidden="true">{hasContrastWarning ? "!" : "✓"}</span>
              <div>
                <strong><T text={hasContrastWarning ? "Improve color contrast" : "Scan-safe contrast"} /></strong>
                <p>
                  <T text={hasContrastWarning
                    ? "Increase the difference between foreground and background before downloading."
                    : "Current colors keep the QR modules clearly separated from the background."} />
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {activeTab === "logo" ? (
        <div
          aria-labelledby="customize-tab-logo"
          className="customization-panel"
          id="customize-panel-logo"
          role="tabpanel"
        >
          <section className="editor-section logo-controls">
            <div className="editor-section-heading">
              <div>
                <h3><T text="Logo in center" />{" "}<ProBadge /></h3>
                <p><T text="Converted in your browser, securely rendered in a protected center cutout, and not stored." /></p>
              </div>
              <span><T text="Local only" /></span>
            </div>
            <input
              accept="image/*"
              className="visually-hidden"
              onChange={(event) => void handleLogo(event.target.files?.[0])}
              ref={inputRef}
              type="file"
            />
            <div className="logo-editor">
              <div className={design.logoDataUrl ? "logo-preview large" : "logo-preview large empty"}>
                {design.logoDataUrl ? (
                  <NextImage
                    alt="Uploaded logo preview"
                    height={96}
                    src={design.logoDataUrl}
                    unoptimized
                    width={96}
                  />
                ) : (
                  <span aria-hidden="true">+</span>
                )}
              </div>
              <div className="logo-editor-copy">
                <strong><T text={design.logoDataUrl ? "Logo ready" : "Add your logo"} /></strong>
                <p><T text="PNG, JPEG, WebP, or another browser-readable image up to 5 MB." /></p>
                <div className="logo-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => { if (!pro) { onRequestPro?.(); return; } inputRef.current?.click(); }}
                    type="button"
                  >
                    <T text={design.logoDataUrl ? "Replace logo" : "Upload logo"} />
                    <ProBadge />
                  </button>
                  {design.logoDataUrl ? (
                    <button className="text-button" onClick={removeLogo} type="button"><T text="Remove logo" /></button>
                  ) : null}
                </div>
                {logoName ? <span className="logo-file-name" title={logoName}>{logoName}</span> : null}
              </div>
            </div>
            {uploadError ? <p className="customize-error"><T text={uploadError} /></p> : null}
            {design.logoDataUrl || !pro ? (
              <label className="logo-size-field editor-setting-card">
                <span>
                  <span className="generator-label"><T text="Logo size" /></span>
                  <ProBadge />
                  <output>{design.logoSize}%</output>
                </span>
                <input
                  max="18"
                  min="10"
                  onChange={(event) =>
                    onDesignChange({ logoSize: Number(event.target.value) })
                  }
                  type="range"
                  value={design.logoSize}
                />
                <small><T text="High error correction is applied automatically for safer scanning." /></small>
              </label>
            ) : null}
          </section>
        </div>
      ) : null}

      {activeTab === "level" ? (
        <div
          aria-labelledby="customize-tab-level"
          className="customization-panel"
          id="customize-panel-level"
          role="tabpanel"
        >
          <section className="editor-section">
            <div className="editor-section-heading">
              <div>
                <h3><T text="Error correction level" />{" "}<ProBadge /></h3>
                <p><T text="Higher levels recover from more damage but create a denser code." /></p>
              </div>
            </div>
            <label className="generator-field correction-field">
              <span className="generator-label"><T text="Correction level" /></span>
              <select
                disabled={Boolean(design.logoDataUrl)}
                onChange={(event) =>
                  onErrorCorrectionChange(event.target.value as ErrorCorrectionLevel)
                }
                value={effectiveLevel}
              >
                {correctionLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    <T text={level.label} /><T text={level.value !== "M" ? " · PRO" : ""} />
                  </option>
                ))}
              </select>
            </label>
            <div className="correction-level-list">
              {correctionLevels.map((level) => (
                <div
                  className={effectiveLevel === level.value ? "active" : undefined}
                  key={level.value}
                >
                  <span>{level.value}</span>
                  <div>
                    <strong><T text={level.label} /></strong>
                    <p><T text={level.description} /></p>
                  </div>
                </div>
              ))}
            </div>
            {design.logoDataUrl ? (
              <p className="editor-setting-note"><T text="High correction is locked while a logo is present to protect scan reliability." /></p>
            ) : null}
          </section>
        </div>
      ) : null}

      {warnings.length ? (
        <ul className="design-warnings" aria-label={t("QR design warnings")}>
          {warnings.map((warning) => (
            <li key={warning}><T text={warning} /></li>
          ))}
        </ul>
      ) : null}
      {stylePreview ? <StylePreview name={stylePreview.name} image={stylePreview.image} pro={pro || Boolean(stylePreview.free)} free={Boolean(stylePreview.free)}
        onClose={() => setStylePreview(null)} onUpgrade={() => { setStylePreview(null); onRequestPro?.(); }} /> : null}
    </div>
  );
}

function StylePreview({ name, image, pro, free, onClose, onUpgrade }: {
  name: string; image: string; pro: boolean; free: boolean; onClose: () => void; onUpgrade: () => void;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} onCancel={onClose} aria-labelledby="style-preview-title"
    style={{ border: "1px solid var(--line)", borderRadius: 24, padding: 24, color: "var(--ink)", background: "var(--surface)", maxWidth: "calc(100vw - 32px)" }}>
    <h2 id="style-preview-title"><T text={name} /> {!free ? <ProBadge /> : null}</h2>
    <div role="img" aria-label={t("{name} sample design preview", { name: t(name) })} style={{ width: "min(65vw, 360px)", height: "min(65vw, 360px)", backgroundImage: image, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "contain", margin: "16px auto" }} />
    <p><T text="Sample style preview. Your QR content stays unchanged." /></p>
    {!pro ? <button className="button button-primary" type="button" onClick={onUpgrade} style={{ marginTop: 16 }}><T text="Unlock Pro to apply" /></button> : null}
    <button className="button button-secondary" type="button" onClick={onClose} style={{ marginTop: 12, marginLeft: 8 }}><T text="Close preview" /></button>
  </dialog>;
}
