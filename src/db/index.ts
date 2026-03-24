import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { desc, asc, eq, and, like, sql } from "drizzle-orm";

// Minimal DB getter to keep bundle size small
const getDb = () => {
  if (process.env.DB) {
    return drizzle(process.env.DB as any, { schema });
  }

  // Fallback Proxy for build time / edge without binding
  // This prevents the bundler from pulling in heavy SQLite drivers
  return new Proxy({}, {
    get(_, prop) {
      if (prop === 'then') return undefined;
      return () => {
        throw new Error(`D1 Database binding "DB" not found.`);
      };
    }
  }) as any;
};

export const db = getDb();

// Optimized helper functions
export async function getHeroMarketData() {
  return { 
    allIndexes: await db.select().from(schema.indexes).limit(3) 
  };
}

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

  const order = params.sort === "asc" 
    ? asc(schema.stocks.changePercentage) 
    : desc(schema.stocks.changePercentage);
  
  const [data, allIndexes, countResult] = await Promise.all([
    qb.limit(params.limit).offset(offset).orderBy(order),
    db.select().from(schema.indexes),
    db.run(sql`SELECT COUNT(*) as count FROM stocks`)
  ]);

  const totalCount = Number(countResult.rows[0].count);
  return { 
    data, 
    allIndexes, 
    totalPages: Math.ceil(totalCount / params.limit) || 1 
  };
}
