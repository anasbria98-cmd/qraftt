import { AuthPage } from "@/components/account/auth-page";
export const metadata = { title: "Reset password" };
export default function ForgotPasswordPage(props: { searchParams: Promise<{ message?: string; next?: string }> }) { return <AuthPage mode="forgot" {...props} />; }
