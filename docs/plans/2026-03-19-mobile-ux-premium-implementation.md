# Mobile UX & Premium Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add premium mobile UX polish — full-screen nav overlay, touch micro-interactions, skeleton loading, premium notifications, and simplified theme toggle.

**Architecture:** All changes are in the `client/` directory. CSS utilities in `index.css`, component modifications in `shared-layout.tsx` and `ui/` components, two new files for the notification system. No backend changes.

**Tech Stack:** React 18, Framer Motion, TailwindCSS, CSS custom properties, Radix UI

---

### Task 1: Simplified Theme Toggle with localStorage

**Files:**
- Modify: `client/src/components/ui/theme-toggle.tsx` (entire file rewrite)

**Why first:** Small, self-contained change. Establishes localStorage theme persistence that other components may reference.

**Step 1: Rewrite theme-toggle.tsx**

Replace the entire file content with:

```tsx
import { useEffect, useState, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("alloy-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("alloy-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      data-testid="button-theme-toggle"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
```

**Step 2: Verify it works**

Run: `npm run check`
Expected: No TypeScript errors

**Step 3: Commit**

```bash
git add client/src/components/ui/theme-toggle.tsx
git commit -m "feat: simplify theme toggle to single button with localStorage persistence"
```

---

### Task 2: Touch Micro-Interactions — CSS Utilities

**Files:**
- Modify: `client/src/index.css` (add new utility classes at end of `@layer utilities` block)

**Step 1: Add tap-ripple and card active styles to index.css**

Insert the following **before** the closing `}` of the `@layer utilities` block (before line 220 — the `}` that closes `@layer utilities`):

```css
  /* ── Touch micro-interactions ── */

  /* Tap ripple — opt-in via class, CSS-only */
  .tap-ripple {
    position: relative;
    overflow: hidden;
  }

  .tap-ripple::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.15), transparent 60%);
    transform: scale(0);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    pointer-events: none;
    border-radius: inherit;
  }

  .tap-ripple:active::after {
    transform: scale(2.5);
    opacity: 1;
    transition: transform 0.15s ease-out, opacity 0.1s ease-out;
  }
```

**Step 2: Add reduced-motion guard**

Inside the existing `@media (prefers-reduced-motion: reduce)` block at the end of the file (around line 614), add:

```css
  .tap-ripple:active::after { transform: none; opacity: 0; }
```

**Step 3: Add active scale to button component**

Modify `client/src/components/ui/button.tsx` line 8-9. Change the base cva string from:

```
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2",
```

to:

```
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  " hover-elevate active-elevate-2 active:scale-[0.97] transition-transform duration-100",
```

**Step 4: Add tilt on active for bento-card and portfolio-card**

In `client/src/index.css`, add to the `.bento-card` block (after line 393, the `box-shadow` line inside `.bento-card:hover`):

```css
.bento-card:active {
  transform: perspective(800px) rotateX(1deg);
}

.portfolio-card:active {
  transform: perspective(800px) rotateX(1deg);
}
```

**Step 5: Verify**

Run: `npm run check`
Expected: No TypeScript errors

**Step 6: Commit**

```bash
git add client/src/index.css client/src/components/ui/button.tsx
git commit -m "feat: add touch micro-interactions — tap ripple, active scale, card tilt"
```

---

### Task 3: Skeleton Loading Shimmer Utility

**Files:**
- Modify: `client/src/index.css` (add skeleton-shimmer class)

**Step 1: Add skeleton-shimmer class**

Insert in the `@layer utilities` block (alongside the tap-ripple class added in Task 2):

```css
  /* ── Skeleton shimmer for loading states ── */
  .skeleton-shimmer {
    @apply rounded-lg;
    background: linear-gradient(
      90deg,
      hsl(var(--muted)) 0%,
      hsl(var(--muted-foreground) / 0.08) 50%,
      hsl(var(--muted)) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
```

This reuses the existing `shimmer` keyframe (already defined at line 293) but with muted colors matching the dark theme.

**Step 2: Verify**

Run: `npm run check`
Expected: No errors

**Step 3: Commit**

```bash
git add client/src/index.css
git commit -m "feat: add skeleton-shimmer CSS utility for loading states"
```

---

### Task 4: Premium Notification System

**Files:**
- Create: `client/src/context/notification-context.tsx`
- Create: `client/src/components/premium-notification.tsx`
- Modify: `client/src/App.tsx` (add provider + component)
- Modify: `client/src/i18n/en.ts` (add i18n key)
- Modify: `client/src/i18n/es.ts` (add i18n key)

**Step 1: Create the notification context**

Create `client/src/context/notification-context.tsx`:

