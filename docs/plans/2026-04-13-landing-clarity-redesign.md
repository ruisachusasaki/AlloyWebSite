# Landing Page Clarity Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make AlloyReady's two core services (Custom Websites + Custom Software) immediately clear to visitors via hero text changes, a scroll-driven "Two Paths" fork section, a 4th case study, and two new dedicated sub-pages with premium scroll animations.

**Architecture:** The landing page (`landing.tsx`) gets a new `TwoPathsSection` component inserted between Chaos and Bento. Two new page files (`custom-websites.tsx`, `custom-software.tsx`) are created with scroll-snap sections, parallax layers, clip-reveal text, and zoom-timeline "How It Works" animations. All new content goes through i18n (en.ts + es.ts). Routes are registered in App.tsx.

**Tech Stack:** React 18, TypeScript, Framer Motion (useScroll, useTransform, useSpring, AnimatePresence), TailwindCSS, Wouter routing, i18n via LanguageContext, Lenis smooth scroll, existing Radix UI components.

---

## Task 1: Add all i18n keys (EN + ES)

**Files:**
- Modify: `client/src/i18n/en.ts`
- Modify: `client/src/i18n/es.ts`

**Step 1: Add hero rotating highlight to en.ts**

After `"hero.rotating.5"` line, add:
```typescript
"hero.rotating.6": "Shopify/WordPress limitations.",
```

**Step 2: Update hero subtitle in en.ts**

Change `"hero.subtitle"` to:
```typescript
"hero.subtitle": "Custom websites and software platforms — built from scratch, exactly how you need them. No templates. No limits. Yours forever.",
```

**Step 3: Add Two Paths section keys to en.ts**

Add after the hero marquee section:
```typescript
// ─── Two Paths Section ───
"twoPaths.title": "What are you building?",
"twoPaths.websites.title": "Custom Websites",
"twoPaths.websites.subtitle": "> eCommerce \u2022 Landing Pages \u2022 Portfolios \u2022 Brand Sites",
"twoPaths.websites.bullet1": "Designed & coded 100% for your brand",
"twoPaths.websites.bullet2": "No Shopify fees. No WordPress plugins. No limits.",
"twoPaths.websites.bullet3": "You own every pixel of code",
"twoPaths.websites.replaces": "Shopify \u00a0 WordPress \u00a0 Wix \u00a0 Tienda Nube",
"twoPaths.websites.cta": "Explore Websites",
"twoPaths.software.title": "Custom Software",
"twoPaths.software.subtitle": "> CRMs \u2022 Internal Tools \u2022 Platforms \u2022 ERPs",
"twoPaths.software.bullet1": "Built for how your team actually works",
"twoPaths.software.bullet2": "Replace 10+ SaaS apps with one system",
"twoPaths.software.bullet3": "Evolves monthly. Never gets outdated.",
"twoPaths.software.replaces": "Notion \u00a0 Salesforce \u00a0 Zapier \u00a0 Airtable \u00a0 10+ apps",
"twoPaths.software.cta": "Explore Software",
```

**Step 4: Add case study placeholder keys to en.ts**

Add after `proof.datalight.*` keys:
```typescript
"proof.websitecase.category": "Custom Website",
"proof.websitecase.description": "A fully custom eCommerce experience with unique design, zero platform fees, and blazing performance.",
"proof.websitecase.tag": "Evolved with 40+ custom features since launch",
```

**Step 5: Add /custom-websites page keys to en.ts**

