# BUGS.md — QA Audit Report

**Auditor:** QA Lead  
**Date:** 2026-02-10  
**Scope:** Full codebase audit — Design Audit, Logic Testing, Edge Cases, Security + i18n Translation Audit  

---

## SEVERITY LEGEND

| Level | Meaning |
|-------|---------|
| 🔴 **CRITICAL** | Security vulnerability, data loss, or crash |
| 🟠 **HIGH** | Broken functionality, significant style drift |
| 🟡 **MEDIUM** | Incorrect behavior, inconsistency with standards |
| 🟢 **LOW** | Minor cosmetic issue, code quality |

---

## 🔴 CRITICAL

---

### BUG-001: Reflected XSS in OAuth Callback Endpoint

**File:** `server/calendarRoutes.ts` (line 185)  
**Severity:** 🔴 CRITICAL  

**Steps to Reproduce:**
1. Navigate to `/api/oauth/callback?error=<script>alert('XSS')</script>`

**Expected Result:**  
The `error` query parameter should be HTML-escaped before being rendered in the response body.

**Actual Result:**  
The `error` query parameter from `req.query.error` is interpolated directly into the HTML response via template literal `${error}` without any sanitization. This allows an attacker to inject arbitrary HTML/JavaScript into the page.

```typescript
// Line 185 — raw interpolation of user input into HTML
<p>Error: ${error}</p>
```

---

### BUG-002: Chat API Routes Are Completely Unauthenticated

**File:** `server/replit_integrations/chat/routes.ts` (lines 55-200)  
**Severity:** 🔴 CRITICAL  

**Steps to Reproduce:**
1. Without logging in, send a `GET` request to `/api/conversations`
2. Send a `POST` request to `/api/conversations` with body `{"title":"test"}`
3. Send a `POST` request to `/api/conversations/1/messages` with body `{"content":"Hello"}`
4. Send a `DELETE` request to `/api/conversations/1`

**Expected Result:**  
All `/api/conversations` routes should be protected by the `isAuthenticated` middleware, as documented in `PROJECT_STANDARDS.md` §4.

**Actual Result:**  
None of the chat routes use `isAuthenticated`. Any anonymous user can create, read, delete conversations and trigger AI completions (consuming API credits). This also means conversations have no user ownership — all users see all conversations.

---

### BUG-003: Calendar Booking Endpoint Has No Rate Limiting

**File:** `server/calendarRoutes.ts` (line 44)  
**Severity:** 🔴 CRITICAL  

**Steps to Reproduce:**
1. Write a script that POSTs to `/api/calendar/book` in a loop with valid booking data.

**Expected Result:**  
The endpoint should have rate limiting to prevent abuse (spam bookings, Google Calendar flooding).

**Actual Result:**  
No rate limiting exists on any API endpoint. An attacker could flood the booking system, consume all available calendar slots, and spam Google Calendar events and email notifications.

---

## 🟠 HIGH — Style Drift

---

### BUG-004: `not-found.tsx` Uses Raw Tailwind Colors Instead of Design Tokens

**File:** `client/src/pages/not-found.tsx` (lines 6, 10, 11, 14)  
**Severity:** 🟠 HIGH  

**Steps to Reproduce:**
1. Navigate to any unknown route (e.g., `/nonexistent`)
2. Observe the 404 page styling

**Expected Result:**  
Per `PROJECT_STANDARDS.md` §1: "Use semantic utility classes, not raw hex codes." Colors should use `bg-background`, `text-foreground`, `text-muted-foreground`, `text-destructive`.

**Actual Result:**  
The page uses raw Tailwind colors that bypass the theme system entirely:
- `bg-gray-50` → should be `bg-background`
- `text-gray-900` → should be `text-foreground`
- `text-gray-600` → should be `text-muted-foreground`
- `text-red-500` → should be `text-destructive`

This page will NOT respond to dark mode theme changes and will look broken when `dark` class is applied.

---

### BUG-005: Ghost CSS Classes — `toggle-elevate` and `toggle-elevated` Not Defined

**File:** `client/src/pages/landing.tsx` (lines 735, 744)  
**Severity:** 🟠 HIGH  

**Steps to Reproduce:**
1. Open the landing page and scroll to the comparison toggle section.
2. Inspect the "Standard SaaS" / "Your Platform" toggle buttons.

**Expected Result:**  
The `toggle-elevate` and `toggle-elevated` classes should produce a visible visual effect (per their names: some kind of elevation/shadow).

**Actual Result:**  
These classes are not defined anywhere — not in `index.css`, not in `tailwind.config.ts`, and not in any component. They are dead classes with zero visual effect. The buttons still work but lack the intended visual feedback.

