/** Server process capability only: never persisted as an account entitlement. */
export function localTemplateReview(request: Request | undefined, env: Record<string, string | undefined> = process.env): boolean {
  if (!request || env.NODE_ENV !== "development" || env.QRAFTT_LOCAL_TEMPLATE_REVIEW !== "1" || env.VERCEL || env.VERCEL_ENV) return false;
  const url = new URL(request.url);
  return url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
}
