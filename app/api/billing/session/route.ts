import { accountLimits } from "@/lib/billing/limits";
/** Compatibility endpoint for older clients. No payment or download tracking. */
export async function GET() {
  return Response.json({ status: "FREE", downloads: "unlimited", ...accountLimits }, { headers: { "Cache-Control": "no-store" } });
}
