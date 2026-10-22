import { T } from "@/components/i18n/language-provider";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getPayPalClient, getPayPalSubscriptionPlanId } from "@/lib/paypal/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Local PayPal Sandbox test",
  robots: { index: false, follow: false },
};

export default async function PayPalSandboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (process.env.NODE_ENV !== "development" || process.env.PAYPAL_ENV !== "sandbox") {
    notFound();
  }
  const params = await searchParams;
  let result: { id: string; status: string } | null = null;
  let error = params.error ? "Could not create the Sandbox subscription. Check the server console and retry." : "";
  if (params.approved === "1") {
    const subscriptionId = (await cookies()).get("qraftt_sandbox_subscription")?.value;
    if (!subscriptionId) {
      error = "No local test subscription was found. Start a new test below.";
    } else {
      try {
        const subscription = await getPayPalClient().getSubscription(subscriptionId);
        if (subscription.planId !== getPayPalSubscriptionPlanId()) {
          throw new Error("Sandbox subscription plan mismatch.");
        }
        result = subscription;
        console.info("PayPal Sandbox checkout result", { id: result.id, status: result.status });
      } catch {
        error = "Could not verify the subscription with PayPal Sandbox. Reload to retry verification.";
      }
    }
  }
  return (
    <main id="main-content" style={{ maxWidth: 720, margin: "64px auto", padding: 24 }}>
      <h1><T text="Qraftt PayPal Sandbox test" /></h1>
      <p><T text="Sandbox checkout now uses your verified Qraftt account through the pricing page. Sign in there, then use a PayPal Sandbox personal buyer account." /></p>
      <p><T text="This legacy page no longer creates anonymous subscriptions." /></p>
      <form action="/api/paypal/sandbox-checkout" method="post">
        <button className="button button-primary" type="submit"><T text="Continue to account checkout" /></button>
      </form>
      {params.cancelled === "1" ? <p role="status"><T text="Checkout cancelled." /></p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {result ? (
        <div role="status">
          <h2><T text="PayPal Sandbox result" /></h2>
          <p><T text="Subscription ID:" />{" "}<code>{result.id}</code></p>
          <p><T text="Status:" />{" "}<strong>{result.status}</strong></p>
          <p><T text="Status was retrieved directly from PayPal. No entitlement was granted." /></p>
        </div>
      ) : null}
    </main>
  );
}
