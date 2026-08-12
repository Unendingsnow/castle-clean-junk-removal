"use client";

import { useEffect, useState } from "react";

/**
 * Mockup-only control for switching between the two design directions.
 *
 * Not part of the real site — set NEXT_PUBLIC_SHOW_DESIGN_TOGGLE=false (or
 * delete the component from page.tsx) once a direction is chosen.
 */

const DESIGNS = [
  { value: "brand", label: "Brand", hint: "From the logo" },
  { value: "yard", label: "Yard", hint: "Alternate direction" },
] as const;

export const DESIGN_STORAGE_KEY = "castleclean-design";

export default function DesignToggle() {
  const [active, setActive] = useState<string>("brand");

  // The inline script in layout.tsx has already applied the stored choice
  // before paint; this just syncs React's copy of it.
  useEffect(() => {
    setActive(document.documentElement.dataset.design || "brand");
  }, []);

  function choose(value: string) {
    document.documentElement.dataset.design = value;
    setActive(value);
    try {
      localStorage.setItem(DESIGN_STORAGE_KEY, value);
    } catch {
      // Private browsing with storage disabled — the toggle still works for
      // this page view, it just won't be remembered.
    }
  }

  return (
    <aside
      aria-label="Design preview switcher"
      className="fixed bottom-24 right-4 z-[60] sm:bottom-4"
    >
      <div className="rounded-xl border border-line bg-canvas/95 p-1.5 shadow-lg backdrop-blur">
        <p className="u-eyebrow px-1.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted">
          Design
        </p>
        <div className="flex gap-1">
          {DESIGNS.map((design) => (
            <button
              key={design.value}
              type="button"
              onClick={() => choose(design.value)}
              aria-pressed={active === design.value}
              title={design.hint}
              className={`min-h-9 rounded-lg px-3 text-xs font-bold transition ${
                active === design.value
                  ? "bg-accent text-accent-ink"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {design.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
