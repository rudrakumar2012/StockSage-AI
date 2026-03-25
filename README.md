# StockSage-AI: Institutional Quantitative Terminal

StockSage-AI is a high-performance, AI-driven stock analysis terminal designed for institutional-grade market intelligence. It combines real-time data fetching, VADER NLP sentiment analysis, and technical alpha scanners into a sleek, "hacker-style" professional interface.

![StockSage Terminal](https://stock-sage-ai-eight.vercel.app/) <!-- Placeholder for a real banner later -->

## 🚀 Key Features

- **Predictive Core**: Real-time EOD and intraday data processing for 115+ top NSE/BSE equities.
- **AI Sentiment Neural Layer**: Automated VADER NLP engine that analyzes news headlines for every symbol to determine bullish/bearish polarity.
- **Alpha Scanners**: Algorithmic detection of market signals like `OVERSOLD_BOUNCE`, `MOMENTUM_SPIKE`, and `MEAN_REVERSION` using 14-day RSI and volume spike correlations.
- **Institutional UI**: A dark-themed, ultra-fast interface built with Tailwind CSS, Framer Motion, and Sonner for modern, responsive feedback.
- **Subscription Gating**: Built-in FREE and PRO tiers to demonstrate feature-locking and premium access workflows.
- **Automated Data Pipeline**: A Python-based backend that auto-syncs market intelligence every 12 hours via GitHub Actions.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS.
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM.
- **Auth**: JWT-based secure authentication.
- **Intelligence**: Python 3.10, YFinance, NLTK (VADER Sentiment), Pandas.
- **Deployment**: Cloudflare Pages + GitHub Actions.
- **UI Components**: Shadcn UI, Lucide Icons, Sonner Toasts.

## ⚙️ Architecture

The project uses a **Local-First / Edge-Ready** architecture:
1. **Next.js API Routes** handle the frontend logic and user management.
2. **Cloudflare D1** serves as the globally distributed edge database.
3. **Python Master Sync** runs in a scheduled GitHub Action to fetch live market data, run AI sentiment analysis, and update the production database without downtime.

## 📥 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/rudrakumar2012/StockSage-AI.git
cd StockSage-AI
```

### 2. Install Dependencies
```bash
npm install
# Install Python requirements
pip install yfinance pandas nltk
```

### 3. Run the Terminal
You can run the frontend and the data sync pipeline concurrently:
```bash
npm run dev:full
```

## 🌐 Deployment

For instructions on how to host this project for free using Cloudflare Pages and set up the automated data sync, see the [**Deployment Guide (DEPLOY.md)**](./DEPLOY.md).

## 📄 License

This project is open-source and available under the MIT License.
