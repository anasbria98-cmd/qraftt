import { T } from "@/components/i18n/language-provider";
import { savedQr, type SavedUsage } from "@/lib/account/saved-qr";
import styles from "./dashboard.module.css";
export async function StorageCard({ title = "Dashboard storage" }: { title?: string } = {}) {
  let usage: SavedUsage | null = null;
  try { usage = await savedQr("usage") as SavedUsage; } catch { /* Never substitute invented zero usage. */ }
  const mb = (value: number) => (value / 1_000_000).toLocaleString("en", { maximumFractionDigits: 2 });
  return <section className={styles.card} aria-labelledby="storage-title"><div className={styles.cardHeader}><h2 id="storage-title"><T text={title} /></h2></div><div className={styles.storage}>{usage ? <>
    <div className={styles.usageGrid}>
      <div><div className={styles.usageLabel}><span><T text="Saved QR codes" /></span><strong dir="ltr">{usage.count} / {usage.savedLimit}</strong></div><progress aria-label="Saved QR codes used" value={usage.count} max={usage.savedLimit} /><p className={styles.muted}>{Math.max(0, usage.savedLimit - usage.count)} <T text="QR codes remaining" /></p></div>
      <div><div className={styles.usageLabel}><span><T text="Storage used" /></span><strong dir="ltr">{mb(usage.bytes)} MB / {mb(usage.storageLimit)} MB</strong></div><progress aria-label="Saved QR storage used" value={usage.bytes} max={usage.storageLimit} /><p className={styles.muted}>{mb(Math.max(0, usage.storageLimit - usage.bytes))} MB <T text="remaining" /></p></div>
    </div>
    <details><summary><T text="Show details" /></summary><p><T text="Usage measures persisted QR names, content, design settings and embedded logo data. Exported downloads do not use dashboard storage. Every account can save 100 QR codes using up to 250 MB. Delete old saved QR codes to free space. Existing data is preserved, including accounts already above these limits." /></p></details></> : <p role="status"><T text="Storage usage is temporarily unavailable. No estimated usage figures are shown. Please try again later." /></p>}</div></section>;
}
