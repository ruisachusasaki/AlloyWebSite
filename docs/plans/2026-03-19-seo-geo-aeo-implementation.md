# SEO/GEO/AEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add comprehensive SEO, GEO, and AEO to alloyready.io with structured data, meta tags, FAQ section, long-form content, semantic HTML, and static SEO files.

**Architecture:** Component-based approach using existing react-helmet. New `seo/` directory for reusable SEO components. FAQ and LearnMore as new landing page sections. All text through i18n.

**Tech Stack:** React 18, react-helmet, Framer Motion, TailwindCSS, i18n (en.ts/es.ts)

---

### Task 1: Static SEO Files (robots.txt + sitemap.xml)

**Files:**
- Create: `client/public/robots.txt`
- Create: `client/public/sitemap.xml`

**Step 1: Create robots.txt**

```
User-agent: *
Allow: /
Disallow: /chat
Disallow: /chat/*

Sitemap: https://alloyready.io/sitemap.xml
```

**Step 2: Create sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://alloyready.io/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://alloyready.io/" />
    <xhtml:link rel="alternate" hreflang="es" href="https://alloyready.io/?lang=es" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://alloyready.io/build</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://alloyready.io/build" />
    <xhtml:link rel="alternate" hreflang="es" href="https://alloyready.io/build?lang=es" />
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Step 3: Commit**

```bash
git add client/public/robots.txt client/public/sitemap.xml
git commit -m "feat(seo): add robots.txt and sitemap.xml with hreflang"
```

---

### Task 2: i18n Keys — SEO, FAQ, and LearnMore Content

**Files:**
- Modify: `client/src/i18n/en.ts` (add ~100 keys after line 232)
- Modify: `client/src/i18n/es.ts` (add matching Spanish keys after line 232)

**Step 1: Add English SEO/FAQ/LearnMore keys to en.ts**

Add after the existing `seo.landing.ogDescription` line (line 232):

