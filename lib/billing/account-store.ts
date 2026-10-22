import "server-only";
import { currentPayPalPlanIds } from "@/lib/paypal/plans";
import { adminClient } from "@/lib/supabase/server";

export class AccountBillingStore {
  private client() { return adminClient(); }

  async entitlement(principal: string) {
    const db = this.client();
    const usage = await db.from("download_usage").select("count").eq("principal", principal).eq("day", new Date().toISOString().slice(0, 10)).maybeSingle();
    if (usage.error) throw new Error("Billing schema is not ready.");
    if (principal.startsWith("guest:")) return { pro: false, status: "FREE", remaining: Math.max(0, 3 - (usage.data?.count ?? 0)) };
    const { data, error } = await db.from("subscriptions").select("id,status,billing_interval").in("provider_plan_id", currentPayPalPlanIds(process.env)).eq("user_id", principal).order("updated_at", { ascending: false });
    if (error) throw new Error("Could not verify subscription.");
    const subscription = data.find(s => s.status === "active") ?? data[0];
    return { pro: subscription?.status === "active", status: subscription?.status.toUpperCase() ?? "FREE", remaining: Math.max(0, 3 - (usage.data?.count ?? 0)) };
  }

  async consumeFreeDownload(principal: string) {
    const { data, error } = await this.client().rpc("qraftt_consume_download", { p_principal: principal });
    if (error) throw new Error("Could not check download limit.");
    return data === true;
  }

  async saveSubscription(id: string, customerId: string, planId: string, interval: string, status: string) {
    if (customerId.startsWith("guest:")) throw new Error("Login required.");
    const existing = await this.subscription(id);
    if (existing) {
      if (existing.customer_id !== customerId || existing.plan_id !== planId || existing.interval !== interval) throw new Error("Subscription ownership mismatch.");
      return;
    }
    const { error } = await this.client().from("subscriptions").insert({ id, user_id: customerId, provider_plan_id: planId, billing_interval: interval, status: status.toLowerCase() });
    if (error) throw new Error("Could not save subscription.");
  }

  async subscription(id: string) {
    const { data, error } = await this.client().from("subscriptions").select("*").in("provider_plan_id", currentPayPalPlanIds(process.env)).eq("id", id).maybeSingle();
    if (error) throw new Error("Could not read subscription.");
    return data ? { ...data, customer_id: String(data.user_id), paypal_custom_id: String(data.paypal_custom_id ?? data.user_id), plan_id: String(data.provider_plan_id), interval: String(data.billing_interval) } : null;
  }

  async updateSubscription(id: string, status: string, _email?: string, event?: { id: string; time: string }, period?: { start?: string; end?: string }, observedAt = new Date().toISOString()) {
    const { error } = await this.client().rpc("qraftt_apply_verified_subscription", {
      p_id: id, p_status: status.toLowerCase(), p_observed_at: event?.time ?? observedAt,
      p_event_id: event?.id ?? null, p_period_start: period?.start ?? null, p_period_end: period?.end ?? null,
    });
    if (error) throw new Error("Could not update verified subscription.");
  }
}
