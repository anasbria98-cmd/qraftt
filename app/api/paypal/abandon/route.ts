import { sameOrigin } from "@/lib/billing/server";
import { pendingCheckout } from "@/lib/paypal/guest-checkout";
import { cancelUnclaimedCheckout } from "@/lib/paypal/abandoned-checkout";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid origin." }, { status: 403 });
  try {
    const pending = await pendingCheckout();
    if (pending && !pending.claimed_by) await cancelUnclaimedCheckout(pending.id);
    return Response.json({ cancelled: true }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Could not cancel your unclaimed subscription. Please retry or contact support@qraftt.com." }, { status: 503 }); }
}
