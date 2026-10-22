import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { dashboardAccount } from "@/lib/account/dashboard";
import { SubscriptionCard } from "@/components/account/subscription-card";
import { DashboardIcon } from "@/components/account/dashboard-icon";
import styles from "@/components/account/dashboard.module.css";
export const metadata = { title: "Your dashboard" };
export default async function DashboardPage() {
  const account = await dashboardAccount();
  return <>
    <div className={styles.pageHeading}><p className={styles.eyebrow}><T text="Your creative workspace" /></p><h1>{account.displayName ? `Welcome back, ${account.displayName}.` : "A little space for your next idea."}</h1><p><T text="Create something worth scanning. Your plan and account essentials, all in one place." /></p></div>
    <SubscriptionCard {...account} />
    <div className={styles.twoColumns}>
      <section className={styles.card}><h2><T text={account.access.pro ? "Your Pro toolkit" : "Today’s free downloads"} /></h2><p className={styles.metric}>{account.access.pro ? "Unlimited" : `${account.access.remaining} / 3`}</p><p className={styles.muted}><T text={account.access.pro ? "Logos, templates, frames, custom colors, SVG and high-resolution exports are ready to use." : "Basic PNG downloads remaining today. Your allowance resets daily at midnight UTC."} /></p><div className={styles.actions}><Link className="button button-primary" href="/qr-code-generator"><T text="Create a QR code" /></Link></div></section>
      <section className={styles.card}><div className={styles.cardHeader}><h2><T text="My QR Codes" /></h2><span className={styles.pill}><T text="Coming soon" /></span></div><DashboardIcon name="qr" /><p className={styles.muted}><T text="A home for saved designs is on the way. For now, keep your exported files on your device; Qraftt does not save a personal QR library." /></p><div className={styles.actions}><Link className={styles.textLink} href="/dashboard/my-qr-codes"><T text="About saved QR codes →" /></Link></div></section>
    </div>
    <section className={styles.card}><div className={styles.cardHeader}><h2><T text="Make yourself at home" /></h2><Link href="/account"><T text="Edit your profile" /></Link></div><p className={styles.muted}><T text="Review your subscription, update your display name, or get help with your account. Your downloaded static codes keep their content directly and do not rely on Qraftt redirects." /></p><div className={styles.actions}><Link className="button button-secondary" href="/dashboard/billing"><T text="Payment & Subscription" /></Link><Link className={styles.textLink} href="/dashboard/support"><T text="Get support →" /></Link></div></section>
  </>;
}
