"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { pricingBenefits, pricingPlans, type BillingPeriod, type BenefitValue } from "@/lib/pricing/plans";
import { checkoutPeriod } from "@/lib/pricing/checkout";
import styles from "./pricing.module.css";
import { useEntitlement } from "@/components/billing/use-entitlement";
import { displayCurrencies, displayRateDate, formatDisplayPrice, isDisplayCurrency, type DisplayCurrency } from "@/lib/pricing/currencies";
import { T, useLanguage } from "@/components/i18n/language-provider";

const currencyStorageKey = "qraftt_pricing_currency";
const currencyChangeEvent = "qraftt:pricing-currency";
let selectedCurrency: DisplayCurrency = "USD";

function readCurrency(): DisplayCurrency {
  try {
    const stored = window.localStorage.getItem(currencyStorageKey);
    if (isDisplayCurrency(stored)) return stored;
  } catch {
    // Keep the selection in memory when browser storage is unavailable.
  }
  return selectedCurrency;
}

function subscribeCurrency(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(currencyChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(currencyChangeEvent, callback);
  };
}

function saveCurrency(value: string) {
  if (!isDisplayCurrency(value)) return;
  selectedCurrency = value;
  try {
    window.localStorage.setItem(currencyStorageKey, value);
  } catch {
    // The current selection still works without persistent storage.
  }
  window.dispatchEvent(new Event(currencyChangeEvent));
}

function defaultCurrency(): DisplayCurrency { return "USD"; }

function Benefit({ value }: { value: BenefitValue }) {
  if (typeof value === "string") return <span><T text={value} /></span>;
  return (
    <span className={value ? styles.check : styles.dash}>
      <span aria-hidden="true">{value ? "✓" : "—"}</span>
      <span className="visually-hidden"><T text={value ? "Included" : "Not included"} /></span>
    </span>
  );
}

