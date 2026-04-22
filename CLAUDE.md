# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StockSage-AI** is a premium institutional-grade AI-powered stock market analytics terminal built with:
- **Next.js 16.2** (App Router, React 19)
- **Drizzle ORM** with Neon PostgreSQL
- **Tailwind CSS v4** with custom glassmorphic UI
- **shadcn/ui** components (Radix UI primitives)
- **Vercel** deployment with Edge runtime

The application features an ultra-premium dark UI with 3D glassmorphism, infinite ticker animations, and real-time market data visualization.

## Critical Warnings

⚠️ **Read AGENTS.md immediately** - Contains important notes about Next.js breaking changes. This project uses Next.js 16 which differs significantly from prior versions. Read `node_modules/next/dist/docs/` before writing new code.

## Development Commands

```bash
# Development server (localhost:3000)
npm run dev
# or
bun dev

# Full dev with Python data sync running concurrently
npm run dev:full

# Production build
npm run build

# Start production server
npm start

# Lint codebase
npm run lint

# Python data pipeline (sync market data, sentiment, alpha signals)
npm run sync
# or
python scripts/master_sync.py

# Generate Drizzle migrations after schema changes
npx drizzle-kit generate
```

## Database Architecture

- **Dialect**: PostgreSQL via Neon (serverless)
- **Connection**: `src/db/index.ts` - uses `@neondatabase/serverless` with HTTP client
- **Schema**: `src/db/schema.ts` - defines `stocks`, `indexes`, `syncLogs`, and `users` tables
- **Runtime**: Pages using DB queries use `export const runtime = 'edge';` (Edge runtime)
- **Local Development**: Can use local SQLite (`local.db`) with `@libsql/client` by adjusting connection URL
- **Migration**: Drizzle generates SQL migrations in `drizzle/` folder; sync to production with `npx drizzle-kit push` or migrations via scripts

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers (Edge runtime)
│   │   ├── auth/                 # Authentication endpoints (login, signup, upgrade)
│   │   └── market/route.ts      # Market data fetch endpoint
│   ├── dashboard/page.tsx       # Main terminal view (client component, fetches from API)
│   ├── pricing/page.tsx         # Pricing page
│   ├── about/page.tsx           # About page
│   ├── disclaimer/page.tsx      # Legal disclaimer page (SEBI-safe)
│   ├── login/page.tsx           # Login form (includes disclaimer acknowledgment)
│   ├── signup/page.tsx          # Signup form (includes disclaimer acknowledgment)
│   ├── layout.tsx               # Root layout (dark theme, Inter font, DisclaimerBanner)
│   ├── page.tsx                 # Landing page (hero, ticker, architecture grid)
│   ├── globals.css              # Tailwind imports + custom ticker animation
│   └── ...                      # Other pages
├── components/
│   ├── Navbar.tsx               # Floating glass pill navigation
│   ├── DashboardHeader.tsx      # Dashboard status bar
│   ├── FeatureGate.tsx          # Subscription-based featurelock
│   ├── MarketSearch.tsx         # Symbol search component
│   ├── SystemBootLoader.tsx     # Initialization loading screen
│   ├── RazorpayCheckout.tsx     # Payment integration (demo mode, labeled)
│   ├── DisclaimerBanner.tsx     # Site-wide legal disclaimer banner
│   └── ui/                      # shadcn/ui components (button, etc.)
├── context/
│   └── AuthContext.tsx          # Authentication state provider
├── db/
│   ├── schema.ts                # Drizzle table definitions
│   └── index.ts                 # DB connection factory (Neon HTTP client)
├── lib/
│   └── utils.ts                 # cn() utility (tailwind-merge + clsx)
└── scripts/
    ├── master_sync.py           # Orchestrates data pipeline
    ├── market_sync.py           # Fetches live market data
    ├── ai_analyzer.py           # VADER sentiment analysis
    └── alpha_scanner.py         # Technical signal detection

