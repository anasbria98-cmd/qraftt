export const planLimits = {
  free: { savedCodes: 0, storageBytes: 0 },
  monthly: { savedCodes: 100, storageBytes: 250_000_000 },
  yearly: { savedCodes: 500, storageBytes: 1_000_000_000 },
} as const;
export function limitsFor(pro: boolean, interval?: string | null) {
  return planLimits[pro ? interval === "yearly" ? "yearly" : "monthly" : "free"];
}
