import { env } from "@/lib/env";
import type { MetadataRoute } from "next";

/**
 * Robots.txt configuration
 * Next.js automatically serves this at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/private/"],
      },
      // Add specific rules for different bots if needed
      // {
      //   userAgent: "Googlebot",
      //   allow: "/",
      //   disallow: ["/admin/"],
      // },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
