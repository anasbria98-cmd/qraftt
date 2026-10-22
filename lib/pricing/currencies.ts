export const displayCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD", "MAD"] as const;
export type DisplayCurrency = (typeof displayCurrencies)[number];

// Indicative USD reference-rate snapshot from https://open.er-api.com/v6/latest/USD.
// Display only: these rates never select or create a PayPal billing plan.
export const displayRates: Record<DisplayCurrency, number> = {
  USD: 1,
  EUR: 0.892629,
  GBP: 0.755605,
  CAD: 1.425643,
  AUD: 1.431802,
  MAD: 9.817487,
};
export const displayRateDate = "2026-10-12";

export function isDisplayCurrency(value: unknown): value is DisplayCurrency {
  return displayCurrencies.some((currency) => currency === value);
}

export function formatDisplayPrice(usdAmount: number, currency: DisplayCurrency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "USD" && Number.isInteger(usdAmount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(usdAmount * displayRates[currency]);
}
