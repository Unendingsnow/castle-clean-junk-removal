import Image from "next/image";
import Link from "next/link";

import { SERVICE_PAGES } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * The footer carries a full service list on every page.
 *
 * That's deliberate: it gives every page an internal link to every other one,
 * which is how ranking signal moves around a small site. It also means a
 * visitor who lands on a demolition page from search can find the trailer
 * rental without going back to Google.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-inverse-ink/10 bg-inverse">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]">
          <div className="flex items-start gap-4">
            <Image
              src="/logo.jpg"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div>
              <p className="u-display text-lg text-inverse-ink">{site.name}</p>
              <p className="u-eyebrow mt-1 text-[10px] text-inverse-accent">
                {site.slogan}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-inverse-muted">
                Serving {site.serviceArea}. {site.hours}.
              </p>
            </div>
          </div>

          <nav aria-label="Services">
            <p className="u-eyebrow text-[10px] text-inverse-dim">Services</p>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {SERVICE_PAGES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex min-h-9 items-center text-sm text-inverse-muted transition hover:text-inverse-accent"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="u-eyebrow text-[10px] text-inverse-dim">Contact</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4">
              <a
                href={`tel:${site.phoneE164}`}
                className="inline-flex min-h-11 items-center font-semibold text-inverse-accent transition hover:text-inverse-ink"
              >
                Call {site.phone}
              </a>
              <a
                href={`sms:${site.phoneE164}`}
                className="inline-flex min-h-11 items-center font-semibold text-inverse-accent transition hover:text-inverse-ink"
              >
                Text
              </a>
            </p>
            <p className="mt-1">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center font-semibold text-inverse-accent transition hover:text-inverse-ink"
              >
                {site.email}
              </a>
            </p>
            <p className="mt-1">
              <Link
                href="/areas-we-serve"
                className="inline-flex min-h-11 items-center text-inverse-muted transition hover:text-inverse-ink"
              >
                Areas we serve
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-inverse-ink/10 pt-6 font-mono text-[11px] text-inverse-dim">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