```typescript
// ─── Custom Websites Page ───
"cw.seo.title": "Custom Website Development | ALLOY - No Templates, No Limits",
"cw.seo.description": "We build 100% custom websites \u2014 eCommerce, landing pages, brand sites. No Shopify. No WordPress. You own every pixel.",
"cw.seo.ogTitle": "Custom Website Development | ALLOY",
"cw.seo.ogDescription": "Websites that don't look like templates. Designed and coded from scratch for your brand.",

"cw.hero.title.line1": "Websites That Don't",
"cw.hero.title.highlight": "Look Like Templates",
"cw.hero.subtitle": "Because your brand deserves more than Shopify constraints",
"cw.hero.cta": "Start Your Project",

"cw.problem.1.title": "Templates limit your brand",
"cw.problem.1.description": "Shopify gives you 100 themes. None of them are yours.",
"cw.problem.2.title": "Platform fees eat your margins",
"cw.problem.2.description": "3-5% per transaction adds up. On your own site: 0%.",
"cw.problem.3.title": "You're renting, not owning",
"cw.problem.3.description": "They change the rules. You pay the price. Your data stays on their servers.",

"cw.how.title": "How We Build It",
"cw.how.step1.title": "Discovery",
"cw.how.step1.description": "We map your goals, your audience, and your brand DNA.",
"cw.how.step2.title": "Design",
"cw.how.step2.description": "Pixel-perfect design that's 100% yours \u2014 no themes, no compromises.",
"cw.how.step3.title": "Develop",
"cw.how.step3.description": "Clean, performant code. Blazing fast. SEO-optimized from the ground up.",
"cw.how.step3.terminal1": "building components...",
"cw.how.step3.terminal2": "optimizing performance...",
"cw.how.step3.terminal3": "SEO engine active...",
"cw.how.step4.title": "Launch & Evolve",
"cw.how.step4.description": "Your site goes live. And it keeps getting better \u2014 monthly updates included.",
"cw.how.step4.stat1": "2.1s load time",
"cw.how.step4.stat2": "98 PageSpeed",
"cw.how.step4.stat3": "24/7 uptime",

"cw.cases.title": "Websites We've Built",
"cw.pricing.title": "Simple Pricing",
"cw.pricing.also": "Need custom software too?",
"cw.pricing.alsoLink": "Explore Custom Software",
"cw.cta.title": "Ready to own your website?",
"cw.cta.subtitle": "Let's build something that's actually yours.",
"cw.cta.button": "Schedule a Call",
```

**Step 6: Add /custom-software page keys to en.ts**

```typescript
// ─── Custom Software Page ───
"cs.seo.title": "Custom Software Development | ALLOY - Replace SaaS Chaos",
"cs.seo.description": "We build custom CRMs, internal tools, and management platforms. Replace 10+ SaaS apps with one system built for your team.",
"cs.seo.ogTitle": "Custom Software Development | ALLOY",
"cs.seo.ogDescription": "Software that thinks like your team. Custom platforms that replace SaaS chaos with clarity.",

"cs.hero.title.line1": "Software That Thinks",
"cs.hero.title.highlight": "Like Your Team",
"cs.hero.subtitle": "Replace 10+ SaaS apps with one system built for how you actually work",
"cs.hero.cta": "Start Your Project",

"cs.problem.1.title": "10 tools, zero sync",
"cs.problem.1.description": "Notion, Slack, Zapier, Sheets, HubSpot \u2014 none of them talk to each other.",
"cs.problem.2.title": "Features never ship",
"cs.problem.2.description": "You've been waiting 6 months for that one feature. It's still 'on the roadmap.'",
"cs.problem.3.title": "Your data, their rules",
"cs.problem.3.description": "They change pricing. They sunset features. Your business depends on their decisions.",

"cs.how.title": "How We Build It",
"cs.how.step1.title": "Map the Chaos",
"cs.how.step1.description": "We audit every tool, every workflow, every pain point.",
"cs.how.step2.title": "Architect",
"cs.how.step2.description": "A unified system designed around your actual processes.",
"cs.how.step3.title": "Build",
"cs.how.step3.description": "Your platform takes shape \u2014 dashboards, automations, integrations.",
"cs.how.step3.terminal1": "connecting data sources...",
"cs.how.step3.terminal2": "deploying automations...",
"cs.how.step3.terminal3": "AI engine initialized...",
"cs.how.step4.title": "Evolve",
"cs.how.step4.description": "Continuous improvements. Monthly updates. Your platform never stops growing.",
"cs.how.step4.stat1": "v1.0 \u2192 v2.0",
"cs.how.step4.stat2": "0 SaaS fees",
"cs.how.step4.stat3": "100% yours",

"cs.cases.title": "Platforms We've Built",
"cs.pricing.title": "Choose Your Plan",
"cs.pricing.also": "Need a custom website?",
"cs.pricing.alsoLink": "Explore Custom Websites",
"cs.cta.title": "Ready to replace the chaos?",
"cs.cta.subtitle": "Let's build the one platform that does it all.",
"cs.cta.button": "Schedule a Call",
```

**Step 7: Add all equivalent ES translations to es.ts**

Mirror every key from steps 1-6 with Spanish translations.

**Step 8: Commit**

```bash
git add client/src/i18n/en.ts client/src/i18n/es.ts
git commit -m "feat(i18n): add all translation keys for clarity redesign

Hero subtitle, rotating highlights, Two Paths section, case study,
and /custom-websites + /custom-software pages."
```

---

## Task 2: Hero text changes in landing.tsx