export function PricingComparison({ embedded = false }: { embedded?: boolean }) {
  const { t } = useLanguage();
  const Root = embedded ? "section" : "main";
  const Heading = embedded ? "h2" : "h1";
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const authDialog = useRef<HTMLDialogElement>(null);
  const resumed = useRef(false);
  const { access, refresh } = useEntitlement();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (embedded || params.get("paypal") !== "approved") return;
    const confirm = async () => {
      try {
        const id = params.get("subscription_id") ?? undefined;
        const response = await fetch("/api/paypal/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        const data = await response.json();
        if (response.status === 401 && data.login && data.approved) { authDialog.current?.showModal(); return; }
        if (!response.ok) throw new Error(data.error);
        setNotice(`Subscription ${data.id}: ${data.status}. ${data.pro ? "Pro is unlocked." : "Approval is still pending. Reload to check again."}`);
        await refresh();
        if (data.pro) window.location.assign("/dashboard");
      } catch (error) { setNotice(error instanceof Error ? error.message : "Verification failed."); }
    };
    void confirm();
  }, [embedded, refresh]);
  const upgrade = useCallback(async (interval: BillingPeriod) => {
    setBusy(true);
    setNotice("");
    try {
      await refresh();
      const response = await fetch("/api/paypal/subscriptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ interval }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      window.location.assign(data.approvalUrl);
    } catch (error) { setNotice(error instanceof Error ? error.message : "PayPal checkout failed."); }
    finally { setBusy(false); }
  }, [refresh]);
  useEffect(() => {
    const interval = checkoutPeriod(new URLSearchParams(window.location.search).get("checkout"));
    if (embedded || !interval || resumed.current) return;
    // Consume the explicit return intent once; ordinary pricing visits never start checkout.
    const task = window.setTimeout(() => {
      resumed.current = true;
      window.history.replaceState(null, "", "/pricing");
      if (interval !== "monthly") { setNotice("Yearly checkout is not available. Please choose monthly billing."); return; }
      setPeriod(interval);
      void upgrade(interval);
    }, 0);
    return () => window.clearTimeout(task);
  }, [embedded, upgrade]);
  const currency = useSyncExternalStore(subscribeCurrency, readCurrency, defaultCurrency);
  const sandboxPriceTest = Boolean(access?.sandboxMonthlyTest);
  const formatPrice = (amount: number) => formatDisplayPrice(amount, currency);
  return (
    <Root id={embedded ? "pricing" : "main-content"} aria-labelledby="pricing-heading" className={styles.page}>
      <div className={styles.intro}>
        <p className="eyebrow"><T text="Qraftt pricing" /></p>
        <Heading id="pricing-heading"><T text="Choose the plan that fits your next idea." /></Heading>
        <p><T text="Create for free, or unlock every design option and unlimited downloads with Pro." /></p>
        <span className={styles.preview}><T text="Pro · monthly subscription" /></span>
      </div>
      <div className={styles.controls}>
        <div className={styles.toggle} role="group" aria-label={t("Billing period")}>
          {(["monthly"] as const).map((value) => (
            <button type="button" key={value} aria-pressed={period === value}
              onClick={() => { setPeriod(value); setNotice(""); }}>
              <T text={value === "monthly" ? "Monthly" : "Yearly · save 44%"} />
            </button>
          ))}
        </div>
        <select className={styles.currency} aria-label={t("Display currency")} value={currency}
          onChange={(event) => saveCurrency(event.target.value)}>
          {displayCurrencies.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <p className={styles.disclosure}><T text="Free QR creation for everyone. Pro adds full design control and unlimited downloads." /></p>
      <p className={styles.currencyNote}><T text="PayPal checkout is charged in USD. The monthly subscription renews until cancelled." />{sandboxPriceTest ? <>{" "}<T text="Testing offer: monthly checkout uses the $1/month Sandbox plan, not the displayed final price. Pro pricing is $2/month. No real payments." /></> : null}
        {currency !== "USD" ? <>{" "}<T text="Converted prices are estimates using reference rates dated" />{" "}{displayRateDate}. <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer"><T text="ExchangeRate-API" /></a>.</> : null}
      </p>
      <section className={styles.comparison} aria-label={t("Compare Qraftt plans")}>
        <aside className={styles.benefits}>
          <div className={styles.cardHead}>
            <h2><T text="Plan Benefits" /></h2>
            <p><T text="Compare the details." /><br /><T text="Choose what fits your workflow." /></p>
            <span className={styles.saving}><T text={period === "yearly" ? "Save with yearly billing" : "Flexible monthly billing"} /></span>
          </div>
          <ul className={styles.rows}>
            {pricingBenefits.map((benefit) => <li key={benefit.id}><T text={benefit.label} /></li>)}
          </ul>
          <div className={styles.cardFoot}><p><T text="Every existing QR content type stays usable for free." /></p></div>
        </aside>
        {pricingPlans.map((plan) => (
          <article className={`${styles.card} ${plan.recommended ? styles.recommended : ""}`} key={plan.id} aria-labelledby={`plan-${plan.id}`}>
            {plan.recommended ? <span className={styles.recommendation}><T text="Recommended" /></span> : null}
            <div className={styles.cardHead}>
              <h2 id={`plan-${plan.id}`}><T text={plan.name} /></h2>
              <p><T text={plan.description} /></p>
              <div className={styles.price} aria-live="polite">
                <strong>{formatPrice(plan.prices[period])}</strong>
                <span>/ <T text={period === "monthly" ? "month" : "year"} /></span>
              </div>
              <span className={styles.billing}><T text={plan.id === "free" ? "Free forever · no signup" : period === "monthly" ? "Billed monthly" : "Billed yearly"} /></span>
              {period === "yearly" && plan.id !== "free" ? (
                <span className={styles.annualSaving}><T text="Save" />{" "}{formatPrice(plan.prices.monthly * 12 - plan.prices.yearly)}<T text="/year (" />{Math.round((1 - plan.prices.yearly / (plan.prices.monthly * 12)) * 100)}%)
                </span>
              ) : null}
            </div>
            <ul className={styles.rows}>
              {pricingBenefits.map((benefit) => (
                <li key={benefit.id}>
                  <span className={styles.mobileLabel}><T text={benefit.label} /></span>
                  <span className="visually-hidden"><T text={benefit.label} />: </span>
                  <Benefit value={plan.benefits[benefit.id]} />
                </li>
              ))}
            </ul>
            <div className={styles.cardFoot}>
              {plan.checkout ? (
                <button type="button" className={`button ${plan.recommended ? "button-primary" : "button-secondary"}`}
                  data-plan={plan.checkout.planKey} data-billing-period={period}
                  disabled={busy || Boolean(access?.pro)} onClick={() => void upgrade(period)}>
                  <T text={access?.pro ? "Pro active" : busy ? "Opening PayPal…" : "Upgrade"} />
                </button>
              ) : <Link className="button button-secondary" href="/qr-code-generator"><T text="Get Free" /></Link>}
              <p><T text={plan.id === "free" ? "No account needed" : sandboxPriceTest && period === "monthly" ? "$1/month Sandbox checkout · no real payment" : "Secure PayPal checkout"} /></p>
            </div>
          </article>
        ))}
      </section>
      <p role="status" className={styles.notice}><T text={notice} /></p>
      {notice ? <div className={styles.authActions}>
        <button className="button button-secondary" type="button" onClick={() => window.location.reload()}><T text="Retry verification" /></button>
        <button className="button button-secondary" type="button" onClick={async () => {
          const response = await fetch("/api/paypal/abandon", { method: "POST" }).catch(() => null);
          setNotice(response?.ok ? "Unclaimed checkout cancelled. You may start a new checkout." : "Cancellation failed. Contact support@qraftt.com before paying again.");
        }}><T text="Cancel unclaimed checkout" /></button>
      </div> : null}
      {access?.pro ? <p className={styles.note}><Link className="button button-primary" href="/dashboard"><T text="View your Pro account" /></Link> · <Link href="/qr-code-generator"><T text="Create with Pro" /></Link></p> : null}
      <p className={styles.note}><T text="Downloaded static codes store their content directly. Basic generation and all 30 content types remain free." /></p>
      <nav className={styles.note} aria-label="Account"><Link href="/login?next=/pricing"><T text="Log in" /></Link> · <Link href="/signup"><T text="Sign up" /></Link> · <Link href="/dashboard"><T text="Your dashboard" /></Link></nav>
      <dialog ref={authDialog} className={styles.checkoutDialog} aria-labelledby="checkout-title">
        <form method="dialog"><button className={styles.close} aria-label="Close checkout" type="submit">×</button></form>
        <p className="eyebrow"><T text="PayPal approval verified" /></p>
        <h2 id="checkout-title"><T text="Link Pro to your Qraftt account" /></h2>
        <p><T text="Your subscription is approved. Sign up or log in to attach it securely to your account. You will not start another payment." /></p>
        <p><T text="Complete this step in this browser within 24 hours of starting checkout. Unclaimed subscriptions are cancelled after expiry by the daily cleanup." /></p>
        <div className={styles.authActions}>
          <Link className="button button-primary" href="/signup?next=%2Fpricing%3Fpaypal%3Dapproved"><T text="Sign up & activate Pro" /></Link>
          <Link className="button button-secondary" href="/login?next=%2Fpricing%3Fpaypal%3Dapproved"><T text="Log in & activate Pro" /></Link>
          <button className="button button-secondary" type="button" onClick={async () => {
            try {
              const response = await fetch("/api/paypal/abandon", { method: "POST" });
              if (!response.ok) throw new Error("Cancellation failed. Contact support@qraftt.com before paying again.");
              authDialog.current?.close(); setNotice("Your unclaimed checkout was cancelled.");
            } catch (error) { setNotice(error instanceof Error ? error.message : "Cancellation failed."); }
          }}><T text="Cancel this unclaimed subscription" /></button>
        </div>
        <p className={styles.checkoutHint}><T text="Lost this browser session? Contact support@qraftt.com. Do not pay again to recover access." /></p>
        {notice ? <p role="alert"><T text={notice} /></p> : null}
      </dialog>
    </Root>
  );
}
