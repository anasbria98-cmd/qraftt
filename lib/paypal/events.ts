export type PayPalSubscriptionState =
  | "activated"
  | "cancelled"
  | "payment_failed"
  | "expired"
  | "suspended";

export interface PayPalSubscriptionEvent {
  eventId: string | null;
  eventType: string;
  state: PayPalSubscriptionState | null;
  subscriptionId: string | null;
}

const subscriptionStateByEventType: Record<string, PayPalSubscriptionState> = {
  "PAYMENT.SALE.COMPLETED": "activated",
  "BILLING.SUBSCRIPTION.ACTIVATED": "activated",
  "BILLING.SUBSCRIPTION.RE-ACTIVATED": "activated",
  "BILLING.SUBSCRIPTION.UPDATED": "activated",
  "BILLING.SUBSCRIPTION.CANCELLED": "cancelled",
  "BILLING.SUBSCRIPTION.PAYMENT.FAILED": "payment_failed",
  "BILLING.SUBSCRIPTION.EXPIRED": "expired",
  "BILLING.SUBSCRIPTION.SUSPENDED": "suspended",
};

function stringValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function parsePayPalSubscriptionEvent(
  event: Record<string, unknown>,
): PayPalSubscriptionEvent {
  const resource =
    event.resource && typeof event.resource === "object"
      ? (event.resource as Record<string, unknown>)
      : {};
  const eventType = stringValue(event.event_type) ?? "UNKNOWN";

  return {
    eventId: stringValue(event.id),
    eventType,
    state: subscriptionStateByEventType[eventType] ?? null,
    subscriptionId:
      stringValue(resource.billing_agreement_id) ?? stringValue(resource.id),
  };
}
