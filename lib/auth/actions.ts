"use server";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/supabase/server";
import { authOrigin } from "@/lib/auth/origin";
import { validNewPassword } from "@/lib/auth/validation";
import { cookies, headers } from "next/headers";
import { checkoutIntentCookie, checkoutPeriod } from "@/lib/pricing/checkout";
import { authFailureMessage } from "@/lib/auth/errors";
import { authReturnPath } from "@/lib/auth/continuation";
import { googleAuthAvailable } from "@/lib/auth/providers";
import { sessionOnlyCookie } from "@/lib/auth/session";

async function origin() {
  return authOrigin(process.env, process.env.NODE_ENV === "development" ? (await headers()).get("origin") : null);
}
function message(path: string, text: string, next?: string): never { redirect(`${path}?message=${encodeURIComponent(text)}${next ? `&next=${encodeURIComponent(next)}` : ""}`); }
function credentials(form: FormData) {
  return { email: String(form.get("email") || "").trim().slice(0, 254), password: String(form.get("password") || "") };
}
export async function signup(form: FormData) {
  const { email, password } = credentials(form);
  const next = await authReturnPath(form.get("next"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !validNewPassword(password)) message("/signup", "Use a valid email and a password of at least 12 characters, up to 72 UTF-8 bytes.", next);
  const siteOrigin = await origin();
  const interval = checkoutPeriod(new URL(next, siteOrigin).searchParams.get("checkout"));
  // Preserve only an allowlisted billing choice across email confirmation, never entitlement.
  (await cookies()).set(checkoutIntentCookie, interval ?? "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: interval ? 86400 : 0 });
  const client = await authClient();
  const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: `${siteOrigin}/auth/callback?next=/dashboard` } });
  if (error) {
    console.error("Supabase signup failed", { code: error.code, status: error.status });
    message(["user_already_exists", "email_exists"].includes(error.code ?? "") ? "/login" : "/signup", authFailureMessage(error), next);
  }
  if (data.user?.identities?.length === 0) message("/login", "This email is already registered. Please log in, or reset your password.", next);
  if (data.session) redirect(next);
  message("/login", next === "/pricing?paypal=approved" ? "Confirm your email in this browser, then log in to link your approved subscription. Do not start another payment." : interval ? "Check your email to confirm your account in this browser, then continue to checkout." : "Check your email to confirm your account, then log in.", next);
}
export async function login(form: FormData) {
  const { email, password } = credentials(form);
  const next = await authReturnPath(form.get("next"));
  if (!email || !password || new TextEncoder().encode(password).length > 72) message("/login", "Enter your email and password.", next);
  const jar = await cookies();
  if (form.get("remember") === "on") jar.delete(sessionOnlyCookie);
  else jar.set(sessionOnlyCookie, "1", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
  const client = await authClient();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) message("/login", authFailureMessage(error), next);
  (await cookies()).delete(checkoutIntentCookie);
  redirect(next);
}
export async function logout() {
  const client = await authClient();
  const { error } = await client.auth.signOut({ scope: "local" });
  if (error) message("/account", "Could not log out. Please retry.");
  (await cookies()).delete(sessionOnlyCookie);
  redirect("/login");
}
export async function googleLogin(form: FormData) {
  const next = await authReturnPath(form.get("next"));
  if (!await googleAuthAvailable()) message("/login", "Google sign-in is not available yet. Please use email and password. Your pending checkout is safe.", next);
  const callback = new URL("/auth/callback", await origin());
  callback.searchParams.set("next", next);
  callback.searchParams.set("provider", "google");
  let destination: string | null = null;
  try {
    const client = await authClient();
    const { data, error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback.href, skipBrowserRedirect: true } });
    if (!error && data.url) {
      const url = new URL(data.url);
      if (url.origin === new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin && url.pathname === "/auth/v1/authorize") destination = url.href;
    }
  } catch { /* Never expose provider errors or credentials. */ }
  if (!destination) message("/login", "We couldn’t start Google sign-in. Please try again or use email and password. Your pending checkout is safe.", next);
  redirect(destination);
}
export async function forgotPassword(form: FormData) {
  const next = await authReturnPath(form.get("next"));
  (await cookies()).set("qraftt_auth_return", next, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 86400 });
  const email = String(form.get("email") || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) message("/forgot-password", "Enter a valid email address.");
  const client = await authClient();
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${await origin()}/auth/callback?next=/reset-password` });
  if (error) {
    console.error("Supabase recovery failed", { code: error.code, status: error.status });
    message("/forgot-password", authFailureMessage(error), next);
  }
  message("/forgot-password", "If this account exists, a password reset email will arrive shortly. Open it in this same browser and check spam too.", next);
}
export async function resetPassword(form: FormData) {
  const next = await authReturnPath((await cookies()).get("qraftt_auth_return")?.value ?? form.get("next"));
  const client = await authClient();
  const { data } = await client.auth.getUser();
  if (!data.user) redirect("/forgot-password");
  const password = String(form.get("password") || "");
  if (!validNewPassword(password)) message("/reset-password", "Use a password of at least 12 characters, up to 72 UTF-8 bytes.");
  const { error } = await client.auth.updateUser({ password });
  if (error) message("/reset-password", "Could not update your password. Try a fresh reset link.");
  await client.auth.signOut();
  (await cookies()).delete("qraftt_auth_return");
  message("/login", "Your password has been updated. Please log in.", next);
}
export async function updateName(form: FormData) {
  const client = await authClient();
  const { data } = await client.auth.getUser();
  if (!data.user) redirect("/login");
  const display_name = String(form.get("display_name") || "").trim();
  if (display_name.length > 100) message("/account", "Keep your name under 100 characters.");
  const { data: updated, error } = await client.from("profiles").update({ display_name }).eq("id", data.user.id).select("id").single();
  if (error || !updated) message("/account", "Could not save your name. Please retry.");
  message("/account", "Account updated.");
}
