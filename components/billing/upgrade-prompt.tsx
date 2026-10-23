"use client";
import { T } from "@/components/i18n/language-provider";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { pricingPlans } from "@/lib/pricing/plans";
import { checkoutReturnPath } from "@/lib/pricing/checkout";
import { formatDisplayPrice } from "@/lib/pricing/currencies";
import styles from "./upgrade.module.css";

const pro = pricingPlans.find(plan => plan.id === "pro")!;

export function UpgradePrompt({ message, onClose, sandboxMonthlyTest = false }: { message: string; onClose: () => void; sandboxMonthlyTest?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return (
    <dialog ref={ref} onCancel={onClose} aria-labelledby="unlock-pro-title" aria-describedby="unlock-pro-message" className={styles.dialog}>
      <button className={styles.close} onClick={onClose} type="button" aria-label="Close upgrade prompt">×</button>
      <p className="eyebrow"><T text="Free to start. Pro to make it yours." /></p>
      <h2 id="unlock-pro-title"><T text="Unlock Pro" /></h2>
      <p id="unlock-pro-message"><T text={message} /></p>
      <ul className={styles.features}>
        <li><T text="Your logo, custom colors and gradients" /></li>
        <li><T text="New premium templates, frames, patterns and custom eyes" /></li>
        <li><T text="PNG, JPG, SVG, PDF, EPS and high-resolution exports" /></li>
        <li><T text="Unlimited downloads and a saved-QR dashboard" /></li>
      </ul>
      <div className={styles.plans}>
        <Link className="button button-primary" href={checkoutReturnPath("monthly")} prefetch={false}><T text="Upgrade monthly ·" />{" "}{formatDisplayPrice(pro.prices.monthly, "USD")}<T text="/month" /></Link>
        <Link className="button button-secondary" href={checkoutReturnPath("yearly")} prefetch={false}><T text="Upgrade yearly ·" />{" "}{formatDisplayPrice(pro.prices.yearly, "USD")}<T text="/year" /></Link>
      </div>
      <p className={styles.fine}><T text={sandboxMonthlyTest ? "Sandbox test: monthly checkout is USD 1.00/month. Displayed prices are the final plan prices. " : "Monthly subscription renews until cancelled. "} /><T text="PayPal opens first; link your Qraftt account after approval." /></p>
      <div className={styles.footer}>
        <Link className={styles.compare} href="/pricing"><T text="Compare Free & Pro" /></Link>
        <button className={styles.keepFree} onClick={onClose} type="button"><T text="Keep using Free" /></button>
      </div>
      <p className={styles.fine}><T text="Free keeps all 30 content types, all 20 original templates and 3 basic PNG / JPG downloads per day." /></p>
    </dialog>
  );
}