drizzle/                         # Generated migrations (after drizzle-kit generate)
drizzle.config.ts               # Production drizzle config (Neon/PostgreSQL)
drizzle.config.local.ts         # Local SQLite config
```

## Tech Stack Details

- **Next.js 16.2.1** - App Router, Edge Runtime by default for API routes
- **React 19.2.4** - New React with improved hooks
- **Tailwind CSS v4** - Using `@tailwindcss/postcss` with new CSS-first config
- **shadcn/ui** - Radix UI components, style: "radix-lyra", icon: "phosphor"
- **Framer Motion 12** - Advanced animations (client components only)
- **Lucide React** & **Phosphor Icons** - Icon libraries
- **TypeScript 5** - Strict mode enabled
- **ESLint 9** - next/core-web-vitals + next/typescript configs
- **Database**: Neon PostgreSQL (serverless) with Drizzle ORM
- **Auth**: JWT tokens via jose library, stored in cookies + localStorage
- **Deployment**: Vercel with Edge Functions

## Styling Conventions

- **Color palette**: Prefer `bg-[#050505]`, `bg-[#0a0a0a]`, `bg-[#020202]` for dark backgrounds
- **Accent colors**: Indigo (`indigo-500`), Fuchsia, Emerald, Rose
- **Effects**: Glassmorphism (`backdrop-blur-xl`), borders `white/10`, glows using shadows
- **Typography**: Inter (sans) from Google Fonts; monospace for data/tickers
- **Animations**: Custom keyframes in `tailwind.config.ts` and `globals.css`:
  - `fade-up`, `reveal-line`, `pulse-slow`, `ticker` (marquee)

## Path Aliases

```typescript
// tsconfig.json
"@/*" -> "./src/*"
"@components" -> "@/components"
"@lib" -> "@/lib"
```

## Deployment Notes

- **Platform**: Vercel with Edge Functions
- **Build Output**: `.vercel/output/static` (standard Vercel output)
- **Database**: Neon PostgreSQL - requires `DATABASE_URL` environment variable
- **Auth**: Requires `JWT_SECRET` environment variable for signing tokens
- **next.config.ts**: `serverExternalPackages: ['drizzle-orm']` to exclude Drizzle from client bundle
- **Edge Runtime**: API routes use `export const runtime = 'edge'` for minimal latency
- **Python Data Sync**: GitHub Actions workflow runs `scripts/master_sync.py` every 12 hours (see `.github/workflows/sync.yml`)

## Key Files

- `next.config.ts` - Next.js configuration with `serverExternalPackages: ['drizzle-orm']` and transpilation settings
- `DEPLOY.md` - Step-by-step deployment guide for Vercel + Neon
- `tailwind.config.ts` - Tailwind v4 config with custom animations (fadeUp, revealLine, pulse-slow, marquee)
- `eslint.config.mjs` - ESLint flat config using next/core-web-vitals
- `postcss.config.mjs` - Tailwind PostCSS config
- `components.json` - shadcn/ui config (radix-lyra style)
- `src/context/AuthContext.tsx` - Authentication state management with JWT + cookies
- `src/app/api/market/route.ts` - Example Edge API route querying Drizzle
- `.github/workflows/sync.yml` - Scheduled Python data pipeline (every 12h)

## Important Patterns

1. **Edge Runtime API Routes**: All API routes in `app/api/` use Edge runtime (`export const runtime = 'edge'`) for minimal latency and Neon PostgreSQL HTTP client compatibility. Data flows: Client component → `fetch()` → API route (edge) → Drizzle query → JSON response.

2. **Client-Side Data Fetching**: The dashboard (`app/dashboard/page.tsx`) is a client component (`'use client'`) that fetches data from API routes using URLSearchParams. It uses `useTransition` for smooth navigation and maintains query state via Next.js navigation.

3. **Authentication Flow**: JWT tokens stored in cookies (for middleware access) and localStorage (for client state). `AuthContext` provides auth state. Protected pages check `isAuthenticated`. API routes verify JWT via `jose`. See `src/lib/auth.ts` for password hashing and token utilities.

4. **Subscription Gating**: Use `<FeatureGate>` component to conditionally render premium features. Falls back to placeholder if user's `subscriptionTier !== 'PRO'`. User data from auth context includes tier.

5. **Grid Lines UI**: Many pages use structural decorative grid lines (vertical dividing lines at 1/4, 1/2, 3/4 positions) - copy pattern from `page.tsx`.

6. **Ticker Animation**: Pure CSS infinite marquee using `@keyframes` with 50% translateX and duplicate content for seamless loop. See `globals.css` for implementation.

7. **Glassmorphic Cards**: Standard card pattern:
   ```tsx
   className="bg-[#050505] border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl hover:bg-white/10 transition-all"
   ```

8. **Python Data Pipeline**: Scheduled GitHub Action runs `scripts/master_sync.py` every 12 hours, which orchestrates:
   - `market_sync.py`: Fetches live prices via yfinance, populates/stocks table
   - `ai_analyzer.py`: Runs VADER sentiment on news headlines (requires NLTK data)
   - `alpha_scanner.py`: Computes technical signals (RSI, volume spikes)

9. **Database Migrations**: Use Drizzle Kit to generate migrations: `npx drizzle-kit generate`. Apply to production via `npx drizzle-kit push` (schema sync) or run sync scripts locally against Neon. Keep schema in `src/db/schema.ts` as source of truth.

10. **Edge Compatibility**: Only use Web Standard APIs in Edge runtime (no Node.js-specific modules). When needed, add Node packages to `serverExternalPackages` in `next.config.ts`.

## Environment

- **Local DB**: `file:local.db` (SQLite)
- **Env file**: `.env.local` exists (do not commit secrets)
- **Package manager**: npm (but bun works per README)

## Known Issues

- **Legacy Cloudflare Configs**: The repository contains leftover Cloudflare D1 configuration files (e.g., `drizzle.config.ts` referencing `.wrangler/`). Use `drizzle.config.local.ts` for local SQLite development, or connect to Neon via the production `db/index.ts`.
- **Edge vs Node Runtime**: API routes use Edge runtime (`export const runtime = 'edge'`). Be aware of Edge-compatible APIs (no Node.js built-in modules unless added to `serverExternalPackages`).
- **Framer Motion**: Only works in client components. Server components cannot use the `animate` prop or Motion components directly.
- **TypeScript Errors**: Build ignores TypeScript errors (`ignoreBuildErrors: true` in next.config.ts) to bypass issues with external packages. Fix errors when possible.

## Workflow Tips

1. After creating new Drizzle tables, run:
   ```bash
   npx drizzle-kit generate
   ```
   Then review generated migrations in `drizzle/` and apply to production via `npx drizzle-kit push` or update sync scripts.

2. **Local Development Data**: Use the Python data pipeline to populate your local Neon or SQLite database:
   ```bash
   npm run sync
   # or
   python scripts/master_sync.py
   ```
   Ensure `DATABASE_URL` is set in `.env.local` (and install Python dependencies: `yfinance`, `pandas`, `nltk`).

3. **Deployment Environment**: For Vercel deployment, set `DATABASE_URL` (Neon connection string) and `JWT_SECRET` (long random string) in project environment variables. See DEPLOY.md for step-by-step.

4. The UI is heavily optimized for dark mode - always test with dark background.

5. Animations use framer-motion; ensure components using motion elements are marked with `'use client'`.

6. API routes default to Edge runtime; avoid Node-specific APIs unless configured in `serverExternalPackages`.

## Testing

No test framework is currently configured. Lint is the primary quality check (`npm run lint`).

## Legal & Compliance

- **Disclaimer Banner**: `DisclaimerBanner.tsx` renders a site-wide legal banner at the bottom of every page (added in root layout). States StockSage is educational, not SEBI registered, not investment advice.
- **Disclaimer Page**: `/disclaimer` route with full legal text covering educational purpose, SEBI status, no investment advice, market risk, data accuracy, and personal responsibility.
- **Auth Pages**: Both `/login` and `/signup` include a small disclaimer acknowledgment line linking to `/disclaimer`.
- **RazorpayCheckout**: Clearly labeled as "Demo upgrade · No real payment" — no real payment processing is active yet.

## Monetization & Validation

- `MONETIZATION_STRATEGY.md` — Revenue roadmap (Razorpay subscriptions, broker affiliates, API access) with 8-week implementation plan and legal compliance notes.
- `VALIDATION_PLAN.md` — Reddit-focused market validation plan with copy-paste posts for r/IndianStreetBets, r/IndiaInvestments, r/StartupsIndia, r/algotrading, and r/SideProject.

## Areas for Enhancement

- Add error boundaries to improve user experience during failures.
- Implement unit and integration test suite (Jest/Vitest + Testing Library).
- Introduce real-time updates via WebSockets or polling for live market data.
- Expand filtering/sorting (by performance, volume, etc.) and saved searches.
- Add user profile management page (edit name, change password, subscription details).
- Consider adding charts (e.g., Recharts) for historical price visualization.
- Implement request throttling on API routes for public endpoints.
- Add analytics/monitoring (Sentry, LogRocket).
- Improve accessibility (ARIA labels, keyboard navigation).
- Internationalization (i18n) for multi-language support.
