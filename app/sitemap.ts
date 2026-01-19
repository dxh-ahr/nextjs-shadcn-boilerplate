import { env } from "@/lib/env";
import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap generation
 * Next.js automatically serves this at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Define your routes here
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    // Add more routes as your app grows
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.8,
    // },
  ];

  return routes;
}
