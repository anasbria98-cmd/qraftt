/** Retired: never create, claim, change or cancel a PayPal agreement. */
export function POST() { return Response.json({ error: "Qraftt is free. Subscription checkout is no longer available." }, { status: 410, headers: { "Cache-Control": "no-store" } }); }
export const GET = POST;
