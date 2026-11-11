import type { MetadataRoute } from "next";

import { AI_CRAWLERS } from "@/lib/ai-bots";

/**
 * Search engines may index the public pages; the signed-in app, the back
 * office and the API stay out of every index. AI crawlers are asked to stay
 * off the whole site (the proxy also refuses them, see lib/ai-bots.ts).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...AI_CRAWLERS], disallow: "/" },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ar/app", "/en/app", "/ar/admin", "/en/admin"],
      },
    ],
  };
}
