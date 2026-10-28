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
    <div className={styles.pageHeading}><p className={styles.eyebrow}><T text="Your creative workspace" /></p><h1>{account.displayName ? `Welcome back, ${account.displayName}.` : "A little space for your next idea."}</h1><p><T text="Create something worth scanning. Your tools and account essentials, all in one place." /></p></div>
    <SubscriptionCard />
    <div className={styles.twoColumns}>
      <section className={styles.card}><h2><T text="Your free toolkit" /></h2><p className={styles.metric}><T text="Unlimited" /></p><p className={styles.muted}><T text="Logos, templates, frames, custom colors and every export format are free to use." /></p><div className={styles.actions}><Link className="button button-primary" href="/qr-code-generator"><T text="Create a QR code" /></Link></div></section>
      <section className={styles.card}><div className={styles.cardHeader}><h2><T text="My QR Codes" /></h2></div><DashboardIcon name="qr" /><p className={styles.muted}><T text="Save, edit and re-download QR codes from your library. Every account includes 100 saved QR codes and 250 MB of storage." /></p><div className={styles.actions}><Link className={styles.textLink} href="/dashboard/my-qr-codes"><T text="Open saved QR codes →" /></Link></div></section>
    </div>
    <section className={styles.card}><div className={styles.cardHeader}><h2><T text="Make yourself at home" /></h2><Link href="/account"><T text="Edit your profile" /></Link></div><p className={styles.muted}><T text="Review your storage, update your display name, or get help with your account. Your downloaded static codes keep their content directly and do not rely on Qraftt redirects." /></p><div className={styles.actions}><Link className="button button-secondary" href="/dashboard/billing"><T text="Account & storage" /></Link><Link className={styles.textLink} href="/dashboard/support"><T text="Get support →" /></Link></div></section>
  </>;
}
