/**
 * Canonical public origin, used for metadata, canonical tags, sitemap and
 * robots.
 *
 * `www.castlecleanjunk.com` is the real domain and is hardcoded as the
 * production default on purpose.
 *
 * It used to fall back to `VERCEL_PROJECT_PRODUCTION_URL`, which resolved to
 * `castle-clean.vercel.app` even after the custom domain was attached. That
 * published `<link rel="canonical" href="https://castle-clean.vercel.app">`
 * on every page of the real site — telling Google the preview host was the
 * authoritative copy and leaving the real domain unable to rank for its own
 * content. Deriving the canonical domain from the deploy environment is what
 * caused that, so the value the business actually owns is stated here instead.
 *
 * www, not the apex: castlecleanjunk.com already 308-redirects to www at the
 * edge, so www is the address that resolves and the one canonicals must use.
 *
 * NEXT_PUBLIC_SITE_URL still overrides for staging or a future domain change.
 */
const PRODUCTION_URL = "https://www.castlecleanjunk.com";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? PRODUCTION_URL
    : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Loud build-time warning if a production build would publish localhost URLs
 * into its own sitemap and canonical tags.
 */
if (process.env.NODE_ENV === "production" && siteUrl.includes("localhost")) {
  console.warn(
    "\n[seo] WARNING: building for production with siteUrl = " +
      siteUrl +
      "\n[seo] Canonical tags and the sitemap will point at localhost." +
      "\n[seo] Unset NEXT_PUBLIC_SITE_URL to fall back to " +
      PRODUCTION_URL +
      ".\n",
  );
}
