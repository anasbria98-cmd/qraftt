export const sessionOnlyCookie = "qraftt_session_only";

// A preference, never an authorization signal. Leave deletions and PKCE cookies intact.
export function sessionCookieOptions<T extends { maxAge?: number; expires?: Date }>(name: string, value: string, options: T, sessionOnly: boolean): T {
  if (!sessionOnly || !/^sb-.+-auth-token(?:\.\d+)?$/.test(name) || !value || options.maxAge === 0) return options;
  const session = { ...options };
  delete session.maxAge;
  delete session.expires;
  return session;
}
