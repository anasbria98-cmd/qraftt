import "server-only";
import { cache } from "react";
import { requireUser, authClient } from "@/lib/supabase/server";
import { getBillingStore } from "@/lib/billing/server";
import { currentPayPalPlanIds } from "@/lib/paypal/plans";

export const dashboardAccount = cache(async () => {
  const user = await requireUser();
  const client = await authClient();
  const [profile, subscriptions, access] = await Promise.all([
    client.from("profiles").select("display_name").eq("id", user.id).single(),
    client.from("subscriptions").select("id,status,billing_interval,current_period_start,current_period_end,updated_at")
      .eq("user_id", user.id).in("provider_plan_id", currentPayPalPlanIds(process.env)).order("updated_at", { ascending: false }),
    getBillingStore().entitlement(user.id),
  ]);
  if (profile.error || subscriptions.error) throw new Error("Your account details could not be loaded. Please retry.");
  const subscription = subscriptions.data.find(item => item.status === "active") ?? subscriptions.data[0] ?? null;
  return { user, displayName: profile.data.display_name as string | null, subscription, access };
});