---

### BUG-006: Ghost CSS Class — `hover-elevate` / `active-elevate-2` Not Defined

**Files:**  
- `client/src/components/shared-layout.tsx` (line 102)
- `client/src/components/ui/button.tsx` (line 9)
- `client/src/components/ui/badge.tsx` (line 9)

**Severity:** 🟠 HIGH  

**Steps to Reproduce:**
1. Hover over any `Button` component in the application.
2. Hover over portfolio dropdown items in the navbar.

**Expected Result:**  
The `hover-elevate` class should apply an elevation/shadow effect on hover. `active-elevate-2` should apply a press-down effect.

**Actual Result:**  
Neither `hover-elevate` nor `active-elevate-2` are defined in `index.css` or `tailwind.config.ts`. Every `<Button>` and `<Badge>` in the entire app references these phantom classes. They produce no visual effect.

---

### BUG-007: Ghost CSS Classes — `module-glass-card`, `scrollbar-thin`, `custom-scrollbar` Not Defined

**Files:**  
- `client/src/pages/build-solution.tsx` (line 121): `module-glass-card`
- `client/src/pages/build-solution.tsx` (line 456): `scrollbar-thin`
- `client/src/components/scheduling-modal.tsx` (line 330): `custom-scrollbar`

**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. View the Build Solution page module cards.
2. Select enough modules to make the sidebar scrollable.
3. Open the scheduling modal and view the time slots.

**Expected Result:**  
These classes should define specific styles (glass morphism, custom scrollbar styling).

**Actual Result:**  
None of these classes are defined. `scrollbar-none` IS defined in `index.css` but `scrollbar-thin` and `custom-scrollbar` are not. `module-glass-card` is not defined. These are all no-ops.

---

### BUG-008: `font-display` Used in Code But Not Registered in Tailwind Config

**File:** `client/src/pages/home.tsx` (line 95)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Log in and navigate to the home page (no active conversation).
2. Inspect the "Welcome to AI Chat" heading.

**Expected Result:**  
`font-display` should be a registered Tailwind font family class that applies a specific font.

**Actual Result:**  
`tailwind.config.ts` registers `sans`, `serif`, and `mono` font families — but NOT `display`. The CSS variable `--font-display` exists in `index.css`, but the Tailwind utility class `font-display` is not mapped. The class will be silently ignored.

---

### BUG-009: Hardcoded Non-Token Colors in Active Pages

**Files:**  
- `client/src/pages/landing.tsx` (lines 622, 843, 852, 861, 870): `bg-green-500`, `from-emerald-500/20`, `from-blue-500/20`, `from-purple-500/20`, `from-cyan-500/20`
- `client/src/pages/build-solution.tsx` (lines 276, 284): `bg-green-500`, `bg-blue-500`

**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. View the landing page and the Build Solution page.

**Expected Result:**  
Per `PROJECT_STANDARDS.md`: "Use semantic utility classes, not raw hex codes." These should reference design tokens (e.g., `status.online` from Tailwind config or `bg-primary`).

**Actual Result:**  
Several raw Tailwind color classes are used as one-offs. While `status.online` (green) is defined in the Tailwind config, it's used as `bg-green-500` instead of `bg-status-online`. The emerald, purple, cyan gradients for portfolio cards have no design token equivalents.

---

## 🟠 HIGH — Logic Issues

---

### BUG-010: Error Response Format Inconsistency Between Global Handler and Routes

**Files:**  
- `server/index.ts` (line 76): Uses `{ message: "..." }`
- `server/replit_integrations/chat/routes.ts`: Uses `{ error: "..." }`
- `server/calendarRoutes.ts`: Uses `{ error: "..." }`
- `server/replit_integrations/auth/routes.ts` (line 15): Uses `{ message: "..." }`

**Severity:** 🟠 HIGH  

**Steps to Reproduce:**
1. Review `PROJECT_STANDARDS.md` §2 which specifies error responses should use `{ error: "..." }`.
2. Trigger the global error handler vs. a route-level error.

**Expected Result:**  
All error responses should follow the documented pattern: `res.status(xxx).json({ error: "...", details?: ... })`.

**Actual Result:**  
The global error handler in `server/index.ts` uses `{ message: "..." }` (line 76). The auth routes also use `{ message: "..." }` (line 15 of auth `routes.ts`, line 137 of `replitAuth.ts`). Meanwhile, calendar and chat routes correctly use `{ error: "..." }`. A frontend error handler expecting a consistent format will break or display wrong error messages.

---

