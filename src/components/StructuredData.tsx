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
    priceRange: site.seo.priceRange,
    currenciesAccepted: "USD",
    areaServed: site.seo.areasServed.map((name) => ({
      "@type": "City",
      name,
      address: {
        "@type": "PostalAddress",
        addressLocality: name,
        addressRegion: "NC",
        addressCountry: "US",
      },
    })),
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
    areaServed: site.seo.areasServed.map((name) => ({
      "@type": "City",
      name,
    })),
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
