import Link from "next/link";
import Image from "next/image";
import { signup, login, forgotPassword, resetPassword, googleLogin } from "@/lib/auth/actions";
import { googleAuthAvailable } from "@/lib/auth/providers";
import { safeReturnPath } from "@/lib/auth/redirect";
import { authReturnPath } from "@/lib/auth/continuation";
import { AuthSubmit, PasswordField } from "./auth-fields";
import styles from "./auth.module.css";
import { T } from "@/components/i18n/language-provider";

const forms = {
  signup: { title: "Create your Qraftt account", action: signup, button: "Create account" },
  login: { title: "Welcome back", action: login, button: "Log in" },
  forgot: { title: "Forgot your password?", action: forgotPassword, button: "Send reset link" },
  reset: { title: "Set a new password", action: resetPassword, button: "Save password" },
};
export async function AuthPage({ mode, searchParams }: { mode: keyof typeof forms; searchParams: Promise<{ message?: string; next?: string }> }) {
  const params = await searchParams;
  const config = forms[mode];
  const next = await authReturnPath(params.next);
  const suffix = `?next=${encodeURIComponent(next)}`;
  const accountEntry = mode === "login" || mode === "signup";
  const googleReady = accountEntry && await googleAuthAvailable();
  return <main id="main-content" className={styles.page}>
    <section className={styles.card}>
    <p className={styles.eyebrow}><T text="Your Qraftt account" /></p>
    <h1><T text={config.title} /></h1>
    <p className={styles.intro}><T text={mode === "login" ? "Log in to your Qraftt account" : mode === "signup" ? "One account for your plan and premium toolkit. Basic QR creation stays free without signing up." : mode === "forgot" ? "Enter your email and we’ll send a secure password reset link. Check your inbox and spam folder." : "Choose a new password. After saving it, log in normally to return to your account."} /></p>
    {params.message ? <p role="status" className={styles.status}><T text={params.message.slice(0, 300)} /></p> : null}
    {accountEntry ? <>
      <form action={googleLogin} className={styles.googleForm}>
        <input type="hidden" name="next" value={safeReturnPath(next)} />
        <button type="submit" className={styles.google} disabled={!googleReady} aria-describedby={!googleReady ? "google-availability" : undefined}><Image src="/images/brand/google-g.svg" alt="" aria-hidden="true" width={20} height={20} className={styles.googleMark} /><T text={mode === "login" ? "Log In with Google" : "Sign Up with Google"} /></button>
      </form>
      {!googleReady ? <p id="google-availability" className={styles.hint}><T text="Google sign-in is not available right now. Please continue with email below." /></p> : null}
      <div className={styles.separator}><span><T text="or" /></span></div>
    </> : null}
    <form action={config.action} className={styles.form}>
      <input type="hidden" name="next" value={safeReturnPath(next)} />
      {mode !== "reset" ? <label><T text="Email" /><input type="email" name="email" required autoComplete="email" maxLength={254} /></label> : null}
      {mode !== "forgot" ? <PasswordField login={mode === "login"} /> : null}
      {mode === "login" ? <div className={styles.options}><label className={styles.remember}><input type="checkbox" name="remember" defaultChecked /><T text="Remember me" /></label><Link href={`/forgot-password${suffix}`}><T text="Forgot password?" /></Link></div> : null}
      <AuthSubmit label={config.button} />
    </form>
    <p className={styles.switch}>{mode === "login" ? <><T text="Don’t have an account?" /> <Link href={`/signup${suffix}`}><T text="Create account" /></Link></> : mode === "signup" ? <><T text="Already have an account?" /> <Link href={`/login${suffix}`}><T text="Log in" /></Link></> : <Link href={`/login${suffix}`}><T text="Back to Log in" /></Link>}</p>
    <p className={styles.legal}><T text="Read our" />{" "}<Link href="/privacy-policy"><T text="Privacy Policy" /></Link>{" "}<T text="and" />{" "}<Link href="/terms"><T text="Terms" /></Link>. <Link href="/contact"><T text="Need help?" /></Link></p>
  </section>
  <aside className={styles.aside}><div><p className={styles.eyebrow}><T text="Made for useful connections" /></p><h2><T text="Your ideas, ready to share." /></h2><div className={styles.benefit}><h3><T text="Create without friction" /></h3><p><T text="Choose from all 30 content types. Every feature is free, with no account required." /></p></div><div className={styles.benefit}><h3><T text="Keep your designs together" /></h3><p><T text="Save up to 100 QR codes using 250 MB of storage. All templates, logos and export formats are free." /></p></div><div className={styles.benefit}><h3><T text="Pick up where you left off" /></h3><p><T text="Save a design, return to edit it, and download it again whenever you need." /></p></div></div><div className={styles.asideFoot}><T text="Qraftt · Simple tools. Direct connections." /></div></aside>
  </main>;
}
