"use client";

import { Analytics } from "@vercel/analytics/next";

/**
 * Vercel Web Analytics, with the reply-handoff route excluded.
 *
 * Analytics reports the full URL of each pageview, query string included —
 * Vercel's own documentation is explicit that "URLs and query parameters can
 * include sensitive data and personal information" and offers `beforeSend`
 * precisely so it can be stripped.
 *
 * `/r` carries a customer's phone number or email address in its query string,
 * so without this every tap of a Text/Call/Email button in Telegram would ship
 * that customer's contact details to a third-party analytics endpoint. Those
 * events are dropped outright rather than redacted: the pageview count for a
 * private redirect page is worth nothing, so there is no reason to send a
 * scrubbed version either.
 *
 * This wrapper exists because `beforeSend` is a function prop, and functions
 * can't be passed from a server component — the root layout — into a client
 * one. Keep `<Analytics />` out of the layout and use this instead.
 */
export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          if (new URL(event.url).pathname.startsWith("/r")) return null;
        } catch {
          // An unparseable URL is not worth reporting either.
          return null;
        }
        return event;
      }}
    />
  );
}
