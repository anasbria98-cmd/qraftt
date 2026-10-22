export function checkoutPeriod(value: unknown): "monthly" | "yearly" | null {
  return value === "monthly" || value === "yearly" ? value : null;
}

export function checkoutReturnPath(period: "monthly" | "yearly") {
  return `/pricing?checkout=${period}`;
}

export const checkoutIntentCookie = "qraftt_checkout_interval";
