import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { dashboardAccount } from "@/lib/account/dashboard";
import { StorageCard } from "@/components/account/storage-card";
import { RecentQrCodes } from "@/components/account/recent-qr-codes";
import { DashboardIcon } from "@/components/account/dashboard-icon";
import styles from "@/components/account/dashboard.module.css";
export const metadata = { title: "Your dashboard" };
export default async function DashboardPage() {
  const account = await dashboardAccount();
  return <>
    <div className={styles.pageHeading}><p className={styles.eyebrow}><T text="Your creative workspace" /></p><h1>{account.displayName ? `Welcome back, ${account.displayName}.` : "A little space for your next idea."}</h1><p><T text="Create something worth scanning. Your tools and account essentials, all in one place." /></p></div>
    <StorageCard title="Usage overview" />
    <div className={styles.twoColumns}>
      <section className={styles.card}><div className={styles.cardHeader}><h2><T text="Quick actions" /></h2></div><div className={styles.quickActions}>{([
        ["Create QR Code", "/qr-code-generator", "qr"], ["Open My QR Codes", "/dashboard/my-qr-codes", "dashboard"], ["Account & Storage", "/dashboard/billing", "billing"], ["Profile", "/account", "profile"],
      ] as const).map(([label, href, icon]) => <Link key={href} href={href}><DashboardIcon name={icon} /><T text={label} /></Link>)}</div></section>
      <RecentQrCodes />
    </div>
    <section className={styles.card}><div className={styles.cardHeader}><h2><T text="Make yourself at home" /></h2><Link href="/account"><T text="Edit your profile" /></Link></div><p className={styles.muted}><T text="Review your storage, update your display name, or get help with your account. Your downloaded static codes keep their content directly and do not rely on Qraftt redirects." /></p><div className={styles.actions}><Link className="button button-secondary" href="/dashboard/billing"><T text="Account & storage" /></Link><Link className={styles.textLink} href="/dashboard/support"><T text="Get support →" /></Link></div></section>
  </>;
}
