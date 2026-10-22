import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { pricingPlans } from "@/lib/pricing/plans";
import { formatDisplayPrice } from "@/lib/pricing/currencies";
import { checkoutReturnPath } from "@/lib/pricing/checkout";
import styles from "./dashboard.module.css";
export function BillingPlans({ pro }: { pro: boolean }) {
  return <section className={styles.card} aria-labelledby="billing-plans">
    <div className={styles.cardHeader}><h2 id="billing-plans"><T text="Plans" /></h2><div className={styles.period} role="group" aria-label="Billing period"><button type="button" aria-pressed="true"><T text="Monthly" /></button><button type="button" disabled title="Yearly checkout is not available"><T text="Yearly · unavailable" /></button></div></div>
    <div className={styles.planGrid}>{pricingPlans.map(plan => {
      const current = (plan.id === "pro") === pro;
      return <article key={plan.id} className={styles.planCard} data-current={current}>
        <span className={styles.pill}><T text={current ? "Your current plan" : plan.id === "pro" ? "More creative freedom" : "Free to create"} /></span>
        <h3>{plan.name}</h3><p className={styles.planPrice}>{formatDisplayPrice(plan.prices.monthly, "USD")} <span><T text="/ month · USD" /></span></p>
        <ul>{(plan.id === "free" ? ["All 30 QR content types", String(plan.benefits.templates), "Black-and-white live preview", "Basic 512px PNG export", "3 PNG downloads per day"] : ["Everything in Free", String(plan.benefits.templates), "Add your logo", "Custom colors & gradients", "Frames", "Patterns, shapes and custom eyes", "SVG and high-resolution export", "Unlimited downloads"]).map(item => <li key={item}><T text={item} /></li>)}</ul>
        {current ? <button type="button" className="button button-secondary" disabled><T text="Current plan" /></button> : plan.id === "pro" ? <Link href={checkoutReturnPath("monthly")} className="button button-primary"><T text="Upgrade to Pro" /></Link> : <Link href="/qr-code-generator" className="button button-secondary"><T text="Use free tools" /></Link>}
      </article>;
    })}</div><p className={styles.muted} style={{ marginTop: "1rem" }}><T text="Pro renews monthly until cancelled. Manage an existing subscription in PayPal. Yearly checkout is not available." /></p>
  </section>;
}
