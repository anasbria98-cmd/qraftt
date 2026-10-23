import { T } from "@/components/i18n/language-provider";
import { savedQr, type SavedUsage } from "@/lib/account/saved-qr";
import styles from "./dashboard.module.css";
export async function StorageCard() {
  let usage: SavedUsage | null = null;
  try { usage = await savedQr("usage") as SavedUsage; } catch { /* Never substitute invented zero usage. */ }
  const bytes = (value: number) => value < 1000 ? `${value} B` : value < 1_000_000 ? `${(value / 1000).toFixed(2)} KB` : value >= 1_000_000_000 ? `${value / 1_000_000_000} GB` : `${(value / 1_000_000).toFixed(2)} MB`;
  return <section className={styles.card} aria-labelledby="storage-title"><div className={styles.cardHeader}><h2 id="storage-title"><T text="Dashboard storage" /></h2></div><div className={styles.storage}>{usage ? <><p>{usage.count} / {usage.savedLimit} <T text="saved QR codes" /></p><progress aria-label="Saved QR storage used" value={usage.bytes} max={Math.max(usage.storageLimit, usage.bytes, 1)} style={{ width: "100%", accentColor: "#16815d" }} /><div className={styles.storageMeta}><span><T text="Used / total" /></span><span>{bytes(usage.bytes)} / {bytes(usage.storageLimit)}</span></div><details><summary><T text="Show details" /></summary><p><T text="Usage measures persisted QR names, content, design settings and embedded logo data. Exported downloads do not use dashboard storage. Free accounts cannot add or edit saved designs. Previously saved designs are retained after downgrade and can be deleted." /></p></details></> : <p role="status"><T text="Storage usage is temporarily unavailable. No estimated usage figures are shown. Please try again later." /></p>}</div></section>;
}
