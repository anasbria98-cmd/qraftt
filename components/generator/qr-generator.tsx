"use client";

import { T, useLanguage } from "@/components/i18n/language-provider";
import { useEffect, useMemo, useRef, useState } from "react";
import { GeneratorCustomization } from "@/components/generator/generator-customization";
import { GeneratorFields } from "@/components/generator/generator-fields";
import { QrTypeSelector } from "@/components/generator/qr-type-selector";
import { useEntitlement } from "@/components/billing/use-entitlement";
import { UpgradePrompt } from "@/components/billing/upgrade-prompt";
import upgradeStyles from "@/components/billing/upgrade.module.css";
import Link from "next/link";
import { pricingPlans } from "@/lib/pricing/plans";
import { formatDisplayPrice } from "@/lib/pricing/currencies";
import { freeDesign, validateExportAccess, isFreeDesign, designCorrection } from "@/lib/qr/access";
import {
  defaultDesign,
  getDesignWarnings,
  type QrDesignOptions,
} from "@/lib/qr/design";
import { buildQrPayload } from "@/lib/qr/payloads";
import { qrContentValues } from "@/lib/qr/content-values";
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
type ExportFormat = "png" | "jpg" | "svg" | "pdf" | "eps";

export function QrGenerator({
  catalogFirst = false,
  initialType = "url",
}: QrGeneratorProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<QrType>(initialType);
  const [values, setValues] = useState<QrFormValues>(initialValues);
  const [design, setDesign] = useState<QrDesignOptions>(freeDesign);
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionLevel>("M");
  const [exportSize, setExportSize] = useState<ExportSize>(512);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [engineError, setEngineError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<ExportFormat | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [savedId, setSavedId] = useState<string>();
  const [savedTitle, setSavedTitle] = useState("My QR code");
  const [saveNotice, setSaveNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const { access, refresh } = useEntitlement();
  const [paywall, setPaywall] = useState("");
  const [artwork, setArtwork] = useState<{ svg: string; error: string | null; key: string }>({ svg: "", error: null, key: "" });
  const designAccess = Boolean(access?.pro || access?.templateReview);
  const effectiveDesign = designAccess || isFreeDesign(design) ? design : freeDesign;

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("saved");
    if (!id) return;
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(`/api/account/qr?id=${encodeURIComponent(id)}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (cancelled) return;
        const d = data.document;
        setType(d.type); setValues({ ...initialValues, ...d.values }); setDesign(d.design);
        setErrorCorrection(d.correction); setExportFormat(d.format); setExportSize(d.size);
        setSavedId(data.id); setSavedTitle(data.title); setSaveNotice("Saved design loaded. Edit and save to update it.");
      } catch (error) { if (!cancelled) setSaveNotice(error instanceof Error ? error.message : "Could not load saved QR."); }
    })();
    return () => { cancelled = true; };
  }, []);

  async function saveDesign() {
    if (!access?.pro) { setPaywall("Save and edit QR codes in your dashboard with Pro."); return; }
    setSaving(true); setSaveNotice("");
    try {
      const response = await fetch("/api/account/qr", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: savedId, title: savedTitle, document: { version: 1, type, values: qrContentValues(type, values), design: effectiveDesign, correction: effectiveCorrection, format: exportFormat, size: exportSize } }) });
      const data = await response.json();
      if (!response.ok) { if(data.upgrade) setPaywall(data.error); throw new Error(data.error); }
      setSavedId(data.id); setSaveNotice("Saved to My QR Codes.");
    } catch (error) { setSaveNotice(error instanceof Error ? error.message : "Could not save QR."); }
    finally { setSaving(false); }
  }

  const result = useMemo(() => buildQrPayload(type, values), [type, values]);
  const designSafety = useMemo(() => getDesignWarnings(effectiveDesign), [effectiveDesign]);
  const designError =
    designSafety.minimumContrast < 2.5
      ? "Increase the contrast between the QR foreground and background colors."
      : null;
  const validationError = result.error ?? designError;
  const payload = validationError ? "" : result.payload;
  const effectiveCorrection = designCorrection(effectiveDesign, errorCorrection);
  const previewKey = JSON.stringify([payload, effectiveDesign, effectiveCorrection]);
  const previewReady = artwork.key === previewKey && Boolean(artwork.svg);
  useEffect(() => {
    if (!access || !payload) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/qr/render", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload, design: effectiveDesign, correction: effectiveCorrection, format: "png", size: 512, preview: true }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error((await response.json()).error);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = () => { if (!controller.signal.aborted) setArtwork({ svg: String(reader.result), error: null, key: previewKey }); };
        reader.onerror = () => { if (!controller.signal.aborted) setArtwork({ svg: "", error: "Preview unavailable. Please retry.", key: previewKey }); };
        reader.readAsDataURL(blob);
      } catch (error) {
        if (!controller.signal.aborted) setArtwork({ svg: "", error: error instanceof Error ? error.message : "Preview unavailable.", key: previewKey });
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [access, effectiveDesign, effectiveCorrection, payload, previewKey]);

  useEffect(() => {
    const canvases = [canvasRef.current, mobileCanvasRef.current].filter(
      (canvas): canvas is HTMLCanvasElement => Boolean(canvas),
    );
    if (!canvases.length) return;

    if (!payload || !previewReady) {
      for (const canvas of canvases) {
        canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let active = true;
    Promise.all(
      canvases.map((canvas) => new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => { if (active) { canvas.width = image.naturalWidth; canvas.height = image.naturalHeight; canvas.getContext("2d")?.drawImage(image, 0, 0); } resolve(); };
        image.onerror = reject;
        image.src = artwork.svg;
      })),
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
  }, [artwork.svg, mobilePreviewOpen, payload, previewReady]);

  function updateValue<Key extends keyof QrFormValues>(
    key: Key,
    value: QrFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function downloadSelectedFormat() {
    if (!previewReady || engineError || !payload) return;
    setDownloading(exportFormat);
    try {
      const response = await fetch("/api/qr/render", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload, design: effectiveDesign, correction: effectiveCorrection, format: exportFormat, size: exportSize }),
      });
      if (!response.ok) {
        const data = await response.json();
        if (data.upgrade) { setPaywall(data.error); return; }
        throw new Error(data.error);
      }
      saveBlob(await response.blob(), `qraftt-${type}-qr.${exportFormat}`);
      await refresh();
    } catch {
      setEngineError("Export failed. Please retry.");
    } finally {
      setDownloading(null);
    }
  }


  const currentError = validationError ?? (artwork.key === previewKey ? artwork.error : null) ?? engineError;
  const canDownload = Boolean(payload && previewReady) && !engineError && !downloading;

  return (
    <section
      className={catalogFirst ? "generator-shell generator-home-workflow" : "generator-shell"}
      aria-labelledby="generator-title"
    >
      {catalogFirst ? (
        <h2 className="visually-hidden" id="generator-title"><T text="Create your QR code" /></h2>
      ) : null}
      {!catalogFirst ? (
        <div className="generator-heading">
          <div>
            <p className="generator-kicker"><T text="QR workspace" /></p>
            <h2 id="generator-title"><T text="Create your code" /></h2>
          </div>
          <span className="local-badge"><T text={access?.pro ? "Pro" : "Free"} /></span>
        </div>
      ) : null}

      <QrTypeSelector
        onSelect={setType}
        selectedType={type}
        showSelectedSummary={!catalogFirst}
      />

      {access?.templateReview ? <aside className={upgradeStyles.notice} aria-label="Local template review">
        <div className={upgradeStyles.copy}>
          <strong>LOCAL TEMPLATE REVIEW · Not production</strong>
          <p>All 10 Pro templates, center-logo upload and exports are unlocked for review on this computer only. No payment or account upgrade is needed. Production access rules are unchanged.</p>
        </div>
      </aside> : <aside className={upgradeStyles.notice} aria-label={t("Free and Pro plans")}>
        <div className={upgradeStyles.copy}>
          <strong><T text={access?.pro ? "Qraftt Pro is active" : "Create with Free. Make it yours with Pro."} /></strong>
          <p>{access?.pro ? <T text="Full customization, PNG / JPG / SVG / PDF / EPS and high-resolution exports. Unlimited downloads." /> : <T text="Free includes 20 original templates and basic PNG / JPG. Pro adds premium templates, logos and vector exports from {monthly}/month or {yearly}/year." values={{ monthly: formatDisplayPrice(pricingPlans[1].prices.monthly, "USD"), yearly: formatDisplayPrice(pricingPlans[1].prices.yearly, "USD") }} />}</p>
        </div>
        <div className={upgradeStyles.actions}>
          <Link className={upgradeStyles.compare} href="/pricing"><T text="Compare plans" /></Link>
          {access?.pro ? <Link className="button button-secondary" href="/dashboard"><T text="Your Pro account" /></Link> : <button className="button button-primary" type="button" onClick={() => setPaywall("Unlock new premium templates, center logos and advanced exports with Qraftt Pro.")}><T text="Upgrade to Pro" /></button>}
        </div>
      </aside>}

      <div className="generator-main">
        <div className="generator-controls">
          <div className="generator-stage-heading">
            <span>1</span>
            <div>
              <h3><T text="Add Content" /></h3>
              <p><T text="Enter exactly what the selected QR code should contain." /></p>
            </div>
          </div>

          <GeneratorFields
            error={type === "google-review" ? result.error : currentError}
            onChange={updateValue}
            type={type}
            values={values}
          />

          <div className="generator-stage-heading customization-stage-heading">
            <span>2</span>
            <div>
              <h3><T text="Customize QR" /></h3>
              <p><T text="Apply a template or shape the details while previewing every change." /></p>
            </div>
          </div>

          <aside className={mobilePreviewOpen ? "mobile-preview-dock open" : "mobile-preview-dock"}>
            <button
              aria-expanded={mobilePreviewOpen}
              className="mobile-preview-toggle"
              onClick={() => setMobilePreviewOpen((current) => !current)}
              type="button"
            >
              <span><T text="Live preview" /></span>
              <strong><T text={mobilePreviewOpen ? "Hide" : "View QR"} /></strong>
            </button>
            {mobilePreviewOpen ? (
              <div className="mobile-preview-content">
                <div className="mobile-preview-canvas">
                  <canvas
                    aria-label={t("Compact live {type} QR code preview", { type })}
                    className={!previewReady || engineError ? "is-empty" : undefined}
                    ref={mobileCanvasRef}
                    role="img"
                  />
                  {!previewReady || engineError ? <span><T text="Complete the fields" /></span> : null}
                </div>
                <div>
                  <span>{effectiveCorrection}{" "}<T text="correction" /></span>
                  <button
                    onClick={() => {
                      setMobilePreviewOpen(false);
                      previewPanelRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    type="button"
                  ><T text="Preview & download" /></button>
                </div>
              </div>
            ) : null}
          </aside>

          <GeneratorCustomization
            design={effectiveDesign}
            pro={designAccess}
            onRequestPro={() => setPaywall("Unlock Pro for new premium templates, center logos and advanced customization.")}
            errorCorrection={effectiveCorrection}
            onDesignChange={(updates) => {
              const next = { ...effectiveDesign, ...updates };
              try { validateExportAccess(designAccess, next, "png", 512); }
              catch { setPaywall("Unlock Pro to apply this customization."); return; }
              setDesign(next);
            }}
            onErrorCorrectionChange={(level) => {
              if (!designAccess && level !== "M") { setPaywall("Unlock Pro for advanced error correction."); return; }
              setErrorCorrection(level);
            }}
            onReset={() => {
              setDesign(designAccess ? defaultDesign : freeDesign);
              setErrorCorrection("M");
            }}
            warnings={designSafety.warnings}
          />

          {type !== "google-review" || !result.error ? (
            <div
              aria-live="polite"
              className={currentError ? "generator-message error" : "generator-message"}
              id="generator-validation"
            >
              <T text={currentError ?? "QR preview is ready and updates automatically."} />
            </div>
          ) : null}
        </div>

        <div className="generator-preview-panel" ref={previewPanelRef}>
          <div className="generator-preview-heading">
            <div className="generator-stage-heading preview-stage-heading">
              <span>3</span>
              <div>
                <h3><T text="Generate & download QR" /></h3>
                <small><T text="Every design detail is included in your file." /></small>
              </div>
            </div>
            <span>{effectiveCorrection}{" "}<T text="correction" /></span>
          </div>
          <div className="generator-canvas-wrap">
            <canvas
              aria-label={t("Live {type} QR code preview", { type })}
              className={!previewReady || engineError ? "is-empty" : undefined}
              ref={canvasRef}
              role="img"
            />
            {!previewReady || engineError ? (
              <p><T text="Complete the fields to preview your QR code." /></p>
            ) : null}
          </div>
          <p className="generator-privacy-note"><T text="QR content is sent securely for rendering. It is saved only when you choose Save to dashboard." /></p>
          <div className="generator-download-settings">
            <label className="export-select-field">
              <span><T text="Format" /></span>
              <select
                aria-label={t("Export format")}
                onChange={(event) => {
                  if (["svg", "pdf", "eps"].includes(event.target.value) && !designAccess) { setPaywall("Unlock Pro for SVG, PDF and EPS exports."); return; }
                  setExportFormat(event.target.value as ExportFormat);
                }}
                value={exportFormat}
              >
                <option value="png"><T text="PNG" /></option>
                <option value="jpg"><T text="JPG" /></option>
                <option value="svg"><T text="SVG · PRO" /></option>
                <option value="pdf"><T text="PDF · PRO" /></option>
                <option value="eps"><T text="EPS · PRO" /></option>
              </select>
            </label>
            <label className="export-select-field">
              <span><T text="Size" /></span>
              <select
                aria-label={t("Export resolution")}
                onChange={(event) => {
                  if (Number(event.target.value) > 512 && !designAccess) { setPaywall("Unlock Pro for high-resolution exports."); return; }
                  setExportSize(Number(event.target.value) as ExportSize);
                }}
                value={exportSize}
              >
                {exportSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} × {size}<T text={size > 512 ? " · PRO" : ""} />
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
              ? t("Preparing download…")
              : t("Download {format}", { format: exportFormat.toUpperCase() })}
          </button>
          <p className="generator-export-note">
            {access?.templateReview ? "Local review · unlimited test exports · no real Pro entitlement" : access?.pro ? t("Pro · unlimited downloads") : t("{count} free downloads remaining today (UTC)", { count: access?.remaining ?? 3 })}
          </p>
          <div style={{ display: "grid", gap: ".6rem", marginTop: "1rem" }}>
            <label><T text="Saved QR name" /><input maxLength={100} value={savedTitle} onChange={event => setSavedTitle(event.target.value)} style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 8, padding: ".65rem", marginTop: ".4rem" }} /></label>
            <button className="button button-secondary" type="button" disabled={!canDownload || saving || !savedTitle.trim()} onClick={() => void saveDesign()}><T text={saving ? "Saving…" : savedId ? "Update saved QR" : "Save to dashboard · Pro"} /></button>
            {savedId ? <button type="button" className="button button-secondary" onClick={() => { setSavedId(undefined); setSaveNotice("Next save will create a separate QR code."); }}><T text="Save a separate copy" /></button> : null}
            {saveNotice ? <p role="status">{saveNotice}</p> : null}
          </div>
        </div>
      </div>
      {paywall ? <UpgradePrompt message={paywall} sandboxMonthlyTest={Boolean(access?.sandboxMonthlyTest)} onClose={() => setPaywall("")} /> : null}
    </section>
  );
}
