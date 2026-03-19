import { Helmet } from "react-helmet";
import { useLanguage } from "@/context/language-context";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}

export function OrganizationSchema() {
  const { t } = useLanguage();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: t("schema.org.name"),
        url: t("schema.org.url"),
        logo: t("schema.org.logo"),
        description: t("schema.org.description"),
        email: t("schema.org.email"),
        sameAs: [],
        address: {
          "@type": "PostalAddress",
          addressLocality: t("schema.org.address.city"),
          addressRegion: t("schema.org.address.region"),
          addressCountry: t("schema.org.address.country"),
        },
      }}
    />
  );
}

export function LocalBusinessSchema() {
  const { t } = useLanguage();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: t("schema.org.name"),
        description: t("schema.org.description"),
        url: t("schema.org.url"),
        logo: t("schema.org.logo"),
        email: t("schema.org.email"),
        priceRange: t("schema.org.priceRange"),
        address: {
          "@type": "PostalAddress",
          addressLocality: t("schema.org.address.city"),
          addressRegion: t("schema.org.address.region"),
          addressCountry: t("schema.org.address.country"),
        },
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: -34.6037,
            longitude: -58.3816,
          },
          geoRadius: "50000",
        },
      }}
    />
  );
}

export function ServiceSchema({
  name,
  description,
  price,
  priceCurrency = "USD",
}: {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: "Custom Software Development",
        provider: {
          "@type": "Organization",
          name: "ALLOY",
        },
        name,
        description,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price,
            priceCurrency,
            unitText: "MONTH",
          },
        },
      }}
    />
  );
}

export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
