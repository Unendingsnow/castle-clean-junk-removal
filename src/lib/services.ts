/**
 * Service landing pages.
 *
 * A one-page site can realistically rank for one cluster of terms. Somebody
 * searching "hot tub removal wilmington nc" or "dumpster rental leland nc" is
 * a different searcher with different intent, and a homepage section will not
 * win those. Each of these is a page with its own title, its own copy and its
 * own questions.
 *
 * Every page carries genuinely distinct content on purpose. Spinning six
 * near-identical pages off one template is the classic doorway-page mistake
 * and Google demotes it, so nothing here is templated boilerplate with the
 * service name swapped in.
 */

export type ServicePage = {
  slug: string;
  /** Nav and breadcrumb label. */
  name: string;
  /** <title> — keyword-led, aim for under 60 characters. */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lede: string;
  /** Image key, matched against the gallery in the page component. */
  image: "driveway" | "yard" | "construction" | "transfer" | "rig";
  body: string[];
  takes: { heading: string; items: string[] };
  priceNote: string;
  faqs: { q: string; a: string }[];
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "junk-removal",
    name: "Junk removal",
    metaTitle: "Junk Removal in Wilmington, NC",
    metaDescription:
      "Owner-operated junk removal across Wilmington and the surrounding towns. Single items to full trailer loads, priced and agreed before any work starts.",
    h1: "Junk removal in Wilmington, NC",
    lede: "One item or a full trailer, hauled away by the person who quoted it.",
    image: "driveway",
    body: [
      "Most junk removal jobs start the same way: something has been sitting in a garage, a spare room or a side yard for months, and moving it takes a truck, a trailer and a second pair of hands you don't have. That's the entire job description here.",
      "Pricing works on volume — how much room the load takes up in the trailer — rather than by the hour or by weight. Hourly pricing rewards working slowly, and weight-based pricing means you can't be told the number until it's already on the scales. Volume means the figure is agreed before anything is touched, and it doesn't move afterwards.",
      "Because this is an owner-operated business, the person reading your photos is the person doing the lifting. Nothing gets lost between a call center, a dispatcher and whichever crew was free. If access is awkward, if there's a gate code, if the fridge has to come down a narrow stairwell — you tell one person once.",
    ],
    takes: {
      heading: "Commonly hauled",
      items: [
        "Sofas, armchairs, mattresses and bed frames",
        "Fridges, washers, dryers and other appliances",
        "Boxes, bags and general household clutter",
        "Old TVs, computers and electronics",
        "Bikes, tools, exercise equipment",
        "Scrap timber, metal and broken furniture",
      ],
    },
    priceNote:
      "Priced by the space it fills, agreed before any work starts. No charge to ask.",
    faqs: [
      {
        q: "Do you take single items?",
        a: "Yes. A single mattress or one broken washer is a perfectly normal job — you don't need a full load to be worth booking.",
      },
      {
        q: "Do I need to move everything outside first?",
        a: "No. Carrying it out is the service. If it's easier for you to stage things in the driveway that's fine and can bring the price down, but it isn't expected.",
      },
    ],
  },

  {
    slug: "dump-trailer-rental",
    name: "Dump trailer rental",
    metaTitle: "Dump Trailer Rental in Wilmington, NC",
    metaDescription:
      "7x14 dump trailer delivered in Wilmington, NC. $300 flat for 5 days including 2 tons of disposal, $79 per ton after. Rolls on tires — no damage to your driveway.",
    h1: "Dump trailer rental in Wilmington, NC",
    lede: "$300 flat for five days. We drop it, you fill it, we haul it away.",
    image: "transfer",
    body: [
      "If you have the time and can do the lifting yourself, this is the cheaper way to clear a property. A 7×14 dump trailer gets delivered to your place and left with you for five full days. Fill it at whatever pace works — evenings, a weekend, across the whole week — and when you're done we pick it up and take it to the transfer station.",
      "The flat $300 covers delivery, five days on site, pickup and disposal of up to two tons. Past two tons it's $79 a ton, charged on the actual weight ticket rather than an estimate. The price does not go up day by day, and there is no separate haul-away fee added at the end.",
      "The reason most people pick this over a traditional roll-off dumpster is the surface it sits on. A roll-off gets dragged off the back of a truck on steel skids, which is how driveways end up gouged and lawns end up rutted. This rolls in on tires and rolls back out on tires. It's the difference between a cleanup and a cleanup plus a concrete repair.",
    ],
    takes: {
      heading: "Well suited to",
      items: [
        "Whole-house or garage clearouts done over a weekend",
        "Renovation and remodel debris",
        "Roofing tear-offs and siding",
        "Landscaping, brush and yard waste",
        "Moving-out clearances with a hard deadline",
        "Anyone who'd rather load it themselves and save the labor",
      ],
    },
    priceNote:
      "$300 flat · 5 days · up to 2 tons included · $79 per ton after.",
    faqs: [
      {
        q: "Will it damage my driveway or lawn?",
        a: "No. It's a trailer on pneumatic tires, not a steel-skidded roll-off container. That's the main reason people choose it over a conventional dumpster — no gouged concrete and no ruts across the grass.",
      },
      {
        q: "What if I need it longer than five days?",
        a: "Ask when you book. Extra days are usually workable depending on what else is scheduled that week.",
      },
      {
        q: "How much is two tons?",
        a: "Roughly a full 7x14 trailer of general household junk, or about half a trailer of heavy material like roofing, tile, plaster or wet timber. Dense loads hit the weight limit long before they fill the space.",
      },
    ],
  },

  {
    slug: "estate-and-storage-cleanouts",
    name: "Estate & storage cleanouts",
    metaTitle: "Estate & Storage Cleanouts, Wilmington NC",
    metaDescription:
      "Full property, garage and storage unit cleanouts around Wilmington, NC. Sorted, cleared and swept, with donatable items separated out first.",
    h1: "Estate and storage cleanouts",
    lede: "Whole-space clearances, handled with a bit of care about what's in them.",
    image: "driveway",
    body: [
      "Cleanouts are rarely just about volume. An estate clearance usually follows a bereavement, and a storage unit that's been paid for over years tends to hold things people have forgotten they own. Both need someone who will slow down when it matters rather than treat every box as landfill.",
      "The working method is straightforward: anything obviously of value or clearly personal gets set aside for you to look at rather than loaded. Anything still usable goes toward donation. The rest is disposed of properly. If you want to walk the space first and mark what stays, that works — and if you'd rather not be there at all, that works too.",
      "Storage units are usually straightforward to price from a photo of the open door, because the frame gives an honest sense of the depth and the stack. A full house is different — for those it's normally worth walking it in person first, and a time gets booked to do that. Either way the photos come first, so nobody wastes a trip.",
    ],
    takes: {
      heading: "Typically covers",
      items: [
        "Full estate and probate clearances",
        "Storage units at the end of a rental",
        "Garages, attics, basements and crawl spaces",
        "Rental turnovers between tenants",
        "Pre-listing clearouts before a house goes on the market",
        "Hoarding situations, handled without commentary",
      ],
    },
    priceNote:
      "Units priced from photos; whole houses walked in person first. Sorted before it's loaded.",
    faqs: [
      {
        q: "Can you sort donatable items separately?",
        a: "Yes, and it's the default. Anything still usable goes toward donation rather than the transfer station wherever there's somewhere local taking it.",
      },
      {
        q: "Do you need me to be there for the whole job?",
        a: "No. Plenty of cleanouts are done with the owner elsewhere once access and the price are agreed. If there are things you want set aside, mark them or send a photo beforehand.",
      },
    ],
  },

  {
    slug: "construction-debris-removal",
    name: "Construction debris removal",
    metaTitle: "Construction Debris Removal, Wilmington",
    metaDescription:
      "Site cleanup and construction debris hauling around Wilmington, NC. Offcuts, sheetrock, roofing, pallets and broken concrete cleared for contractors and homeowners.",
    h1: "Construction debris removal",
    lede: "Site clearance for contractors, remodelers and DIY jobs that got away.",
    image: "construction",
    body: [
      "Building work generates debris faster than anyone plans for. Offcuts, packaging, broken board, torn-out fixtures and the pile that accumulates behind the dumpster because the dumpster filled up on day two. Clearing it is the difference between a site that can be worked in and one that can't.",
      "For contractors, the useful part is scheduling around the trade rather than around a call center. A load taken at the end of a framing stage, or a clear-down before the finish trades arrive, can be arranged directly with the person driving the truck.",
      "For homeowners who took on a project themselves, this is often the last step nobody costed for. Either the debris gets hauled full-service, or the dump trailer gets dropped for five days and you load it as you go — that second option tends to work out cheaper on a long renovation.",
    ],
    takes: {
      heading: "Site material taken",
      items: [
        "Timber offcuts, framing scrap and pallets",
        "Sheetrock, plaster and torn-out drywall",
        "Roofing tear-off, shingles and underlay",
        "Siding, trim and old windows",
        "Broken concrete, brick and block in manageable amounts",
        "Packaging, sheeting and general site waste",
      ],
    },
    priceNote:
      "Full-service or drop the trailer for five days and load as you go.",
    faqs: [
      {
        q: "Can you work around an active site?",
        a: "Yes. Timing gets agreed directly rather than through a dispatcher, so clearing between stages is usually straightforward.",
      },
      {
        q: "Is there a weight limit on heavy material?",
        a: "Dense loads like concrete, tile and wet plaster hit weight limits well before they fill the space. Mention what it is in your photos and the quote will account for it rather than surprising you later.",
      },
    ],
  },

  {
    slug: "furniture-and-appliance-removal",
    name: "Furniture & appliance removal",
    metaTitle: "Furniture & Appliance Removal, Wilmington",
    metaDescription:
      "Sofa, mattress, fridge and washer removal around Wilmington, NC. Carried out without marking the walls, and recycled or donated where possible.",
    h1: "Furniture and appliance removal",
    lede: "The heavy awkward things, carried out without wrecking the doorframe.",
    image: "driveway",
    body: [
      "Sofas that came in before the doorway was narrowed, mattresses nobody wants to put in a car, fridges that need two people and a stair trolley. These are the jobs where hiring somebody actually saves money, because the alternative usually involves a friend's back and a scraped hallway.",
      "Getting things out cleanly is most of the skill. Doors come off hinges where they need to, corners get protected, and awkward stairwells get worked out before anything is lifted rather than halfway up.",
      "Appliances go for recycling wherever there's somewhere local taking them — metal in particular is worth keeping out of the ground. Furniture in usable condition goes toward donation rather than straight to the transfer station.",
    ],
    takes: {
      heading: "Regularly removed",
      items: [
        "Sofas, sectionals, recliners and armchairs",
        "Mattresses, box springs and bed frames",
        "Fridges, freezers, washers, dryers and ovens",
        "Wardrobes, dressers and flat-pack that won't survive a move",
        "Desks, filing cabinets and office furniture",
        "Televisions and electronics",
      ],
    },
    priceNote:
      "Priced per item or per load. Awkward access is fine — just mention it.",
    faqs: [
      {
        q: "Can you get it down a narrow staircase?",
        a: "Usually. Send a photo of the stairwell along with the item and any doubt gets resolved before booking rather than on the day.",
      },
      {
        q: "What happens to a fridge or a washer?",
        a: "Appliances go for recycling wherever there's a local facility taking them, so the metal is recovered rather than buried.",
      },
    ],
  },

  {
    slug: "demolition",
    name: "Demolition",
    metaTitle: "Shed, Deck & Hot Tub Removal, Wilmington",
    metaDescription:
      "Light demolition around Wilmington, NC. Sheds, decks, porches, hot tubs and interior teardown dismantled, carried out and hauled away in one visit.",
    h1: "Shed, deck and hot tub demolition",
    lede: "Taken apart, carried out and hauled off — all in the same visit.",
    image: "transfer",
    body: [
      "A rotten deck, a shed that's given up, or a hot tub that hasn't been filled in four years all present the same problem: the demolition and the disposal are one job, and most people can only solve half of it. Renting a saw doesn't help if there's nowhere for the pile to go.",
      "Hot tubs are the most common of these and the most underestimated. They're heavier than they look, usually fiberglass over a timber frame with an insulated shell, and they generally have to be cut down before they'll clear a gate. That's a saw, a plan and somewhere to put the pieces.",
      "Interior teardown works the same way — cabinets, partition walls, old bathroom fittings, built-in units. Everything comes out, gets loaded, and the room is left ready for whoever's working in it next.",
    ],
    takes: {
      heading: "Structures taken down",
      items: [
        "Hot tubs and spas, cut down and removed",
        "Storage sheds and outbuildings",
        "Decks, porches and steps",
        "Fencing and old playsets",
        "Interior partitions, cabinets and built-ins",
        "Bathroom and kitchen strip-outs",
      ],
    },
    priceNote:
      "Demolition and disposal quoted together — never one without the other.",
    faqs: [
      {
        q: "Do you handle the disposal too?",
        a: "Always. Demolition and haul-away are quoted as one job, because a pile of broken deck in your yard isn't a finished job.",
      },
      {
        q: "Is a hot tub really that hard to remove?",
        a: "Harder than most people expect. They're heavy, awkward, and usually have to be cut into sections to get through a gate. It's a routine job here, but it's not a two-people-and-a-truck afternoon.",
      },
    ],
  },

  {
    slug: "carpet-and-sheetrock-removal",
    name: "Carpet & sheetrock removal",
    metaTitle: "Carpet & Sheetrock Removal, Wilmington",
    metaDescription:
      "Old carpet, underlay and torn-out drywall pulled up, bagged and hauled away around Wilmington, NC. Rooms left clear and ready to work in.",
    h1: "Carpet and sheetrock removal",
    lede: "Pulled up, bagged and gone — floors left ready for what's next.",
    image: "construction",
    body: [
      "Carpet removal is unpleasant more than it is difficult. It's dusty, it's bulkier once it's up than it looked down, and old underlay tends to come away in pieces along with a few hundred tack strips and staples. Getting it out of the house is the awkward part.",
      "Carpet gets cut into manageable rolls rather than dragged through the house whole, which keeps the walls intact and the dust down. Tack strips and staples come up with it so the subfloor is genuinely ready for whatever's going down next, not just uncovered.",
      "Sheetrock is the same story with more weight. Torn-out drywall is dense and it fills a trailer quickly, so it's worth being clear about the room count when asking for a price — the weight matters more than the volume on these loads.",
    ],
    takes: {
      heading: "Cleared and hauled",
      items: [
        "Carpet, underlay and padding",
        "Tack strips, staples and gripper",
        "Vinyl, laminate and floating floors",
        "Torn-out drywall and plaster",
        "Ceiling tiles and old insulation",
        "Skirting, trim and baseboards",
      ],
    },
    priceNote:
      "Priced by room count and material — mention how many rooms when you ask.",
    faqs: [
      {
        q: "Do you take the tack strips and staples up too?",
        a: "Yes. Leaving them behind just moves the job to whoever lays the new floor, so they come up as part of the same visit.",
      },
      {
        q: "Can you do it before a floor fitter arrives?",
        a: "That's the usual arrangement. Scheduling is agreed directly, so lining it up the day before a fitter is booked is straightforward.",
      },
    ],
  },
];

export function getService(slug: string): ServicePage | undefined {
  return SERVICE_PAGES.find((service) => service.slug === slug);
}
