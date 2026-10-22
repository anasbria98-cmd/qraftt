import { AuthPage } from "@/components/account/auth-page";
import { requireUser } from "@/lib/supabase/server";
export const metadata = { title: "Set a new password" };
export default async function ResetPasswordPage(props: { searchParams: Promise<{ message?: string; next?: string }> }) { await requireUser(); return <AuthPage mode="reset" {...props} />; }
