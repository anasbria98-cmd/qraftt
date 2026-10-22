import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieOptions, sessionOnlyCookie } from "@/lib/auth/session";

// Session refresh only. Pages, server actions, and APIs verify authorization again.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return response;
  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values) response.cookies.set(name, value, sessionCookieOptions(name, value, options, request.cookies.get(sessionOnlyCookie)?.value === "1"));
      },
    },
  });
  await client.auth.getUser();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/dashboard/:path*", "/account/:path*", "/login", "/signup", "/forgot-password", "/reset-password", "/auth/:path*", "/api/billing/:path*", "/api/paypal/confirm", "/api/paypal/subscriptions", "/api/qr/render"] };
