import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Nothing useful to crawl here, and it only accepts POST anyway.
        "/api/",
        // Reply-handoff links. Their query strings carry a customer's phone
        // number and email address, so they must never be crawled or indexed.
        // The page also sets a noindex robots tag, for crawlers that take the
        // tag seriously but ignore this file.
        "/r",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
