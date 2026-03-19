import { Helmet } from "react-helmet";
import { useLanguage } from "@/context/language-context";

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
}

const BASE_URL = "https://alloyready.io";

export function SeoHead({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
}: SeoHeadProps) {
  const { language } = useLanguage();
  const canonicalUrl = `${BASE_URL}${path}`;
  const altLang = language === "en" ? "es" : "en";
  const altUrl = `${BASE_URL}${path}${path.includes("?") ? "&" : "?"}lang=${altLang}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* hreflang */}
      <link rel="alternate" hrefLang={language} href={canonicalUrl} />
      <link rel="alternate" hrefLang={altLang} href={altUrl} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${path}`} />

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:locale" content={language === "en" ? "en_US" : "es_AR"} />
      <meta property="og:site_name" content="ALLOY" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
