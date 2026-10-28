import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import styles from "./dashboard.module.css";
export function SubscriptionCard() {
  return <section className={styles.card} aria-labelledby="free-account">
    <div className={styles.cardHeader}><h2 id="free-account"><T text="Your free account" /></h2><span className={styles.pill}><T text="All features included" /></span></div>
    <div className={styles.subscription}><div><span className={styles.planName}><T text="Free" /></span><p><T text="All templates, Logo QR, styling and export formats. Unlimited downloads. Save up to 100 QR codes using 250 MB of storage." /></p></div><Link href="/qr-code-generator" className="button button-primary"><T text="Create a QR code" /></Link></div>
  </section>;
}
