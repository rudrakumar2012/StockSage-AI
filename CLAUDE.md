# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StockSage-AI** is a free, open stock analysis terminal for Indian equities built with:
- **Next.js 16.2** (App Router, React 19)
- **Drizzle ORM** with Neon PostgreSQL
- **Tailwind CSS v4** with custom glassmorphic UI
- **Python data pipeline** (yfinance + FinBERT + backtesting)

The application features an ultra-premium dark UI with 3D glassmorphism, infinite ticker animations, and real-time market data visualization.

## Development Commands

```bash
# Development server (localhost:3000)
npm run dev

# Full dev with Python data sync running concurrently
npm run dev:full

# Production build
npm run build

# Lint codebase
npm run lint

# Python data pipeline (sync market data, sentiment, signals, backtesting)
npm run sync
# or
python scripts/master_sync.py

# Generate Drizzle migrations after schema changes
npx drizzle-kit generate
```

## Database Architecture

- **Dialect**: PostgreSQL via Neon (serverless)
- **Connection**: `src/db/index.ts` - uses `@neondatabase/serverless` with HTTP client
- **Schema**: `src/db/schema.ts` - defines `stocks`, `indexes`, `syncLogs`, and `signalBacktest` tables
- **Runtime**: Pages using DB queries use `export const runtime = 'edge'`

## Folder Structure

```
src/
├── app/
│   ├── api/market/route.ts       # Market data API endpoint (Edge runtime)
│   ├── dashboard/page.tsx          # Main terminal view (client component)
│   ├── about/page.tsx             # Methodology page
│   ├── disclaimer/page.tsx        # Legal disclaimer page
│   ├── layout.tsx                 # Root layout (Navbar + DisclaimerBanner)
│   └── page.tsx                   # Landing page (dynamic, fetches real signal data)
├── components/
│   ├── Navbar.tsx                 # Floating glass pill navigation
│   ├── DashboardHeader.tsx        # Dashboard header with nav links
│   ├── MarketSearch.tsx           # Symbol search component
│   ├── SystemBootLoader.tsx       # Initialization loading screen
│   └── DisclaimerBanner.tsx      # Site-wide legal disclaimer banner
├── db/
│   ├── schema.ts                  # Drizzle table definitions (stocks, indexes, syncLogs, signalBacktest)
│   └── index.ts                  # DB connection factory (Neon HTTP client) + getMarketData()
├── lib/
│   └── utils.ts                  # cn() utility (tailwind-merge + clsx)
scripts/
├── master_sync.py                 # Orchestrator: market_sync → finbert_analyzer → alpha_scanner → backtester
├── market_sync.py                 # Fetches prices for 100 NSE stocks + 3 indexes via yfinance
├── finbert_analyzer.py           # FinBERT financial NLP sentiment analysis (replaces VADER)
├── alpha_scanner.py               # Multi-factor signal generation (3+ factors required per signal)
├── backtester.py                  # Historical win rate calculation per signal type
└── requirements.txt               # Python dependencies (yfinance, pandas, psycopg2-binary, transformers, torch)
```

## Data Pipeline

Pipeline runs via `python scripts/master_sync.py`:
1. `market_sync.py` — Fetches EOD prices, populates/updates stocks and indexes tables
2. `finbert_analyzer.py` — Runs ProsusAI/finbert on financial news headlines, outputs BULLISH/BEARISH/NO_DATA
3. `alpha_scanner.py` — Generates signals requiring 3+ concurring factors, confidence from backtested win rates
4. `backtester.py` — Computes historical win rates per signal type, stores in signal_backtest table

**Signal Rules (multi-factor confluence)**:
- OVERSOLD_BOUNCE: RSI < 35 AND sentiment > 0.3 AND volume_spike > 1.0
- MOMENTUM_SPIKE: volume_spike > 1.5 AND RSI 55-70 AND sentiment > 0.3
- MEAN_REVERSION: RSI > 70 AND sentiment < -0.3 AND volume_spike > 1.0
- BEARISH_DUMP: volume_spike > 1.5 AND RSI < 40 AND sentiment < -0.3

**Confidence**: Read from `signal_backtest` table (backtested win rates). Defaults to 50% when no backtest data exists.

**No auth**: There is no login, signup, or paywall. All features are visible to everyone.

## Key Files

- `next.config.ts` — Next.js configuration with `serverExternalPackages: ['drizzle-orm']`
- `src/db/schema.ts` — Database schema (no users table)
- `src/db/index.ts` — Database connection and `getMarketData()` query
- `.github/workflows/sync.yml` — Scheduled Python data pipeline (every 12h)
- `scripts/requirements.txt` — Python dependencies

## Important Patterns

1. **Edge Runtime API Routes**: All API routes use Edge runtime (`export const runtime = 'edge'`).

2. **Client-Side Data Fetching**: Dashboard fetches data from `/api/market` using URLSearchParams.

3. **No Authentication**: No login, signup, or subscription tiers. Dashboard is open to everyone.

4. **Landing Page Dynamic Data**: `page.tsx` fetches real signal data from the database. Shows "Awaiting next data sync" when no signals exist.

5. **Sentiment NO_DATA**: Stocks without news articles get `sentiment_label = "NO_DATA"`. No signal fires on NO_DATA stocks.

6. **Database Migrations**: Use Drizzle Kit to generate migrations: `npx drizzle-kit generate`. Apply to production via `npx drizzle-kit push`.

7. **Python Pipeline**: Requires `DATABASE_URL` environment variable. Run as: `export DATABASE_URL=... && python scripts/master_sync.py`

8. **FinBERT Model**: First run downloads ~300MB model from HuggingFace. Cached in `~/.cache/huggingface/`.

## Environment

- **Database**: Neon PostgreSQL (requires `DATABASE_URL` in `.env`)
- **Package manager**: npm

## Legal & Compliance

- **Disclaimer Banner**: Site-wide legal banner at bottom of every page
- **Disclaimer Page**: `/disclaimer` route with full legal text
- **No Payment Processing**: No Razorpay or subscription system