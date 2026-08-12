import Image from "next/image";

import DesignToggle from "@/components/DesignToggle";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import QuoteForm from "@/components/QuoteForm";
import StickyCallBar from "@/components/StickyCallBar";
import { site } from "@/lib/site";

// Mockup-only. Set to "false" in the environment to hide it for production.
const SHOW_DESIGN_TOGGLE =
  process.env.NEXT_PUBLIC_SHOW_DESIGN_TOGGLE !== "false";

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <LocalBusinessSchema />

      <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="flex items-center gap-2.5">
            <Image
              src="/logo.jpg"
              alt=""
              width={44}
              height={44}
              priority
              className="h-11 w-11 rounded-md object-cover"
            />
            <span className="u-display text-base font-extrabold leading-tight tracking-tight text-ink sm:text-lg">
              {site.shortName}
              <span className="u-eyebrow block text-[11px] font-semibold uppercase tracking-wider text-accent">
                Junk Removal
              </span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href={site.phoneHref}
              className="hidden min-h-11 items-center px-2 text-sm font-bold text-ink hover:text-accent sm:flex"
            >
              {site.phone}
            </a>
            <a
              href="#quote"
              className="u-cta flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-bold text-accent-ink transition hover:bg-accent-strong"
            >
              Get a quote
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="u-hazard bg-inverse">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
            <p className="u-eyebrow text-sm font-bold uppercase tracking-[0.2em] text-inverse-accent">
              {site.slogan}
            </p>
            <h1 className="u-display mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-inverse-ink sm:text-5xl">
              {site.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-inverse-muted">
              {site.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#quote"
                className="u-cta-inverse rounded-xl bg-canvas px-7 py-4 text-center text-lg font-bold text-ink shadow-lg transition hover:bg-surface-2"
              >
                Send photos, get a price
              </a>
              <a
                href={site.phoneHref}
                className="rounded-xl border border-inverse-ink/30 px-7 py-4 text-center text-lg font-bold text-inverse-ink transition hover:bg-inverse-ink/10"
              >
                Call {site.phone}
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-inverse-ink/15 pt-8 sm:grid-cols-4">
              {site.trustPoints.map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-base font-bold text-inverse-ink">
                    {term}
                  </dt>
                  <dd className="mt-1 text-sm text-inverse-dim">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Services */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
          <h2 className="u-display text-3xl font-extrabold tracking-tight text-ink">
            What we take on
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            If it needs hauling away, cutting back, or cleaning up, it&apos;s
            probably on this list. If it isn&apos;t, ask anyway.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.services.map((service) => (
              <div
                key={service.title}
                className="u-card rounded-xl border border-line bg-surface p-6 transition hover:border-accent/40 hover:bg-accent-soft"
              >
                <h3 className="u-display text-lg font-bold text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 text-muted">{service.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-line bg-surface-2">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
            <h2 className="u-display text-3xl font-extrabold tracking-tight text-ink">
              How it works
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              {site.steps.map((step, index) => (
                <li key={step.title}>
                  <div className="u-step flex h-11 w-11 items-center justify-center rounded-full bg-accent text-lg font-extrabold text-accent-ink">
                    {index + 1}
                  </div>
                  <h3 className="u-display mt-4 text-lg font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Quote form */}
        <section id="quote" className="scroll-mt-20 bg-canvas">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
            <div className="text-center">
              <h2 className="u-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Get your free quote
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
                Tell us what you&apos;ve got and add a few photos. We&apos;ll
                come back with a straight price — usually the same day.
              </p>
            </div>

            <div className="mt-10">
              <QuoteForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-inverse">
        <div className="mx-auto max-w-5xl px-5 py-12">
          <div className="flex flex-col justify-between gap-8 sm:flex-row">
            <div className="flex items-start gap-3">
              <Image
                src="/logo.jpg"
                alt=""
                width={52}
                height={52}
                className="h-13 w-13 rounded-md object-cover"
              />
              <div>
                <p className="u-display text-lg font-extrabold text-inverse-ink">
                  {site.name}
                </p>
                <p className="text-sm font-semibold text-inverse-accent">
                  {site.slogan}
                </p>
                <p className="mt-2 max-w-sm text-sm text-inverse-muted">
                  Serving {site.serviceArea}. {site.hours}.
                </p>
              </div>
            </div>
            <div className="text-sm">
              <p>
                <a
                  href={site.phoneHref}
                  className="inline-flex min-h-11 items-center font-bold text-inverse-accent hover:text-inverse-ink"
                >
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex min-h-11 items-center text-inverse-muted hover:text-inverse-ink"
                >
                  {site.email}
                </a>
              </p>
            </div>
          </div>
          {/* Bottom padding clears the fixed mobile call bar. */}
          <p className="mt-10 border-t border-inverse-ink/10 pb-20 pt-6 text-xs text-inverse-dim sm:pb-0">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </footer>

      <StickyCallBar />
      {SHOW_DESIGN_TOGGLE && <DesignToggle />}
    </div>
  );
}
