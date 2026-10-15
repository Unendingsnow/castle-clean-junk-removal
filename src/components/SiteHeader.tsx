import Image from "next/image";
import Link from "next/link";

import { site } from "@/lib/site";

/**
 * Nav links are absolute (`/#pricing` rather than `#pricing`) so the same
 * header works on the homepage and on the service pages, where those sections
 * don't exist locally.
 */
const NAV = [
  ["Services", "/services"],
  ["Pricing", "/#pricing"],
  ["Our work", "/#work"],
  ["Areas", "/areas-we-serve"],
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.jpg"
            alt=""
            width={44}
            height={44}
            priority
            className="h-11 w-11 rounded-lg object-cover"
          />
          <span className="u-display text-base leading-none text-ink sm:text-lg">
            {site.shortName}
            <span className="u-eyebrow mt-1 block text-[10px] font-semibold text-accent">
              Junk Removal
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-11 items-center text-sm font-semibold text-muted transition hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${site.phoneE164}`}
            aria-label={`Call ${site.phone}`}
            className="flex min-h-11 items-center rounded-lg border border-line px-3.5 text-sm font-bold text-ink transition hover:border-ink"
          >
            Call<span className="hidden lg:inline">&nbsp;{site.phone}</span>
          </a>
          <a
            href={`sms:${site.phoneE164}`}
            aria-label={`Text ${site.phone}`}
            className="flex min-h-11 items-center rounded-lg border border-line px-3.5 text-sm font-bold text-ink transition hover:border-ink"
          >
            Text
          </a>
          <a
            href="#quote"
            className="u-cta hidden min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-bold text-accent-ink transition hover:bg-accent-strong sm:flex"
          >
            Get a price
          </a>
        </div>
      </div>
    </header>
  );
}
