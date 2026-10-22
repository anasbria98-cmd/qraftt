type AuthFailure = { code?: string; status?: number };
export function authFailureMessage(error: AuthFailure) {
  switch (error.code) {
    case "user_already_exists": case "email_exists": return "This email is already registered. Please log in, or reset your password.";
    case "email_not_confirmed": return "Confirm your email before logging in. Check your inbox and spam folder.";
    case "email_address_not_authorized": return "Email delivery is not configured for this address yet. Contact support@qraftt.com. Your pending checkout has not been cancelled.";
    case "over_email_send_rate_limit": case "over_request_rate_limit": return "Too many email or login requests. Please wait before trying again. Your pending checkout has not been cancelled.";
    case "weak_password": return "Choose a stronger password with at least 12 characters.";
    case "invalid_credentials": return "Email or password is incorrect. Log in with your Qraftt credentials, not your PayPal credentials, or reset your password.";
    case "signup_disabled": return "New accounts are not available right now. If you already have an account, log in instead.";
    case "email_address_invalid": return "Check your email address and try again.";
    default: return "We couldn’t complete this request. Try again shortly, or contact support@qraftt.com if it continues. Your pending checkout is safe.";
  }
}
