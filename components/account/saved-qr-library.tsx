"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T } from "@/components/i18n/language-provider";
import type { SavedSummary } from "@/lib/account/saved-qr";
import styles from "./dashboard.module.css";
export function SavedQrLibrary() {
  const router = useRouter();
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
      setItems(current => current.filter(item => item.id !== id)); setNotice("Saved QR deleted. Storage space has been released.");
      router.refresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not delete QR."); }
    finally { setBusy(false); }
  }
  return <section className={styles.card}><div className={styles.cardHeader}><h2><T text="Saved designs" /></h2><Link href="/qr-code-generator" className="button button-primary"><T text="Create QR Code" /></Link></div>{notice ? <p role="status">{notice}</p> : null}<div className={styles.tableWrap}><table className={styles.table}><thead><tr><th><T text="Name" /></th><th><T text="Updated" /></th><th><T text="Actions" /></th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.title}</td><td>{new Date(item.updated_at).toLocaleDateString()}</td><td><><Link href={`/qr-code-generator?saved=${encodeURIComponent(item.id)}`}><T text="Edit / download" /></Link>{" · "}</><button type="button" disabled={busy} onClick={() => void remove(item.id)}><T text="Delete" /></button></td></tr>)}</tbody></table></div></section>;
}
