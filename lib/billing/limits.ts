/** One storage policy for every account; subscription history is irrelevant. */
export const accountLimits = { savedCodes: 100, storageBytes: 250_000_000 } as const;
export function limitsFor(...historicalPlan: unknown[]) { void historicalPlan; return accountLimits; }