**Files:**
- Modify: `client/src/pages/landing.tsx` (HeroSection function, ~line 158-494)

**Step 1: Add the 7th rotating highlight**

In `HeroSection`, the `highlights` array (~line 164-171) currently has indices 0-5. Add index 6 after the last item:

```typescript
const highlights = [
  t("hero.rotating.0"),
  t("hero.rotating.1"),
  t("hero.rotating.2"),
  t("hero.rotating.3"),
  t("hero.rotating.4"),
  t("hero.rotating.5"),
  t("hero.rotating.6"), // NEW
];
```

No other changes to HeroSection. The subtitle uses `t("hero.subtitle")` which already points to the updated i18n key.

**Step 2: Verify in browser**

Run `npm run dev`, check that:
- Hero subtitle now reads "Custom websites and software platforms..."
- Rotating text cycles through 7 items including "Shopify/WordPress limitations."

**Step 3: Commit**

```bash
git add client/src/pages/landing.tsx
git commit -m "feat(hero): add Shopify/WordPress rotating highlight"
```

---

## Task 3: TwoPathsSection component in landing.tsx

**Files:**
- Modify: `client/src/pages/landing.tsx`
- Modify: `client/src/index.css` (new CSS classes)

This is the largest task. The section goes between `SpaghettiChaosSection` and `BentoGridSection`.

**Step 1: Add CSS for the split line and browser/dashboard mockups to index.css**

Add before the `@media (prefers-reduced-motion)` block:

```css
/* ── Two Paths: split divider ── */
.split-line {
  background: linear-gradient(180deg, hsl(var(--primary)), hsl(var(--primary) / 0.3));
  box-shadow: 0 0 20px hsl(var(--primary) / 0.3), 0 0 40px hsl(var(--primary) / 0.1);
}

/* ── Two Paths: browser mockup ── */
.browser-mockup {
  @apply rounded-xl border border-border bg-card overflow-hidden;
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.1);
}

.dark .browser-mockup {
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.4);
}

.browser-mockup-bar {
  @apply flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border;
}

.browser-mockup-dot {
  @apply w-2.5 h-2.5 rounded-full;
}

/* ── Two Paths: dashboard mockup ── */
.dashboard-mockup {
  @apply rounded-xl border border-border bg-card overflow-hidden;
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.1);
}

.dark .dashboard-mockup {
  box-shadow: 0 8px 32px -8px rgba(0,0,0,0.4);
}
```

Also add inside the `@media (prefers-reduced-motion: reduce)` block:
```css
.split-line { box-shadow: none; }
```

**Step 2: Build the TwoPathsSection function**

Add this function in `landing.tsx` after `SpaghettiChaosSection` and before `BentoGridSection`. The component structure:

```
function TwoPathsSection()
  - containerRef (h-[250vh])
  - stickyRef (sticky top-0 h-screen)
  - useScroll on containerRef
  - useReducedMotion for fallback

  Scroll phases:
  - 0.00-0.20: title + horizontal line grow (scaleX 0→1)
  - 0.18-0.25: line rotates 90° (rotate 0→90deg), moves to center
  - 0.25-0.55: left card slides in from left (x: -100%→0), right card from right (x: 100%→0)
  - 0.55-0.65: CTAs fade in (opacity 0→1, y: 20→0)
  - 0.70-1.00: everything fades out for next section

  Left card: BrowserMockup component
    - Chrome bar with 3 dots (red/yellow/green) + URL bar
    - Inside: staggered reveals of nav, hero area, product grid, buy button
    - Below: title, subtitle (font-mono), 3 bullets, replaces line

  Right card: DashboardMockup component
    - Sidebar with 5 nav items
    - Header with avatar + search
    - Main area: SVG line chart (pathLength animation) + 3 stat cards
    - Below: title, subtitle (font-mono), 3 bullets, replaces line

  Mobile (< lg breakpoint):
    - No scroll-linked animation
    - Two stacked bento-cards with fade-in-up
    - Simplified mockups (static, no scroll animation)
```

Key implementation details:
- Use `useTransform` for ALL scroll-linked values
- Browser mockup uses div-based layout (no images):
  - Nav: `h-8 bg-muted/30` with small rectangles
  - Hero: `h-24 bg-gradient-to-r from-primary/20 to-accent-warm/20` with rounded corners
  - Products: 3x `w-full h-16 bg-muted/20 rounded-lg` in a grid
  - Buy button: `w-20 h-6 bg-primary rounded-md`
