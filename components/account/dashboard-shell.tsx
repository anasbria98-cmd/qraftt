"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { DashboardIcon } from "./dashboard-icon";
import styles from "./dashboard.module.css";
import { T } from "@/components/i18n/language-provider";
import { Logo } from "@/components/brand/logo";

const navigation = [
  ["Create QR Code", "/qr-code-generator", "qr"], ["My QR Codes", "/dashboard/my-qr-codes", "qr"], ["Dashboard", "/dashboard", "dashboard"],
  ["Statistics", "/dashboard/statistics", "statistics"], ["Import from CSV", "/dashboard/import", "import"],
  ["Archived QR Codes", "/dashboard/archive", "archive"], ["Custom Domain", "/dashboard/domains", "domain"],
  ["API Integration", "/dashboard/api", "api"], ["Profile", "/account", "profile"],
  ["Account & storage", "/dashboard/billing", "billing"], ["Support", "/dashboard/support", "support"],
  ["FAQ", "/dashboard/faq", "faq"],
] as const;
const comingSoon = new Set(["/dashboard/statistics", "/dashboard/import", "/dashboard/archive", "/dashboard/domains", "/dashboard/api"]);

export function DashboardShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const current = navigation.find(item => item[1] === pathname)?.[0] ?? "Your workspace";
  return <main id="main-content" className={styles.shell}>
    <aside className={styles.sidebar}>
      <div className={styles.workspace}><Logo /><p className={styles.workspaceCaption}><T text="Make every scan count." /></p></div>
      <button className={styles.menuToggle} type="button" aria-expanded={menuOpen} aria-controls="dashboard-navigation" onClick={() => setMenuOpen(!menuOpen)}><T text="Account navigation" />{" "}<span aria-hidden="true">{menuOpen ? "−" : "+"}</span></button>
      <nav id="dashboard-navigation" aria-label="Dashboard navigation" className={styles.navigation} data-open={menuOpen}>
        {navigation.map(([label, href, icon]) => comingSoon.has(href)
          ? <span key={href} className={styles.disabledNavigation} aria-disabled="true"><DashboardIcon name={icon} /><span><T text={label} /></span><small className={styles.soon}><T text="Coming soon" /></small></span>
          : <Link key={href} href={href} className={href === "/qr-code-generator" ? styles.createLink : undefined} aria-current={pathname === href ? "page" : undefined} onClick={() => setMenuOpen(false)}><DashboardIcon name={icon} /><span><T text={label} /></span></Link>)}
        <form action={logout}><button type="submit"><DashboardIcon name="logout" /><T text="Log out" /></button></form>
      </nav>
      <div className={styles.sidebarPlan}><p><T text="Every QR tool is free. Save up to 100 QR codes / 250 MB." /></p><Link href="/qr-code-generator"><T text="Create a QR code →" /></Link></div>
    </aside>
    <div className={styles.workspaceBody}>
      <header className={styles.topbar}><p><T text="Your workspace" /> <span aria-hidden="true">/</span> <strong><T text={current} /></strong></p><div className={styles.identity}><span className={styles.avatar} aria-hidden="true">{email.charAt(0).toUpperCase()}</span><span className={styles.email} dir="ltr" translate="no">{email}</span></div></header>
      <div className={styles.content}>{children}</div>
    </div>
  </main>;
}
