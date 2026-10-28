import "server-only";
import { cache } from "react";
import { requireUser, authClient } from "@/lib/supabase/server";
import { accountLimits } from "@/lib/billing/limits";

export const dashboardAccount = cache(async () => {
  const user = await requireUser();
  const client = await authClient();
  const profile = await client.from("profiles").select("display_name").eq("id", user.id).single();
  if (profile.error) throw new Error("Your account details could not be loaded. Please retry.");
  return { user, displayName: profile.data.display_name as string | null, access: { status: "FREE", ...accountLimits } };
});
