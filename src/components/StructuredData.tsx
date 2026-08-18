import { site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

/**
 * Structured data for the whole site.
 *
 * Three separate graphs, all linked by @id so search engines understand they
 * describe one business:
 *
 *  - LocalBusiness — feeds the local pack and knowledge panel
 *  - FAQPage       — eligible for expandable FAQ rich results
 *  - Service       — carries the real trailer price, which can surface
 *                    directly in results
 *
 * Nothing unverified goes in here. No address (there isn't a confirmed one),
 * no telephone (deliberately not published), and no aggregateRating — inventing
 * review counts is exactly what gets structured data ignored or penalised.
 */

const BUSINESS_ID = `${siteUrl}/#business`;

/**
 * Coverage as a radius rather than an enumerated town list.
 *
 * Shared by the business and the trailer service so the two can never drift
 * apart and describe different coverage for the same operation.
 *
 * The centre is a public city centroid, not the operating base — see the note
 * on `serviceAreaGeo` in site.ts before changing these numbers.
 */
const SERVICE_AREA = {
  "@type": "GeoCircle",
  geoMidpoint: {
    "@type": "GeoCoordinates",
    latitude: site.seo.serviceAreaGeo.latitude,
    longitude: site.seo.serviceAreaGeo.longitude,
  },
  geoRadius: String(site.seo.serviceAreaGeo.radiusMeters),
} as const;

export default function StructuredData() {
  const address = site.seo.postalAddress;

  const business = {
    "@type": "HomeAndConstructionBusiness",
    "@id": BUSINESS_ID,
    name: site.name,
    alternateName: site.shortName,
    description: site.metaDescription,
    slogan: site.slogan,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/logo.jpg`,
    email: site.email,
    /**
     * Present in markup but deliberately not rendered on the page.
     *
     * Worth being straight about the trade-off: Google's structured data
     * guidelines ask that markup describe content visible to the reader, and
     * this doesn't. The realistic downside is that Google discounts or
     * ignores the field — a manual action over a real, verifiable phone
     * number the business publishes on its own Facebook page is not a
     * plausible outcome.
     *
     * It's here because a LocalBusiness with no telephone at all is a much
     * bigger local-ranking problem, and because the number needs to match
     * Google Business Profile exactly for NAP consistency. If Google ends up
     * ignoring it, the fix is to surface it in the footer.
     */
    telephone: site.phoneE164,
    priceRange: site.seo.priceRange,
    currenciesAccepted: "USD",
    areaServed: SERVICE_AREA,
    openingHoursSpecification: site.seo.openingHours.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: spec.days,
      opens: spec.opens,
      closes: spec.closes,
    })),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address.street,
            addressLocality: address.locality,
            addressRegion: address.region,
            postalCode: address.postalCode,
            addressCountry: address.country,
          },
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Junk removal and cleanout services",
      itemListElement: site.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.body,
        },
      })),
    },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: site.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  // The trailer has a real published price, so it gets a real Offer. Full
  // service is quoted per job, so it carries no price rather than a fake one.
  const trailerService = {
    "@type": "Service",
    "@id": `${siteUrl}/#trailer-rental`,
    name: "Dump trailer rental",
    serviceType: "Dumpster / dump trailer rental",
    description:
      "7x14 dump trailer delivered to your property for five days. You load it at your own pace, we haul it away. Rolls on tires so it doesn't damage lawns or driveways.",
    provider: { "@id": BUSINESS_ID },
    areaServed: SERVICE_AREA,
    offers: {
      "@type": "Offer",
      price: "300",
      priceCurrency: "USD",
      description:
        "Flat rate for 5 days, including disposal of up to 2 tons. $79 per ton thereafter.",
      availability: "https://schema.org/InStock",
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [business, faq, trailerService],
  };

  return (
    <script
      type="application/ld+json"
      // Content comes entirely from our own config, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
