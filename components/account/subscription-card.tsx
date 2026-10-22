import { AccountStatus } from "@/components/i18n/account-status";
import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { checkoutReturnPath } from "@/lib/pricing/checkout";
import styles from "./dashboard.module.css";
export interface AccountSummary {
  access: { pro: boolean; status: string; remaining: number };
  subscription: { id: string; billing_interval: string; current_period_end: string | null } | null;
}
export function SubscriptionCard({ access, subscription }: AccountSummary) {
  return <section className={styles.card} aria-labelledby="current-subscription">
    <div className={styles.cardHeader}><h2 id="current-subscription"><T text="Current Subscription" /></h2><span className={styles.muted}><T text="Your Qraftt membership" /></span></div>
    <div className={styles.subscription}><div><span className={styles.planName}><T text={access.pro ? "Pro" : "Free"} /></span><span className={styles.pill}><AccountStatus status={access.pro ? "ACTIVE" : access.status} /></span><p><T text={access.pro ? "Premium customization and unlimited downloads are unlocked." : "All 30 content types. Simple, reliable sharing."} /></p></div>
      {access.pro ? <Link href="/qr-code-generator" className="button button-primary"><T text="Create with Pro" /></Link> : <Link href={checkoutReturnPath("monthly")} className="button button-primary"><T text="Upgrade to Pro" /></Link>}
    </div>
    {subscription ? <dl className={styles.facts}><div><dt><T text="Billing interval" /></dt><dd><T text={subscription.billing_interval} /></dd></div><div><dt><T text="Subscription ID" /></dt><dd>{subscription.id}</dd></div><div><dt><T text="Next billing date supplied by PayPal" /></dt><dd>{subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString("en-US", { timeZone: "UTC" }) : "Not supplied"}</dd></div></dl> : null}
  </section>;
}