```typescript
    // ─── SEO Extended ───
    "seo.landing.ogImage": "https://alloyready.io/og-image.png",
    "seo.landing.twitterTitle": "ALLOY - Custom Software Platforms",
    "seo.landing.twitterDescription": "Replace your messy tech stack with a single, custom-coded digital backbone. One flat fee, unlimited evolution.",
    "seo.build.ogTitle": "Build Your Solution | ALLOY",
    "seo.build.ogDescription": "Select the features you need for your custom internal tool. Interactive module builder with 30+ integrations.",
    "seo.canonical.base": "https://alloyready.io",

    // ─── Structured Data ───
    "schema.org.name": "ALLOY",
    "schema.org.description": "Custom software platform builder that replaces SaaS chaos with unified, evolving systems.",
    "schema.org.url": "https://alloyready.io",
    "schema.org.logo": "https://alloyready.io/alloy-favicon.png",
    "schema.org.address.street": "Buenos Aires",
    "schema.org.address.city": "Buenos Aires",
    "schema.org.address.region": "CABA",
    "schema.org.address.country": "AR",
    "schema.org.email": "hello@alloyready.io",
    "schema.org.priceRange": "$$",

    // ─── Breadcrumbs ───
    "breadcrumb.home": "Home",
    "breadcrumb.build": "Build Your Solution",
    "breadcrumb.pricing": "Pricing",

    // ─── FAQ Section ───
    "faq.badge": "FAQ",
    "faq.title.line1": "Questions?",
    "faq.title.highlight": "Answered.",
    "faq.subtitle": "Everything you need to know about productized software development.",

    "faq.q1": "What is a productized software service?",
    "faq.a1": "A productized software service delivers custom-built software through a fixed monthly subscription instead of per-project billing. You get a dedicated development team that continuously builds, maintains, and evolves your platform — like having an in-house tech team without the overhead.",

    "faq.q2": "How much does custom software development cost?",
    "faq.a2": "Traditional custom software projects range from $50,000 to $500,000+ upfront. ALLOY's productized model starts at $200/month for eCommerce sites and $599/month for full custom platforms, with no large upfront investment. You pay a flat monthly fee for continuous development and evolution.",

    "faq.q3": "What's the difference between SaaS and a custom platform?",
    "faq.a3": "SaaS tools are generic products built for millions of users — you adapt your workflow to fit the tool. A custom platform is built around your exact workflow, integrating all your processes into one system. You own the code, control the roadmap, and never pay for features you don't use.",

    "faq.q4": "Can I replace HubSpot, Airtable, or Zapier with a custom tool?",
    "faq.a4": "Yes. Most businesses use 5-15 SaaS tools that don't talk to each other, costing $2,000-5,000/month in subscriptions alone. A custom platform unifies CRM, automation, data management, and integrations into one system — often for less than the combined SaaS spend.",

    "faq.q5": "What is included in an unlimited software subscription?",
    "faq.a5": "ALLOY subscriptions include continuous development, bug fixes, feature additions, security updates, hosting, and strategy sessions. There are no per-feature charges. Request a new feature today, and it can be live within days — not months.",

    "faq.q6": "How long does it take to build a custom internal tool?",
    "faq.a6": "An initial MVP is typically delivered within 2-4 weeks. From there, the platform evolves continuously based on your feedback. Unlike traditional development where you wait months for a 'finished' product, you start using and refining your tool almost immediately.",

    "faq.q7": "Do I own the code that ALLOY builds for me?",
    "faq.a7": "Yes, you own 100% of the code and intellectual property. Your platform runs on your infrastructure, and you retain full access to the codebase. If you ever decide to leave, you take everything with you.",

    "faq.q8": "Is ALLOY only for businesses in Argentina?",
    "faq.a8": "No. ALLOY is based in Buenos Aires but serves clients globally. Our productized model works for any business that needs custom software, regardless of location. We work asynchronously across time zones with regular strategy sessions.",

    // ─── Learn More Section ───
    "learnMore.title": "Learn More",
    "learnMore.toggle": "Read more about productized software development",
    "learnMore.h2.problem": "The Problem: SaaS Fragmentation",
    "learnMore.p1": "Growing businesses face a silent crisis: SaaS fragmentation. As teams scale from 5 to 50 people, the average company accumulates 15-25 different software subscriptions. Each tool solves one narrow problem — a CRM here, a project manager there, a separate analytics dashboard, yet another tool for invoicing. The result is a Frankenstein tech stack held together by Zapier automations and manual data entry.",
    "learnMore.p2": "This fragmentation costs more than subscription fees. It costs clarity. When your client data lives in HubSpot, your project status in Asana, your finances in QuickBooks, and your communications in Slack, no single person has a complete picture of the business. Decisions are made on partial information. Teams waste hours copying data between systems. Critical updates fall through the cracks.",
    "learnMore.h2.solution": "How Productized Software Development Works",
    "learnMore.p3": "Productized software development replaces the traditional agency model — where you pay tens of thousands upfront for a 'finished' product that's outdated by launch — with a continuous development partnership. For a fixed monthly fee, you get a dedicated team that builds, maintains, and evolves your custom platform indefinitely.",
    "learnMore.p4": "The process starts with your most painful workflow. Within 2-4 weeks, you have a working MVP that addresses your core bottleneck. From there, the platform grows organically. Need a client portal? It's built and deployed within days. Want AI-powered reporting? Added next sprint. Your platform becomes a living system that adapts as fast as your business does.",
    "learnMore.h2.alloy": "Why ALLOY's Model Is Different",
    "learnMore.p5": "ALLOY combines the predictability of SaaS pricing with the power of custom development. Starting at $200/month for eCommerce sites and $599/month for full custom platforms, you get unlimited feature requests, priority bug fixes, strategy sessions, and a platform that never stops evolving. There are no hourly rates, no scope negotiations, and no surprise invoices.",
    "learnMore.p6": "Based in Buenos Aires with a global client base, ALLOY operates as your external tech department. We handle architecture decisions, security updates, performance optimization, and infrastructure management — so you can focus on running your business. Every line of code we write belongs to you, and you can take it with you if you ever leave.",
```

