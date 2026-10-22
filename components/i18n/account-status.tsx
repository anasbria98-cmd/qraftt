import { T } from "./language-provider";

const labels: Record<string, string> = {
  FREE: "Free plan", ACTIVE: "Active", CANCELLED: "Cancelled", SUSPENDED: "Suspended",
  EXPIRED: "Expired", PAYMENT_FAILED: "Payment failed", APPROVAL_PENDING: "Approval pending",
  APPROVED: "Approved", COMPLETED: "Completed", PENDING: "Pending", DENIED: "Denied",
  REFUNDED: "Refunded", FAILED: "Failed",
};
// Display-only mapping. Never used to calculate billing state or entitlement.
export function AccountStatus({ status }: { status: string }) {
  return <T text={labels[status.toUpperCase()] ?? status.replaceAll("_", " ")} />;
}
