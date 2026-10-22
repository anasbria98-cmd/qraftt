import { T } from "@/components/i18n/language-provider";
export function ProBadge() {
  return <span style={{ display: "inline-block", fontSize: "0.65rem", fontWeight: 750, letterSpacing: ".04em", padding: "2px 5px", borderRadius: 5, background: "var(--mint-pale)", color: "var(--mint-strong)", border: "1px solid var(--line)", lineHeight: 1.4, marginLeft: 5 }}><T text="PRO" /></span>;
}
