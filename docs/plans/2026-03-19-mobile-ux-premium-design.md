# Mobile UX & Premium Polish Design

**Date:** 2026-03-19
**Status:** Approved

## Scope

5 features to elevate mobile experience and add premium details:

1. Full-screen mobile navigation overlay
2. Touch micro-interactions (button scale, card tilt, tap ripple)
3. Skeleton loading states for dynamic content
4. Premium toast/notification bar
5. Simplified dark/light theme toggle with localStorage

**Out of scope:** "By The Numbers" stats counter section (removed per user request).

---

## 1. Full-Screen Mobile Navigation

**File:** `client/src/components/shared-layout.tsx`

**Current:** Dropdown menu with `height: auto` animation, small text, no language toggle inside.

**New behavior:**
- Full-screen overlay: `fixed inset-0 z-[60]` sliding in from right (`x: "100%"` → `x: 0`)
- Background: `bg-background/95 backdrop-blur-xl`
- Nav links at `text-2xl` (~24px) with staggered entry (50ms per link)
- Each link is a `motion.a` or `motion(Link)` with `initial={{ opacity: 0, x: 40 }}` → `animate={{ opacity: 1, x: 0 }}`
- Language toggle (EN|ES) at the bottom of the overlay
- Hamburger → X transition via `AnimatePresence` icon swap
- Body scroll lock preserved (already exists)
- Close on link click (existing behavior)
- CTA button at bottom with shimmer-btn styling

**Animation details:**
- Overlay slide: `duration: 0.4, ease: [0.22, 1, 0.36, 1]`
- Link stagger: `delay: 0.1 + index * 0.05`
- Exit: reverse with `duration: 0.3`
- Respects `prefers-reduced-motion`: instant show/hide if reduced

---

## 2. Touch Micro-Interactions

**Files:** `client/src/components/ui/button.tsx`, `client/src/index.css`

### Button scale-down
- Add `active:scale-[0.97] transition-transform duration-100` to base Button variants
- Wrapped in `@media (prefers-reduced-motion: no-preference)` in CSS

### Card tilt on touch
- Pricing cards already have 3D tilt via mouse tracking
- For bento-card and portfolio-card: CSS-only `:active` with `transform: perspective(800px) rotateX(1deg)`
- No JS touch handlers needed

### Tap ripple
- New `.tap-ripple` utility class in `index.css`
- Uses `::after` pseudo-element: radial gradient, `scale(0)` → `scale(1)` on `:active`
- CSS-only, performant
- Opt-in: add class to buttons/cards that want it

---

## 3. Skeleton Loading States

**Files:** `client/src/index.css`, `client/src/pages/landing.tsx`

### New CSS utility
- `.skeleton-shimmer` class using existing `shimmer` keyframe
- Dark theme colors: `bg-muted` base with lighter sweep (`bg-muted-foreground/10`)
- Matches existing dark aesthetic

### Application
- Pricing cards: skeleton version with placeholder bars for title, price, features
- Case study cards: skeleton with image placeholder + text bars
- Conditionally rendered — ready for when data becomes dynamic

---

## 4. Premium Notification Bar

**Files:** New `client/src/components/premium-notification.tsx`, new `client/src/context/notification-context.tsx`

### Component: `PremiumNotification`
- Full-width bar sliding down from top: `y: -100` → `y: 0`
- Animated SVG checkmark: circle draws first (`pathLength: 0→1`), then check path
- Message text in `font-medium`
- Shrinking progress bar at bottom: `scaleX: 1→0` over 4 seconds (transform-origin right)
- Auto-dismiss after 4s
- Background: `bg-primary/10 border-b border-primary/20`

### Context: `useNotification()`
- `show(message: string, type?: "success" | "info")` method
- Used in scheduling modal success callback
- Replaces generic toast for form submissions

---

## 5. Simplified Theme Toggle

**File:** `client/src/components/ui/theme-toggle.tsx`

**Current:** Dropdown with Light/Dark/System options. No localStorage persistence.

**New behavior:**
- Single button toggle (no dropdown): click cycles dark → light → dark
- Sun/Moon icon with rotation animation on toggle
- Persist to `localStorage` key `alloy-theme`
- Read from localStorage on mount, fallback to system preference
- Existing CSS variables already support both modes
- Glass effects already have light/dark variants

---

## Constraints

- All animations respect `prefers-reduced-motion`
- No heavy JS on touch events — CSS `:active` states for mobile
- Use existing design system (semantic tokens, Framer Motion patterns)
- No text/copy changes
- i18n keys only for any new user-facing strings (notification messages)
