import { billingCustomer, getBillingStore } from "@/lib/billing/server";
import { sandboxTestPlan } from "@/lib/paypal/plans";
import { localTemplateReview } from "@/lib/qr/local-review";

export async function GET(request: Request) {
  if (localTemplateReview(request)) return Response.json({ pro: false, remaining: 3, status: "LOCAL_REVIEW", templateReview: true }, { headers: { "Cache-Control": "no-store" } });
  try {
    const id = await billingCustomer(true);
    return Response.json({ ...await getBillingStore().entitlement(id), sandboxMonthlyTest: Boolean(sandboxTestPlan(process.env)) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Billing is unavailable." }, { status: 503 });
  }
}