**Step 2: Add Spanish translations to es.ts**

Add after the existing `seo.landing.ogDescription` Spanish line (line 232):

```typescript
    // ─── SEO Extended ───
    "seo.landing.ogImage": "https://alloyready.io/og-image.png",
    "seo.landing.twitterTitle": "ALLOY - Plataformas de Software a Medida",
    "seo.landing.twitterDescription": "Reemplazá tu stack tecnológico desordenado por un sistema digital hecho a medida. Una tarifa fija, evolución ilimitada.",
    "seo.build.ogTitle": "Armá tu Solución | ALLOY",
    "seo.build.ogDescription": "Seleccioná las funciones que necesitás para tu herramienta interna. Constructor interactivo de módulos con 30+ integraciones.",
    "seo.canonical.base": "https://alloyready.io",

    // ─── Structured Data ───
    "schema.org.name": "ALLOY",
    "schema.org.description": "Constructor de plataformas de software a medida que reemplaza el caos SaaS con sistemas unificados y evolutivos.",
    "schema.org.url": "https://alloyready.io",
    "schema.org.logo": "https://alloyready.io/alloy-favicon.png",
    "schema.org.address.street": "Buenos Aires",
    "schema.org.address.city": "Buenos Aires",
    "schema.org.address.region": "CABA",
    "schema.org.address.country": "AR",
    "schema.org.email": "hello@alloyready.io",
    "schema.org.priceRange": "$$",

    // ─── Breadcrumbs ───
    "breadcrumb.home": "Inicio",
    "breadcrumb.build": "Armá tu Solución",
    "breadcrumb.pricing": "Precios",

    // ─── FAQ Section ───
    "faq.badge": "Preguntas Frecuentes",
    "faq.title.line1": "¿Preguntas?",
    "faq.title.highlight": "Respondidas.",
    "faq.subtitle": "Todo lo que necesitás saber sobre desarrollo de software productizado.",

    "faq.q1": "¿Qué es un servicio de software productizado?",
    "faq.a1": "Un servicio de software productizado entrega software hecho a medida a través de una suscripción mensual fija en lugar de cobrar por proyecto. Tenés un equipo de desarrollo dedicado que construye, mantiene y evoluciona tu plataforma continuamente — como tener un equipo tech interno sin los costos fijos.",

    "faq.q2": "¿Cuánto cuesta el desarrollo de software a medida?",
    "faq.a2": "Los proyectos tradicionales de software a medida van de $50,000 a $500,000+ por adelantado. El modelo productizado de ALLOY empieza en $200/mes para sitios eCommerce y $599/mes para plataformas completas, sin inversión inicial grande. Pagás una tarifa fija mensual por desarrollo y evolución continua.",

    "faq.q3": "¿Cuál es la diferencia entre SaaS y una plataforma a medida?",
    "faq.a3": "Las herramientas SaaS son productos genéricos para millones de usuarios — vos adaptás tu flujo de trabajo a la herramienta. Una plataforma a medida se construye alrededor de tu flujo exacto, integrando todos tus procesos en un solo sistema. Sos dueño del código, controlás la hoja de ruta y nunca pagás por funciones que no usás.",

    "faq.q4": "¿Puedo reemplazar HubSpot, Airtable o Zapier con una herramienta propia?",
    "faq.a4": "Sí. La mayoría de las empresas usan 5-15 herramientas SaaS que no se comunican entre sí, gastando $2,000-5,000/mes solo en suscripciones. Una plataforma a medida unifica CRM, automatización, gestión de datos e integraciones en un solo sistema — muchas veces por menos que el gasto combinado en SaaS.",

    "faq.q5": "¿Qué incluye una suscripción de software ilimitada?",
    "faq.a5": "Las suscripciones de ALLOY incluyen desarrollo continuo, corrección de bugs, nuevas funcionalidades, actualizaciones de seguridad, hosting y sesiones de estrategia. No hay cargos por funcionalidad. Pedí una función nueva hoy y puede estar activa en días — no meses.",

    "faq.q6": "¿Cuánto tiempo tarda construir una herramienta interna a medida?",
    "faq.a6": "Un MVP inicial se entrega típicamente en 2-4 semanas. Desde ahí, la plataforma evoluciona continuamente según tu feedback. A diferencia del desarrollo tradicional donde esperás meses por un producto 'terminado', empezás a usar y refinar tu herramienta casi inmediatamente.",

    "faq.q7": "¿Soy dueño del código que ALLOY construye para mí?",
    "faq.a7": "Sí, sos dueño del 100% del código y la propiedad intelectual. Tu plataforma corre en tu infraestructura y tenés acceso completo al código fuente. Si alguna vez decidís irte, te llevás todo.",

    "faq.q8": "¿ALLOY es solo para empresas en Argentina?",
    "faq.a8": "No. ALLOY tiene base en Buenos Aires pero atiende clientes globalmente. Nuestro modelo productizado funciona para cualquier empresa que necesite software a medida, sin importar la ubicación. Trabajamos asincrónicamente entre zonas horarias con sesiones de estrategia regulares.",

    // ─── Learn More Section ───
    "learnMore.title": "Más Información",
    "learnMore.toggle": "Leer más sobre desarrollo de software productizado",
    "learnMore.h2.problem": "El Problema: Fragmentación SaaS",
    "learnMore.p1": "Las empresas en crecimiento enfrentan una crisis silenciosa: la fragmentación SaaS. A medida que los equipos escalan de 5 a 50 personas, la empresa promedio acumula 15-25 suscripciones de software diferentes. Cada herramienta resuelve un problema específico — un CRM acá, un gestor de proyectos allá, un dashboard de analytics aparte, otra herramienta más para facturación. El resultado es un stack tecnológico Frankenstein sostenido por automatizaciones de Zapier y carga manual de datos.",
    "learnMore.p2": "Esta fragmentación cuesta más que las suscripciones. Cuesta claridad. Cuando tus datos de clientes viven en HubSpot, el estado de tus proyectos en Asana, tus finanzas en QuickBooks y tu comunicación en Slack, ninguna persona tiene una imagen completa del negocio. Las decisiones se toman con información parcial. Los equipos pierden horas copiando datos entre sistemas. Actualizaciones críticas se pierden en el camino.",
    "learnMore.h2.solution": "Cómo Funciona el Desarrollo de Software Productizado",
    "learnMore.p3": "El desarrollo de software productizado reemplaza el modelo tradicional de agencia — donde pagás decenas de miles por adelantado por un producto 'terminado' que ya está desactualizado al lanzarse — con una asociación de desarrollo continuo. Por una tarifa fija mensual, tenés un equipo dedicado que construye, mantiene y evoluciona tu plataforma de forma indefinida.",
    "learnMore.p4": "El proceso comienza con tu flujo de trabajo más doloroso. En 2-4 semanas, tenés un MVP funcional que aborda tu cuello de botella principal. Desde ahí, la plataforma crece orgánicamente. ¿Necesitás un portal de clientes? Se construye y despliega en días. ¿Querés reportes con IA? Se agrega en el próximo sprint. Tu plataforma se convierte en un sistema vivo que se adapta tan rápido como tu negocio.",
    "learnMore.h2.alloy": "Por Qué el Modelo de ALLOY Es Diferente",
    "learnMore.p5": "ALLOY combina la previsibilidad de precios SaaS con el poder del desarrollo a medida. Desde $200/mes para sitios eCommerce y $599/mes para plataformas completas, tenés solicitudes de funciones ilimitadas, correcciones prioritarias, sesiones de estrategia y una plataforma que nunca deja de evolucionar. Sin tarifas por hora, sin negociaciones de alcance y sin facturas sorpresa.",
    "learnMore.p6": "Con base en Buenos Aires y clientes globales, ALLOY opera como tu departamento tech externo. Nos encargamos de decisiones de arquitectura, actualizaciones de seguridad, optimización de rendimiento y gestión de infraestructura — para que puedas enfocarte en tu negocio. Cada línea de código que escribimos te pertenece, y te la llevás si alguna vez decidís irte.",
```

