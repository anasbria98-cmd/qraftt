"use client";
import { useCallback, useEffect, useState } from "react";

export function useEntitlement() {
  const [access, setAccess] = useState<{ pro: boolean; remaining: number; status: string; sandboxMonthlyTest?: boolean; templateReview?: boolean } | null>(null);
  const refresh = useCallback(async () => {
    const response = await fetch("/api/billing/session", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load your access. Please retry.");
    const data = await response.json();
    setAccess(data);
    return data as { pro: boolean; remaining: number; status: string };
  }, []);
  useEffect(() => {
    const reload = () => { void refresh().catch(() => setAccess(null)); };
    reload();
    window.addEventListener("focus", reload);
    const timer = window.setInterval(reload, 60000);
    return () => { window.removeEventListener("focus", reload); window.clearInterval(timer); };
  }, [refresh]);
  return { access, refresh };
}
