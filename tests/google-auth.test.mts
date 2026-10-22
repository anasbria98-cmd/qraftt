import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { componentFixture } from "./helpers/render-component.mjs";
import { checkoutAuthReturnPath } from "../lib/auth/redirect.ts";
import { sessionCookieOptions } from "../lib/auth/session.ts";

class RedirectSignal extends Error { location: string; constructor(location: string) { super("redirect"); this.location = location; } }
const pending = { state: "open", claimed_by: null, subscription_id: "I-TEST", expires_at: "2099-01-01T00:00:00Z" };
const jar = { get: () => undefined, set: () => {}, delete: () => {} };

test("login and signup render Google before the email form, with clear account navigation", async () => {
  for (const mode of ["login", "signup"] as const) {
    const { AuthPage } = componentFixture("components/account/auth-page.tsx", {
      "@/lib/auth/actions": { signup: async () => {}, login: async () => {}, googleLogin: async () => {} },
      "@/lib/auth/providers": { googleAuthAvailable: async () => true },
      "@/lib/auth/continuation": { authReturnPath: async () => "/pricing?paypal=approved" },
    });
    const html = renderToStaticMarkup(await AuthPage({ mode, searchParams: Promise.resolve({}) }));
    assert.ok(html.indexOf(mode === "login" ? "Log In with Google" : "Sign Up with Google") < html.indexOf('name="email"'));
    assert.match(html, /src="\/images\/brand\/google-g.svg"/);
    assert.doesNotMatch(html, />G<|Continue with Google/);
    assert.match(html, />or</); assert.match(html, /No second checkout is needed/);
    assert.match(html, /value="\/pricing\?paypal=approved"/);
    assert.match(html, mode === "login" ? /Welcome back/ : /Create your Qraftt account/);
    assert.match(html, mode === "login" ? /Remember me/ : /Already have an account/);
    assert.match(html, /next=%2Fpricing%3Fpaypal%3Dapproved/);
    assert.doesNotMatch(html, /disabled=""/);
  }
});

test("Google OAuth uses the existing Supabase PKCE client and allowlisted pending continuation", async () => {
  const original = process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://auth.example.test";
  try {
    for (const hasPending of [false, true]) {
      let request: { provider: string; options: { redirectTo: string; skipBrowserRedirect: boolean } } | undefined;
      const { googleLogin } = componentFixture("lib/auth/actions.ts", {
        "next/navigation": { redirect: (location: string) => { throw new RedirectSignal(location); } },
        "next/headers": { cookies: async () => jar },
        "@/lib/auth/providers": { googleAuthAvailable: async () => true },
        "@/lib/auth/continuation": { authReturnPath: async (value: unknown) => checkoutAuthReturnPath(value, hasPending ? pending : null) },
        "@/lib/supabase/server": { authClient: async () => ({ auth: { signInWithOAuth: async (input: typeof request) => { request = input; return { data: { url: "https://auth.example.test/auth/v1/authorize?provider=google&code_challenge=fixture" }, error: null }; } } }) },
      });
      const form = new FormData(); form.set("next", "https://untrusted.test");
      await assert.rejects(googleLogin(form), (error: unknown) => error instanceof RedirectSignal && error.location.startsWith("https://auth.example.test/auth/v1/authorize"));
      assert.equal(request!.provider, "google");
      assert.equal(request!.options.skipBrowserRedirect, true);
      const callback = new URL(request!.options.redirectTo);
      assert.equal(callback.pathname, "/auth/callback");
      assert.equal(callback.searchParams.get("next"), hasPending ? "/pricing?paypal=approved" : "/dashboard");
    }
  } finally { if (original === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = original; }
});

test("Google cancellation and callback success preserve checkout without granting entitlement", async () => {
  for (const hasPending of [false, true]) {
    const { GET } = componentFixture("app/auth/callback/route.ts", {
      "next/server": { NextResponse: { redirect: (url: URL, options: { headers: Record<string, string> }) => new Response(null, { status: 307, headers: { ...options.headers, location: String(url) } }) } },
      "next/headers": { cookies: async () => jar },
      "@/lib/supabase/server": { authClient: async () => ({ auth: { exchangeCodeForSession: async () => ({ error: null }) } }) },
      "@/lib/paypal/guest-checkout": { pendingCheckout: async () => hasPending ? pending : null },
      "@/lib/auth/continuation": { authReturnPath: async (value: unknown) => checkoutAuthReturnPath(value, hasPending ? pending : null) },
    });
    const success = await GET(new Request("https://www.qraftt.com/auth/callback?provider=google&code=fixture&next=/dashboard"));
    assert.equal(success.headers.get("location"), hasPending ? "https://www.qraftt.com/pricing?paypal=approved" : "https://www.qraftt.com/dashboard");
    const failure = await GET(new Request("https://www.qraftt.com/auth/callback?provider=google&error=access_denied&next=/dashboard"));
    const target = new URL(failure.headers.get("location")!);
    assert.match(target.searchParams.get("message")!, /Google sign-in wasn’t completed/);
    assert.equal(target.searchParams.get("next"), hasPending ? "/pricing?paypal=approved" : "/dashboard");
    assert.equal(failure.headers.get("cache-control"), "private, no-store");
  }
});

test("Remember me changes cookie persistence only, never PKCE or cookie deletion", () => {
  const options = { httpOnly: true, maxAge: 3600, expires: new Date("2030-01-01") };
  assert.deepEqual(sessionCookieOptions("sb-test-auth-token.0", "token", options, true), { httpOnly: true });
  assert.deepEqual(sessionCookieOptions("sb-test-auth-token", "token", options, false), options);
  assert.deepEqual(sessionCookieOptions("sb-test-auth-token-code-verifier", "pkce", options, true), options);
  assert.equal(sessionCookieOptions("sb-test-auth-token", "", { maxAge: 0 }, true).maxAge, 0);
});
