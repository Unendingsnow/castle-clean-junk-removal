"use client";

import { useEffect, useState } from "react";

import {
  draftBody,
  EMAIL_SUBJECT,
  type HandoffAction,
} from "@/lib/contact-links";

const LABELS: Record<HandoffAction, { verb: string; app: string }> = {
  sms: { verb: "Opening Messages", app: "Open Messages" },
  call: { verb: "Starting call", app: "Call now" },
  email: { verb: "Opening Mail", app: "Open Mail" },
};

/**
 * Build the native-scheme URL.
 *
 * The SMS scheme is genuinely inconsistent between platforms: iOS wants the
 * body separated with `&`, everyone else follows RFC 5724 and wants `?`.
 * Getting it wrong doesn't error — it opens Messages with an empty draft, or
 * with the body glued onto the phone number — so it's worth the sniff.
 */
function nativeUrl(action: HandoffAction, target: string, name: string) {
  if (action === "call") return `tel:${target}`;

  if (action === "sms") {
    const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
    return `sms:${target}${isApple ? "&" : "?"}body=${encodeURIComponent(draftBody(name))}`;
  }

  const params = new URLSearchParams({
    subject: EMAIL_SUBJECT,
    body: draftBody(name),
  });
  return `mailto:${target}?${params.toString()}`;
}

export default function Handoff({
  action,
  target,
  name,
}: {
  action: HandoffAction;
  target: string;
  name: string;
}) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const url = nativeUrl(action, target, name);
    setHref(url);

    /**
     * Try the handoff automatically, but keep the button below.
     *
     * Telegram opens links in its own in-app browser, and those are
     * inconsistent about following a custom scheme without a user gesture —
     * iOS in particular blocks it often enough that an auto-redirect alone
     * would look broken. The automatic attempt covers the common case; the
     * button covers the rest. Never remove the button in favour of the
     * redirect.
     */
    const timer = window.setTimeout(() => {
      window.location.href = url;
    }, 350);
    return () => window.clearTimeout(timer);
  }, [action, target, name]);

  const label = LABELS[action];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-7 bg-inverse px-6 text-center">
      <div>
        <p className="u-eyebrow text-xs text-inverse-accent">Castle Clean</p>
        <p className="u-display mt-3 text-3xl text-inverse-ink">
          {label.verb}…
        </p>
        <p className="mt-3 font-mono text-sm text-inverse-muted">{target}</p>
      </div>

      {/* The fallback, and on iOS usually the thing that actually works. */}
      <a
        href={href ?? "#"}
        className="u-cta-inverse rounded-xl bg-accent px-8 py-4 text-lg font-bold text-accent-ink transition hover:bg-accent-strong"
      >
        {label.app}
      </a>

      <p className="max-w-xs text-sm leading-relaxed text-inverse-dim">
        Didn&apos;t open automatically? Tap the button above.
      </p>
    </div>
  );
}