**Step 3: Commit**

```bash
git add client/src/i18n/en.ts client/src/i18n/es.ts
git commit -m "feat(i18n): add SEO, FAQ, and LearnMore content keys for EN and ES"
```

---

### Task 3: SeoHead Component

**Files:**
- Create: `client/src/components/seo/seo-head.tsx`

**Step 1: Create the SeoHead component**

```tsx
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
```

**Step 2: Commit**

```bash
git add client/src/components/seo/seo-head.tsx
git commit -m "feat(seo): add reusable SeoHead component with OG, Twitter, hreflang"
```

---

### Task 4: StructuredData Component

**Files:**
- Create: `client/src/components/seo/structured-data.tsx`

**Step 1: Create the StructuredData component**

This component renders JSON-LD scripts via Helmet. It takes data as props and outputs valid schema.org markup.

```tsx
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
```

**Step 2: Commit**

```bash
git add client/src/components/seo/structured-data.tsx
git commit -m "feat(seo): add JSON-LD structured data components (Org, LocalBusiness, Service, FAQ, Breadcrumb)"
```

---

### Task 5: FAQ Section Component

**Files:**
- Create: `client/src/components/faq-section.tsx`

**Step 1: Create FAQ section as a full cinematic section**

This matches the existing design language in landing.tsx (SectionNumber, gradient titles, Framer Motion stagger animations). Uses semantic `<details>`/`<summary>` HTML for accessibility and crawlability, with Framer Motion for visual enhancement.

