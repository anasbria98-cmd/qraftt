import { AuthPage } from "@/components/account/auth-page";
export const metadata = { title: "Log in" };
export default function LoginPage(props: { searchParams: Promise<{ message?: string; next?: string }> }) { return <AuthPage mode="login" {...props} />; }
