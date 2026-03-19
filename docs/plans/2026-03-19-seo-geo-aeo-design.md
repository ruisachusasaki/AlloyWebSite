# SEO/GEO/AEO Implementation Design

**Date:** 2026-03-19
**Status:** Approved

## Overview

Comprehensive SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) implementation for alloyready.io.

## Architecture

**Approach:** Helmet + Custom Components (builds on existing react-helmet setup)

### New Files

1. **`client/src/components/seo/seo-head.tsx`** — Reusable meta tags component wrapping Helmet
2. **`client/src/components/seo/structured-data.tsx`** — JSON-LD schema.org components
3. **`client/src/components/faq-section.tsx`** — Full cinematic FAQ section (section "05")
4. **`client/src/components/learn-more-section.tsx`** — Expandable long-form content
5. **`client/public/robots.txt`** — Crawler directives
6. **`client/public/sitemap.xml`** — Site map with hreflang

### Modified Files

7. **`client/src/pages/landing.tsx`** — Replace inline Helmet with SeoHead, add semantic HTML, integrate FAQ + LearnMore sections
8. **`client/src/pages/build-solution.tsx`** — Replace inline Helmet with SeoHead
9. **`client/src/i18n/en.ts`** — Add ~100 new keys (faq.*, seo.*, learnMore.*)
10. **`client/src/i18n/es.ts`** — Spanish translations for all new keys
11. **`client/index.html`** — Add preload hints, theme-color meta

## Component Specs

### SeoHead
- Props: `title`, `description`, `path`, `image?`, `type?`
- Auto-generates: canonical URL, og:* tags, twitter:* tags, hreflang en/es
- Base URL: `https://alloyready.io`

### StructuredData
- Renders multiple `<script type="application/ld+json">` blocks via Helmet
- Schemas: Organization, LocalBusiness, Service (x3 pricing tiers), FAQ, BreadcrumbList

### FAQ Section
- Full cinematic section "05" with SectionNumber, gradient title, stagger animations
- 6-8 questions with Framer Motion animated accordion
- Semantic `<details>`/`<summary>` HTML structure
- Content feeds into FAQSchema structured data

### Learn More Section
- Expandable 500-800 word content block
- Crawlable but collapsed by default
- Uses Tailwind typography plugin (`prose`)
- Topics: SaaS fragmentation, productized services, ALLOY's model

## Section Order

Hero → Marquee → Chaos(01) → BentoGrid(02) → AIPartner(03) → ComparisonToggle(04) → Cases → Clients → Pricing → **FAQ(05)** → **LearnMore** → Footer
