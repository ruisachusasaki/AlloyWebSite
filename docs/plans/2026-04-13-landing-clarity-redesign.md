# Landing Page Clarity Redesign

## Goal
Make AlloyReady's two core services (Custom Websites + Custom Software) immediately clear to visitors, with premium scroll-driven animations matching/exceeding existing site quality.

## Deliverables

### 1. Hero Text Changes
- New subtitle addressing both personas (EN + ES)
- Add `hero.rotating.6`: "Shopify/WordPress limitations." (EN + ES)
- Touch NOTHING else in hero (no layout, no animation changes)

### 2. Two Paths Fork Section (`TwoPathsSection`)
- Placement: between `SpaghettiChaosSection` and `BentoGridSection` in landing.tsx
- Section number shifts: this becomes 02, Bento becomes 03
- Scroll-driven split reveal:
  - Phase 1 (0-20%): centered question "What are you building?" + horizontal line grows
  - Phase 2 (20-50%): line rotates vertical, splits screen. Left: browser mockup (website). Right: dashboard mockup (software). Completely different visual treatments.
  - Phase 3 (50-60%): CTAs appear linking to /custom-websites and /custom-software
- Mobile: stacked cards, no split animation, simple fade-in-up
- Implementation: h-[250vh] container, sticky inner, useScroll+useTransform
- Mockups are pure CSS/div (no images), theme-aware (dark mode compatible)

### 3. Case Study Addition
- 4th card in CasesSection for a real website project
- Accent color: emerald (hsl 160 84% 39%)
- Same portfolio-card design, hover effects, animation as existing cards
- Position: 2nd in order (after WealthFit, before EventGrowth)
- Placeholder data until user provides real project details

### 4. Sub-Page: `/custom-websites`
- Full scroll-driven narrative page
- Global: scroll-snap-type:y proximity, Lenis smooth scroll, vertical progress line
- Section 1 HERO: clip-path title reveal, parallax ghost text + orbs, zoom-blur exit on scroll
- Section 2 PROBLEMS: pinned 200vh, 3 pain points with clip-reveal sequence, parallax numbers
- Section 3 HOW IT WORKS: pinned 400vh zoom timeline, 4 steps (Discovery/Design/Develop/Launch), zoom transitions between steps (scale+blur+opacity), progress dots, wireframe→color→code→live mockup animations, typewriter terminal effect on scroll
- Section 4 CASES: filtered to website projects, standard fade-in-up
- Section 5 PRICING: single eCommerce/Website tier card, link to /custom-software
- Section 6 FAQ+CTA+FOOTER: filtered FAQs, full-width CTA, SharedFooter
- SEO: unique SeoHead, ServiceSchema, BreadcrumbSchema, FAQSchema

### 5. Sub-Page: `/custom-software`
- Same scroll system as /custom-websites
- Different content: "Software That Thinks Like Your Team"
- Problems: "10 tools zero sync" / "Features never ship" / "Your data their rules"
- How It Works: Map Chaos→Architect→Build→Evolve (dashboard mockup)
- Cases: WealthFit, EventGrowth, AgencyBoost
- Pricing: Premium + Enterprise tiers
- SEO: unique SeoHead, ServiceSchema, BreadcrumbSchema, FAQSchema

## Design Principles
- One visual per section (no competing elements)
- 90% grayscale/muted, primary blue only on active elements + CTAs
- Max 3 font sizes per viewport
- All easing: [0.22, 1, 0.36, 1]
- useReducedMotion fallback on every animation
- All i18n keys in both en.ts and es.ts
- Semantic design tokens only (no raw colors)

## Animation Techniques
- Scroll snapping: CSS scroll-snap-type:y proximity
- Parallax: useScroll+useTransform with different rate multipliers per layer
- Clip reveals: overflow-hidden + translateY transforms tied to scroll
- Zoom transitions: scale+opacity+blur transforms between pinned steps
- Pinned sections: sticky containers with tall scroll areas (existing Chaos pattern)
- Path drawing: SVG stroke-dasharray + pathLength for wireframes
- Typewriter: scroll-linked character reveal (not time-based)
