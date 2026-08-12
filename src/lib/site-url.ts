/**
 * Canonical public origin, used for metadata, sitemap and robots.
 *
 * Vercel injects the production host automatically, so this only needs setting
 * by hand once a custom domain is attached.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