### BUG-011: `DEVELOPMENT_MANIFEST.md` Documents `memorystore` — But Code Uses `connect-pg-simple`

**File:** `DEVELOPMENT_MANIFEST.md` (line 69)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Read `DEVELOPMENT_MANIFEST.md` line 69: "**Store**: `memorystore` (dev/prod)."
2. Read `server/replit_integrations/auth/replitAuth.ts` line 8: `import connectPg from "connect-pg-simple"`

**Expected Result:**  
Documentation should match the actual implementation.

**Actual Result:**  
The manifest claims sessions use `memorystore`, but the actual code uses `connect-pg-simple` (PostgreSQL-backed sessions). The `memorystore` package IS present in `package.json` but is NOT used anywhere in the codebase. This is misleading documentation.

---

### BUG-012: `PrivateRoute` — useEffect Does Nothing

**File:** `client/src/App.tsx` (lines 19-23)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Review the `PrivateRoute` component.

**Expected Result:**  
The `useEffect` should handle the redirect for unauthenticated users.

**Actual Result:**  
The `useEffect` body is empty — it contains only a comment: `// Redirect handled by LandingPage being the default for logged out`. The `setLocation` is listed in the dependency array but never called. The redirect works only because of the fallback `if (!user) return <LandingPage />` below, making the `useEffect` dead code that adds unnecessary complexity and a lint warning (`setLocation` in deps but unused).

---

### BUG-013: `apiRequest` Throws After Consuming Response Body, Preventing Caller Error Parsing

**File:** `client/src/lib/queryClient.ts` (lines 10-24)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. `apiRequest` calls `throwIfResNotOk(res)` which reads `res.text()` on error.
2. The caller in `scheduling-modal.tsx` (line 100) then calls `res.json()`.
3. If the response is an error, `throwIfResNotOk` already consumed the body.

**Expected Result:**  
The caller should be able to parse the error response JSON to show the user a meaningful error.

**Actual Result:**  
`throwIfResNotOk` consumes the response body by calling `res.text()`, then throws. However, the `scheduling-modal.tsx` does a `try/catch` approach where it calls `const result = await res.json()` AFTER `apiRequest()`. Since `apiRequest` throws on error (consuming the body), the caller's error message extraction in `scheduling-modal.tsx` lines 101-103 will never execute for API errors — the thrown error message is a raw `"400: {json body text}"` string rather than a parsed error object. This makes user-facing error messages ugly.

---

## 🟡 MEDIUM — Edge Cases

---

### BUG-014: Build Solution Mobile "Continue to Quote Request" Has No Form Validation

**File:** `client/src/pages/build-solution.tsx` (lines 569-577)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Open `/build` on a mobile device.
2. Tap "Continue to Quote Request" without entering any name or email.

**Expected Result:**  
The mobile button should enforce the same validation as the desktop sidebar (name + email required).

**Actual Result:**  
The mobile CTA button at line 570 calls `handleRequestQuote()` directly, which opens the scheduling modal without checking `formData.name` or `formData.email`. The desktop sidebar button (line 536) HAS a `disabled={!formData.name || !formData.email}` condition, but the mobile button does NOT. On mobile, the sidebar form isn't visible, so users click through to the modal without having entered any data.

---

### BUG-015: Chat Messages Use Array Index as React Key

**File:** `client/src/pages/home.tsx` (line 134)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Open a chat conversation with messages.
2. Delete a message or observe streaming behavior.

**Expected Result:**  
React keys should be stable and unique identifiers (e.g., `message.id`).

**Actual Result:**  
`key={i}` (array index) is used. When messages are added/removed or when optimistic updates modify the array, React may incorrectly reuse DOM elements, causing stale content or animation glitches. The streaming cursor might appear on the wrong message.

---

### BUG-016: `parseInt` Without Validation on Route Params

**Files:**  
- `server/replit_integrations/chat/routes.ts` (lines 68, 96, 108)
- `client/src/pages/home.tsx` (line 14)
- `client/src/components/layout/sidebar.tsx` (line 41)

**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Send a GET request to `/api/conversations/abc`
2. Send a DELETE request to `/api/conversations/notanumber`

**Expected Result:**  
Invalid route params should return a `400 Bad Request` response.

**Actual Result:**  
`parseInt("abc")` returns `NaN`, which is then passed to `chatStorage.getConversation(NaN)`. Depending on the Drizzle ORM behavior, this could result in a 500 error with a confusing database error message rather than a clean validation error.

---

### BUG-017: Portfolio Grid Has 4 Items in 3-Column Layout

**File:** `client/src/pages/landing.tsx` (lines 837-874, 897)  
**Severity:** 🟢 LOW  

