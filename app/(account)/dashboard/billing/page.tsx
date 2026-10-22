import { AccountStatus } from "@/components/i18n/account-status";
import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { dashboardAccount } from "@/lib/account/dashboard";
import { getPayPalClient } from "@/lib/paypal/server";
import { SubscriptionCard } from "@/components/account/subscription-card";
import { StorageCard } from "@/components/account/storage-card";
import { BillingPlans } from "@/components/account/billing-plans";
import { DashboardIcon } from "@/components/account/dashboard-icon";
import styles from "@/components/account/dashboard.module.css";
export const metadata = { title: "Payment & Subscription" };
export default async function BillingPage() {
  const account = await dashboardAccount();
  let payments: Awaited<ReturnType<ReturnType<typeof getPayPalClient>["getRecentTransactions"]>> = [];
  let historyUnavailable = false;
  // This ID comes only from this authenticated user's RLS-scoped query, never URL/client input.
  if (account.subscription) {
    try { payments = await getPayPalClient().getRecentTransactions(account.subscription.id); }
    catch { historyUnavailable = true; }
  }
  const manageUrl = process.env.PAYPAL_ENV === "sandbox" ? "https://www.sandbox.paypal.com/myaccount/autopay/" : "https://www.paypal.com/myaccount/autopay/";
  return <>
    <div className={styles.pageHeading}><p className={styles.eyebrow}><T text="Your plan, at a glance" /></p><h1><T text="Payment & Subscription" /></h1><p><T text="See your membership, explore your options, and keep billing in view." /></p></div>
    <SubscriptionCard {...account} /><StorageCard /><BillingPlans pro={account.access.pro} />
    <section className={styles.card} aria-labelledby="payment-history"><div className={styles.cardHeader}><h2 id="payment-history"><T text="Payment history" /></h2>{account.subscription ? <a href={manageUrl} target="_blank" rel="noopener noreferrer"><T text="Manage in PayPal ↗" /></a> : <span className={styles.muted}><T text="USD billing" /></span>}</div>
      {payments.length ? <><p className={styles.muted}><T text="PayPal transactions for your current or latest linked subscription, from the last 30 days. These are payment records, not Qraftt invoices." /></p><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th scope="col"><T text="Date" /></th><th scope="col"><T text="Transaction" /></th><th scope="col"><T text="Amount" /></th><th scope="col"><T text="Status" /></th></tr></thead><tbody>{payments.map(payment => <tr key={payment.id}><td>{new Date(payment.time).toLocaleDateString("en-US", { timeZone: "UTC" })}</td><td>{payment.id}</td><td>{new Intl.NumberFormat("en-US", { style: "currency", currency: payment.currency }).format(Number(payment.amount))}</td><td><AccountStatus status={payment.status} /></td></tr>)}</tbody></table></div></> : <div className={styles.empty}><div className={styles.emptyIcon}><DashboardIcon name="billing" /></div><h3><T text={historyUnavailable ? "Payment history is temporarily unavailable" : "No payment records to display"} /></h3><p><T text={historyUnavailable ? "We couldn’t retrieve your recent payments from PayPal. Your plan has not changed. Check PayPal directly or try again later." : account.subscription ? "There are no PayPal transactions to display for this linked subscription in the last 30 days." : "Payments will appear here after a subscription is securely linked to this account. If you already approved a payment, finish linking it in the original checkout browser. Do not pay again."} /></p>{!account.subscription ? <div className={styles.actions}><Link className={styles.textLink} href="/pricing?paypal=approved"><T text="Check an existing checkout →" /></Link></div> : null}</div>}
    </section>
    <p className={styles.muted}><T text="Billing status is verified server-side. To change a payment method or cancel renewal, use PayPal." />{" "}<Link className={styles.textLink} href="/dashboard/support"><T text="Need a hand?" /></Link></p>
  </>;
}