```tsx
import { createContext, useContext, useState, useCallback } from "react";

interface Notification {
  id: number;
  message: string;
  type: "success" | "info";
}

interface NotificationContextValue {
  notification: Notification | null;
  show: (message: string, type?: "success" | "info") => void;
  dismiss: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notification: null,
  show: () => {},
  dismiss: () => {},
});

export function useNotification() {
  return useContext(NotificationContext);
}

let idCounter = 0;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const dismiss = useCallback(() => setNotification(null), []);

  const show = useCallback((message: string, type: "success" | "info" = "success") => {
    const id = ++idCounter;
    setNotification({ id, message, type });
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, show, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}
```

**Step 2: Create the premium notification component**

Create `client/src/components/premium-notification.tsx`:

```tsx
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/context/notification-context";

function AnimatedCheckmark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d="M8 12l3 3 5-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}

const AUTO_DISMISS_MS = 4000;

export function PremiumNotification() {
  const { notification, dismiss } = useNotification();

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notification, dismiss]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.id}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-[100] bg-primary/10 backdrop-blur-md border-b border-primary/20"
        >
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
            <span className="text-primary">
              <AnimatedCheckmark />
            </span>
            <span className="text-sm font-medium text-foreground">
              {notification.message}
            </span>
          </div>
          {/* Progress bar */}
          <motion.div
            className="h-[2px] bg-primary/40 origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 3: Wire into App.tsx**

In `client/src/App.tsx`, add two imports:

```tsx
import { NotificationProvider } from "@/context/notification-context";
import { PremiumNotification } from "@/components/premium-notification";
```

Then wrap the existing providers. Change the App function body to nest `NotificationProvider` inside `LanguageProvider` and add `<PremiumNotification />` next to `<Toaster />`:

```tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <NotificationProvider>
          <ScrollProvider>
            <TooltipProvider>
              <Toaster />
              <PremiumNotification />
              <Preloader />
              <CustomCursor />
              <Router />
            </TooltipProvider>
          </ScrollProvider>
        </NotificationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