```tsx
import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

function SectionNumber({ number }: { number: string }) {
  return <span className="section-number">{number}</span>;
}

function FAQItem({
  question,
  answer,
  index,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <details
        open={isOpen}
        className="group border border-border/50 rounded-xl overflow-hidden transition-colors hover:border-primary/30"
      >
        <summary
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none"
        >
          <h3 className="text-base md:text-lg font-semibold text-foreground text-left">
            {question}
          </h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </summary>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </details>
    </motion.div>
  );
}

export function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
    { question: t("faq.q7"), answer: t("faq.a7") },
    { question: t("faq.q8"), answer: t("faq.a8") },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-background" aria-label="Frequently Asked Questions">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <SectionNumber number="07" />
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium mb-8 font-mono text-primary">
            <HelpCircle className="w-4 h-4" />
            {t("faq.badge")}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground mb-6 section-title heading-glow" style={{ letterSpacing: "0.05em" }}>
            {t("faq.title.line1")}{" "}
            <span className="text-primary">{t("faq.title.highlight")}</span>
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add client/src/components/faq-section.tsx
git commit -m "feat(seo): add cinematic FAQ section with animated accordions"
```

---

### Task 6: LearnMore Section Component

**Files:**
- Create: `client/src/components/learn-more-section.tsx`

**Step 1: Create the expandable long-form content section**

```tsx
import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";

export function LearnMoreSection() {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="learn-more" className="py-16 relative bg-background" aria-label="Learn more about productized software">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between gap-4 py-4 text-left group"
          aria-expanded={isExpanded}
        >
          <span className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {t("learnMore.toggle")}
            </span>
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.article
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="prose prose-neutral dark:prose-invert max-w-none pb-8">
                <h2>{t("learnMore.h2.problem")}</h2>
                <p>{t("learnMore.p1")}</p>
                <p>{t("learnMore.p2")}</p>

                <h2>{t("learnMore.h2.solution")}</h2>
                <p>{t("learnMore.p3")}</p>
                <p>{t("learnMore.p4")}</p>

                <h2>{t("learnMore.h2.alloy")}</h2>
                <p>{t("learnMore.p5")}</p>
                <p>{t("learnMore.p6")}</p>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

        {/* Crawlable hidden content for search engines when collapsed */}
        {!isExpanded && (
          <div className="sr-only" aria-hidden="false">
            <h2>{t("learnMore.h2.problem")}</h2>
            <p>{t("learnMore.p1")}</p>
            <p>{t("learnMore.p2")}</p>
            <h2>{t("learnMore.h2.solution")}</h2>
            <p>{t("learnMore.p3")}</p>
            <p>{t("learnMore.p4")}</p>
            <h2>{t("learnMore.h2.alloy")}</h2>
            <p>{t("learnMore.p5")}</p>
            <p>{t("learnMore.p6")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add client/src/components/learn-more-section.tsx
git commit -m "feat(seo): add expandable LearnMore section with crawlable long-form content"
```

