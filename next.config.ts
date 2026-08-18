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
