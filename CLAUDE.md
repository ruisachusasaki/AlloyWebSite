# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AlloyWebSite is a custom software platform builder featuring a React frontend with Express backend, using PostgreSQL for persistence. The project follows an "Orchestrator + Worker" development pattern with specialized AI workers for Frontend, Backend, and QA tasks.

**IMPORTANT**: The `server/` directory has been deleted from this repository. Server-side code references in documentation may be outdated. Focus work on the `client/` codebase unless explicitly instructed otherwise.

## Development Commands

```bash
# Start development server (runs backend + Vite frontend)
npm run dev

# Type checking
npm run check

# Push database schema changes
npm run db:push

# Build for production
npm run build

# Start production server
npm run start
```

**Note**: The `dev` script uses Unix-style environment variables (`NODE_ENV=development`). On Windows, use `start-dev.ps1` instead.

## Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite 5+
- **Routing**: Wouter (not React Router)
- **Styling**: TailwindCSS 3.4 + `tailwindcss-animate`
- **Animation**: Framer Motion
- **UI Components**: Radix UI (headless components)
- **Icons**: Lucide React (primary), react-icons (brand icons only)
- **State Management**: TanStack Query (React Query)
- **Forms**: react-hook-form + Zod validation
- **Backend**: Express 5.0 + TypeScript (currently deleted)
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: Passport.js with express-session

### Folder Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── ui/        # Shadcn/Radix base components
│   │   │   ├── chat/      # Chat-specific components
│   │   │   └── layout/    # Layout components (sidebar, etc.)
│   │   ├── context/       # React Contexts (LanguageContext, SchedulingContext)
│   │   ├── hooks/         # Custom React hooks (use-auth, use-chat-stream, etc.)
│   │   ├── pages/         # Page components (landing, home, build-solution)
│   │   ├── lib/           # Utilities (queryClient, auth-utils)
│   │   ├── i18n/          # Internationalization (en.ts, es.ts)
│   │   ├── index.css      # Global styles + design tokens
│   │   ├── App.tsx        # Root component with routing
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── replit_integrations/ # Replit-specific client code
│   └── index.html
├── shared/                # Shared types (schema.ts for Drizzle)
├── server/                # ⚠️ DELETED - server code removed
├── dist/                  # Build output
│   ├── index.cjs         # Compiled backend
│   └── public/           # Compiled frontend
├── .agent/workflows/      # AI worker prompts (orchestrator, frontend, backend, qa)
└── attached_assets/       # Design prompts and requirements
```

### Path Aliases

Configure in both `vite.config.ts` and `tsconfig.json`:
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets/*` → `attached_assets/*`

Always use these aliases instead of relative imports for consistency.

## Critical Standards (from PROJECT_STANDARDS.md)

### Styling Rules

**ALWAYS use semantic design tokens, NEVER raw Tailwind colors.**

```tsx
// ✅ CORRECT
<div className="bg-primary text-foreground">

// ❌ WRONG
<div className="bg-blue-500 text-gray-900">
```

**Design Token Reference:**
- `bg-primary` / `text-primary` - Brand color, primary actions
- `bg-secondary` - Less prominent backgrounds
- `bg-accent` / `text-accent` - Highlights, active states
- `text-muted-foreground` - Subtitles, disabled text
- `bg-card` - Component backgrounds
- `bg-background` - Page background
- `bg-destructive` - Error states

**Custom Effect Classes:**
- `.glass` - Backdrop blur + semi-transparent background
- `.shimmer-btn` - Animated gradient buttons
- `.glow-border` - Gradient border effect
- `.noise-bg` - Subtle texture overlay

**Spacing:** Use `rounded-lg`, `rounded-xl`, or `rounded-2xl` for cards. Center containers with `max-w-5xl` or `max-w-7xl mx-auto`.

### Naming Conventions

- **Files/Directories**: `kebab-case` (e.g., `build-solution.tsx`, `shared-layout.tsx`)
- **Variables/Functions**: `camelCase` (e.g., `getAvailableSlots`)
- **React Components**: `PascalCase` (e.g., `HeroSection`)
- **Types/Interfaces**: `PascalCase` (e.g., `BookingRequest`)
- **Database Columns**: `snake_case` in DB, `camelCase` in JS

### API Response Patterns (if server is restored)

**Success:**
```typescript
res.json({ success: true, data: {...} });
```

**Error:**
```typescript
res.status(400).json({ error: "Message", details?: {...} });
```

Common status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 500 (Internal Error)

## Routing

This project uses **Wouter**, not React Router.

```tsx
import { useLocation, Route, Switch } from "wouter";

// Get/set location
const [location, setLocation] = useLocation();

// Define routes
<Switch>
  <Route path="/" component={LandingPage} />
  <Route path="/chat/:id?" component={HomePage} />
  <Route path="/:rest*" component={NotFound} />
</Switch>
```

## Authentication

- **Architecture**: Session-based auth via Passport.js
- **User Object**: `req.user` contains `{ id, email, firstName, lastName, profileImageUrl }`
- **Client Hook**: `useAuth()` from `@/hooks/use-auth`
- **Protected Routes**: Use `PrivateRoute` wrapper in `App.tsx`