---

### Task 7: Integrate Everything into Landing Page

**Files:**
- Modify: `client/src/pages/landing.tsx`

**Step 1: Add imports (top of file, after existing imports)**

Add these imports to the import block at the top of landing.tsx:

```tsx
import { SeoHead } from "@/components/seo/seo-head";
import { OrganizationSchema, LocalBusinessSchema, ServiceSchema, FAQSchema, BreadcrumbSchema } from "@/components/seo/structured-data";
import { FAQSection } from "@/components/faq-section";
import { LearnMoreSection } from "@/components/learn-more-section";
```

**Step 2: Replace Helmet block in LandingPage component**

In the `LandingPage()` function (around line 2415-2450), replace the inline `<Helmet>` block and add structured data + new sections.

Replace the entire block:
```tsx
        <Helmet>
          <title>{t("seo.landing.title")}</title>
          <meta name="description" content={t("seo.landing.description")} />
          <meta property="og:title" content={t("seo.landing.ogTitle")} />
          <meta property="og:description" content={t("seo.landing.ogDescription")} />
          <meta property="og:type" content="website" />
        </Helmet>
```

With:
```tsx
        <SeoHead
          title={t("seo.landing.title")}
          description={t("seo.landing.description")}
          path="/"
          ogTitle={t("seo.landing.ogTitle")}
          ogDescription={t("seo.landing.ogDescription")}
          ogImage={t("seo.landing.ogImage")}
        />

        {/* Structured Data */}
        <OrganizationSchema />
        <LocalBusinessSchema />
        <BreadcrumbSchema items={[
          { name: t("breadcrumb.home"), url: "https://alloyready.io/" },
          { name: t("breadcrumb.pricing"), url: "https://alloyready.io/#pricing" },
        ]} />
        <ServiceSchema
          name={t("pricing.ecommerce.title")}
          description={t("pricing.ecommerce.description")}
          price="200"
        />
        <ServiceSchema
          name={t("pricing.premium.title")}
          description={t("pricing.premium.description")}
          price="599"
        />
        <ServiceSchema
          name={t("pricing.enterprise.title")}
          description={t("pricing.enterprise.description")}
          price="1499"
        />
        <FAQSchema items={[
          { question: t("faq.q1"), answer: t("faq.a1") },
          { question: t("faq.q2"), answer: t("faq.a2") },
          { question: t("faq.q3"), answer: t("faq.a3") },
          { question: t("faq.q4"), answer: t("faq.a4") },
          { question: t("faq.q5"), answer: t("faq.a5") },
          { question: t("faq.q6"), answer: t("faq.a6") },
          { question: t("faq.q7"), answer: t("faq.a7") },
          { question: t("faq.q8"), answer: t("faq.a8") },
        ]} />
```

**Step 3: Add semantic `<main>` wrapper and new sections**

Wrap the page content in `<main>` and add the FAQ + LearnMore sections after PricingSection:

Replace:
```tsx
        <SharedNavbar />
        <HeroSection onScheduleClick={openScheduling} />
        ...
        <PricingSection />
        <SharedFooter />
```

With:
```tsx
        <SharedNavbar />
        <main>
          <HeroSection onScheduleClick={openScheduling} />
          <HeroMarquee />
          <SpaghettiChaosSection />
          <BentoGridSection />
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <AIPartnerSection />
          <ComparisonToggleSection />
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <CasesSection />
          <ClientsSection />
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <PricingSection />
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <FAQSection />
          <LearnMoreSection />
        </main>
        <SharedFooter />
```

**Step 4: Remove the old Helmet import if no longer needed directly**