- Dashboard mockup uses div-based layout:
  - Sidebar: `w-16 bg-muted/30` with 5 small rectangles
  - Header: full width `h-10 bg-muted/20`
  - Chart: SVG with `<path>` using `pathLength` animated 0→1
  - Stats: 3 small cards with count-up numbers
- "Replaces" line uses `text-destructive/50 text-xs line-through` for crossed-out competitors
- CTA buttons use existing `shimmer-btn glow-border` pattern
- CTA links: `<Link href="/custom-websites">` and `<Link href="/custom-software">`

**Step 3: Insert TwoPathsSection into the LandingPage render**

In the `LandingPage` default export (~line 2466-2481), change:
```tsx
<SpaghettiChaosSection />
<BentoGridSection />
```
to:
```tsx
<SpaghettiChaosSection />
<TwoPathsSection />
<BentoGridSection />
```

**Step 4: Update BentoGridSection section number**

Change `<SectionNumber number="02" />` to `<SectionNumber number="03" />` in `BentoGridSection`.

**Step 5: Verify in browser**

- Desktop: scroll through the section, verify split animation, mockup builds, CTAs appear
- Mobile (resize to <1024px): verify stacked cards with fade-in
- Dark mode: verify mockups are theme-aware
- Reduced motion: verify fallback

**Step 6: Commit**

```bash
git add client/src/pages/landing.tsx client/src/index.css
git commit -m "feat: add Two Paths fork section with scroll-driven split reveal

Scroll-linked split animation showing Custom Websites (browser mockup)
and Custom Software (dashboard mockup) as two distinct service paths.
Mobile-responsive with stacked cards fallback."
```

---

## Task 4: Case study placeholder card

**Files:**
- Modify: `client/src/pages/landing.tsx` (CasesSection function)

**Step 1: Add 4th portfolio item**

In the `CasesSection` function, find the `portfolioItems` array. Add a new item at index 1 (after WealthFit, before EventGrowth):

```typescript
{
  name: "WebsiteProject", // placeholder name
  category: t("proof.websitecase.category"),
  description: t("proof.websitecase.description"),
  image: "", // placeholder — user will provide
  link: "#",
  accentHsl: "160 84% 39%", // emerald
  icon: Globe,
  stats: [
    { value: "0%", label: "Platform Fees" },
    { value: "98", label: "PageSpeed" },
    { value: "2.1s", label: "Load Time" },
  ],
  evolutionTag: t("proof.websitecase.tag"),
},
```

**Step 2: Verify carousel handles 4 items**

Check the dot indicators and swipe behavior still work with 4 items. The existing code uses `portfolioItems.length` for the dots, so it should auto-adapt.

**Step 3: Commit**

```bash
git add client/src/pages/landing.tsx
git commit -m "feat: add placeholder website case study card

4th portfolio card (emerald accent) for a custom website project.
Placeholder data — awaiting real project details from user."
```

---

## Task 5: /custom-websites page

**Files:**
- Create: `client/src/pages/custom-websites.tsx`
- Modify: `client/src/index.css` (scroll-snap + clip-reveal + zoom-timeline CSS)

This is the most complex page. Build it section by section.

**Step 1: Add page-level CSS to index.css**

```css
/* ── Service pages: scroll snap ── */
.service-page {
  scroll-snap-type: y proximity;
}

.service-page > section {
  scroll-snap-align: start;
}

/* ── Service pages: vertical progress line ── */
.progress-line {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 120px;
  background: hsl(var(--border));
  border-radius: 1px;
  z-index: 40;
}

.progress-line-fill {
  width: 100%;
  background: hsl(var(--primary));
  border-radius: 1px;
  transform-origin: top;
  box-shadow: 0 0 8px hsl(var(--primary) / 0.5);
}

/* ── Service pages: clip reveal ── */
.clip-reveal {
  overflow: hidden;
}

/* ── Service pages: zoom timeline dots ── */
.timeline-dot {
  @apply w-3 h-3 rounded-full border-2 border-border bg-background transition-all duration-500;
}

.timeline-dot.active {
  @apply border-primary bg-primary;
  box-shadow: 0 0 12px hsl(var(--primary) / 0.5);
  transform: scale(1.4);
}

.timeline-line {
  @apply h-0.5 bg-border;
}

.timeline-line-fill {
  @apply h-full bg-primary;
  transform-origin: left;
}

/* ── Wireframe SVG drawing ── */
.wireframe-path {
  stroke: hsl(var(--muted-foreground));
  stroke-width: 1.5;
  fill: none;
  stroke-linecap: round;
}

/* ── Terminal typewriter ── */
.terminal-line {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
}

.terminal-line .check {
  color: hsl(160 84% 39%);
}

.terminal-line .prompt {
  color: hsl(var(--primary));
}
```

