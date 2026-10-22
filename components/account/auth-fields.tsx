"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import styles from "./auth.module.css";
import { T, useLanguage } from "@/components/i18n/language-provider";
export function PasswordField({ login }: { login: boolean }) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  return <div className={styles.field}><label htmlFor="auth-password"><T text="Password" /></label><div className={styles.password}><input id="auth-password" type={visible ? "text" : "password"} name="password" required minLength={login ? 1 : 12} maxLength={72} autoComplete={login ? "current-password" : "new-password"} aria-describedby={!login ? "password-guidance" : undefined} /><button type="button" aria-controls="auth-password" aria-pressed={visible} aria-label={t(visible ? "Hide" : "Show")} onClick={() => setVisible(!visible)}><T text={visible ? "Hide" : "Show"} /></button></div>{!login ? <span id="password-guidance" className={styles.hint}><T text="Use at least 12 characters, up to 72 UTF-8 bytes." /></span> : null}</div>;
}
export function AuthSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button className={`button button-primary ${styles.submit}`} type="submit" disabled={pending} aria-busy={pending}><T text={pending ? "Please wait…" : label} /></button>;
}
