import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { payPalApiOrigin, payPalEnvironment, type PayPalEnvironment } from "./environment.ts";
// Historical plan verification only; product checkout is retired.
const historicalPrices = { monthly: 4.99, yearly: 19.99 };

export const PAYPAL_SANDBOX_API_ORIGIN = "https://api-m.sandbox.paypal.com";

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

interface PayPalClientOptions {
  environment?: PayPalEnvironment;
  clientId: string;
  clientSecret: string;
  fetch?: FetchLike;
}

interface PayPalAccessTokenResponse {
  access_token?: string;
  expires_in?: number;
}

interface PayPalLink {
  href?: string;
  rel?: string;
}

interface PayPalSubscriptionResponse {
  id?: string;
  plan_id?: string;
  links?: PayPalLink[];
  status?: string;
  custom_id?: string;
  subscriber?: { email_address?: string };
  billing_info?: { failed_payments_count?: number; last_payment?: { time?: string }; next_billing_time?: string };
}

interface PayPalWebhookVerificationResponse {
  verification_status?: string;
}

export interface CreatePayPalSubscriptionInput {
  customerId?: string;
  cancelUrl: string;
  planId: string;
  interval?: "monthly" | "yearly";
  returnUrl: string;
}

export interface PayPalWebhookVerificationInput {
  authAlgo: string;
  certUrl: string;
  event: Record<string, unknown>;
  transmissionId: string;
  transmissionSignature: string;
  transmissionTime: string;
  webhookId: string;
}

export class PayPalApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PayPalApiError";
    this.status = status;
  }
}

export function isMissingPayPalSubscription(error: unknown) {
  return error instanceof PayPalApiError && error.status === 404
    && error.message === "PayPal Sandbox subscription verification failed.";
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return {};
  }
}

export class PayPalClient {
  private readonly apiOrigin: string;
  private readonly fetch: FetchLike;
  private readonly options: PayPalClientOptions;

  constructor(options: PayPalClientOptions) {
    this.apiOrigin = payPalApiOrigin(payPalEnvironment(options.environment ?? "sandbox"));
    this.options = options;
    this.fetch = options.fetch ?? fetch;
  }

