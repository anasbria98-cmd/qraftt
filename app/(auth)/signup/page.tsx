import { AuthPage } from "@/components/account/auth-page";
export const metadata = { title: "Sign up" };
export default function SignupPage(props: { searchParams: Promise<{ message?: string; next?: string }> }) { return <AuthPage mode="signup" {...props} />; }
