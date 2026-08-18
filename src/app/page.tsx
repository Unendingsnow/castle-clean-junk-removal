import Image from "next/image";
import Link from "next/link";

import QuoteForm from "@/components/QuoteForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StructuredData from "@/components/StructuredData";
import { SERVICE_PAGES } from "@/lib/services";
import { site } from "@/lib/site";

import constructionDebris from "@/images/work/construction-debris.jpg";
import drivewayLoad from "@/images/work/driveway-load.jpg";
import rig from "@/images/work/rig.jpg";
import transferStation from "@/images/work/transfer-station.jpg";
import yardWaste from "@/images/work/yard-waste.jpg";

const gallery = [
  {
    src: drivewayLoad,
    alt: "Trailer loaded with patio furniture, plywood and a bagged mattress on a suburban driveway",
    caption: "Garage clearout",
    place: "Residential driveway",
  },
  {
    src: yardWaste,
    alt: "Trailer stacked with cut brush, branches and reclaimed lumber",
    caption: "Yard debris & brush",
    place: "Storm cleanup",
  },
  {
    src: constructionDebris,
    alt: "Construction offcuts, sheeting and buckets stacked in a plywood bin on a new-build lot",
    caption: "Construction debris",
    place: "New build site",
  },
  {
    src: transferStation,
    alt: "Dump trailer full of demolition timber and roofing at the transfer station",
    caption: "Demolition load",
    place: "At the transfer station",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <StructuredData />

      <SiteHeader />

      <main id="top">
        {/* ---------------- Hero ---------------- */}
        <section className="relative isolate overflow-hidden bg-inverse">
          <Image
            src={drivewayLoad}
            alt=""
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
          />
          {/* Scrim keeps the headline legible over a busy daylight photo. */}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-r from-inverse via-inverse/90 to-inverse/40"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <p className="u-eyebrow text-xs text-inverse-accent">
              {site.slogan}
            </p>
            <h1 className="mt-5 max-w-3xl">
              <span className="u-display block text-[2.75rem] leading-[0.95] text-inverse-ink sm:text-6xl lg:text-7xl">
                {site.headline}
              </span>
              {/* Carries the ranking terms the display line deliberately
                  doesn't. Sized down so the hero still leads with the
                  headline rather than reading as two competing titles. */}
              <span className="mt-4 block text-lg font-semibold text-inverse-accent sm:text-xl">
                {site.headlineSupport}
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-inverse-muted">
              {site.subhead}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quote"
                className="u-cta-inverse rounded-xl bg-accent px-8 py-4 text-center text-lg font-bold text-accent-ink transition hover:bg-accent-strong"
              >
                Send photos, get a quote
              </a>
              <a
                href="#pricing"
                className="rounded-xl border border-inverse-ink/25 px-8 py-4 text-center text-lg font-bold text-inverse-ink transition hover:bg-inverse-ink/10"
              >
                See what it costs
              </a>
            </div>

            <dl className="mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-7 border-t border-inverse-ink/15 pt-8 lg:grid-cols-4">
              {site.trustPoints.map(([term, detail]) => (
                <div key={term}>
                  <dt className="u-display text-base text-inverse-ink">
                    {term}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-snug text-inverse-dim">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <div className="u-hazard" />

        {/* ---------------- Two ways to hire ---------------- */}
        <section id="pricing" className="scroll-mt-16">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <p className="u-eyebrow text-xs text-accent">Two ways to do it</p>
            <h2 className="u-display mt-3 text-4xl text-ink sm:text-5xl">
              We haul it, or you load it.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Pick whichever fits the job. One is hands-off and priced on the
              space it fills; the other is a flat rate and a trailer on your
              driveway for five days.
            </p>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {site.offers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex flex-col border border-line bg-surface p-7 sm:p-9"
                >
                  <p className="u-eyebrow text-[11px] text-accent">
                    {offer.eyebrow}
                  </p>
                  <h3 className="u-display mt-3 text-2xl text-ink sm:text-3xl">
                    {offer.title}
                  </h3>

                  <div className="mt-5 border-y border-line py-5">
                    <p className="u-display text-4xl text-accent">
                      {offer.price}
                    </p>
                    <p className="mt-1.5 font-mono text-xs text-muted">
                      {offer.priceNote}
                    </p>
                  </div>

                  <p className="mt-5 text-muted">{offer.body}</p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {offer.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-ink">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#quote"
                    className="u-cta mt-8 block rounded-lg bg-ink px-6 py-3.5 text-center font-bold text-canvas transition hover:bg-inverse"
                  >
                    {offer.cta}
                  </a>
                </div>
              ))}
            </div>

            {/* Already advertised on his own Facebook posts but missing from
                the site entirely. Camp Lejeune and Fort Bragg are both in the
                910 region, so this lands on a genuinely large local audience
                rather than being generic goodwill. */}
            <div className="mt-8 flex flex-col gap-3 border border-accent bg-accent-soft p-6 sm:flex-row sm:items-center sm:gap-5">
              <p className="u-display shrink-0 text-2xl text-accent">
                {site.veteranDiscount.percent}% off
              </p>
              <p className="text-ink">
                <span className="font-bold">Veterans, thank you.</span>{" "}
                {site.veteranDiscount.note}
              </p>
            </div>

            <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-muted">
              No charge to ask, and no obligation. Hazardous material (paint,
              solvents, oil, asbestos, chemicals, gas cylinders) needs
              specialized disposal and can&apos;t be taken.
            </p>
          </div>
        </section>

        {/* ---------------- Why choose us ----------------
            Placed directly after pricing because a tester read the whole page
            and still asked "why should I choose you?" — the trust points in
            the hero weren't answering it on their own. */}
        <section className="border-t border-line bg-inverse">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
            <p className="u-eyebrow text-xs text-inverse-accent">
              The difference
            </p>
            <h2 className="u-display mt-3 text-4xl text-inverse-ink sm:text-5xl">
              {site.whyUs.heading}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-inverse-muted">
              {site.whyUs.lede}
            </p>

            <ul className="mt-12 space-y-px">
              {site.whyUs.rows.map((row) => (
                <li
                  key={row.ours}
                  className="grid gap-3 bg-inverse-2 p-5 sm:grid-cols-2 sm:gap-8 sm:p-6"
                >
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 font-mono text-sm text-inverse-muted"
                    >
                      ✕
                    </span>
                    {/* De-emphasised by the strikethrough and the mark, not by
                        dimming the colour — inverse-dim on this panel only
                        reaches 3.5:1 and fails WCAG AA. */}
                    <span className="text-inverse-muted line-through decoration-inverse-muted/50">
                      {row.usual}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 font-mono text-sm text-inverse-accent"
                    >
                      ✓
                    </span>
                    <span className="font-semibold text-inverse-ink">
                      {row.ours}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- Services ---------------- */}
        <section
          id="services"
          className="scroll-mt-16 border-y border-line bg-surface-2"
        >
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <p className="u-eyebrow text-xs text-accent">What we take</p>
            <h2 className="u-display mt-3 text-4xl text-ink sm:text-5xl">
              If you want it gone, it&apos;s on the list.
            </h2>

            {/* Each card links to its own page — that's what lets the site
                rank for "hot tub removal wilmington" as well as "junk
                removal", and it spreads signal to the deeper pages. */}
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_PAGES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="u-card flex h-full flex-col border border-line bg-canvas p-6 transition hover:bg-accent-soft"
                  >
                    <h3 className="u-display text-lg text-ink">
                      {service.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                      {service.lede}
                    </p>
                    <span className="u-eyebrow mt-4 text-[10px] text-accent">
                      Read more →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <p className="u-eyebrow text-xs text-accent">How it works</p>
          <h2 className="u-display mt-3 text-4xl text-ink sm:text-5xl">
            Three steps, no pressure.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">{site.quoteFlow}</p>

          <ol className="mt-12 grid gap-10 sm:grid-cols-3">
            {site.steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-ink pt-5">
                <span className="u-eyebrow text-xs text-accent">
                  Step {index + 1}
                </span>
                <h3 className="u-display mt-3 text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-2.5 leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------------- Recent work ---------------- */}
        <section id="work" className="scroll-mt-16 bg-inverse">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
            <p className="u-eyebrow text-xs text-inverse-accent">
              Recent loads
            </p>
            <h2 className="u-display mt-3 text-4xl text-inverse-ink sm:text-5xl">
              Real jobs, real trailers.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-inverse-muted">
              Not stock photography. These are actual loads from around
              Wilmington.
            </p>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((shot) => (
                <li key={shot.caption} className="group">
                  <div className="relative aspect-4/3 overflow-hidden border border-inverse-ink/15">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      placeholder="blur"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="u-display mt-3 text-base text-inverse-ink">
                    {shot.caption}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-inverse-dim">
                    {shot.place}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- Owner-operated ---------------- */}
        <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-4/3 overflow-hidden border border-line">
              <Image
                src={rig}
                alt="The Castle Clean pickup and dump trailer, branded on the door"
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="u-eyebrow text-xs text-accent">
                Who turns up
              </p>
              <h2 className="u-display mt-3 text-4xl text-ink sm:text-5xl">
                You get the owner. Every time.
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                <p>
                  The national outfits send whichever crew is free that day, and
                  the person who quoted your job is never the person who does
                  it. Here they&apos;re the same person.
                </p>
                <p>
                  That means the price you were given is the price you pay,
                  nobody has to be told twice where the gate is, and
                  there&apos;s no dispatcher between you and the answer.
                </p>
                <p className="border-l-3 border-accent pl-5 text-ink">
                  It also means honesty about timing: this is one truck and one
                  trailer. You&apos;ll be told straight when the next opening
                  is rather than promised a slot that doesn&apos;t exist.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Service area ---------------- */}
        <section className="border-y border-line bg-surface-2">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <p className="u-eyebrow text-xs text-accent">Where we work</p>
            <h2 className="u-display mt-3 text-3xl text-ink">
              Across southeastern NC
            </h2>
            {/* No town list here on purpose. Naming towns commits the business
                to runs it may not want, and any name that isn't genuinely
                serviced is worse than saying nothing. */}
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              Based near Wilmington and Leland, working right across{" "}
              {site.seo.regionLabel}. One truck and one trailer, so the run has
              to make sense — but that covers a lot more ground than people
              tend to assume.
            </p>
            <p className="mt-6 text-muted">
              Not sure if you&apos;re in range? Ask anyway — include your town
              or ZIP with your photos and you&apos;ll get a straight answer
              either way.
            </p>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" className="scroll-mt-16">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
            <p className="u-eyebrow text-xs text-accent">Questions</p>
            <h2 className="u-display mt-3 text-4xl text-ink sm:text-5xl">
              The things people ask.
            </h2>

            <div className="mt-10 divide-y divide-line border-y border-line">
              {site.faqs.map((faq) => (
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

        {/* ---------------- Quote form ---------------- */}
        <section id="quote" className="scroll-mt-16 bg-inverse">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:py-24">
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