**Steps to Reproduce:**
1. Navigate to the landing page.
2. Scroll to the "Real systems. Real results." section.
3. Observe the grid layout on desktop.

**Expected Result:**  
Either a 4-column or 2-column grid, or 3 items in a 3-column grid.

**Actual Result:**  
There are 4 portfolio items in a `grid md:grid-cols-3` layout. The 4th item (DataLight) wraps to a second row alone, left-aligned, creating an asymmetric layout.

---

### BUG-018: Hardcoded Owner Email in `calendar.ts`

**File:** `server/calendar.ts` (lines 9-15)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Review `CALENDAR_IDS` array.

**Expected Result:**  
Calendar IDs and owner email should be configurable via environment variables.

**Actual Result:**  
Three email addresses are hardcoded directly in source code:
```typescript
const CALENDAR_IDS = [
  "ruisasaki0@gmail.com",
  "rui@themediaoptimizers.com",
  "rui@boostmode.com",
];
```
These should be in `.env` or a config file. If the code is forked or deployed to a different environment, these won't be updated and calendar integration will silently fail or leak personal information.

---

### BUG-019: Session Cookie `secure: true` Breaks Local Development

**File:** `server/replit_integrations/auth/replitAuth.ts` (line 37)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Run the app locally with `npm run dev` (HTTP, not HTTPS).
2. Try to log in.

**Expected Result:**  
Session cookies should work on `localhost` in development.

**Actual Result:**  
`secure: true` is hardcoded on the session cookie. Browsers will not send cookies over plain HTTP. This means authentication will silently fail in any local development environment that doesn't use HTTPS. This should be `secure: process.env.NODE_ENV === "production"`.

---

## 🟢 LOW — Code Quality & Minor Issues

---

### BUG-020: `next-themes` Package Installed But Theme Implementation Is Custom

**File:** `package.json` (line 65)  
**Severity:** 🟢 LOW  

**Steps to Reproduce:**
1. Check `package.json` for `next-themes` dependency.
2. Search for `next-themes` usage in the codebase.

**Expected Result:**  
Dependencies should be used or removed.

**Actual Result:**  
`next-themes` is listed as a dependency but the theme toggle appears to use a custom implementation (in `theme-toggle.tsx`). This is a dead dependency adding bundle size.

---

### BUG-021: `react-icons` Library Inconsistent with `PROJECT_STANDARDS.md`

**File:** `client/src/pages/landing.tsx` (lines 35-39)  
**Severity:** 🟢 LOW  

**Steps to Reproduce:**
1. Read `PROJECT_STANDARDS.md` §1: "**Icons**: Lucide React"
2. Review imports in `landing.tsx`.

**Expected Result:**  
Only Lucide React should be used for icons per project standards.

**Actual Result:**  
`landing.tsx` imports 22+ icons from `react-icons/si` and 1 from `react-icons/fa`. While these are third-party brand icons not available in Lucide, the deviation from standards should be documented. Additionally, `react-icons` pulls in a much larger bundle than Lucide.

---

### BUG-022: `PrivateRoute` Component Uses `...rest: any` Type

**File:** `client/src/App.tsx` (line 15)  
**Severity:** 🟢 LOW  

**Steps to Reproduce:**
1. Run TypeScript strict checks.

**Expected Result:**  
Proper TypeScript typing per project conventions.

**Actual Result:**  
`PrivateRoute` accepts `{ component: Component, ...rest }: any`, bypassing all type safety. Per `PROJECT_STANDARDS.md` §3, interfaces should be `PascalCase` and properly typed.

---

### BUG-023: `dev` Script Uses `NODE_ENV=development` (Unix Syntax) — Fails on Windows

**File:** `package.json` (line 7)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. On Windows, run `npm run dev`.

**Expected Result:**  
The dev server should start.

**Actual Result:**  
`NODE_ENV=development tsx server/index.ts` uses Unix-style environment variable assignment, which will fail on Windows CMD/PowerShell. The project has `start-dev.ps1` as a workaround, but `npm run dev` is the documented command in `DEVELOPMENT_MANIFEST.md`.

---

### BUG-024: `useChatStream` Uses Unvalidated `conversationId` of `0` as Fallback

**File:** `client/src/pages/home.tsx` (line 17)  
**Severity:** 🟢 LOW  

**Steps to Reproduce:**
1. Navigate to `/` while logged in (no active conversation).

**Expected Result:**  
The chat hook should not initialize with an invalid conversation ID.

