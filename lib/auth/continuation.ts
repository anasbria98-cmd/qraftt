import "server-only";
import { pendingCheckout } from "@/lib/paypal/guest-checkout";
import { checkoutAuthReturnPath } from "@/lib/auth/redirect";

export async function authReturnPath(value: unknown) {
  return checkoutAuthReturnPath(value, await pendingCheckout());
}
