type PlanEnvironment = Record<string, string | undefined>;

export function sandboxTestPlan(env: PlanEnvironment) {
  const productionTest = env.PAYPAL_SANDBOX_PRODUCTION_TEST === "true";
  const testEnvironment = env.NODE_ENV === "development" || env.VERCEL_ENV === "preview" || productionTest;
  if (!testEnvironment || env.PAYPAL_ENV !== "sandbox" || (env.VERCEL_ENV === "production" && !productionTest)) return null;
  const id = env.PAYPAL_SANDBOX_TEST_PLAN_ID?.trim();
  if (!id) return null;
  if (!/^P-[A-Z0-9]+$/.test(id)) throw new Error("Invalid Sandbox test plan.");
  return id;
}

export function resolveProPlanId(interval: "monthly" | "yearly", env: PlanEnvironment) {
  const id = interval === "monthly" && sandboxTestPlan(env)
    || env[interval === "monthly" ? "PAYPAL_PRO_MONTHLY_PLAN_ID" : "PAYPAL_PRO_YEARLY_PLAN_ID"]?.trim();
  if (!id || !/^P-[A-Z0-9]+$/.test(id)) throw new Error("Invalid Pro plan configuration.");
  return id;
}

// Environment-specific plan IDs isolate retained Sandbox records from Live billing.
export function currentPayPalPlanIds(env: PlanEnvironment) {
  if (env.PAYPAL_ENV !== "live" && env.PAYPAL_ENV !== "sandbox") return [];
  return [...new Set([env.PAYPAL_PRO_MONTHLY_PLAN_ID,
    env.PAYPAL_PRO_YEARLY_PLAN_ID,
    ...(env[`PAYPAL_${env.PAYPAL_ENV.toUpperCase()}_LEGACY_PLAN_IDS`]?.split(",") ?? []),
    ...(env.PAYPAL_ENV === "sandbox" ? [env.PAYPAL_SANDBOX_TEST_PLAN_ID] : []),
  ].map(id => id?.trim()).filter((id): id is string => Boolean(id && /^P-[A-Z0-9]+$/.test(id))))];
}
