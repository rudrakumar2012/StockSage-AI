# Deployment Guide: StockSage-AI

This guide explains how to host StockSage-AI for free using **Cloudflare Pages** (Frontend/API) and **GitHub Actions** (Background Data Sync).

## 1. Cloudflare Setup (Free)

### Create D1 Database
1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages > D1**.
3. Create a new database named `stocksage-db`.
4. Copy the **Database ID** for later.

### Deploy to Cloudflare Pages
1. Connect your GitHub repository to Cloudflare Pages.
2. Use the following build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
3. Add **Environment Variables** in the Pages settings:
   - `JWT_SECRET`: A long random string.
   - `NODE_VERSION`: `18` or higher.
4. In the **Functions** tab, bind your D1 database to the name `DB`.

---

## 2. Automated Data Sync (GitHub Actions)

Since Cloudflare Pages doesn't run background Python scripts, we use GitHub Actions to fetch stock data and update the database every 12 hours.

### Get Cloudflare Credentials
1. **Account ID**: Found on your Cloudflare Dashboard homepage (right sidebar).
2. **API Token**: 
   - Go to **My Profile > API Tokens**.
   - Create a token with **Edit D1** permissions.
3. **Database ID**: From the D1 database you created.

### Add GitHub Secrets
In your GitHub Repo: **Settings > Secrets and variables > Actions**:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_DATABASE_ID`

### How it works
The included `.github/workflows/sync.yml` will:
1. Download the production database from Cloudflare.
2. Run the Python scripts (`market_sync`, `ai_analyzer`, `alpha_scanner`).
3. Upload the updated database back to Cloudflare.

---

## 3. Initial Database Setup
To create the tables in your production database, run this command once locally (after logging in with `npx wrangler login`):

```bash
npx wrangler d1 execute stocksage-db --remote --file=./drizzle/0003_create_all_tables.sql
```

Your terminal is now live!
