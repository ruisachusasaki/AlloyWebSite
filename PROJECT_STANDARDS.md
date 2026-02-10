# Project Standards

## 1. Styling & Design System

### Technology
- **Engine**: TailwindCSS v3.4+
- **Animation**: `tailwindcss-animate`, Framer Motion
- **Icons**: Lucide React

### Color Palette (Theming)
All colors are defined as CSS variables in `client/src/index.css` using HSL values. Use semantic utility classes, not raw hex codes.

| Semantic Name | Usage | Tailwind Class |
| :--- | :--- | :--- |
| **Primary** | Main brand color, primary actions | `bg-primary`, `text-primary` |
| **Secondary** | Less prominent backgrounds | `bg-secondary` |
| **Accent** | Highlights, active states | `bg-accent` |
| **Muted** | Subtitles, disabled text | `text-muted-foreground` |
| **Card** | Component backgrounds | `bg-card` |
| **Background** | Page background | `bg-background` |
| **Destructive**| Error states, delete actions | `bg-destructive` |

### Custom Effects
We use specific utility classes for "premium" feel:
- `.glass`: Backdrop blur and semi-transparent background.
- `.shimmer-btn`: Animated gradient on buttons.
- `.glow-border`: Gradient border effect.
- `.noise-bg`: Subtle texture overlay on the body.

### Spacing & Layout
- **Border Radius**: Use `rounded-lg` (default), `rounded-xl`, or `rounded-2xl` for cards.
- **Container**: `max-w-5xl` or `max-w-7xl` centered with `mx-auto`.

## 2. API Response Patterns

### Success Response
Return JSON directly. If returning an object, use `res.json(data)`.
```typescript
// Example
res.json({
  success: true,
  booking: { id: "123", ... }
});
```

### Error Response
Always set the HTTP status code and return a JSON object with an `error` message string. Optional `details` for validation errors.
```typescript
// Example
res.status(400).json({
  error: "Invalid input",
  details: zodError.errors
});
```
**Common Status Codes**:
- `200`: OK
- `400`: Bad Request (Validation failed)
- `401`: Unauthorized (Not logged in)
- `500`: Internal Server Error

## 3. Naming Conventions

### Files & Directories
- **Directories**: `kebab-case` (e.g., `client/src/components`)
- **Files**: `kebab-case` (e.g., `build-solution.tsx`, `shared-layout.tsx`)
    - *Exception*: Some legacy server files use `camelCase` (e.g., `replitAuth.ts`). **Prefer `kebab-case` for new files.**

### Code
- **Variables/Functions**: `camelCase` (e.g., `getAvailableSlots`)
- **React Components**: `PascalCase` (e.g., `HeroSection`)
- **Interfaces/Types**: `PascalCase` (e.g., `BookingRequest`)
- **Database Columns**: `snake_case` in DB, mapped to `camelCase` in Drizzle/JS.
    - Example: `created_at` (DB) -> `createdAt` (JS)

## 4. Authentication Flow

### Architecture
- **Provider**: Replit (OpenID Connect) or Mock (in dev if configured).
- **Session Management**: `express-session` with `connect-pg-simple` (PostgreSQL store).
- **Library**: Passport.js (`passport-openid-client`).

### Middleware
Use `isAuthenticated` from `@/server/replit_integrations/auth` to protect routes.

```typescript
import { isAuthenticated } from "./replit_integrations/auth";

app.get("/api/protected-route", isAuthenticated, (req, res) => {
  // Safe to access req.user
});
```

### User Object
The `req.user` object (and `users` table) contains:
- `id`: Replit User ID
- `email`: User email
- `firstName` / `lastName`
- `profileImageUrl`