```tsx
const { user, isLoading } = useAuth();

if (isLoading) return <Loader />;
if (!user) return <LandingPage />;
```

## Internationalization (i18n)

The project supports English and Spanish via `LanguageContext`.

```tsx
import { useLanguage } from "@/context/language-context";

const { t, language, toggleLanguage } = useLanguage();

// Use translation keys
<h1>{t("landing.hero.title")}</h1>
```

**Translation Files:**
- `client/src/i18n/en.ts`
- `client/src/i18n/es.ts`

Always add new user-facing strings to both files. Never hardcode English strings.

## Known Issues (from BUGS.md)

### Critical Security Issues (if server is restored)
- BUG-001: XSS vulnerability in OAuth callback
- BUG-002: Chat API routes lack authentication
- BUG-003: No rate limiting on booking endpoint
- BUG-019: Session cookie `secure: true` breaks local dev (should be conditional)

### Common Style Issues to Avoid
- BUG-004: Using raw Tailwind colors (`bg-gray-50`) instead of tokens (`bg-background`)
- BUG-005-007: Ghost CSS classes (`toggle-elevate`, `hover-elevate`, `module-glass-card`) - these are NOT defined
- BUG-008: `font-display` class not registered in Tailwind config

### Logic Issues
- BUG-010: Error response format inconsistent (`{ message }` vs `{ error }`)
- BUG-015: Array indices as React keys (use stable IDs)
- BUG-016: `parseInt()` without validation on route params
- BUG-024: `useChatStream(conversationId || 0)` - 0 is invalid

### i18n Issues
- BUG-031: Hardcoded error strings in `home.tsx:74`
- BUG-032: Date formatting not locale-aware (use `date-fns` with locale param)

## Environment Variables

Required in `.env` (never commit this file):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session signing
- `PORT` - Server port (defaults to 5000)
- `OPENAI_API_KEY` - (Optional) For AI features
- `GOOGLE_CLIENT_ID` - OAuth for Calendar API
- `GOOGLE_CLIENT_SECRET` - OAuth secret
- `GOOGLE_REFRESH_TOKEN` - Refresh token for calendar access
- `GOOGLE_OWNER_EMAIL` - Email for booking requests

## Development Workflow (Orchestrator + Workers)

This project uses specialized AI workers coordinated by an Orchestrator. See `.agent/workflows/` for full prompts.

**Worker Responsibilities:**
- **Frontend Worker**: `client/src/` only - UI, components, pages, hooks
- **Backend Worker**: `server/` and `shared/` only - API, schema, business logic
- **QA Worker**: Full codebase audit - updates `BUGS.md`

**Execution Order:** Backend → Frontend → QA (unless frontend-only changes)

**Worker Folder Rules:**
- Frontend: `client/src/components/`, `client/src/pages/`, `client/src/hooks/`, `client/src/context/`, `client/src/lib/`
- Backend: `server/`, `shared/`
- QA: Project root only (generates `BUGS.md`, `CONSISTENCY_CHECK.md`)

When making changes, always:
1. Read `PROJECT_STANDARDS.md` before starting
2. Check `BUGS.md` for known issues in files you're editing
3. Follow the naming conventions and styling rules
4. Use semantic design tokens (never raw colors)
5. Add i18n keys for all user-facing text
6. Avoid over-engineering (see general instructions about keeping changes minimal)

## Replit-Specific

This project is configured for Replit deployment:
- `.replit` defines run/build commands
- Replit integrations in `client/replit_integrations/` (audio, auth)
- Dev server runs on port 5000, frontend proxies through Vite
- Secrets managed via Replit Secrets panel (not in `.env` for production)

## Type Checking

Run `npm run check` before committing. The project uses TypeScript strict mode.

Common pitfalls:
- BUG-022: `PrivateRoute` uses `any` type (known issue)
- Always type component props properly
- Use Zod schemas for validation where possible

## Database

**ORM**: Drizzle ORM
**Schema Location**: `shared/schema.ts` (currently may be missing due to server deletion)
**Migration Command**: `npm run db:push` (pushes schema changes to NeonDB)

**Note**: With server files deleted, database integration may be non-functional.

## Debugging Tips

1. **Server not starting**: Check if server files exist (they're deleted in current state)
2. **Auth not working**: Ensure `.env` has `SESSION_SECRET` and check `secure` cookie flag
3. **Styles not applying**: Verify you're using design tokens, not raw colors
4. **Translations missing**: Check both `en.ts` and `es.ts` for translation keys
5. **Build failing**: Run `npm run check` to identify TypeScript errors

## Important Files to Read First

When starting work on this project:
1. `PROJECT_STANDARDS.md` - Coding standards and patterns
2. `DEVELOPMENT_MANIFEST.md` - Tech stack and infrastructure
3. `BUGS.md` - Known issues and audit findings
4. `.agent/workflows/orchestrator.md` - Development workflow
