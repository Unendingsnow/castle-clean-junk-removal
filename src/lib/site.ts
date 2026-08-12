/**
 * Everything business-specific lives here. Change these values and the whole
 * site updates -- no need to touch any component.
 *
 * Name, slogan and palette are taken from the client's existing logo
 * (`public/logo.jpg`). The brand colours are defined in `app/globals.css`.
 */
export const site = {
  name: "Castle Clean Junk Removal",
  shortName: "Castle Clean",
  slogan: "We clear. You keep.",

  headline: "Junk cleared fast, and the place left tidy.",
  description:
    "Same-week junk removal, cleanouts, yard work and property maintenance. Send a few photos and get a straight price back — no site visit needed for most jobs.",

  // TODO: replace both with the real number from the client's business card.
  phone: "(555) 123-4567",
  phoneHref: "tel:+15551234567",
  // TODO: replace with the real address.
  email: "hello@castlecleanjunk.com",

  serviceArea: "the greater metro area and surrounding towns",
  hours: "Mon-Sat, 7am - 6pm",

  services: [
    {
      title: "Junk removal",
      body: "Single items to full truckloads. Furniture, appliances, mattresses, e-waste, construction debris — loaded and hauled, floor swept after.",
    },
    {
      title: "Property cleanouts",
      body: "Garages, basements, attics, storage units, estate and rental turnovers. We sort what's donatable and dispose of the rest responsibly.",
    },
    {
      title: "Yard & lot clearing",
      body: "Brush, branches, leaf haul-off, overgrowth cutback and general lot cleanup so the property shows well again.",
    },
    {
      title: "Property maintenance",
      body: "Mowing, trimming, gutter clearing, pressure washing and seasonal upkeep on a one-off or recurring basis.",
    },
    {
      title: "Light demolition",
      body: "Sheds, decks, fencing, old playsets and interior teardown — dismantled and carried out in one visit.",
    },
    {
      title: "Landlord & agent work",
      body: "Fast turnarounds between tenants, pre-listing cleanups and standing arrangements for managed portfolios.",
    },
  ],

  steps: [
    {
      title: "Send photos",
      body: "Fill out the form below and attach a few pictures of the job. Takes about a minute.",
    },
    {
      title: "Get a price",
      body: "We look at the photos and text or call you back with a straight number — no site visit needed for most jobs.",
    },
    {
      title: "We clear it",
      body: "Pick a time that works. We show up, load everything, and leave the space clean.",
    },
  ],

  trustPoints: [
    ["Same week", "Most jobs scheduled fast"],
    ["Upfront pricing", "Quoted before we start"],
    ["Fully cleared", "We sweep up after"],
    ["Responsible disposal", "Donated or recycled first"],
  ],

  /**
   * Feeds the LocalBusiness structured data that search engines read for
   * "junk removal near me" style queries.
   */
  seo: {
    /**
     * Towns the business actually covers. Search engines use these to decide
     * which local queries to show the site for, so replace these with real
     * ones -- wrong towns are worse than none.
     */
    // TODO: replace with David's real coverage list.
    areasServed: ["Springfield", "Shelbyville", "Ogdenville", "North Haverbrook"],

    /**
     * Postal address. Left null on purpose: publishing a made-up address is
     * actively harmful for local ranking and trust, so the address is simply
     * omitted from the markup until there's a real one.
     */
    // TODO: fill in once David confirms, or leave null if he has no shopfront.
    postalAddress: null as null | {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    },

    /** Schema.org opening hours. Mirrors `hours` above. */
    openingHours: [
      {
        days: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "07:00",
        closes: "18:00",
      },
    ],

    priceRange: "$$",
  },
} as const;
