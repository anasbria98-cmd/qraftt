import { adSenseClientId } from "@/lib/integrations";

export const dynamic = "force-static";

export function GET() {
  if (!adSenseClientId) {
    return new Response("AdSense is not configured.\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
      status: 404,
    });
  }

  const publisherId = adSenseClientId.replace(/^ca-/, "");
  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}
