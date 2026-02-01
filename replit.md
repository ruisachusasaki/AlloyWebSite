# Replit.md

## Overview

This is a productized service landing page and AI-powered chat application built with a React frontend and Express backend. The project serves as a marketing website for a custom software development service that replaces fragmented SaaS tools with unified platforms. It includes an authenticated chat interface where users can interact with AI assistants powered by multiple providers (OpenAI, Anthropic, Google Gemini).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Shadcn/ui component library built on Radix primitives
- **State Management**: TanStack Query (React Query) for server state
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a page-based structure under `client/src/pages/` with reusable components in `client/src/components/`. Custom hooks in `client/src/hooks/` handle authentication, chat streaming, and conversation management.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage
- **Authentication**: Replit Auth via OpenID Connect (passport strategy)

The server uses a modular integration pattern under `server/replit_integrations/` with separate modules for:
- `auth/` - Authentication and user management
- `chat/` - Conversation and message handling with AI streaming
- `audio/` - Voice chat capabilities with speech-to-text/text-to-speech
- `image/` - AI image generation
- `batch/` - Batch processing utilities with rate limiting

### API Design
- RESTful endpoints under `/api/` prefix
- Server-Sent Events (SSE) for real-time chat streaming
- Typed route contracts in `shared/routes.ts` using Zod schemas

### Database Schema
Located in `shared/schema.ts` (re-exports from `shared/models/`):
- `users` - User profiles from Replit Auth
- `sessions` - Session storage for authentication
- `conversations` - Chat conversation metadata
- `messages` - Individual chat messages with role and content

### Build System
Custom build script in `script/build.ts` that:
1. Builds frontend with Vite to `dist/public/`
2. Bundles server with esbuild to `dist/index.cjs`
3. Selectively bundles specific dependencies to reduce cold start times

## External Dependencies

### AI Services (via Replit AI Integrations)
- **OpenAI**: Chat completions, image generation, speech-to-text, text-to-speech
- **Anthropic Claude**: Alternative chat completions
- **Google Gemini**: Alternative chat completions

Environment variables required:
- `AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL`
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` / `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`
- `AI_INTEGRATIONS_GEMINI_API_KEY` / `AI_INTEGRATIONS_GEMINI_BASE_URL`

### Database
- **PostgreSQL**: Primary data store
- `DATABASE_URL` environment variable required
- Migrations managed via Drizzle Kit (`npm run db:push`)

### Authentication
- **Replit Auth**: OpenID Connect provider
- `SESSION_SECRET` environment variable required
- `ISSUER_URL` defaults to `https://replit.com/oidc`

### Audio Processing
- **FFmpeg**: Required on system for audio format conversion (WebM to WAV)

### Google Calendar & Gmail Integration (Scheduling System)
The scheduling system uses Google APIs for calendar availability checking, event creation, and email notifications. All features use the same OAuth credentials (no separate SMTP needed).

**Required Environment Variables:**
- `GOOGLE_CLIENT_ID` - OAuth 2.0 Client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - OAuth 2.0 Client Secret from Google Cloud Console
- `GOOGLE_REFRESH_TOKEN` - Obtained by running the OAuth setup script (see below)

**Optional Environment Variables:**
- `GOOGLE_OWNER_EMAIL` - Email address of the calendar owner (defaults to ruisasaki0@gmail.com)
- `OAUTH_REDIRECT_URI` - OAuth redirect URI (defaults to http://localhost:3333/oauth2callback)
- `OAUTH_PORT` - Port for OAuth callback server (defaults to 3333)

**Getting Your Refresh Token:**
1. Add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Replit Secrets
2. In Google Cloud Console, add `http://localhost:3333/oauth2callback` to your OAuth 2.0 authorized redirect URIs
3. Run the setup script: `npx tsx server/oauth-setup.ts`
4. Visit the URL displayed in the console and authorize the app
5. Copy the refresh token from the browser and add it to Replit Secrets as GOOGLE_REFRESH_TOKEN

**Features (all free, no SMTP required):**
- Check availability across multiple calendars with buffer time logic
- Create Google Calendar events with Google Meet links
- Send email notifications via Gmail API

### Build Your Solution Page
Interactive module builder at `/build` where potential clients can select features they need.

**Premium Visual Design:**
- Stunning hero section with animated gradient background, floating particles, and grid pattern overlay
- "Interactive Solution Builder" premium badge with animated indicator
- Main heading with gradient text effect ("Architect Your Digital Empire")
- Three status indicators: 30+ Modules, Unlimited Custom Features, One Unified Platform

**Glass-Style Module Cards:**
- 30 module cards with apple glass styling (backdrop blur, gradient overlays)
- Mouse-tracking glow effects matching landing page bento-card behavior
- Selected state with animated checkmark and primary color styling
- Glassmorphic icon containers with gradient backgrounds
- Staggered reveal animations on page load
- Premium category badges on each card

**Features:**
- Responsive grid: 1 column mobile, 2 tablet, 3 desktop
- Desktop sidebar with glassmorphic styling showing selected modules in real-time
- Mobile sticky bottom bar with selection count and continue button
- Integration with scheduling modal - selected modules included in calendar event and emails
- Form fields: Name, Email, Company Name, Description, Custom Request

**"More Features" Section:**
- Located after module grid
- "Need Something Else?" heading with Plus icon
- Clear messaging about unlimited custom feature possibilities
- Tag pills: AI Integrations, Custom APIs, Third-Party Connectors, Industry-Specific Tools
- "Discuss Custom Features" CTA button linking to scheduling modal

**Navigation:**
- Link in navbar (both pages via SharedNavbar)
- Route: `/build`

**Module Categories:**
Communication, Productivity, Security, Sales, Analytics, AI, Features, Data, Industry, Operations, Automation, Marketing, Integration, Payments, Development, Education

**New Modules Added:**
- Website Migration - Seamlessly move from legacy sites to modern platforms
- E-Commerce Platform - Full online store with cart, checkout, and inventory
- Course & Learning Platform - Create and sell online courses with progress tracking

### Shared Layout Components
Both landing page and Build Your Solution page use shared components from `client/src/components/shared-layout.tsx`:
- **SharedNavbar**: Full navigation with logo, Solutions, Portfolio dropdown, Build Your Solution (highlighted when active), Clients, Contact, theme toggle, Schedule a Call button
- **SharedFooter**: "Ready to simplify?" CTA section with schedule button, logo, and copyright
- **SchedulingContext**: Shared React context for opening the scheduling modal from anywhere