**Actual Result:**  
`useChatStream(conversationId || 0)` passes `0` as a fallback, which is a valid-looking but nonexistent conversation ID. If `sendMessage` is ever called in this state, it will POST to `/api/conversations/0/messages`, creating a 404 or 500 from the server.

---

### BUG-025: `react-helmet` Instead of `react-helmet-async` (Potential SSR/Streaming Issues)

**File:** `package.json` (line 77)  
**Severity:** 🟢 LOW  

**Steps to Reproduce:**
1. Check the dependency.

**Expected Result:**  
Use `react-helmet-async` for React 18 compatibility.

**Actual Result:**  
`react-helmet` is deprecated and has known issues with concurrent mode in React 18+. While it works in client-only rendering, `react-helmet-async` is the maintained successor.

---

## i18n Translation Audit — Re-Audit (2026-02-10)

> BUG-026 through BUG-030 have been **✅ RESOLVED** by the Frontend Worker.
> All 5 planned files created, all 6 target files wired with `t()` calls, geo-detection and session persistence implemented.

---

### BUG-026: ✅ RESOLVED — i18n Infrastructure Implemented
### BUG-027: ✅ RESOLVED — All Pages Now Use `t()` Calls
### BUG-028: ✅ RESOLVED — Language Toggle Rendered in Navbar
### BUG-029: ✅ RESOLVED — Geo-Detection Logic Implemented
### BUG-030: ✅ RESOLVED — `App.tsx` Wrapped with `<LanguageProvider>`

---

## 🟡 MEDIUM — i18n Re-Audit Findings (NEW — 2026-02-10)

---

### BUG-031: Hardcoded English Error String in Chat Stream Error Handler

**File:** `client/src/pages/home.tsx` (line 74)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Start a chat conversation.
2. Trigger a stream error (e.g., disconnect network mid-stream).
3. Observe the error message appended to the chat.

**Expected Result:**  
Error message should use `t("home.errorGenerating")` for a localized string.

**Actual Result:**  
Hardcoded as `"\n\n*[Error generating response]*"`. Spanish-language users see English.

**Fix:** Add `"home.errorGenerating"` key to `en.ts`/`es.ts`, use `t()` via a ref.

---

### BUG-032: Date Formatting in Scheduling Modal Not Locale-Aware

**File:** `client/src/components/scheduling-modal.tsx` (lines 328, 464)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. Switch to Spanish language.
2. Open the scheduling modal and select a date.

**Expected Result:**  
Dates formatted with `date-fns` locale parameter (e.g., "lunes, 10 de febrero de 2026").

**Actual Result:**  
- Line 328: `format(selectedDate, "MMM d, yyyy")` → always English
- Line 464: `format(selectedDate, "EEEE, MMMM d, yyyy")` → always English

**Fix:** Import `es` locale from `date-fns/locale/es`, pass `{ locale }` to `format()`.

---

### BUG-033: Language Toggle Badge Positioning May Be Broken

**File:** `client/src/components/ui/language-toggle.tsx` (lines 13, 25)  
**Severity:** 🟡 MEDIUM  

**Steps to Reproduce:**
1. View the language toggle button in the navbar.
2. Check if the "EN"/"ES" badge is positioned correctly.

**Expected Result:**  
Badge appears at bottom-right of the button.

**Actual Result:**  
`<Button>` (line 13) has `className="h-9 w-9 rounded-full"` but no `relative`. The badge (line 25) uses `absolute` positioning, which requires a positioned ancestor.

**Fix:** Add `relative` to Button className.

---

### BUG-034: `LanguageProvider` Nested Inside `QueryClientProvider`

**File:** `client/src/App.tsx` (lines 54-61)  
**Severity:** 🟢 LOW  

**Expected (per plan):**
```tsx
<LanguageProvider>
  <QueryClientProvider>...</QueryClientProvider>
</LanguageProvider>
```

**Actual:**
```tsx
<QueryClientProvider>
  <LanguageProvider>...</LanguageProvider>
</QueryClientProvider>
```

Works functionally but deviates from agreed plan. Low priority.

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 3 |
| 🟠 HIGH | 6 |
| 🟡 MEDIUM | 12 |
| 🟢 LOW | 7 |
| **TOTAL** | **29** (5 resolved, 4 new) |

### Top Priority Fixes:
1. **BUG-001**: Sanitize user input in OAuth callback HTML responses
2. **BUG-002**: Add `isAuthenticated` middleware to ALL chat API routes
3. **BUG-003**: Add rate limiting to booking endpoint
4. **BUG-031**: Add `t()` call for chat error string in `home.tsx`
5. **BUG-032**: Add locale-aware date formatting in `scheduling-modal.tsx`

