import Image from "next/image";
import Link from "next/link";
import { T } from "@/components/i18n/language-provider";
import { savedQr, type SavedDocument, type SavedSummary } from "@/lib/account/saved-qr";
import { buildQrPayload } from "@/lib/qr/payloads";
import { renderQrSvg } from "@/lib/qr/render";
import { designCorrection } from "@/lib/qr/access";
import { premiumTemplate } from "@/lib/qr/premium-templates";
import type { QrFormValues } from "@/lib/qr/types";
import { DashboardIcon } from "./dashboard-icon";
import styles from "./dashboard.module.css";

/** Read-only account overview. Reuses the authenticated storage service and editor. */
export async function RecentQrCodes() {
  let items: SavedSummary[] | null = null;
  try { items = (await savedQr("list") as SavedSummary[]).slice().sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 3); } catch { /* Unavailable is not an empty library. */ }
  const previews = await Promise.all((items ?? []).map(async item => {
    try {
      const record = await savedQr("get", { id: item.id }) as { document: SavedDocument };
      const { type, values, design, correction } = record.document;
      const { payload } = buildQrPayload(type, values as QrFormValues);
      if (!payload) return null;
      const source = premiumTemplate(design.premiumTemplateId)?.sourceId;
      const artwork = source ? (await import("@/lib/qr/reference-images")).referenceImages[source]
        : design.uploadedFrameId ? (await import("@/lib/qr/uploaded-frame-image")).uploadedFrameImage(design.uploadedFrameId) : undefined;
      const svg = renderQrSvg(payload, designCorrection(design, correction), design, artwork);
      const png = await (await import("@/lib/qr/exports")).exportQr(svg, "png", 512);
      return `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
    } catch { return null; }
  }));
  return <section className={styles.card} aria-labelledby="recent-qr-title"><div className={styles.cardHeader}><h2 id="recent-qr-title"><T text="Recent QR Codes" /></h2><Link href="/dashboard/my-qr-codes"><T text="View all" /></Link></div>
    {items === null ? <p role="status" className={styles.muted}><T text="Saved QR codes are temporarily unavailable. Please try again later." /></p> : items.length ? <ul className={styles.recentList}>{items.map((item, index) => <li key={item.id}>
      {previews[index] ? <Image alt="" src={previews[index]} unoptimized width={64} height={64} /> : <span className={styles.recentPlaceholder} aria-label="Preview unavailable"><DashboardIcon name="qr" /></span>}
      <div className={styles.recentInfo}><strong translate="no">{item.title}</strong><time dateTime={item.updated_at}><T text="Updated" /> {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(item.updated_at))}</time><Link href={`/qr-code-generator?saved=${encodeURIComponent(item.id)}`}><T text="Edit / download" /></Link></div>
    </li>)}</ul> : <div className={styles.empty}><div className={styles.emptyIcon}><DashboardIcon name="qr" /></div><h3><T text="No saved QR codes yet" /></h3><p><T text="Create a QR code and save it to your dashboard to find it here." /></p><div className={styles.actions}><Link className="button button-primary" href="/qr-code-generator"><T text="Create QR Code" /></Link></div></div>}
  </section>;
}
