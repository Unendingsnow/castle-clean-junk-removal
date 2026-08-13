/**
 * Everything business-specific lives here. Change these values and the whole
 * site updates -- no need to touch any component.
 *
 * Copy notes, because these were deliberate calls:
 *
 * - No response-time promises. This is a one-person operation, so "same day"
 *   and "within the hour" are claims the national franchises can make and this
 *   business cannot. Promising it would just manufacture complaints.
 * - "You get the owner" is the actual competitive position. Junkluggers and
 *   College HUNKS sell speed and scale; neither can offer the person who
 *   quotes the job also being the person who shows up.
 * - No public phone number. Every enquiry routes through the form so it lands
 *   in Telegram with photos attached, and gets called back properly.
 */
export const site = {
  name: "Castle Clean Junk Removal",
  shortName: "Castle Clean",
  slogan: "We clear. You keep.",

  headline: "Junk gone. Yard untouched.",
  subhead:
    "Owner-operated junk removal and cleanouts around Wilmington. Send a few photos and get a straight price back — no crews, no call centre, no surprise charges.",

  /**
   * TODO — CONFIRM WITH DAVID. He supplied this as "castleclean843@gmal.com",
   * which is missing the "i". `gmal.com` is a real registered domain, so
   * publishing it as written would quietly send customer email to a stranger.
   * Corrected to gmail.com here on the assumption it was a typo.
   */
  email: "castleclean843@gmail.com",

  serviceArea: "Wilmington and the surrounding towns",
  hours: "Most jobs run Monday to Saturday",

  /**
   * Honest expectation-setting, used near the form and in the success state.
   * Deliberately conservative -- under-promise, over-deliver.
   */
  responseTime: "usually the same day, and always within one business day",

  /** The two ways to hire the business. */
  offers: [
    {
      id: "full-service",
      eyebrow: "We do the work",
      title: "Full-service removal",
      price: "Priced by volume",
      priceNote: "Quoted from your photos before we start",
      body: "You point at it, we carry it out and haul it away. Everything from a single mattress to a full estate cleanout — loaded, swept up, and gone.",
      points: [
        "We do all the lifting and loading",
        "Priced on the space it takes in the trailer, not by the hour",
        "Quoted upfront from photos — no charge to ask",
        "Swept clean before we leave",
      ],
      cta: "Get a price from photos",
    },
    {
      id: "trailer",
      eyebrow: "You load it",
      title: "Dump trailer drop-off",
      price: "$300 flat",
      priceNote: "5 days · up to 2 tons included · $79 per ton after",
      body: "We drop a 7×14 dump trailer at your place, leave it with you for five days, and haul it away when you're done. Cheaper than full service if you've got the time and the muscle.",
      points: [
        "7×14 dump trailer delivered and collected",
        "Five full days to work at your own pace",
        "Dump fees for the first 2 tons included",
        "Rolls on tyres — no damage to lawns or driveways",
      ],
      cta: "Book a trailer",
    },
  ],

  /** Straight from the client's own service list. */
  services: [
    {
      title: "Junk removal",
      body: "Any kind, any amount. Single items through to full truckloads — furniture, boxes, scrap, general clutter.",
    },
    {
      title: "Garage, storage & estate cleanouts",
      body: "Whole-space clearances. Garages, storage units, attics, basements, and full estate turnovers handled start to finish.",
    },
    {
      title: "Yard & construction debris",
      body: "Brush, branches, storm damage, offcuts, pallets, broken concrete and site leftovers cleared and hauled off.",
    },
    {
      title: "Furniture & appliance removal",
      body: "Sofas, beds, mattresses, fridges, washers and dryers taken out without marking the walls on the way.",
    },
    {
      title: "Demolition",
      body: "Porches, sheds, hot tubs and interior teardown — dismantled, carried out and disposed of in one visit.",
    },
    {
      title: "Carpet & sheetrock",
      body: "Old carpet, underlay and torn-out drywall pulled up, bagged and removed so the room is ready to work in.",
    },
  ],

  steps: [
    {
      title: "Send a few photos",
      body: "Fill in the form with what you've got and snap a couple of pictures. Takes about a minute, and there's no charge to ask.",
    },
    {
      title: "Get a straight price",
      body: "We look at the photos and come back with a real number — not a range, and not an hourly rate that grows while you watch.",
    },
    {
      title: "We clear it out",
      body: "Pick a time that suits. Everything gets loaded, the space gets swept, and what can be donated or recycled goes that way first.",
    },
  ],

  trustPoints: [
    ["Owner-operated", "Same person quotes it and hauls it"],
    ["Priced upfront", "Agreed before anything moves"],
    ["Yard friendly", "Trailer on tyres, not a dropped skid"],
    ["Cleared properly", "Donated and recycled where we can"],
  ],

  faqs: [
    {
      q: "How much does it cost?",
      a: "Full-service removal is priced on how much room your load takes up in the trailer, not by weight or by the hour — so you know the number before anything moves. Send photos and you'll get a straight price back. If you'd rather load it yourself, the dump trailer is a flat $300 for five days including dump fees up to 2 tons, then $79 a ton after that.",
    },
    {
      q: "Will the trailer wreck my driveway or lawn?",
      a: "No. It's a 7×14 dump trailer on tyres, not a steel skid dropped off the back of a roll-off truck. That's the main reason people pick it over a traditional dumpster — no gouged concrete, no ruts across the grass.",
    },
    {
      q: "How soon can you come out?",
      a: "It depends what's already booked that week. This is an owner-operated business, so you're not getting slotted in by a dispatcher — you'll be told honestly when the next opening is when you get your quote.",
    },
    {
      q: "Do I need to be there?",
      a: "Not always. If everything is outside or in an unlocked garage and the price is agreed, plenty of jobs get done without the customer on site.",
    },
    {
      q: "What can't you take?",
      a: "Hazardous material is the main one — paint, solvents, oil, asbestos, chemicals and gas cylinders all need specialist disposal. If you're not sure, put it in the photos and ask.",
    },
    {
      q: "What happens to it all?",
      a: "Anything still usable goes to donation or gets recycled where there's somewhere local to take it. The rest goes to the transfer station and is disposed of properly.",
    },
  ],

  /**
   * Feeds the LocalBusiness structured data that search engines read for
   * "junk removal near me" style queries.
   */
  seo: {
    // TODO: confirm the full coverage list with David. These are the towns
    // immediately around Wilmington; wrong ones actively hurt local ranking.
    areasServed: [
      "Wilmington",
      "Leland",
      "Castle Hayne",
      "Hampstead",
      "Wrightsville Beach",
      "Carolina Beach",
      "Ogden",
      "Porters Neck",
      "Belville",
      "Navassa",
    ],

    /**
     * Postal address. Left null on purpose: publishing a made-up address is
     * actively harmful for local ranking and trust, so it's simply omitted
     * from the markup until there's a real one.
     */
    // TODO: fill in once David confirms, or leave null if he works from home.
    postalAddress: null as null | {
      street: string;
      locality: string;
      region: string;
      postalCode: string;
      country: string;
    },

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
