import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import * as schema from "./schema";
import { desc, asc, eq, and, like, sql } from "drizzle-orm";

const getDb = () => {
  // 1. Cloudflare D1 (Production/Wrangler Dev)
  if (process.env.DB) {
    return drizzleD1(process.env.DB as any, { schema });
  }

  // 2. Fallback for local development
  // We use a proxy to avoid importing heavy local drivers in the production bundle
  if (process.env.NEXT_RUNTIME === "edge") {
    return new Proxy({}, {
      get(target, prop) {
        if (prop === 'then') return undefined;
        return () => {
          throw new Error(`Database operation '${String(prop)}' failed: D1 binding 'DB' is missing.`);
        };
      }
    }) as any;
  }

  // Local Node.js environment (for scripts/master_sync.py etc)
  try {
    const { drizzle } = require("drizzle-orm/libsql");
    const { createClient } = require("@libsql/client");
    const url = process.env.DATABASE_URL || "file:local.db";
    const client = createClient({ url });
    return drizzle(client, { schema });
  } catch (e) {
    return new Proxy({}, {
      get() {
        return () => { throw new Error("Local DB driver not found. Run npm install."); };
      }
    }) as any;
  }
};

export const db = getDb();

// Fetch for Homepage
export async function getHeroMarketData() {
  const allIndexes = await db.select().from(schema.indexes).limit(3);
  return { allIndexes };
}

// Fetch for Dashboard
export async function getMarketData(params: {
  page: number;
  limit: number;
  sort: string;
  sector: string;
  query?: string;
}) {
  const offset = (params.page - 1) * params.limit;
  let qb = db.select().from(schema.stocks).$dynamic();
  
  const filters = [];
  if (params.sector !== "All") filters.push(eq(schema.stocks.sector, params.sector));
  if (params.query) filters.push(like(schema.stocks.symbol, `%${params.query}%`));

  if (filters.length > 0) qb = qb.where(and(...filters));

  const order = params.sort === "asc" ? asc(schema.stocks.changePercentage) : desc(schema.stocks.changePercentage);
  
  const [data, allIndexes, countResult] = await Promise.all([
    qb.limit(params.limit).offset(offset).orderBy(order),
    db.select().from(schema.indexes),
    db.run(sql`SELECT COUNT(*) as count FROM stocks`)
  ]);

  const totalCount = Number(countResult.rows[0].count);
  return { data, allIndexes, totalPages: Math.ceil(totalCount / params.limit) || 1 };
}