```

**Step 4: Add i18n keys**

In `client/src/i18n/en.ts`, add (in the appropriate section):

```
"notification.bookingSuccess": "Your call has been booked! Check your email for confirmation.",
```

In `client/src/i18n/es.ts`, add:

```
"notification.bookingSuccess": "Tu llamada ha sido agendada! Revisa tu email para la confirmacion.",
```

**Step 5: Verify**

Run: `npm run check`
Expected: No TypeScript errors

**Step 6: Commit**

```bash
git add client/src/context/notification-context.tsx client/src/components/premium-notification.tsx client/src/App.tsx client/src/i18n/en.ts client/src/i18n/es.ts
git commit -m "feat: add premium notification bar with animated checkmark and auto-dismiss"
```

---

### Task 5: Full-Screen Mobile Navigation Overlay

**Files:**
- Modify: `client/src/components/shared-layout.tsx` (lines 29-293, the SharedNavbar component)

**This is the largest task.** We're replacing the mobile dropdown menu (lines 160-293) with a full-screen overlay.

**Step 1: Add useReducedMotion import**

At line 2, update the framer-motion import to include `useReducedMotion`:

```tsx
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
```

**Step 2: Add reduced motion hook inside SharedNavbar**

Inside the `SharedNavbar` function, after the existing state declarations (around line 33), add:

```tsx
const prefersReducedMotion = useReducedMotion();
```

**Step 3: Replace the mobile menu AnimatePresence block**

Replace the entire `<AnimatePresence>` block (lines 160-294) that contains the mobile menu with:

```tsx
      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] md:hidden bg-background/95 backdrop-blur-xl flex flex-col"
          >
            {/* Top bar with logo + close */}
            <div className="flex items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <img src={alloyLogo} alt="ALLOY" className="h-8 w-auto dark:brightness-110 brightness-90 dark:drop-shadow-[0_0_4px_rgba(200,160,120,0.3)]" />
                <span className="text-lg font-bold tracking-tight">
                  <span className="text-primary">ALL</span>
                  <span className="text-foreground">OY</span>
                </span>
              </Link>
              <Button size="icon" variant="ghost" onClick={() => setMobileMenuOpen(false)} data-testid="button-mobile-close">
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Nav links — staggered */}
            <nav className="flex-1 flex flex-col justify-center px-10 gap-6">
              {[
                { href: isLandingPage ? "#solution" : "/#solution", label: t("nav.solutions"), isAnchor: isLandingPage },
                { href: isLandingPage ? "#cases" : "/#cases", label: t("nav.portfolio"), isAnchor: isLandingPage },
                { href: "/build", label: t("nav.buildYourSolution"), isAnchor: false, isActive: location === "/build" },
                { href: isLandingPage ? "#clients" : "/#clients", label: t("nav.clients"), isAnchor: isLandingPage },
                { href: isLandingPage ? "#pricing" : "/#pricing", label: t("nav.pricing"), isAnchor: isLandingPage },
                { href: isLandingPage ? "#contact" : "/#contact", label: t("nav.contact"), isAnchor: isLandingPage },
              ].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.isAnchor ? (
                    <a
                      href={item.href}
                      className={`text-2xl font-display font-semibold transition-colors duration-200 ${item.isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-2xl font-display font-semibold transition-colors duration-200 ${item.isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Bottom: CTA + Language toggle */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="px-10 pb-10 flex flex-col gap-5"
            >
              <Button
                size="lg"
                className="font-semibold shimmer-btn glow-border w-full text-lg"
                onClick={() => { setMobileMenuOpen(false); openScheduling(); }}
                data-testid="mobile-button-cta"
              >
                {t("nav.scheduleCall")}
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>

              {/* Language toggle */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { const { setLanguage } = require("@/context/language-context"); }}
                  className="text-sm font-mono text-muted-foreground"
                >
                  {/* Using the existing LanguageToggle component */}
                </button>
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
```

**Important note for implementer:** The nav links array uses `isAnchor` to decide between `<a>` (for same-page hash navigation) and `<Link>` (for cross-page navigation via Wouter). The `isActive` field highlights the current page. Remove the hacky inline `require()` for the language toggle — just render the existing `<LanguageToggle />` and `<ThemeToggle />` components that are already imported at the top of the file.

**Step 4: Move the LanguageToggle and ThemeToggle from the top bar into the overlay only on mobile**

Currently the top navbar shows `<LanguageToggle />` and `<ThemeToggle />` in the right-side controls (line 136). These should remain visible on desktop but move into the overlay on mobile. Wrap them with `hidden md:flex`:

Change lines 135-146 from:
```tsx
<div className="flex items-center gap-2">
  <LanguageToggle />
  <ThemeToggle />
  <Button ...>
```

to:
```tsx
<div className="flex items-center gap-2">
  <div className="hidden md:flex items-center gap-2">
    <LanguageToggle />
    <ThemeToggle />
  </div>
  <Button ...>
```

**Step 5: Verify**

Run: `npm run check`
Expected: No TypeScript errors

**Step 6: Manually test mobile nav**

Run: `npm run dev`
- Open browser dev tools, enable mobile viewport (iPhone 14 Pro)
- Tap hamburger — full-screen overlay slides in from right
- Links appear with stagger animation
- Tap a link — overlay closes, page scrolls to section
- Language toggle and theme toggle visible at bottom

**Step 7: Commit**

```bash
git add client/src/components/shared-layout.tsx
git commit -m "feat: replace mobile dropdown with full-screen nav overlay with staggered animations"
```

---

### Task 6: Visual QA & Polish Pass

**Files:**
- Possibly: `client/src/index.css`, `client/src/components/shared-layout.tsx`

**Step 1: Test all features in mobile viewport**

Run: `npm run dev`

Checklist:
- [ ] Theme toggle persists across page reload (localStorage)
- [ ] Theme toggle animates sun/moon icons
- [ ] Mobile nav overlay slides from right
- [ ] Nav links stagger in
- [ ] Language toggle works in mobile overlay
- [ ] Button press shows scale-down (0.97) on touch
- [ ] Tap-ripple class shows radial gradient on active (test on a CTA button)
- [ ] Bento cards tilt slightly on active press
- [ ] Premium notification shows when triggered
- [ ] Notification auto-dismisses after 4s with progress bar
- [ ] All animations disabled with `prefers-reduced-motion: reduce`

**Step 2: Fix any issues found**

Address any visual bugs, z-index conflicts, or animation timing issues.

**Step 3: Final commit**

```bash
git add -A
git commit -m "fix: polish mobile UX interactions and resolve visual issues"
```

---

## Execution Order & Dependencies

```
Task 1 (Theme Toggle) ──┐
Task 2 (Touch CSS)    ──┤── Can run in parallel
Task 3 (Skeleton CSS) ──┘
         │
Task 4 (Notification) ──── Depends on nothing, but modifies App.tsx
         │
Task 5 (Mobile Nav)   ──── Depends on Task 1 (ThemeToggle in overlay)
         │
Task 6 (QA Pass)      ──── Depends on all above
```

Tasks 1, 2, and 3 are independent and can be parallelized.
Task 4 is independent but touches App.tsx.
Task 5 depends on Task 1 (uses ThemeToggle inside the overlay).
Task 6 is the final QA pass.