Add to `@media (prefers-reduced-motion: reduce)`:
```css
.service-page { scroll-snap-type: none; }
.timeline-dot { transition: none; }
```

**Step 2: Create the page file**

Create `client/src/pages/custom-websites.tsx` with this structure:

```
Imports: React, useState, useRef, Framer Motion hooks, Wouter Link,
  SharedNavbar, SharedFooter, SeoHead, ServiceSchema, BreadcrumbSchema,
  FAQSchema, FAQSection, SchedulingModal, SchedulingContext,
  useLanguage, Button, ArrowRight, Check, Globe, etc.

Reuse from landing.tsx: fadeInUp, stagger, SectionNumber, GhostText,
AnimatedSectionTitle, MagneticButton patterns (copy relevant helpers
or extract to shared utils if needed)

function ProgressLine({ progress }: { progress: MotionValue<number> })
  - Fixed right side, 120px tall
  - Fill height tied to scrollYProgress
  - Hidden on mobile (hidden lg:block)

function ServiceHero({ onScheduleClick })
  - Full viewport min-h-screen
  - grid-pattern background
  - Parallax ghost text "WEBSITES" at 0.3x speed
  - Two gradient orbs at 0.5x speed
  - Clip-path title reveal: clipPath inset(100% 0 0 0) → inset(0% 0 0 0)
  - Title: "Websites That Don't" + highlight "Look Like Templates"
  - Mono subtitle with > prompt
  - CTA button (shimmer-btn)
  - On scroll out: scale 1→1.05, blur 0→6px, opacity 1→0

function ProblemsSection()
  - Pinned section: h-[200vh] container, sticky h-screen inner
  - 3 pain points with clip-reveal (overflow-hidden + translateY)
  - Large background numbers (01/02/03) at 0.5x parallax
  - Sequential: each point exits before next enters
  - Horizontal connecting line between points grows as you scroll

function HowItWorksSection()
  - Pinned section: h-[400vh] container, sticky h-screen inner
  - 4 steps (Discovery/Design/Develop/Launch)
  - Progress dots at top (horizontal line + 4 dots)
  - Zoom transition between steps:
    - Outgoing: scale 1→1.3, opacity 1→0, filter blur(0→10px)
    - Incoming: scale 0.85→1, opacity 0→1, filter blur(6px→0)
  - Step 1 visual: SVG wireframe (pathLength 0→1)
  - Step 2 visual: wireframe fills with color (gradient wipe)
  - Step 3 visual: terminal with scroll-linked typewriter
  - Step 4 visual: "LIVE" pulse dot + 3 metric cards counting up

function WebsiteCasesSection()
  - Standard section, not pinned
  - Filtered case studies (website projects only)
  - Reuse portfolio-card styling from landing.tsx
  - fade-in-up with stagger

function WebsitePricingSection()
  - Single pricing card (eCommerce/Website tier)
  - Reuse PricingCard component pattern from landing
  - Link to /custom-software below

function ServiceCTA({ onScheduleClick })
  - Full-width gradient background (primary → primary/50)
  - "Ready to own your website?" title
  - Schedule Call CTA

export default function CustomWebsitesPage()
  - SchedulingContext.Provider wrapper
  - SeoHead with cw.seo.* keys
  - ServiceSchema + BreadcrumbSchema
  - service-page class on container
  - SharedNavbar
  - ProgressLine tied to page scrollYProgress
  - All sections in order
  - SharedFooter
  - SchedulingModal
```

**Step 3: Verify each section individually**

Build the page incrementally:
1. First: just hero + navbar + footer → verify basic render
2. Add ProblemsSection → verify clip reveals
3. Add HowItWorksSection → verify zoom transitions
4. Add remaining sections → verify full flow

**Step 4: Test responsive**

- Desktop 1440px: full scroll experience
- Tablet 768px: simplified animations, single column
- Mobile 375px: no pinned sections, standard fade-in-up
- Dark mode: verify all mockups/wireframes are theme-aware
- Reduced motion: verify all animations have fallback

**Step 5: Commit**

```bash
git add client/src/pages/custom-websites.tsx client/src/index.css
git commit -m "feat: add /custom-websites page with scroll-driven animations

Full-screen scroll-snap sections, clip-reveal text, parallax depth,
zoom-timeline How It Works (wireframe→design→code→launch),
SVG path drawing, scroll-linked typewriter terminal."
```

