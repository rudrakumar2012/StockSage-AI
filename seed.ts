import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { stocks, indexes } from './src/db/schema';

async function seed() {
  const client = createClient({ url: 'file:local.db' });
  const db = drizzle(client);

  console.log("🌱 Seeding Institutional Data...");

  // Insert Stock
  await db.insert(stocks).values({
    symbol: 'AAPL',
    indexName: 'NASDAQ',
    sector: 'Technology',
    price: 182.50,
    changePercentage: 1.25,
  });

  // Insert Index
  await db.insert(indexes).values({
    indexName: 'S&P 500',
    price: 5120.40,
    changePercentage: 0.85,
  });

  console.log("✅ Seed Complete! Refresh Port 3000.");
}

seed().catch(console.error);