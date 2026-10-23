"use client";
import { useState } from "react";
import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { pricingPlans, planBenefits, type BillingPeriod } from "@/lib/pricing/plans";
import { formatDisplayPrice } from "@/lib/pricing/currencies";
import { checkoutReturnPath } from "@/lib/pricing/checkout";
import styles from "./dashboard.module.css";
export function BillingPlans({ pro, interval }: { pro: boolean; interval?: string | null }) {
  const [period, setPeriod] = useState<BillingPeriod>(interval === "yearly" ? "yearly" : "monthly");
  return <section className={styles.card} aria-labelledby="billing-plans">
    <div className={styles.cardHeader}><h2 id="billing-plans"><T text="Plans" /></h2><div className={styles.period} role="group" aria-label="Billing period">{(["monthly", "yearly"] as const).map(value => <button type="button" key={value} aria-pressed={period === value} onClick={() => setPeriod(value)}><T text={value === "monthly" ? "Monthly" : "Yearly"} /></button>)}</div></div>
    <div className={styles.planGrid}>{pricingPlans.map(plan => {
      const current = plan.id === "free" ? !pro : pro && period === (interval ?? "monthly");
      const benefits = planBenefits(plan, period);
      return <article key={plan.id} className={styles.planCard} data-current={current}>
        <span className={styles.pill}><T text={current ? "Your current plan" : plan.id === "pro" ? "More creative freedom" : "Free to create"} /></span>
        <h3>{plan.name}{plan.id === "pro" ? ` ${period === "monthly" ? "Monthly" : "Yearly"}` : ""}</h3><p className={styles.planPrice}>{formatDisplayPrice(plan.prices[period], "USD")} <span><T text={period === "monthly" ? "/ month · USD" : "/ year · USD"} /></span></p>
        <ul>{(plan.id === "free" ? ["All 30 QR content types", String(benefits.templates), "Basic 512px PNG / JPG export", "3 downloads per day"] : ["Everything in Free", String(benefits.templates), "Center logo upload", "Custom colors, gradients, shapes, eyes and frames", "PNG / JPG / SVG / PDF / EPS", "High-resolution exports", "Unlimited downloads", `${benefits.saved} · ${benefits.storage} storage`, "Edit and re-download saved QR codes"]).map(item => <li key={item}><T text={item} /></li>)}</ul>
        {current ? <button type="button" className="button button-secondary" disabled><T text="Current plan" /></button> : plan.id === "pro" ? pro ? <Link href="/dashboard/support" className="button button-secondary"><T text="Contact support to change interval" /></Link> : <Link href={checkoutReturnPath(period)} className="button button-primary"><T text="Upgrade to Pro" /></Link> : <Link href="/qr-code-generator" className="button button-secondary"><T text="Use free tools" /></Link>}
      </article>;
    })}</div><p className={styles.muted} style={{ marginTop: "1rem" }}><T text="Both Pro plans include the same creative tools. Yearly includes higher saved-QR and storage limits. Manage existing renewal in PayPal; do not start a second subscription to change plans." /></p>
  </section>;
}
