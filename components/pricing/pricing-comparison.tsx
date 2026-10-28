import Link from "next/link";
import { T } from "@/components/i18n/language-provider";
import styles from "./pricing.module.css";

export function PricingComparison({ embedded = false }: { embedded?: boolean }) {
  const Root = embedded ? "section" : "main";
  const Heading = embedded ? "h2" : "h1";
  return <Root className={styles.page} id="pricing"><div className={styles.intro}>
    <Heading><T text="Every QR tool. Completely free." /></Heading>
    <p><T text="No subscriptions, paid tiers or download limits." /></p>
  </div><section className={styles.freeCard} aria-label="Free features">
    <div className={styles.cardHead}><h2><T text="Free" /></h2><div className={styles.price}><strong>$0</strong></div><p><T text="All features included" /></p></div>
    <ul className={styles.rows}>{[
      ["QR content types", "All 30 types"], ["Templates & frames", "Every design included"],
      ["Logo QR", "Upload your own center logo"], ["Colors, gradients, shapes & eyes", "All styling included"],
      ["Export formats", "PNG · JPG · SVG · PDF · EPS"], ["Resolution", "Up to 2000 × 2000"],
      ["Downloads", "Unlimited"], ["Saved QR codes per account", "100"], ["Storage per account", "250 MB"],
    ].map(([label, value]) => <li key={label}><span><T text={label} /></span><strong><T text={value} /></strong></li>)}</ul>
    <div className={styles.cardFoot}><Link className="button button-primary" href="/qr-code-generator"><T text="Create QR Code" /></Link><p><T text="No account needed to create or export. Sign in only to save designs." /></p></div>
  </section><p className={styles.note}><T text="Storage full? Delete old saved QR codes or files to free space. Your existing data is preserved; downloads do not use dashboard storage." /></p></Root>;
}
