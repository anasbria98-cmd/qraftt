import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessionCookieOptions, sessionOnlyCookie } from "@/lib/auth/session";

export async function authClient() {
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        try { for (const { name, value, options } of values) jar.set(name, value, sessionCookieOptions(name, value, options, jar.get(sessionOnlyCookie)?.value === "1")); }
        catch { /* Server Components are read-only; proxy refreshes their cookies. */ }
      },
    },
  });
}

export function adminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Supabase server configuration is missing.");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export async function currentUser() {
  const client = await authClient();
  const { data, error } = await client.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError" && error.status !== 401 && error.status !== 403) {
    throw new Error("Account verification is unavailable.");
  }
  return data.user;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/dashboard");
  return user;
}
