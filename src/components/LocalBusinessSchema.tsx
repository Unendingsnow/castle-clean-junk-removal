import { site } from "@/lib/site";
import { siteUrl } from "@/lib/site-url";

/**
 * LocalBusiness structured data.
 *
 * For a business like this, "junk removal near me" is the main way new
 * customers appear, and search engines lean on this markup to decide which
 * local queries the site should show up for. Anything unverified is left out
 * rather than guessed -- a wrong address in here is worse than no address.
 */
export default function LocalBusinessSchema() {
  const address = site.seo.postalAddress;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.name,
    description: site.subhead,
    slogan: site.slogan,
    url: siteUrl,
    image: `${siteUrl}/logo.jpg`,
    logo: `${siteUrl}/logo.jpg`,
    // No `telephone` — enquiries route through the form so they land in
    // Telegram with photos attached. Publishing a number would bypass that.
    email: site.email,
    priceRange: site.seo.priceRange,
    areaServed: site.seo.areasServed.map((name) => ({
      "@type": "City",
      name,
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
      name: "Services",
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

  return (
    <script
      type="application/ld+json"
      // Content is entirely from our own config, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
