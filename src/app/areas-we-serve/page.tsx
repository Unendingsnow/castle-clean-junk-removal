import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SERVICE_PAGES } from "@/lib/services";
import { site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Areas We Serve — Leland, Wilmington & SE NC",
  description:
    "Junk removal, cleanouts and dump trailer rental across southeastern North Carolina — roughly forty miles out from the Wilmington and Leland area.",
  alternates: { canonical: "/areas-we-serve" },
};

/**
 * One honest coverage page rather than a separate near-duplicate page per town.
 *
 * Spinning up ten pages that differ only by a place name is the textbook
 * doorway-page pattern, and Google demotes it — often taking the rest of the
 * site's credibility with it. Individual town pages are worth building later,
 * but only once there's genuinely local content for each: jobs actually done
 * there, landmarks, disposal sites used, local specifics. Until then this
 * ranks better and risks nothing.
 */
export default function AreasWeServe() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Areas we serve",
        item: `${siteUrl}/areas-we-serve`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-canvas">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SiteHeader />

      <main>
        <section className="bg-inverse">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-inverse-dim">
                <li>
                  <Link href="/" className="hover:text-inverse-accent">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-inverse-muted">Areas we serve</li>
              </ol>
            </nav>
            <h1 className="u-display mt-6 max-w-3xl text-4xl leading-[1.02] text-inverse-ink sm:text-5xl">
              Where we work
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-inverse-muted">
              Based around Wilmington and Leland, working right across{" "}
              {site.seo.regionLabel}. One truck, one trailer, so the run has to
              make sense — but that covers more ground than people assume.
            </p>
          </div>
        </section>
        <div className="u-hazard" />

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="u-display text-3xl text-ink">How far we go</h2>

          {/* Deliberately not a town list. Naming towns commits the business
              to runs it may not want, and claiming a town that isn't really
              serviced is worse for trust than staying regional. */}
          <div className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
            <p>
              Roughly a forty-mile run out from the Wilmington and Leland area
              — which takes in most of {site.seo.regionLabel}, the coast, and a
              fair way inland.
            </p>
            <p>
              There&apos;s no hard boundary, because drive time is the real
              limit rather than a line on a map. A larger job further out often
              makes sense where a single mattress wouldn&apos;t, so it&apos;s
              always worth asking.
            </p>
            <p>
              Include your town or ZIP when you send photos and you&apos;ll get
              a straight answer either way — including &ldquo;that&apos;s too
              far, try someone closer&rdquo; if that&apos;s the honest answer.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="u-display text-3xl text-ink">
              What we do in those towns
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_PAGES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="u-card block h-full border border-line bg-surface p-5 transition hover:bg-accent-soft"
                  >
                    <span className="u-display text-lg text-ink">
                      {service.name}
                    </span>
                    <span className="mt-1.5 block text-sm text-muted">
                      {service.lede}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 border border-line bg-surface-2 p-8 text-center">
            <h2 className="u-display text-2xl text-ink">
              Not sure if you&apos;re in range?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Send the job and your ZIP. Costs nothing to find out.
            </p>
            <Link
              href="/#quote"
              className="u-cta mt-6 inline-block rounded-lg bg-accent px-7 py-3.5 font-bold text-accent-ink transition hover:bg-accent-strong"
            >
              Get a price
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
