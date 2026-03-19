# Design: Cinematic "Chaos to Clarity" Section

**Date**: 2026-03-19
**Replaces**: `SpaghettiChaosSection` (Section 01 in landing page)
**New file**: `client/src/components/cinematic-chaos.tsx`

## Overview

Rebuild Section 01 as a scroll-driven cinematic 3-phase narrative: chaotic SaaS logos scatter and pile up, collapse into a central point, then a clean Alloy dashboard mockup expands outward. Pinned to viewport during scroll (~300vh scroll distance).

## Scroll Structure

- Outer: `h-[300vh]` scroll container
- Inner: `sticky top-0 h-screen` pinned viewport
- `useScroll({ target, offset: ["start start", "end end"] })` maps to 0-1 progress

## Phase 1 — "THE CHAOS" (progress 0.0 - 0.33)

- 27 SaaS logos (same set as current section) animate from off-screen edges into a messy overlapping pile
- Staggered entry: logos appear sequentially across progress 0.0-0.20
- Once piled: CSS `@keyframes jitter` animation (subtle shake)
- Cost counter ticks up 0 -> $2,847/mo in destructive/mono font
- Background: red-tinted radial gradient overlay
- Title: "THIS IS YOUR TECH STACK" uppercase, with jitter

## Phase 2 — "THE COLLAPSE" (progress 0.33 - 0.50)

- All logos: scale to 0, translate to center, opacity to 0
- White flash overlay at progress ~0.45 (narrow band)
- Title and cost counter fade out
- Red background fades to zero

## Phase 3 — "THE CLARITY" (progress 0.50 - 1.0)

- Dashboard mockup scales up from center (0.5 -> 1.0)
- 2x2 glassmorphism bento grid: CRM, Analytics, Workflows, API
- Each card uses `.glass` + `border-primary/20`, staggered scale-in
- Title: "THIS IS YOUR ALLOY PLATFORM" (clean, no shake)
- Cost: "$1,000/mo" in primary color
- Subtle radial glow background
- CTA button fades in near progress 0.9

## Mobile (< lg)

No sticky pinning. Vertical timeline with `whileInView` triggers:
1. Static messy pile (~12 logos subset) + cost + title
2. Fade transition
3. Dashboard mockup + cost + title

## Reduced Motion

Static Phase 1 cross-fades to static Phase 3. No jitter, flash, or individual animations.

## i18n Keys (new)

- `chaos.phase1.title` / `chaos.phase1.cost`
- `chaos.phase3.title` / `chaos.phase3.titleHighlight` / `chaos.phase3.cost`
