import { timingSafeEqual } from "node:crypto";
import { currentPayPalPlanIds } from "@/lib/paypal/plans";
import { adminClient } from "@/lib/supabase/server";
import { cancelUnclaimedCheckout } from "@/lib/paypal/abandoned-checkout";

export const maxDuration = 60;
export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization") ?? "";
  const target = `Bearer ${expected}`;
  if (!expected || Buffer.byteLength(supplied) !== Buffer.byteLength(target) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(target))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await adminClient().from("pending_paypal_checkouts").select("id").in("provider_plan_id", currentPayPalPlanIds(process.env)).is("claimed_by", null).in("state", ["open", "cancelling"]).lte("expires_at", new Date().toISOString()).limit(10);
  if (error) return Response.json({ error: "Cleanup unavailable" }, { status: 503 });
  let failed = 0;
  for (const row of data) { try { await cancelUnclaimedCheckout(row.id); } catch { failed++; } }
  return Response.json({ checked: data.length, failed }, { status: failed ? 503 : 200 });
}
