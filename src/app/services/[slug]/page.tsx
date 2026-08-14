import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import QuoteForm from "@/components/QuoteForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getService, SERVICE_PAGES } from "@/lib/services";
import { site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

import constructionDebris from "@/images/work/construction-debris.jpg";
import drivewayLoad from "@/images/work/driveway-load.jpg";
import rig from "@/images/work/rig.jpg";
import transferStation from "@/images/work/transfer-station.jpg";
import yardWaste from "@/images/work/yard-waste.jpg";

const IMAGES = {
  driveway: {
    src: drivewayLoad,
    alt: "Trailer loaded with furniture and plywood on a residential driveway",
  },
  yard: {
    src: yardWaste,
    alt: "Trailer stacked with cut brush, branches and reclaimed lumber",
  },
  construction: {
    src: constructionDebris,
    alt: "Construction offcuts and sheeting stacked in a bin on a new-build lot",
  },
  transfer: {
    src: transferStation,
    alt: "Dump trailer full of demolition timber at the transfer station",
  },
  rig: {
    src: rig,
    alt: "The Castle Clean pickup and dump trailer",
  },
};

// Every service page is known at build time, so they all ship as static HTML.
export function generateStaticParams() {
  return SERVICE_PAGES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${siteUrl}/services/${service.slug}`,
      type: "article",
      // Declaring openGraph here replaces the inherited object wholesale, so
      // the root share card has to be named again or these pages ship without
      // one and preview as a bare link.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const image = IMAGES[service.image];
  const others = SERVICE_PAGES.filter((s) => s.slug !== service.slug);
  const url = `${siteUrl}/services/${service.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.name,
        description: service.metaDescription,
        provider: { "@id": `${siteUrl}/#business` },
        areaServed: site.seo.areasServed.map((name) => ({
          "@type": "City",
          name,
        })),
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${siteUrl}/services`,
          },
          { "@type": "ListItem", position: 3, name: service.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
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
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-inverse">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/90 to-inverse/50"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-inverse-dim">
                <li>
                  <Link href="/" className="hover:text-inverse-accent">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/services" className="hover:text-inverse-accent">
                    Services
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-inverse-muted">{service.name}</li>
              </ol>
            </nav>

            <h1 className="u-display mt-6 max-w-3xl text-4xl leading-[1.02] text-inverse-ink sm:text-5xl lg:text-6xl">
              {service.h1}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-inverse-muted">
              {service.lede}
            </p>
            <a
              href="#quote"
              className="u-cta-inverse mt-8 inline-block rounded-xl bg-accent px-8 py-4 text-lg font-bold text-accent-ink transition hover:bg-accent-strong"
            >
              Send photos, get a quote
            </a>
          </div>
        </section>
        <div className="u-hazard" />

        {/* Body */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              {service.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              <p className="border-l-3 border-accent pl-5 text-ink">
                {service.priceNote}
              </p>
            </div>

            <aside className="border border-line bg-surface p-7">
              <h2 className="u-eyebrow text-[11px] text-accent">
                {service.takes.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {service.takes.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        {/* Service-specific FAQ */}
        <section className="border-y border-line bg-surface-2">
          <div className="mx-auto max-w-3xl px-5 py-16">
            <h2 className="u-display text-3xl text-ink">
              About this job in particular
            </h2>
            <div className="mt-8 divide-y divide-line border-y border-line">
              {service.faqs.map((faq) => (
                <details key={faq.q} className="u-faq group">
                  <summary className="flex cursor-pointer items-start justify-between gap-6 py-5 text-left">
                    <span className="u-display text-lg text-ink">{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className="u-faq-sign mt-1 shrink-0 text-2xl font-light leading-none text-accent transition-transform duration-200"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 pr-10 leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internal links — these are what spread ranking signal around */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="u-display text-3xl text-ink">Other things we do</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/services/${other.slug}`}
                  className="u-card block h-full border border-line bg-surface p-5 transition hover:bg-accent-soft"
                >
                  <span className="u-display text-lg text-ink">
                    {other.name}
                  </span>
                  <span className="mt-1.5 block text-sm text-muted">
                    {other.lede}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Quote form */}
        <section id="quote" className="scroll-mt-16 bg-inverse">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
            <div className="text-center">
              <p className="u-eyebrow text-xs text-inverse-accent">
                No charge to ask
              </p>
              <h2 className="u-display mt-3 text-4xl text-inverse-ink sm:text-5xl">
                Tell us what you&apos;ve got.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-inverse-muted">
                A few photos and a sentence is enough. You&apos;ll hear back{" "}
                {site.responseTime} — with a price, or a time to come look.
              </p>
            </div>
            <div className="mt-10">
              <QuoteForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
