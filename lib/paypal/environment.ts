export type PayPalEnvironment = "sandbox" | "live";
export function payPalEnvironment(value: string | undefined): PayPalEnvironment {
  if (value !== "sandbox" && value !== "live") throw new Error("Invalid PayPal environment.");
  return value;
}
export function payPalApiOrigin(environment: PayPalEnvironment) {
  return environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}
export function validApprovalUrl(value: string, environment: PayPalEnvironment) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && url.hostname === (environment === "live" ? "www.paypal.com" : "www.sandbox.paypal.com");
  } catch { return false; }
}
