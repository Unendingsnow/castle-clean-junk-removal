/**
 * Canonical public origin, used for metadata, canonical tags, sitemap and
 * robots.
 *
 * Order matters. An explicit NEXT_PUBLIC_SITE_URL always wins, because once a
 * custom domain is attached that is the only address that should ever appear
 * in a canonical tag or a sitemap. Vercel's own host is the fallback.
 *
 * Getting this wrong is quietly expensive: canonicals pointing at
 * `*.vercel.app` tell Google the preview domain is the real site, and the
 * custom domain then struggles to rank for its own content.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Loud build-time warning if a production build would publish localhost URLs
 * into its own sitemap and canonical tags.
 */
if (
  process.env.NODE_ENV === "production" &&
  siteUrl.includes("localhost")
) {
  console.warn(
    "\n[seo] WARNING: building for production with siteUrl = " +
      siteUrl +
      "\n[seo] Canonical tags and the sitemap will point at localhost." +
      "\n[seo] Set NEXT_PUBLIC_SITE_URL to the real domain.\n",
  );
}
