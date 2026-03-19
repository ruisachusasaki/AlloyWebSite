# Cinematic Chaos-to-Clarity Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the static `SpaghettiChaosSection` (Section 01) with a scroll-pinned cinematic 3-phase narrative: chaotic SaaS logos pile up -> collapse -> Alloy dashboard expands.

**Architecture:** A self-contained component (`cinematic-chaos.tsx`) uses Framer Motion `useScroll`+`useTransform` to drive all animation from a single `scrollYProgress` (0-1). The outer div is `h-[300vh]` with a `sticky top-0 h-screen` inner viewport. Desktop gets the full scroll-driven experience; mobile gets a simplified vertical timeline with `whileInView` triggers. Reduced-motion gets a static cross-fade.

**Tech Stack:** React, Framer Motion (`useScroll`, `useTransform`, `useReducedMotion`, `AnimatePresence`), TailwindCSS semantic tokens, react-icons/si (SaaS logos), lucide-react, i18n via `useLanguage()`.

**Design doc:** `docs/plans/2026-03-19-cinematic-chaos-section-design.md`

---

## Task 1: Add i18n Keys

**Files:**
- Modify: `client/src/i18n/en.ts` (lines 77-85, chaos section keys)
- Modify: `client/src/i18n/es.ts` (lines 77-85, chaos section keys)

**Step 1: Add new keys to en.ts**

Replace the existing chaos section block with:

```typescript
// ─── Cinematic Chaos Section ───
"chaos.phase1.title": "THIS IS YOUR TECH STACK",
"chaos.phase1.cost": "$2,847/mo",
"chaos.phase1.subtitle": "in scattered subscriptions",
"chaos.phase3.title": "THIS IS YOUR",
"chaos.phase3.titleHighlight": "ALLOY PLATFORM",
"chaos.phase3.cost": "$1,000/mo",
"chaos.phase3.subtitle": "one platform, everything included",
"chaos.scroll": "Scroll to unify",
"chaos.cta": "Build Your Platform",
```

Remove the old keys: `chaos.title.line1`, `chaos.title.highlight`, `chaos.title.line2`, `chaos.subtitle`, `chaos.unified.title`, `chaos.unified.highlight`, `chaos.subscriptions`.

**Step 2: Add equivalent keys to es.ts**

```typescript
// ─── Cinematic Chaos Section ───
"chaos.phase1.title": "ESTE ES TU STACK TECNOLOGICO",
"chaos.phase1.cost": "$2.847/mes",
"chaos.phase1.subtitle": "en suscripciones dispersas",
"chaos.phase3.title": "ESTA ES TU",
"chaos.phase3.titleHighlight": "PLATAFORMA ALLOY",
"chaos.phase3.cost": "$1.000/mes",
"chaos.phase3.subtitle": "una plataforma, todo incluido",
"chaos.scroll": "Scrollea para unificar",
"chaos.cta": "Construi Tu Plataforma",
```

**Step 3: Verify — `npm run check`**

Expected: no new errors from i18n changes (these are plain string objects).

**Step 4: Commit**

```
feat(i18n): add cinematic chaos section keys, remove old chaos keys
```

---

## Task 2: Add jitter keyframe to index.css

**Files:**
- Modify: `client/src/index.css` (add after existing keyframes)

**Step 1: Add the jitter keyframe**

Add inside the existing `@layer base` or after the last `@keyframes` block:

```css
@keyframes jitter {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  20% { transform: translate(-1px, 1px) rotate(-0.5deg); }
  40% { transform: translate(1px, -1px) rotate(0.5deg); }
  60% { transform: translate(-1px, 0) rotate(-0.3deg); }
  80% { transform: translate(1px, 1px) rotate(0.3deg); }
}
```

**Step 2: Verify — dev server shows no CSS errors**

**Step 3: Commit**

```
feat(css): add jitter keyframe for chaos section
```

---

## Task 3: Create the cinematic-chaos component (data + scroll setup)

**Files:**
- Create: `client/src/components/cinematic-chaos.tsx`

**Step 1: Create the file with imports, logo data, and scroll scaffolding**

This is the main component file. It contains:

1. **Logo data array** — migrated from `SpaghettiChaosSection` in landing.tsx (the `chaosApps` array, lines 655-688). Each entry has `icon` (from react-icons/si or lucide), optional `imageSrc`, `name`, `color`, and positional data (`x`, `y`, `rotate`).

2. **`CinematicChaosSection` component** — the exported default:
   - `useLanguage()` for i18n
   - `useReducedMotion()` for accessibility
   - `useIsMobile()` hook from `@/hooks/use-mobile`
   - `containerRef` for the 300vh outer div
   - `useScroll({ target: containerRef, offset: ["start start", "end end"] })` for `scrollYProgress`
   - Conditional render: mobile version vs desktop version

