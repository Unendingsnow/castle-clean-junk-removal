import type { MetadataRoute } from "next";

import { SERVICE_PAGES } from "@/lib/services";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...SERVICE_PAGES.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      // The trailer rental is the strongest commercial term on the site and
      // the one no local competitor is targeting, so it leads the pack.
      priority: service.slug === "dump-trailer-rental" ? 0.9 : 0.8,
    })),
    {
      url: `${siteUrl}/areas-we-serve`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
