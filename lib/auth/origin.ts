/** Production uses configured origin; development may return to a loopback port. */
export function authOrigin(env: Record<string, string | undefined>, requestOrigin?: string | null) {
  if (env.NODE_ENV === "development" && requestOrigin) {
    try {
      const url = new URL(requestOrigin);
      if (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)) return url.origin;
    } catch { /* Ignore untrusted or malformed origins. */ }
  }
  return new URL(env.AUTH_SITE_URL || (env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.qraftt.com")).origin;
}
