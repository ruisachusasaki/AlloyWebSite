# Development Manifest

## Project Overview
**AlloyWebSite** is a custom software platform builder. It features a React frontend with a high-performance Express backend, using PostgreSQL for data persistence.

## Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5+
- **Language**: TypeScript
- **Styling**: TailwindCSS 3.4, `tailwindcss-animate`
- **Animation**: Framer Motion
- **UI Components**: Radix UI (Headless), Lucide React (Icons)
- **Routing**: Wouter

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.0
- **Language**: TypeScript (running via `tsx` in dev)
- **Database ORM**: Drizzle ORM
- **Database Driver**: `node-postgres` (`pg`)
- **Authentication**: Passport.js with Session handling (`express-session`)

### AI & Integrations
- **AI Models**: Google Generative AI (`@google/genai`), OpenAI (`openai`) - *Dependencies present, integration pending/partial.*
- **Replit Integrations**: Custom auth and chat routes located in `server/replit_integrations`.

## Folder Structure

```
/
├── client/
│   └── src/
│       ├── components/  # UI components (shared-layout, etc.)
│       ├── context/     # React Contexts (SchedulingContext)
│       ├── hooks/       # Custom React hooks
│       ├── pages/       # Page components (landing, build-solution)
│       └── lib/         # Utilities (queryClient, etc.)
├── server/
│   ├── replit_integrations/ # Authentication & proprietary integrations
│   ├── db.ts            # Database connection & schema export
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API Route definitions
│   └── vite.ts          # Vite middleware setup
├── shared/
│   └── schema.ts        # Drizzle schema (shared types)
├── script/              # Build scripts
└── .env                 # Environment variables (GitIgnored)
```

## Infrastructure Status

### Database
- **Status**: **Active / Connected**
- **Provider**: PostgreSQL (NeonDB)
- **Configuration**:
    - Connection defined in `server/db.ts`
    - Uses `DATABASE_URL` environment variable.
    - Schema managed via Drizzle Kit (`npm run db:push`).

### AWS
- **Status**: **Not Configured / None**
- **Notes**: No AWS SDKs or configurations detected in the current codebase.

### Authentication
- **Status**: **Active**
- **Method**: Session-based auth using `passport` and `express-session`.
- **Store**: `memorystore` (dev/prod).

## Environment Variables
Required variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string.
- `SESSION_SECRET`: Secret for session signing.
- `PORT`: (Optional) Server port, defaults to 5000.
- `OPENAI_API_KEY`: (Optional) For AI features.

## Development Workflow
1.  **Start Server**: `npm run dev` (Starts backend + Vite frontend)
2.  **Database Updates**: `npm run db:push` (Push schema changes)
3.  **Type Check**: `npm run check`

## 🚀 Replit Deployment & Google Integrations

To ensure seamless operation on Replit and GitHub sync:

### 1. Environment Secrets (Replit)
Add the following keys to the **Secrets** tab in Replit (do not commit to GitHub):
- `DATABASE_URL`: Your PostgreSQL connection string.
- `SESSION_SECRET`: A secure random string.
- `GOOGLE_CLIENT_ID`: OAuth Client ID for Calendar API.
- `GOOGLE_CLIENT_SECRET`: OAuth Client Secret.
- `GOOGLE_REFRESH_TOKEN`: Refresh token for the **owner's** Google Account (see below).
- `GOOGLE_OWNER_EMAIL`: The email address receiving booking requests (e.g., `ruisasaki0@gmail.com`).

### 2. Google Calendar Setup (Local & Replit)
The "Schedule a Call" feature requires a valid `GOOGLE_REFRESH_TOKEN` to check availability.
1.  Go to `/api/oauth/setup` in your browser (locally or on Replit) to authorize the app.
2.  Copy the generated Refresh Token.
3.  Add it to your `.env` (local) or Secrets (Replit) as `GOOGLE_REFRESH_TOKEN`.
4.  **Note:** Without this token, the calendar will use default slots and may fail to check conflicts.

### 3. Build Command
Replit automatically detects `npm run build` and `npm run start`. Ensure your `.replit` file is configured to run the server:
```toml
run = "npm run start"
```
