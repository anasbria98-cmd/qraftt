import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { dashboardAccount } from "@/lib/account/dashboard";
import { DashboardShell } from "@/components/account/dashboard-shell";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  const { user } = await dashboardAccount();
  return <DashboardShell email={user.email ?? "Your account"}>{children}</DashboardShell>;
}