---

## Task 6: /custom-software page

**Files:**
- Create: `client/src/pages/custom-software.tsx`

**Step 1: Create the page**

Same structure as custom-websites.tsx but with different content:

- Hero: "Software That Thinks" + "Like Your Team"
- Ghost text: "SOFTWARE"
- Problems: 10 tools zero sync / Features never ship / Your data their rules
- How It Works:
  - Step 1 "Map the Chaos": scattered mini SaaS icons (simplified chaos)
  - Step 2 "Architect": flowchart SVG (nodes + connecting lines draw)
  - Step 3 "Build": dashboard mockup fills with data
  - Step 4 "Evolve": version ticker (v1.0→v2.0) + metrics
- Cases: WealthFit, EventGrowth, AgencyBoost (reuse existing data)
- Pricing: Premium + Enterprise tiers (two cards)
- CTA: "Ready to replace the chaos?"
- Link to /custom-websites as cross-sell

Extract shared components between the two pages into helper functions at the top of custom-software.tsx (or inline — keep it DRY but don't over-abstract for just 2 pages).

**Step 2: Verify in browser**

Same checks as Task 5 but for software content.

**Step 3: Commit**

```bash
git add client/src/pages/custom-software.tsx
git commit -m "feat: add /custom-software page with scroll-driven animations

Same scroll system as /custom-websites with software-specific content:
chaos mapping, flowchart architecture, dashboard mockups, version evolution."
```

---

## Task 7: Route registration + navbar links

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/components/shared-layout.tsx`

**Step 1: Add imports and routes in App.tsx**

Add imports at top:
```typescript
import CustomWebsitesPage from "@/pages/custom-websites";
import CustomSoftwarePage from "@/pages/custom-software";
```

In `AnimatedRoutes`, add before the NotFound route:
```tsx
<Route path="/custom-websites" component={CustomWebsitesPage} />
<Route path="/custom-software" component={CustomSoftwarePage} />
```

**Step 2: Add nav links in SharedNavbar**

In `shared-layout.tsx`, add "Services" dropdown or direct links to the navbar for Custom Websites and Custom Software. Follow the existing `portfolioItems` dropdown pattern — create a similar "Services" dropdown with two items.

Add i18n keys for nav items:
```
"nav.services": "Services"
"nav.services.websites": "Custom Websites"
"nav.services.websites.desc": "eCommerce, landing pages, brand sites"
"nav.services.software": "Custom Software"
"nav.services.software.desc": "CRMs, internal tools, platforms"
```

**Step 3: Verify navigation**

- Click "Custom Websites" → navigates to /custom-websites
- Click "Custom Software" → navigates to /custom-software
- Back button works
- Page transitions animate (AnimatePresence)
- SEO: check page title changes in browser tab

**Step 4: Commit**

```bash
git add client/src/App.tsx client/src/components/shared-layout.tsx client/src/i18n/en.ts client/src/i18n/es.ts
git commit -m "feat: register routes and navbar links for service pages

/custom-websites and /custom-software routes in App.tsx.
Services dropdown in SharedNavbar with links to both pages."
```

---

## Task 8: Final integration + type check

**Files:** All modified files

**Step 1: Run type check**

```bash
npm run check
```

Fix any TypeScript errors.

**Step 2: Full visual QA**

Test the complete flow:
1. Landing page → hero shows new subtitle + 7th rotating highlight
2. Scroll past Chaos → Two Paths section with split animation
3. Click "Explore Websites" → /custom-websites page
4. Scroll through all sections on /custom-websites
5. Navigate back → landing page
6. Click "Explore Software" → /custom-software page
7. Scroll through all sections on /custom-software
8. Cases section on landing → 4th card visible
9. Toggle language EN/ES → all new content translates
10. Toggle dark mode → all new sections theme-correct
11. Mobile viewport → all responsive fallbacks work

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix: resolve type errors and polish integration

Final QA pass on all new sections and pages."
```

---

## Dependency Order

```
Task 1 (i18n) → Task 2 (hero)     → Task 3 (Two Paths) → Task 4 (case study)
                                                                    ↓
                            Task 5 (websites page) → Task 6 (software page) → Task 7 (routes) → Task 8 (QA)
```

Tasks 1-2 are quick wins. Task 3 is the main landing page build. Tasks 5-6 are the heaviest (sub-pages). Task 7 wires everything together. Task 8 is verification.
