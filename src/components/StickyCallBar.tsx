import { site } from "@/lib/site";

/**
 * Fixed call/quote bar for phones.
 *
 * The header phone number is hidden below the `sm` breakpoint to keep the bar
 * from crowding, which left mobile visitors with no way to call once they
 * scrolled past the hero. Since most of this traffic will be on a phone, and
 * some people will always rather ring than fill in a form, the two actions
 * follow them down the page.
 */
export default function StickyCallBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas/95 p-3 backdrop-blur sm:hidden"
    >
      <div className="flex gap-2.5">
        <a
          href={site.phoneHref}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-accent-strong px-4 text-base font-bold text-accent-strong transition active:bg-accent-soft"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.6a1 1 0 01-.25 1l-2.2 2.2z" />
          </svg>
          Call
        </a>
        <a
          href="#quote"
          className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-accent px-4 text-base font-bold text-accent-ink transition active:bg-accent-strong"
        >
          Get a quote
        </a>
      </div>
    </nav>
  );
}