  async getAccessToken() {
    const authorization = Buffer.from(
      `${this.options.clientId}:${this.options.clientSecret}`,
    ).toString("base64");
    const response = await this.fetch(`${this.apiOrigin}/v1/oauth2/token`, {
      body: "grant_type=client_credentials",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${authorization}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      signal: AbortSignal.timeout(15000),
    });
    const data = (await parseJson(response)) as PayPalAccessTokenResponse;

    if (!response.ok || !data.access_token) {
      throw new PayPalApiError("PayPal Sandbox OAuth failed.", response.status);
    }

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in ?? 0,
    };
  }

  async createSubscription(input: CreatePayPalSubscriptionInput) {
    if (this.options.environment === "live") await this.verifyLivePlan(input.planId, input.interval ?? "monthly");
    const { accessToken } = await this.getAccessToken();
    const response = await this.fetch(
      `${this.apiOrigin}/v1/billing/subscriptions`,
      {
        body: JSON.stringify({
          application_context: {
            cancel_url: input.cancelUrl,
            return_url: input.returnUrl,
            shipping_preference: "NO_SHIPPING",
            user_action: "SUBSCRIBE_NOW",
          },
          plan_id: input.planId,
          custom_id: input.customerId,
        }),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          ...(input.customerId ? { "PayPal-Request-Id": createHash("sha256").update(input.customerId.startsWith("checkout:") ? `${input.customerId}:${input.planId}` : `${input.customerId}:${input.planId}:${new Date().toISOString().slice(0, 10)}`).digest("hex") } : {}),
        },
        method: "POST",
        signal: AbortSignal.timeout(15000),
      },
    );
    const data = (await parseJson(response)) as PayPalSubscriptionResponse;

    if (!response.ok || !data.id) {
      throw new PayPalApiError("PayPal Sandbox subscription creation failed.", response.status);
    }

    return {
      approvalUrl: data.links?.find((link) => link.rel === "approve")?.href ?? null,
      id: data.id,
      status: data.status ?? "UNKNOWN",
    };
  }

  async getSubscription(id: string) {
    if (!/^I-[A-Z0-9]+$/.test(id)) {
      throw new Error("Invalid PayPal subscription ID.");
    }
    const { accessToken } = await this.getAccessToken();
    const response = await this.fetch(
      `${this.apiOrigin}/v1/billing/subscriptions/${id}`,
      {
        headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
    const data = (await parseJson(response)) as PayPalSubscriptionResponse;
    if (!response.ok || data.id !== id || !data.status || !data.plan_id) {
      throw new PayPalApiError("PayPal Sandbox subscription verification failed.", response.status);
    }
    return { id: data.id, status: data.status === "ACTIVE" && (data.billing_info?.failed_payments_count ?? 0) > 0 ? "PAYMENT_FAILED" : data.status, planId: data.plan_id,
      ...(data.custom_id ? { customerId: data.custom_id } : {}),
      ...(data.subscriber?.email_address ? { email: data.subscriber.email_address } : {}),
      period: { start: data.billing_info?.last_payment?.time, end: data.billing_info?.next_billing_time },
    };
  }

  async verifyLivePlan(planId: string, interval: "monthly" | "yearly" = "monthly") {
    const expectedPrice = historicalPrices[interval];
    if (!/^P-[A-Z0-9]+$/.test(planId)) throw new Error("Invalid PayPal plan.");
    const { accessToken } = await this.getAccessToken();
    const response = await this.fetch(`${this.apiOrigin}/v1/billing/plans/${planId}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    const plan = await parseJson(response) as {
      status?: string; billing_cycles?: Array<{ tenure_type?: string; total_cycles?: number;
        frequency?: { interval_unit?: string; interval_count?: number };
        pricing_scheme?: { fixed_price?: { currency_code?: string; value?: string } } }>;
      payment_preferences?: { setup_fee?: { value?: string } };
      taxes?: { percentage?: string };
    };
    const cycles = plan.billing_cycles;
    const cycle = cycles?.[0];
    if (!response.ok || plan.status !== "ACTIVE" || cycles?.length !== 1
      || cycle?.tenure_type !== "REGULAR" || cycle.total_cycles !== 0
      || cycle.frequency?.interval_unit !== (interval === "yearly" ? "YEAR" : "MONTH") || cycle.frequency.interval_count !== 1
      || cycle.pricing_scheme?.fixed_price?.currency_code !== "USD"
      || Number(cycle.pricing_scheme.fixed_price.value) !== expectedPrice
      || Number(plan.payment_preferences?.setup_fee?.value ?? 0) !== 0
      || Number(plan.taxes?.percentage ?? 0) !== 0) {
      throw new Error(`Live PayPal plan must match the displayed USD ${expectedPrice} ${interval} price without extra fees.`);
    }
  }

  async cancelSubscription(id: string) {
    if (!/^I-[A-Z0-9]+$/.test(id)) throw new Error("Invalid subscription.");
    const { accessToken } = await this.getAccessToken();
    const response = await this.fetch(`${this.apiOrigin}/v1/billing/subscriptions/${id}/cancel`, {
      method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Unclaimed Qraftt Sandbox checkout cancelled." }), signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new PayPalApiError("Could not cancel Sandbox subscription.", response.status);
  }

  async getRecentTransactions(id: string) {
    if (!/^I-[A-Z0-9]+$/.test(id)) throw new Error("Invalid PayPal subscription ID.");
    const { accessToken } = await this.getAccessToken();
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 86400000);
    const query = new URLSearchParams({ start_time: start.toISOString(), end_time: end.toISOString() });
    const response = await this.fetch(`${this.apiOrigin}/v1/billing/subscriptions/${id}/transactions?${query}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
      cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    const data = await parseJson(response) as { transactions?: Array<{ id?: string; status?: string; time?: string; amount_with_breakdown?: { gross_amount?: { value?: string; currency_code?: string } } }> };
    if (!response.ok || !Array.isArray(data.transactions)) throw new PayPalApiError("Could not load PayPal payment history.", response.status);
    return data.transactions.map(item => ({ id: item.id, status: item.status, time: item.time,
      amount: item.amount_with_breakdown?.gross_amount?.value, currency: item.amount_with_breakdown?.gross_amount?.currency_code,
    })).filter((item): item is { id: string; status: string; time: string; amount: string; currency: string } =>
      Boolean(item.id && item.status && item.time && Number.isFinite(Date.parse(item.time)) && item.amount && Number.isFinite(Number(item.amount)) && item.currency && /^[A-Z]{3}$/.test(item.currency)));
  }

  async verifyWebhookSignature(input: PayPalWebhookVerificationInput) {
    const { accessToken } = await this.getAccessToken();
    const response = await this.fetch(
      `${this.apiOrigin}/v1/notifications/verify-webhook-signature`,
      {
        body: JSON.stringify({
          auth_algo: input.authAlgo,
          cert_url: input.certUrl,
          transmission_id: input.transmissionId,
          transmission_sig: input.transmissionSignature,
          transmission_time: input.transmissionTime,
          webhook_event: input.event,
          webhook_id: input.webhookId,
        }),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      },
    );
    const data = (await parseJson(response)) as PayPalWebhookVerificationResponse;

    if (!response.ok) {
      throw new PayPalApiError("PayPal Sandbox webhook verification failed.", response.status);
    }

    return data.verification_status === "SUCCESS";
  }
}

// Compatibility for existing Sandbox fixtures; callers default to Sandbox unless
// the validated server configuration explicitly selects Live.
export { PayPalClient as PayPalSandboxClient };
