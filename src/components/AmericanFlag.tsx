/**
 * The US flag, drawn to the official specification in the Castle Clean
 * palette.
 *
 * Deliberately an inline SVG and not an image file:
 *
 *  - Licensing. The flag design itself is public domain, but a *photograph*
 *    of a flag belongs to whoever took it. Dropping a stock photo onto a
 *    commercial site is a real exposure, and an easy one to avoid.
 *  - Weight. No extra request, no layout shift, and it stays sharp at any
 *    size on any display. The hero already loads a large photo.
 *  - Palette. Stock #B31942 red and #0A3161 blue are cool, and they fight the
 *    warm neutrals the rest of the site is built from. Recoloring an image to
 *    match would mean editing a binary; here it's four constants.
 *
 * Geometry follows Executive Order 10834: hoist-to-fly 1:1.9, union 7/13 of
 * the hoist and 2/5 of the fly, thirteen stripes starting and ending on the
 * red, and the nine-row 6/5 alternating star grid. All fifty stars are here —
 * which is why the hero renders this at ~112px rather than badge size. Much
 * below ~110px the stars stop resolving and turn to mush.
 */

/** 1:1.9, at a size where every stripe lands on a whole number. */
const WIDTH = 1235;
const HEIGHT = 650;

const STRIPE = HEIGHT / 13; // 50
const UNION_W = WIDTH * 0.4; // 494
const UNION_H = STRIPE * 7; // 350

/**
 * Site tokens standing in for the flag's own colors, so the mark belongs to
 * the page rather than sitting on top of it. Kept as literals rather than CSS
 * variables because an SVG `fill` can't read a Tailwind theme token.
 *
 * The union is the same navy as the dark sections. On the hero it therefore
 * reads as part of the ground rather than a solid block — intentional, and
 * the reason the flag carries a hairline border there. Lift it to
 * `--color-inverse-2` (#16283f) if it needs to sit on its own.
 */
const SIGNAL_ORANGE = "#b03517"; // --color-accent, in place of flag red
const CANVAS_CREAM = "#f4f1ea"; // --color-canvas, warmer than pure white
const LOGO_NAVY = "#0d1a2b"; // --color-inverse, in place of flag blue
const FLAG_GOLD = "#f0c24b"; // --color-inverse-accent, for the stars

/** Star centres: nine rows, alternating six and five, evenly spaced. */
const STAR_COLUMN = UNION_W / 12; // 41.1667
const STAR_ROW = UNION_H / 10; // 35

const STARS = Array.from({ length: 9 }, (_, row) => {
  const count = row % 2 === 0 ? 6 : 5;
  // Even rows sit on odd multiples of the column unit and odd rows on even
  // ones, which is what produces the offset grid.
  return Array.from({ length: count }, (_, i) => ({
    x: STAR_COLUMN * (row % 2 === 0 ? 2 * i + 1 : 2 * i + 2),
    y: STAR_ROW * (row + 1),
  }));
}).flat();

/**
 * One five-pointed star, centred on the origin, outer radius 20.
 *
 * Points alternate between the outer radius and an inner radius of
 * R * sin(18°)/sin(54°) — the regular pentagram ratio, which is what keeps
 * the arms straight instead of pinched.
 */
const STAR_PATH =
  "M 0,-20 L 4.49,-6.18 L 19.02,-6.18 L 7.27,2.36 L 11.76,16.18 " +
  "L 0,7.64 L -11.76,16.18 L -7.27,2.36 L -19.02,-6.18 L -4.49,-6.18 Z";

export default function AmericanFlag({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      // Decorative: the wording underneath carries the meaning, so announcing
      // "American flag" here would only make screen readers repeat themselves.
      aria-hidden="true"
      focusable="false"
    >
      {/* Seven orange stripes, laid as a field with six cream ones over it. */}
      <rect width={WIDTH} height={HEIGHT} fill={SIGNAL_ORANGE} />
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect
          key={i}
          y={STRIPE * i}
          width={WIDTH}
          height={STRIPE}
          fill={CANVAS_CREAM}
        />
      ))}

      <rect width={UNION_W} height={UNION_H} fill={LOGO_NAVY} />

      <g fill={FLAG_GOLD}>
        {STARS.map((star) => (
          <path
            key={`${star.x}-${star.y}`}
            d={STAR_PATH}
            transform={`translate(${star.x} ${star.y})`}
          />
        ))}
      </g>
    </svg>
  );
}
