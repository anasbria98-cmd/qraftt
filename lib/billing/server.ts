import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { AccountBillingStore } from "@/lib/billing/account-store";
import { currentUser } from "@/lib/supabase/server";

const cookieName = "qraftt_customer";
let store: AccountBillingStore | undefined;
export function getBillingStore() {
  if (!store) {
    store = new AccountBillingStore();
  }
  return store;
}
export async function billingCustomer(create = false) {
  const user = await currentUser();
  if (user) return user.id;
  const jar = await cookies();
  let token = jar.get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    if (!create) throw new Error("Customer session required.");
    token = randomBytes(32).toString("hex");
    jar.set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return `guest:${createHash("sha256").update(token).digest("hex")}`;
}
export function sameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}