3. **Outer structure:**
```tsx
<section id="problem" ref={containerRef} className="relative h-[300vh]">
  <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
    {/* Phase backgrounds */}
    {/* Phase 1: Chaos */}
    {/* Phase 2: Flash */}
    {/* Phase 3: Clarity */}
  </div>
</section>
```

4. **Logo data** — same 27 entries from current `chaosApps`, but simplified: we only need `icon`/`imageSrc`, `name`, `color`, `iconSize`, `useThemeColor`. The `x/y/rotate/scale/zIndex` positional data is still needed for the "pile" target positions. Each logo also gets a random entry direction (computed once via seeded offsets based on index).

5. **Imports required:**
   - React: `useRef`, `memo`
   - Framer Motion: `motion`, `useScroll`, `useTransform`, `useReducedMotion`
   - `useLanguage` from `@/context/language-context`
   - `useIsMobile` from `@/hooks/use-mobile`
   - All SaaS icons from `react-icons/si` (same set as landing.tsx imports)
   - `Cloud`, `Mic`, `ArrowRight` from `lucide-react`
   - `Button` from `@/components/ui/button`
   - `Link` from `wouter`
   - The 3 custom logo images: `darwinLogo`, `meliLogo`, `tokkoLogo`, `alloyLogo` from `@assets/`
   - Lucide icons for dashboard mockup: `Users`, `BarChart3`, `GitBranch`, `Plug`

**Step 2: Verify — `npm run check`**

Expected: compiles with no new errors. The component won't be rendered yet.

**Step 3: Commit**

```
feat: scaffold cinematic-chaos component with data and scroll setup
```

---

## Task 4: Implement Phase 1 — "The Chaos" (desktop)

**Files:**
- Modify: `client/src/components/cinematic-chaos.tsx`

**Step 1: Build the ChaosLogo sub-component**

Each of the 27 logos gets individual `useTransform` motion values:

```tsx
function ChaosLogo({ app, index, scrollYProgress, total }: { ... }) {
  // Entry timing: stagger logos across progress 0.0 - 0.20
  const entryStart = (index / total) * 0.18;
  const entryEnd = entryStart + 0.05;

  // Start position: off-screen based on index (alternate edges)
  const startX = (index % 4 === 0) ? -800 : (index % 4 === 1) ? 800 : (index % 4 === 2) ? -600 : 600;
  const startY = (index % 3 === 0) ? -500 : (index % 3 === 1) ? 500 : (index % 2 === 0) ? -400 : 400;

  // Phase 1 (enter): fly from off-screen to pile position
  const x = useTransform(scrollYProgress,
    [0, entryStart, entryEnd, 0.33, 0.45],
    [startX, startX, app.x * 0.5, app.x * 0.5, 0]
  );
  const y = useTransform(scrollYProgress,
    [0, entryStart, entryEnd, 0.33, 0.45],
    [startY, startY, app.y * 0.5, app.y * 0.5, 0]
  );

  // Phase 2 (collapse): scale to 0, opacity to 0
  const scale = useTransform(scrollYProgress,
    [0, entryStart, entryEnd, 0.33, 0.45],
    [0, 0, 1, 1, 0]
  );
  const opacity = useTransform(scrollYProgress,
    [0, entryStart, entryEnd, 0.33, 0.43],
    [0, 0, 1, 1, 0]
  );
  const rotate = useTransform(scrollYProgress,
    [0, entryEnd, 0.33, 0.45],
    [app.rotate * 3, app.rotate, app.rotate, 0]
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x, y, scale, opacity, rotate, translateX: "-50%", translateY: "-50%", zIndex: app.zIndex }}
    >
      {/* Icon or image rendering — same pattern as current ChaosIcon */}
    </motion.div>
  );
}
```

**Step 2: Build Phase 1 overlay (title + cost counter + background)**

```tsx
// Red background tint
const chaosBgOpacity = useTransform(scrollYProgress, [0, 0.05, 0.25, 0.40], [0, 0.15, 0.15, 0]);

// Title opacity (visible during phase 1, fades in phase 2)
const chaosTitleOpacity = useTransform(scrollYProgress, [0.05, 0.10, 0.30, 0.40], [0, 1, 1, 0]);

// Cost counter: maps progress to dollar amount (0 -> 2847)
const costProgress = useTransform(scrollYProgress, [0.02, 0.22], [0, 2847]);
```

The cost counter renders via a `motion.span` that reads `costProgress` with `useMotionValueEvent` or a `useTransform` to string conversion. Display as `$X,XXX/mo` with `text-destructive font-mono` styling.

