# Deployment Guide: StockSage-AI (Vercel + Neon)

This guide explains how to host StockSage-AI for free using **Vercel** (Frontend/API) and **Neon.tech** (PostgreSQL Database).

## 1. Database Setup (Neon.tech)

### Create PostgreSQL Database
1. Sign up for a free account at [Neon.tech](https://neon.tech/).
2. Create a new project (e.g., `StockSage-AI`).
3. In the **Connection Details** widget, copy the **Connection String** (it starts with `postgresql://...`).
4. Save this as your `DATABASE_URL`.

---

## 2. Frontend & API Setup (Vercel)

### Deploy to Vercel
1. Sign up for [Vercel](https://vercel.com/) and connect your GitHub repository.
2. Vercel will automatically detect the **Next.js** framework.
3. Add the following **Environment Variables** in the Vercel project settings:
   - `DATABASE_URL`: Paste your Neon connection string here.
   - `JWT_SECRET`: A long random string (e.g., use `openssl rand -base64 32`).
4. Click **Deploy**. Vercel will build and host your application.

---

## 3. Automated Data Sync (GitHub Actions)

Since Next.js on Vercel is serverless, we use GitHub Actions to run our Python scripts and update the Neon database periodically.

### Add GitHub Secrets
In your GitHub Repository, go to **Settings > Secrets and variables > Actions** and add:
- `DATABASE_URL`: Your Neon connection string.

### How it works
The included `.github/workflows/sync.yml` will:
1. Set up a Python environment.
2. Install dependencies (`psycopg2-binary`, `yfinance`, `pandas`, `nltk`).
3. Run `python scripts/master_sync.py` which connects to Neon and updates the live data.

---

## 4. Initial Database Setup
To create the tables in your production database, you can run the migrations once locally:

1. Create a `.env` file locally with your `DATABASE_URL`.
2. Run the following command:
```bash
npx drizzle-kit push
```
This will sync your local schema directly to your Neon database.

Alternatively, you can run the Python script locally to initialize and populate the data:
```bash
# Install dependencies
pip install psycopg2-binary yfinance pandas nltk
# Run the sync
python scripts/master_sync.py
```

Your terminal is now live on Vercel!
