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