import type { NextConfig } from "next";

/**
 * The production Vercel host, from before the custom domain existed.
 *
 * This is matched exactly rather than as `*.vercel.app` on purpose: preview
 * deployments get their own generated hostnames
 * (`castle-clean-git-<branch>-<scope>.vercel.app`), and a wildcard would
 * redirect every preview to production and make them impossible to review.
 */
const LEGACY_VERCEL_HOST = "castle-clean.vercel.app";
const CANONICAL_HOST = "www.castlecleanjunk.com";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop a response being re-interpreted as a type it isn't.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No reason for this site to be framed; blocks clickjacking.
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          /**
           * Send the origin but never the path to other sites.
           *
           * This one matters more here than on a typical site: /r URLs carry
           * a customer's phone number or email in the query string, and a
           * full-URL referrer would hand those to any host the browser talks
           * to next. /r tightens this further below.
           */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // The handoff route leaks nothing at all, not even the origin.
        source: "/r",
        headers: [
          { key: "Referrer-Policy", value: "no-referrer" },
          // Belt and braces alongside the noindex tag on the page itself.
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          // Never let a URL containing customer details sit in a shared cache.
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      /**
       * Send the old Vercel host to the real domain, permanently.
       *
       * It currently serves the entire site as a second, fully indexable copy.
       * Whatever ranking the business has today is attached to that hostname,
       * so this is a redirect rather than a `noindex`: a 308 consolidates the
       * existing signal onto the new domain, while a `noindex` would simply
       * discard it and start the domain from nothing.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: LEGACY_VERCEL_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
