import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";
import { desc, asc, eq, and, like, sql, count } from "drizzle-orm";

// Initialize Neon client
const sql_client = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql_client, { schema });

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
  
  // Create base filters
  const filters = [];
  if (params.sector !== "All") filters.push(eq(schema.stocks.sector, params.sector));
  if (params.query) filters.push(like(schema.stocks.symbol, `%${params.query}%`));

  const order = params.sort === "asc" 
    ? asc(schema.stocks.changePercentage) 
    : desc(schema.stocks.changePercentage);
  
  // Count query
  let countQuery = db.select({ count: count() }).from(schema.stocks);
  if (filters.length > 0) countQuery = countQuery.where(and(...filters)) as any;

  // Data query
  let dataQuery = db.select().from(schema.stocks).limit(params.limit).offset(offset).orderBy(order);
  if (filters.length > 0) dataQuery = dataQuery.where(and(...filters)) as any;

  const [data, allIndexes, countResult] = await Promise.all([
    dataQuery,
    db.select().from(schema.indexes),
    countQuery
  ]);

  const totalCount = Number(countResult[0].count);
  return { 
    data, 
    allIndexes, 
    totalPages: Math.ceil(totalCount / params.limit) || 1 
  };
}
