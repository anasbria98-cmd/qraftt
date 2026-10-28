import { T } from "@/components/i18n/language-provider";
import { authClient, requireUser } from "@/lib/supabase/server";
import { SubscriptionCard } from "@/components/account/subscription-card";
import { StorageCard } from "@/components/account/storage-card";
import styles from "@/components/account/dashboard.module.css";
export const metadata = { title: "Account & storage" };
export default async function BillingPage() {
  const user = await requireUser();
  const client = await authClient();
  // Historical records are read-only and never determine feature access.
  const history = await client.from("subscriptions").select("id,status,billing_interval").eq("user_id", user.id).order("updated_at", { ascending: false });
  return <>
    <div className={styles.pageHeading}><h1><T text="Account & storage" /></h1><p><T text="Every feature is free. Every account has the same safe storage allowance." /></p></div>
    <SubscriptionCard /><StorageCard />
    <section className={styles.card}><h2><T text="Historical payment records" /></h2><p><T text="Qraftt no longer sells subscriptions. Existing PayPal agreements are not automatically cancelled or changed. If you previously subscribed, review automatic payments in your PayPal account to stop any future renewal. Your Qraftt tools remain free either way." /></p>
      <a className={styles.textLink} href="https://www.paypal.com/myaccount/autopay/" target="_blank" rel="noopener noreferrer"><T text="Review historical PayPal agreements ↗" /></a>
      {history.error ? <p role="status"><T text="Historical records are temporarily unavailable. Your free access is unaffected." /></p> : history.data?.length ? <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th><T text="Subscription ID" /></th><th><T text="Status" /></th><th><T text="Historical interval" /></th></tr></thead><tbody>{history.data.map(row => <tr key={row.id}><td>{row.id}</td><td>{row.status}</td><td>{row.billing_interval}</td></tr>)}</tbody></table></div> : null}
    </section>
  </>;
}