Title gets the `jitter` animation class: `style={{ animation: "jitter 0.3s infinite" }}` — only applied when phase 1 is active.

**Step 3: Verify visually** — the component won't be on page yet, but `npm run check` should pass.

**Step 4: Commit**

```
feat: implement Phase 1 chaos logos + overlay
```

---

## Task 5: Implement Phase 2 — "The Collapse" + Phase 3 — "The Clarity"

**Files:**
- Modify: `client/src/components/cinematic-chaos.tsx`

**Step 1: White flash overlay**

```tsx
const flashOpacity = useTransform(scrollYProgress, [0.43, 0.46, 0.49], [0, 0.9, 0]);
// Rendered as:
<motion.div
  className="absolute inset-0 bg-background z-50 pointer-events-none"
  style={{ opacity: flashOpacity }}
/>
```

**Step 2: Dashboard mockup component**

A `DashboardMockup` sub-component renders a 2x2 bento grid:

```tsx
function DashboardMockup() {
  const modules = [
    { icon: Users, label: "CRM", bars: 4 },
    { icon: BarChart3, label: "Analytics", bars: 5 },
    { icon: GitBranch, label: "Workflows", nodes: 3 },
    { icon: Plug, label: "API", statuses: 3 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 w-[320px] md:w-[480px]">
      {modules.map((mod) => (
        <div key={mod.label} className="glass rounded-xl border border-primary/20 p-4 md:p-5">
          <div className="flex items-center gap-2 mb-3">
            <mod.icon className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono font-semibold text-primary tracking-wider">{mod.label}</span>
          </div>
          {/* Faux content: bars for CRM/Analytics, dots for Workflows/API */}
          <div className="space-y-1.5">
            {Array.from({ length: mod.bars || mod.nodes || mod.statuses || 3 }).map((_, j) => (
              <div key={j} className="h-1.5 rounded-full bg-primary/10"
                style={{ width: `${50 + Math.random() * 50}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

Note: The random widths need to be seeded/stable. Use a deterministic pattern like `width: ${50 + ((j * 37 + modIndex * 13) % 50)}%` instead of `Math.random()`.

**Step 3: Phase 3 animations**

```tsx
// Dashboard scale + opacity
const dashboardScale = useTransform(scrollYProgress, [0.48, 0.60, 0.70], [0.3, 0.9, 1]);
const dashboardOpacity = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);

// Clarity title + cost
const clarityTitleOpacity = useTransform(scrollYProgress, [0.60, 0.70], [0, 1]);
const clarityCostOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);

// Background glow
const clarityGlowOpacity = useTransform(scrollYProgress, [0.50, 0.65], [0, 0.6]);

// CTA
const ctaOpacity = useTransform(scrollYProgress, [0.80, 0.90], [0, 1]);
const ctaY = useTransform(scrollYProgress, [0.80, 0.90], [30, 0]);
```

Phase 3 layout:

```tsx
<motion.div className="absolute inset-0 flex flex-col items-center justify-center z-10"
  style={{ opacity: dashboardOpacity, scale: dashboardScale }}>

  {/* Radial glow behind */}
  <motion.div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
    style={{
      opacity: clarityGlowOpacity,
      background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
      filter: "blur(80px)"
    }}
  />

  <DashboardMockup />

  <motion.h2 className="text-3xl md:text-5xl font-black mt-8 text-center"
    style={{ opacity: clarityTitleOpacity }}>
    {t("chaos.phase3.title")}{" "}
    <span className="text-primary">{t("chaos.phase3.titleHighlight")}</span>
  </motion.h2>

  <motion.div className="mt-4 flex items-center gap-2"
    style={{ opacity: clarityCostOpacity }}>
    <span className="font-mono text-2xl md:text-3xl font-black text-primary">
      {t("chaos.phase3.cost")}
    </span>
    <span className="text-muted-foreground text-sm">{t("chaos.phase3.subtitle")}</span>
  </motion.div>

  <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="mt-8">
    <Link href="/build">
      <Button size="lg" className="font-bold shimmer-btn">
        {t("chaos.cta")}
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </Link>
  </motion.div>
</motion.div>
```

**Step 4: Verify — `npm run check`**

**Step 5: Commit**

```
feat: implement Phase 2 collapse + Phase 3 clarity dashboard
```

---

## Task 6: Implement mobile + reduced-motion variants

**Files:**
- Modify: `client/src/components/cinematic-chaos.tsx`

**Step 1: Mobile variant**

A `MobileChaosSection` sub-component — no sticky pinning, no scroll-driven transforms:

```tsx
function MobileChaosSection() {
  const { t } = useLanguage();
  // Subset of 12 logos for mobile (pick the most recognizable)
  const mobileLogo subset = CHAOS_APPS.filter((_, i) => i % 2 === 0).slice(0, 12);

  return (
    <section id="problem" className="py-16 px-6">
      {/* Phase 1: Static messy pile */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="relative h-[280px] mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          {mobileLogos.map((app, i) => (
            <div key={app.name} className="absolute" style={{
              left: `${50 + app.x * 0.12}%`,
              top: `${50 + app.y * 0.12}%`,
              transform: `translate(-50%, -50%) rotate(${app.rotate}deg)`,
            }}>
              {/* render icon */}
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 w-full text-center">
          <p className="font-mono text-xl font-black text-destructive">{t("chaos.phase1.cost")}</p>
          <p className="text-sm text-muted-foreground">{t("chaos.phase1.subtitle")}</p>
        </div>
      </motion.div>

      {/* Divider / transition */}
      <div className="flex justify-center my-6">
        <div className="w-px h-12 bg-gradient-to-b from-destructive/50 to-primary/50" />
      </div>

      {/* Phase 3: Dashboard mockup */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="flex flex-col items-center">
        <DashboardMockup />
        <h2 className="text-2xl font-black mt-6 text-center">
          {t("chaos.phase3.title")} <span className="text-primary">{t("chaos.phase3.titleHighlight")}</span>
        </h2>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-xl font-black text-primary">{t("chaos.phase3.cost")}</span>
          <span className="text-muted-foreground text-sm">{t("chaos.phase3.subtitle")}</span>
        </div>
        <Link href="/build">
          <Button size="lg" className="font-bold shimmer-btn mt-6">
            {t("chaos.cta")} <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
```

**Step 2: Reduced motion**

In the main `CinematicChaosSection`, when `prefersReducedMotion` is true, render a simplified version: Phase 1 static with a simple `whileInView` fade → Phase 3 static. Similar to mobile but within the sticky container, just no animation/jitter/flash. Use the same `MobileChaosSection` layout.

**Step 3: Wire the conditional render**

```tsx
export default memo(function CinematicChaosSection() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  if (isMobile || prefersReducedMotion) return <MobileChaosSection />;
  return <DesktopChaosSection />;
});
```

**Step 4: Verify — `npm run check`**

**Step 5: Commit**

```
feat: add mobile and reduced-motion variants for cinematic chaos
```

---

## Task 7: Wire into landing page + remove old section

**Files:**
- Modify: `client/src/pages/landing.tsx`

**Step 1: Add import**

At top of file, after the existing lazy imports (~line 47):

```tsx
import CinematicChaosSection from "@/components/cinematic-chaos";
```

**Step 2: Replace `<SpaghettiChaosSection />` with `<CinematicChaosSection />`**

In the page assembly (~line 2429):

```diff
- <SpaghettiChaosSection />
+ <CinematicChaosSection />
```

**Step 3: Delete old code from landing.tsx**

Remove these functions and all their code:
- `ChaosIcon` (lines ~538-625)
- `SpaghettiChaosSection` (lines ~627-787)

Also remove any SaaS icon imports from landing.tsx that are no longer used there (check if `ComparisonToggleSection` or any other section still uses them — if not, remove from the import block).

**Step 4: Verify — `npm run check`**

Expected: no TS errors. Old functions removed, new component imported.

**Step 5: Verify visually — `npm run dev`**

Check:
- [ ] Desktop: section pins on scroll, logos fly in, pile up, jitter, cost ticks up
- [ ] Desktop: logos collapse, white flash, dashboard mockup expands
- [ ] Desktop: title, cost, CTA all appear cleanly in phase 3
- [ ] Desktop: no horizontal scrollbar
- [ ] Mobile: simplified vertical timeline renders
- [ ] Section number "01" still appears correctly

**Step 6: Commit**

```
feat: integrate cinematic chaos section, remove old SpaghettiChaosSection
```

---

## Task 8: Final polish + performance pass

**Files:**
- Modify: `client/src/components/cinematic-chaos.tsx`
- Possibly: `client/src/index.css`

**Step 1: Performance check**

- Ensure all animated properties are `transform` and `opacity` only (GPU-composited)
- Add `will-change: transform` only to the sticky container, not individual logos
- Verify no layout thrashing in DevTools Performance tab

**Step 2: Visual polish**

- Tune scroll ranges if transitions feel too fast/slow
- Adjust jitter intensity
- Ensure dashboard mockup cards have consistent heights
- Check dark mode rendering

**Step 3: Final `npm run check`**

**Step 4: Commit**

```
refactor: polish cinematic chaos section animations and performance
```
