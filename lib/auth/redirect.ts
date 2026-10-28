export function safeReturnPath(value: unknown, fallback = "/dashboard") {
  return typeof value === "string" && ["/dashboard", "/account", "/pricing", "/reset-password"].includes(value) ? value : fallback;
}
/** Old checkout links now continue safely to the free dashboard. */
export function checkoutAuthReturnPath(value: unknown, ...historical: unknown[]) { void historical; return safeReturnPath(value); }
