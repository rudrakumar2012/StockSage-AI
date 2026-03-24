import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './src/db/schema';

async function seed() {
  const client = createClient({ url: 'file:local.db' });
  const db = drizzle(client, { schema });

  console.log("🌱 Seeding Institutional Data...");

  // Clear existing data to avoid unique constraint violations
  await db.delete(schema.stocks);
  await db.delete(schema.indexes);
  await db.delete(schema.syncLogs);

  // Insert Multiple Stocks
  const stockData = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 182.50, changePercentage: 1.25, aiSignal: 'STRONG_BULLISH', aiConfidence: 88, sentimentLabel: 'BULLISH' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', price: 2950.00, changePercentage: 0.85, aiSignal: 'MOMENTUM_UP', aiConfidence: 75, sentimentLabel: 'BULLISH' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'Technology', price: 4120.00, changePercentage: -0.45, aiSignal: 'MEAN_REVERSION', aiConfidence: 62, sentimentLabel: 'NEUTRAL' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Financial Services', price: 1450.00, changePercentage: -1.20, aiSignal: 'BEARISH_DUMP', aiConfidence: 80, sentimentLabel: 'BEARISH' },
    { symbol: 'INFY', name: 'Infosys Ltd', sector: 'Technology', price: 1620.00, changePercentage: 0.30, aiSignal: 'NONE', aiConfidence: 0, sentimentLabel: 'NEUTRAL' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Financial Services', price: 1080.00, changePercentage: 1.10, aiSignal: 'STRONG_BULLISH', aiConfidence: 85, sentimentLabel: 'BULLISH' },
  ];

  for (const stock of stockData) {
    await db.insert(schema.stocks).values(stock);
  }

  // Insert Multiple Indexes for the Infinite Ticker
  const indexData = [
    { indexName: 'NIFTY 50', price: 22450.30, changePercentage: 0.65 },
    { indexName: 'SENSEX', price: 74120.50, changePercentage: 0.58 },
    { indexName: 'BANK NIFTY', price: 47850.20, changePercentage: 0.42 },
    { indexName: 'NIFTY IT', price: 35600.80, changePercentage: -0.15 },
    { indexName: 'NIFTY AUTO', price: 21200.40, changePercentage: 1.12 },
    { indexName: 'S&P 500', price: 5120.40, changePercentage: 0.85 },
    { indexName: 'NASDAQ', price: 16273.38, changePercentage: 1.15 },
  ];

  for (const idx of indexData) {
    await db.insert(schema.indexes).values(idx);
  }

  // Insert Sync Log
  await db.insert(schema.syncLogs).values({
    id: 1,
    lastSuccess: new Date().toLocaleString(),
    status: 'READY'
  });

  console.log("✅ Seed Complete! Refresh Port 3000.");
}

seed().catch(console.error);