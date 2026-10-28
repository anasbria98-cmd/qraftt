import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dashboardAccount } from "@/lib/account/dashboard";
import { DashboardIcon } from "@/components/account/dashboard-icon";
import styles from "@/components/account/dashboard.module.css";

const futureSections: Record<string, { title: string; icon: string; description: string; detail: string }> = {
  statistics: { title: "Statistics", icon: "statistics", description: "No scan reports to display.", detail: "Qraftt’s static codes encode content directly. They do not send scan activity to Qraftt, so no personal scan analytics are collected or available here." },
  import: { title: "Import from CSV", icon: "import", description: "Bulk creation is not available yet.", detail: "CSV import and bulk QR generation are not implemented. You can still create a code for each destination using the existing generator." },
  archive: { title: "Archived QR Codes", icon: "archive", description: "Archiving is not available yet.", detail: "Manage your saved designs in My QR Codes. A separate archive feature is not implemented." },
  domains: { title: "Custom Domain", icon: "domain", description: "Your links already go straight to their destination.", detail: "Custom-domain management is not available. Downloaded static codes do not rely on a Qraftt redirect or a managed short-link domain." },
  api: { title: "API Integration", icon: "api", description: "Create directly in your browser for now.", detail: "A public developer API and API keys are not available. No integrations or credentials have been created for your account." },
};
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return { title: futureSections[section]?.title ?? (section === "faq" ? "Account FAQ" : section === "support" ? "Account support" : "Your workspace") };
}
export default async function WorkspaceSection({ params }: { params: Promise<{ section: string }> }) {
  await dashboardAccount();
  const { section } = await params;
  if (section === "support") return <><div className={styles.pageHeading}><p className={styles.eyebrow}><T text="A real person, a clear next step" /></p><h1><T text="How can we help?" /></h1><p><T text="Questions about your account, a download, or a payment? Get in touch." /></p></div><section className={styles.card}><div className={styles.empty}><div className={styles.emptyIcon}><DashboardIcon name="support" /></div><h2><T text="Contact Qraftt support" /></h2><p><T text="Email support@qraftt.com with a short description of what happened. For billing questions, include the subscription or transaction ID if you have it. Never send passwords, full card details, or login codes." /></p><div className={styles.actions}><a className="button button-primary" href="mailto:support@qraftt.com"><T text="Email support@qraftt.com" /></a><Link className={styles.textLink} href="/dashboard/faq"><T text="Read the FAQ →" /></Link></div></div></section></>;
  if (section === "faq") return <><div className={styles.pageHeading}><p className={styles.eyebrow}><T text="The essentials" /></p><h1><T text="Account FAQ" /></h1><p><T text="Quick answers about your account, downloads and storage." /></p></div><section className={`${styles.card} ${styles.faq}`}>
    <details><summary><T text="What stays free?" /></summary><p><T text="All 30 QR types, every template and frame, Logo QR, advanced styling, all five export formats, high resolution and unlimited downloads. No account is required to create or export." /></p></details>
    <details><summary><T text="Do I need a subscription?" /></summary><p><T text="No. Every feature is free, and subscription status is never used for access." /></p></details>
    <details><summary><T text="How do I manage renewal or my payment method?" /></summary><p><T text="Use the subscription’s automatic-payment settings in your PayPal account. Qraftt no longer sells subscriptions and does not automatically cancel historical agreements. Your access remains free regardless of their status." /></p></details>
    <details><summary><T text="Where are my saved QR codes and scan statistics?" /></summary><p><T text="Designs saved explicitly from the generator appear in My QR Codes. Every account includes 100 saved codes and 250 MB. Delete old saved designs to free space when a limit is reached. Static codes do not report scans to Qraftt, so there are no scan statistics in this workspace." /></p></details>
    <details><summary><T text="How do I reset my password?" /></summary><p><T text="Use Forgot password and open the email link in the same browser. Set your new password, then log in. Your saved designs remain in your account." /></p><Link className={styles.textLink} href="/forgot-password"><T text="Request a reset link →" /></Link></details>
  </section></>;
  const item = futureSections[section];
  if (!item) notFound();
  return <><div className={styles.pageHeading}><p className={styles.eyebrow}><T text="Your workspace" /></p><h1><T text={item.title} /></h1><p><T text={item.description} /></p></div><section className={styles.card}><div className={styles.empty}><div className={styles.emptyIcon}><DashboardIcon name={item.icon} /></div><span className={styles.pill}><T text="Coming soon · not available on any plan" /></span><h2><T text="A clear view of what’s available" /></h2><p><T text={item.detail} /></p><div className={styles.actions}><Link className="button button-primary" href="/qr-code-generator"><T text="Create a QR code" /></Link><Link className={styles.textLink} href="/dashboard"><T text="Back to dashboard" /></Link></div></div></section></>;
}
