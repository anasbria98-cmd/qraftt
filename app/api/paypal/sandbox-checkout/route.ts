import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development" || process.env.PAYPAL_ENV !== "sandbox") {
    return new Response(null, { status: 404 });
  }
  const origin = new URL(request.url).origin;
  if (!new Set(["localhost", "127.0.0.1", "[::1]"]).has(new URL(origin).hostname) ||
    request.headers.get("origin") !== origin) {
    return new Response(null, { status: 403 });
  }
  // Preserve the legacy local route, but use the account-bound checkout only.
  return NextResponse.redirect(`${origin}/pricing`, 303);
}
