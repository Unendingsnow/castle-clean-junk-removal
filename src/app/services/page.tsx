import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SERVICE_PAGES } from "@/lib/services";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Junk Removal Services, Wilmington NC",
  description:
    "Junk removal, dump trailer rental, estate cleanouts, construction debris, demolition and more around Wilmington, NC. Owner-operated, priced from photos.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndex() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${siteUrl}/services`,
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
                <li className="text-inverse-muted">Services</li>
              </ol>
            </nav>
            <h1 className="u-display mt-6 max-w-3xl text-4xl leading-[1.02] text-inverse-ink sm:text-5xl">
              Everything we take on
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-inverse-muted">
              Two ways to work: we do the lifting, or we drop a trailer and you
              load it at your own pace. Either way the price is agreed before
              anything moves.
            </p>
          </div>
        </section>
        <div className="u-hazard" />

        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_PAGES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="u-card flex h-full flex-col border border-line bg-surface p-6 transition hover:bg-accent-soft"
                >
                  <h2 className="u-display text-xl text-ink">{service.name}</h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                    {service.lede}
                  </p>
                  <span className="u-eyebrow mt-5 text-[10px] text-accent">
                    {service.priceNote.split(".")[0]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 border border-line bg-surface-2 p-8 text-center">
            <h2 className="u-display text-2xl text-ink">
              Not sure which you need?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Send photos of the job and you&apos;ll be told which option works
              out cheaper — including if that&apos;s the one where you do the
              loading.
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
