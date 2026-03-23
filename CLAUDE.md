# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StockSage-AI** is a premium institutional-grade AI-powered stock market analytics terminal built with:
- **Next.js 16.2** (App Router, React 19)
- **Drizzle ORM** with SQLite (local.db)
- **Tailwind CSS v4** with custom glassmorphic UI
- **shadcn/ui** components (Radix UI primitives)
- **Cloudflare Pages** deployment via `next-on-pages` bridge

The application features an ultra-premium dark UI with 3D glassmorphism, infinite ticker animations, and real-time market data visualization.

## Critical Warnings

⚠️ **Read AGENTS.md immediately** - Contains important notes about Next.js breaking changes. This project uses Next.js 16 which differs significantly from prior versions. Read `node_modules/next/dist/docs/` before writing new code.

## Development Commands

```bash
# Development server (localhost:3000)
npm run dev
# or
bun dev

# Production build
npm run build

# Start production server
npm start

# Lint codebase
npm run lint

# Create and apply database migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# Seed database with sample data
npx tsx seed.ts
```

## Database Architecture

- **Dialect**: SQLite (local file)
- **Location**: `local.db` (root) and `.wrangler/state/v3/d1/...` (Cloudflare emulation)
- **Schema**: `src/db/schema.ts` - defines `stocks` and `indexes` tables
- **Connection**: `src/db/index.ts` - uses `@libsql/client` with file-based URL
- **Migration configs**:
  - `drizzle.config.ts` (production)
  - `drizzle.config.local.ts` (local development)
- **Important**: Database is server-only; pages using DB queries must have `export const runtime = 'nodejs';`

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/page.tsx # Main terminal view (server component)
│   ├── pricing/page.tsx   # Pricing page
│   ├── about/page.tsx     # About page
│   ├── layout.tsx         # Root layout (dark theme, Inter font)
│   ├── page.tsx           # Landing page (hero, ticker, architecture grid)
│   ├── globals.css        # Tailwind imports + custom ticker animation
│   └── ...                # Other pages
├── components/
│   ├── Navbar.tsx         # Floating glass pill navigation
│   └── ui/                # shadcn/ui components (button, etc.)
├── db/
│   ├── schema.ts          # Drizzle table definitions
│   └── index.ts           # DB connection factory
└── lib/
    └── utils.ts           # cn() utility (tailwind-merge + clsx)

drizzle/                   # Generated migrations (after drizzle-kit generate)
drizzle.config.ts         # Production drizzle config (Cloudflare D1)
drizzle.config.local.ts   # Local SQLite config
```

## Tech Stack Details

- **Next.js 16.2.1** - App Router, Server Components by default
- **React 19.2.4** - New React with improved hooks
- **Tailwind CSS v4** - Using `@tailwindcss/postcss` with new CSS-first config
- **shadcn/ui** - Radix UI components, style: "radix-lyra", icon: "phosphor"
- **Framer Motion 12** - Advanced animations
- **Lucide React** & **Phosphor Icons** - Icon libraries
- **TypeScript 5** - Strict mode enabled
- **ESLint 9** - next/core-web-vitals + next/typescript configs
- **Cloudflare Workers** - `wrangler.toml` configured with D1 database binding

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

- **Platform**: Cloudflare Pages (via `next-on-pages` adapter)
- **Wrangler**: Version 4.76.0
- **Output**: `.vercel/output/static` (pages build output)
- **D1 Database**: Binding name `DB`, migrations in `drizzle/` folder
- **Server External Packages**: `drizzle-orm` and `better-sqlite3` must be in `serverExternalPackages` in `next.config.ts`

## Key Files

- `next.config.ts` - Server external packages configured (drizzle-orm, better-sqlite3)
- `wrangler.toml` - Cloudflare Pages config with D1 binding
- `tailwind.config.ts` - Tailwind v4 config with custom animations
- `eslint.config.mjs` - ESLint flat config using next/core-web-vitals
- `postcss.config.mjs` - Tailwind PostCSS config
- `components.json` - shadcn/ui config (radix-lyra style)

## Important Patterns

1. **Server Components by Default**: All pages in `app/` are server components unless `'use client'` is added. Dashboard fetches data directly from DB in component body.

2. **Runtime for DB Pages**: Pages that use DB queries must explicitly set `export const runtime = 'nodejs';` (see `src/app/dashboard/page.tsx`)

3. **Grid Lines UI**: Many pages use structural decorative grid lines (vertical dividing lines at 1/4, 1/2, 3/4 positions) - copy pattern from `page.tsx`

4. **Ticker Animation**: Pure CSS infinite marquee using `@keyframes` with 50% translateX and duplicate content for seamless loop. See `globals.css` for implementation.

5. **Glassmorphic Cards**: Standard card pattern:
   ```tsx
   className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl hover:bg-white/10 transition-all"
   ```

6. **No Traditional API Routes**: This uses server components directly. For client-side data fetching, would need Route Handlers in `app/api/` (currently none).

## Environment

- **Local DB**: `file:local.db` (SQLite)
- **Env file**: `.env.local` exists (do not commit secrets)
- **Package manager**: npm (but bun works per README)

## Known Issues

- D1 database emulation path in `drizzle.config.ts` points to `.wrangler/state/v3/d1/...` which is specific to Cloudflare emulation. Use `drizzle.config.local.ts` for local SQLite.
- Next-on-Pages bridge can be tricky; see recent commits for stabilization fixes.

## Workflow Tips

1. After creating new Drizzle tables, run:
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```
2. To seed data: `npx tsx seed.ts`
3. For production builds, ensure `wrangler` is deployed correctly and D1 database exists.
4. The UI is heavily optimized for dark mode - always test with dark background.
5. Animations use framer-motion; avoid `animate` prop on non-client components.

## Testing

No test framework is currently configured. Lint is the primary quality check (`npm run lint`).

## Not Yet Implemented

- Authentication (login page exists at `/login` route but not built yet)
- Real-time data sync (currently static seeded data)
- API endpoints for external market data
- Unit tests
- Error boundaries
