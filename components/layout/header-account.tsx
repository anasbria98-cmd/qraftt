"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { T } from "@/components/i18n/language-provider";

const HeaderAccountContext = createContext(false);
export function HeaderAccountProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!disposed) setAuthenticated(data.authenticated === true);
      } catch { /* Keep the existing navigation usable if the status check fails. */ }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { disposed = true; controller.abort(); window.removeEventListener("focus", refresh); };
  }, [pathname]);
  return <HeaderAccountContext.Provider value={authenticated}>{children}</HeaderAccountContext.Provider>;
}

export function HeaderAccountAnchor({ authenticated }: { authenticated: boolean }) {
  return <Link className="button button-secondary header-account-link" href={authenticated ? "/dashboard" : "/login"} prefetch={false}><T text={authenticated ? "Dashboard" : "Login"} /></Link>;
}
export function HeaderAccountLink() {
  return <HeaderAccountAnchor authenticated={useContext(HeaderAccountContext)} />;
}
