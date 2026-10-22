import "server-only";
import { PayPalClient } from "@/lib/paypal/client";
import { resolveProPlanId } from "@/lib/paypal/plans";
import { payPalEnvironment } from "@/lib/paypal/environment";

function requiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required PayPal configuration: ${name}.`);
  }
  return value;
}

export function getPayPalClient() {
  return new PayPalClient({
    environment: payPalEnvironment(process.env.PAYPAL_ENV),
    clientId: requiredEnvironmentVariable("NEXT_PUBLIC_PAYPAL_CLIENT_ID"),
    clientSecret: requiredEnvironmentVariable("PAYPAL_CLIENT_SECRET"),
  });
}

export function getPayPalSubscriptionPlanId() {
  const planId = requiredEnvironmentVariable("PAYPAL_SUBSCRIPTION_PLAN_ID");
  if (!/^P-[A-Z0-9]+$/.test(planId)) {
    throw new Error("Invalid PayPal subscription plan configuration.");
  }
  return planId;
}

export function getPayPalWebhookId() {
  return requiredEnvironmentVariable("PAYPAL_WEBHOOK_ID");
}

export function getProPlanId(interval: "monthly" | "yearly") {
  if (process.env.PAYPAL_ENV === "live") requiredEnvironmentVariable("PAYPAL_WEBHOOK_ID");
  return resolveProPlanId(interval, process.env);
}
