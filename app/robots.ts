import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: siteConfig.url,
    rules: [
      {
        allow: "/",
        userAgent: "OAI-SearchBot",
      },
      {
        allow: "/",
        userAgent: "Claude-SearchBot",
      },
      {
        allow: "/",
        userAgent: "PerplexityBot",
      },
      {
        allow: "/",
        userAgent: "*",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
