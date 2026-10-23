"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { T } from "@/components/i18n/language-provider";
import type { SavedSummary } from "@/lib/account/saved-qr";
import styles from "./dashboard.module.css";
export function SavedQrLibrary({ pro }: { pro: boolean }) {
  const [items, setItems] = useState<SavedSummary[]>([]);
  const [notice, setNotice] = useState("Loading saved QR codes…");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/account/qr", { cache: "no-store", signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems(data); setNotice(data.length ? "" : "No saved QR codes yet. Create a QR code and choose Save to dashboard.");
    }).catch(error => { if (!controller.signal.aborted) setNotice(error.message); });
    return () => controller.abort();
  }, []);
  async function remove(id: string) {
    if (!window.confirm("Delete this saved QR design? Already downloaded static QR codes will still work.")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/account/qr", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setItems(current => current.filter(item => item.id !== id)); setNotice("Saved QR deleted. Refresh billing to see updated usage.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not delete QR."); }
    finally { setBusy(false); }
  }
  return <section className={styles.card}><div className={styles.cardHeader}><h2><T text="Saved designs" /></h2><Link href="/qr-code-generator" className="button button-primary"><T text="Create QR Code" /></Link></div>{!pro ? <><p><T text="Pro Monthly includes 100 saved QR codes and 250 MB. Pro Yearly includes 500 saved QR codes and 1 GB. Retained designs can be deleted after downgrade; editing requires Pro." /></p><Link className="button button-secondary" href="/pricing"><T text="Explore Pro" /></Link></> : null}{notice ? <p role="status">{notice}</p> : null}<div className={styles.tableWrap}><table className={styles.table}><thead><tr><th><T text="Name" /></th><th><T text="Updated" /></th><th><T text="Actions" /></th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.title}</td><td>{new Date(item.updated_at).toLocaleDateString()}</td><td>{pro ? <><Link href={`/qr-code-generator?saved=${encodeURIComponent(item.id)}`}><T text="Edit / download" /></Link>{" · "}</> : null}<button type="button" disabled={busy} onClick={() => void remove(item.id)}><T text="Delete" /></button></td></tr>)}</tbody></table></div></section>;
}
