import type { MetadataRoute } from "next";

import { SERVICE_PAGES } from "@/lib/services";
import { siteUrl } from "@/lib/site-url";

/**
 * When the page copy was last genuinely edited.
 *
 * Bump this by hand when content actually changes.
 *
 * It used to be `new Date()`, which stamped every URL with the build time —
 * so a deploy that only touched a config file still told Google all ten pages
 * had been rewritten. Google openly ignores `lastmod` from sites where it
 * doesn't correlate with real changes, which throws away the one thing the
 * field is good for: getting genuinely updated pages recrawled quickly.
 */
const CONTENT_UPDATED = new Date("2026-08-18");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...SERVICE_PAGES.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      // The trailer rental is the strongest commercial term on the site and
      // the one no local competitor is targeting, so it leads the pack.
      priority: service.slug === "dump-trailer-rental" ? 0.9 : 0.8,
    })),
    {
      url: `${siteUrl}/areas-we-serve`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
