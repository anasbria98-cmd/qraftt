import { currentUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", Vary: "Cookie" };
export async function GET() {
  try {
    const user = await currentUser();
    // Header presentation only. No token, email, plan or other account data is exposed.
    return Response.json({ authenticated: Boolean(user) }, { headers });
  } catch {
    return Response.json({ error: "Account status is temporarily unavailable." }, { status: 503, headers });
  }
}
