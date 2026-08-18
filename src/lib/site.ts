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
 * - No public phone number. Every inquiry routes through the form so it lands
 *   in Telegram with photos attached, and gets called back properly.
 */
export const site = {
  name: "Castle Clean Junk Removal",
  shortName: "Castle Clean",
  slogan: "We clear. You keep.",

  headline: "Junk gone. Yard untouched.",

  /**
   * Second line of the H1, rendered smaller directly beneath `headline`.
   *
   * `headline` alone is pure brand voice — it contains neither "junk removal"
   * nor "Wilmington", which left the single strongest on-page signal on the
   * most important page carrying no ranking terms at all. The keywords were
   * present only in the subhead paragraph, which counts for considerably less.
   *
   * This is deliberately a real, visible sentence rather than hidden text or a
   * stuffed keyword string: someone landing cold from a search result learns
   * what the business does and where it operates without reading further,
   * which is the same job the H1 does for a crawler.
   */
  headlineSupport: "Junk removal and cleanouts in Wilmington, NC",

  /** Hero paragraph. Free to be longer than a meta description needs to be. */
  subhead:
    "Owner-operated junk removal and cleanouts around Wilmington. Send a few photos and we'll get straight back to you — no crews, no call center, no surprise charges.",

  /**
   * Separate from `subhead` purely for length. Google truncates around 155-160
   * characters, and the hero paragraph reads better slightly longer than that,
   * so tying the two together forces one of them to be worse.
   */
  metaDescription:
    "Owner-operated junk removal, cleanouts and dump trailer rental around Wilmington, NC. Send photos, get a straight answer — priced before any work starts.",

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
   *
   * Deliberately conservative. One person cannot guarantee a same-day reply
   * while they're on a job with a trailer, and a tester specifically asked
   * "price or estimate, and how long?" -- so this answers both plainly rather
   * than implying an instant response.
   */
  responseTime: "normally within one business day",

  /**
   * How quoting actually works, stated once and reused everywhere.
   *
   * Deliberately NOT "a firm price from photos". Photos hide volume, access
   * and weight, and binding the price before seeing the job puts the risk on
   * a one-person operation that can't absorb it. Equally, driving out to quote
   * every single mattress burns an hour of the only worker's day.
   *
   * So: photos filter and inform, small jobs get priced on the spot, bigger
   * ones get looked at properly, and nothing is charged until the number is
   * agreed.
   */
  quoteFlow:
    "Straightforward jobs get a price right there. Bigger or awkward ones get a time booked so it can be looked at properly. Either way, nothing gets touched until the price is agreed.",

  /**
   * Direct answer to "why should I choose you?", which a tester asked outright
   * after reading the page -- meaning the trust points alone weren't landing.
   *
   * Framed against how the job usually goes rather than against a named
   * competitor. "No BS, no surprises" is the tester's own phrasing; they
   * flagged it as the thing they liked, so it leads.
   */
  whyUs: {
    heading: "Why choose us?",
    lede: "No BS, no surprises. Here's the difference in plain terms.",
    rows: [
      {
        usual: "A crew you've never met, sent out by a dispatcher",
        ours: "The person who quotes your job is the person who shows up",
      },
      {
        usual: "A number that creeps up once the truck is half loaded",
        ours: "Agreed before anything is touched, and it doesn't move after that",
      },
      {
        usual: "Hourly rates that climb while you watch them work",
        ours: "Priced on the space it fills, so a slower day costs you nothing",
      },
      {
        usual: "A steel dumpster dropped on your driveway",
        ours: "A trailer on tires that leaves the concrete and grass alone",
      },
      {
        usual: "“Call for a quote”, then a sales pitch",
        ours: "Send photos, get a straight answer back, walk away if it isn't for you",
      },
    ],
  },

  /** The two ways to work with the business. */
  offers: [
    {
      id: "full-service",
      eyebrow: "We do the work",
      title: "Full-service removal",
      price: "Priced by volume",
      priceNote: "Agreed before any work starts — never after",
      body: "You point at it, we carry it out and haul it away. Everything from a single mattress to a full estate cleanout — loaded, swept up, and gone.",
      points: [
        "We do all the lifting and loading",
        "Priced on the space it takes in the trailer, not by the hour",
        "Photos first, so nobody wastes a trip — no charge to ask",
        "Swept clean before we leave",
      ],
      cta: "Send photos for a quote",
    },
    {
      id: "trailer",
      eyebrow: "You load it",
      title: "Dump trailer drop-off",
      price: "$300 flat",
      priceNote: "5 days · up to 2 tons included · $79 per ton after",
      body: "We drop a 7×14 dump trailer at your place, leave it with you for five days, and haul it away when you're done. Cheaper than full service if you have the time and can do the lifting yourself.",
      points: [
        "7×14 dump trailer delivered and picked up",
        "Five full days to work at your own pace",
        "Dump fees for the first 2 tons included",
        "Rolls on tires — no damage to lawns or driveways",
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
      body: "Fill out the form with what you've got and snap a couple of pictures. Takes about a minute, and there's no charge to ask.",
    },
    {
      title: "We get back to you",
      body: "Normally within one business day. Straightforward jobs get a price right there. Bigger or awkward ones get a time booked so it can be looked at properly first.",
    },
    {
      title: "Price agreed, then we clear it",
      body: "Nothing gets touched until you've heard the number and said yes. Then it's loaded, the space gets swept, and whatever can be donated or recycled goes that way first.",
    },
  ],

  trustPoints: [
    ["Owner-operated", "Same person quotes it and hauls it"],
    ["Priced upfront", "Agreed before any work starts"],
    ["Yard friendly", "Trailer on tires, not a dropped skid"],
    ["Cleared properly", "Donated and recycled where we can"],
  ],

  faqs: [
    {
      q: "How much does it cost?",
      a: "Full-service removal is priced on how much room your load takes up in the trailer, not by weight or by the hour. Send photos and you'll hear back within a business day — a straightforward job gets a price there and then, a bigger one gets a time booked to look at it properly. Nothing is charged until you've agreed the number. If you'd rather load it yourself, the dump trailer is a flat $300 for five days including dump fees up to 2 tons, then $79 a ton after that.",
    },
    {
      q: "Do you need to come out and look before quoting?",
      a: "Sometimes. A couch, a mattress or a cleared-out garage can be priced straight from photos — no point either of us waiting on a visit for that. A full house, a demolition job, or anything where access looks tight is worth looking at in person, and we'll book a time. The photos decide which it is, which is why they're worth sending.",
    },
    {
      q: "Will the trailer wreck my driveway or lawn?",
      a: "No. It's a 7×14 dump trailer on tires, not a steel skid dropped off the back of a roll-off truck. That's the main reason people pick it over a traditional dumpster — no gouged concrete, no ruts across the grass.",
    },
    {
      q: "How soon can you come out?",
      a: "It depends on what's already booked that week. This is an owner-operated business, so you're not getting slotted in by a dispatcher — your quote comes back with the next honest opening, not a date that sounds good.",
    },
    {
      q: "Do I need to be there?",
      a: "Not always. If everything is outside or in an unlocked garage and the price is agreed, plenty of jobs get done without the customer on site.",
    },
    {
      q: "What can't you take?",
      a: "Hazardous material is the main one — paint, solvents, oil, asbestos, chemicals and gas cylinders all need specialized disposal. If you're not sure, put it in the photos and ask.",
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
