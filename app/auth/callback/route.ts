import { NextResponse } from "next/server";
import { authClient } from "@/lib/supabase/server";
import { safeReturnPath, checkoutAuthReturnPath } from "@/lib/auth/redirect";
import { cookies } from "next/headers";
import { checkoutIntentCookie, checkoutPeriod, checkoutReturnPath } from "@/lib/pricing/checkout";
import { pendingCheckout } from "@/lib/paypal/guest-checkout";
import { authReturnPath } from "@/lib/auth/continuation";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (code || (tokenHash && (type === "email" || type === "signup" || type === "recovery"))) {
    const client = await authClient();
    const { error } = code ? await client.auth.exchangeCodeForSession(code) : await client.auth.verifyOtp({ token_hash: tokenHash!, type: type as "email" | "signup" | "recovery" });
    if (!error) {
      const next = type === "recovery" ? "/reset-password" : safeReturnPath(url.searchParams.get("next"));
      const pending = await pendingCheckout();
      const checkoutNext = checkoutAuthReturnPath(next, pending);
      if (checkoutNext === "/pricing?paypal=approved") return NextResponse.redirect(new URL(checkoutNext, url.origin), { headers: { "Cache-Control": "private, no-store" } });
      const interval = checkoutPeriod((await cookies()).get(checkoutIntentCookie)?.value);
      (await cookies()).delete(checkoutIntentCookie);
      return NextResponse.redirect(new URL(next === "/dashboard" && interval ? checkoutReturnPath(interval) : next, url.origin), { headers: { "Cache-Control": "private, no-store" } });
    }
  }
  const recovery = type === "recovery" || url.searchParams.get("next") === "/reset-password";
  const failure = new URL(recovery ? "/forgot-password" : "/login", url.origin);
  failure.searchParams.set("message", url.searchParams.get("provider") === "google" ? "Google sign-in wasn’t completed. Please try again or use email and password. Your pending checkout is safe." : "This link is invalid or expired, or was opened in a different browser. Request a fresh link and open it in the browser where you started.");
  failure.searchParams.set("next", await authReturnPath((await cookies()).get("qraftt_auth_return")?.value ?? url.searchParams.get("next")));
  return NextResponse.redirect(failure, { headers: { "Cache-Control": "private, no-store" } });
}
