import { T } from "@/components/i18n/language-provider";
import styles from "./dashboard.module.css";
export function StorageCard() {
  return <section className={styles.card} aria-labelledby="storage-title"><div className={styles.cardHeader}><h2 id="storage-title"><T text="Storage" /></h2><span className={styles.pill}><T text="Coming soon" /></span></div><div className={styles.storage}><h3><T text="File storage" /></h3><div className={styles.storageTrack} role="img" aria-label="Storage usage unavailable: file storage is not implemented" /><div className={styles.storageMeta}><span><T text="Used / total" /></span><span><T text="Not available yet" /></span></div><details><summary><T text="Show details" /></summary><p><T text="Qraftt currently generates static codes without storing your files or saved designs. No storage quota or measured usage is available. Your downloads stay on your device." /></p></details></div></section>;
}