Check if `Helmet` is still used elsewhere in landing.tsx. If not, remove `import { Helmet } from "react-helmet";` from the imports.

**Step 5: Commit**

```bash
git add client/src/pages/landing.tsx
git commit -m "feat(seo): integrate SeoHead, structured data, FAQ, and LearnMore into landing page"
```

---

### Task 8: Update Build Solution Page with SeoHead

**Files:**
- Modify: `client/src/pages/build-solution.tsx`

**Step 1: Replace inline Helmet with SeoHead**

Add import:
```tsx
import { SeoHead } from "@/components/seo/seo-head";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
```

Replace (around line 467-470):
```tsx
        <Helmet>
          <title>{t("build.seo.title")}</title>
          <meta name="description" content={t("build.seo.description")} />
        </Helmet>
```

With:
```tsx
        <SeoHead
          title={t("build.seo.title")}
          description={t("build.seo.description")}
          path="/build"
          ogTitle={t("seo.build.ogTitle")}
          ogDescription={t("seo.build.ogDescription")}
          ogImage={t("seo.landing.ogImage")}
        />
        <BreadcrumbSchema items={[
          { name: t("breadcrumb.home"), url: "https://alloyready.io/" },
          { name: t("breadcrumb.build"), url: "https://alloyready.io/build" },
        ]} />
```

Remove the old `import { Helmet } from "react-helmet";` if no longer used.

**Step 2: Commit**

```bash
git add client/src/pages/build-solution.tsx
git commit -m "feat(seo): replace inline Helmet with SeoHead on build-solution page"
```

---

### Task 9: Update index.html with Performance SEO

**Files:**
- Modify: `client/index.html`

**Step 1: Add performance hints and meta tags**

Update the `<head>` section to add font preloading, theme-color, and author meta:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5" />
    <meta name="theme-color" content="#0ea5e9" />
    <meta name="author" content="ALLOY" />
    <link rel="icon" type="image/png" href="/alloy-favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Grotesk:wght@300..700&display=swap" as="style" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Key changes:
- `maximum-scale=5` (was 1, bad for accessibility)
- `theme-color` meta tag
- `author` meta tag
- `rel="preload"` for fonts (loads them earlier)

**Step 2: Commit**

```bash
git add client/index.html
git commit -m "feat(seo): add performance hints, theme-color, and preload to index.html"
```

---

### Task 10: Add Semantic HTML to Landing Page Sections

**Files:**
- Modify: `client/src/pages/landing.tsx`

**Step 1: Add `aria-label` attributes to existing sections**

Add `aria-label` to each section that doesn't have one:

- `HeroSection`: The section ref div should have `aria-label="Hero"` — but since it uses a `<section>` already for `#problem`, focus on sections missing IDs or labels.
- Ensure the `<section>` in `BentoGridSection` has `id="solutions"` and `aria-label`.
- Ensure `AIPartnerSection` section has `id="ai-partner"` and `aria-label`.
- Ensure `ComparisonToggleSection` section has `id="comparison"` and `aria-label`.
- Ensure `CasesSection` has `id="cases"` and `aria-label`.
- Ensure `ClientsSection` has `id="clients"` and `aria-label`.

These are surgical edits — add `id` and `aria-label` attributes to each section's opening `<section>` tag where missing.

**Step 2: Commit**

```bash
git add client/src/pages/landing.tsx
git commit -m "feat(seo): add semantic aria-labels and section IDs throughout landing page"
```

---

### Task 11: Verify and Test

**Step 1: Run the dev server**

```bash
npm run dev
```

**Step 2: Run type checking**

```bash
npm run check
```

**Step 3: Verify structured data in browser**

Open the landing page, view page source, and confirm:
- JSON-LD scripts are present in the `<head>`
- FAQ section renders with accordions
- LearnMore section is expandable
- Meta tags are correct (inspect with browser dev tools)

**Step 4: Validate structured data**

Copy the JSON-LD output and paste into https://search.google.com/test/rich-results to confirm validation.

**Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(seo): address any issues found during verification"
```
