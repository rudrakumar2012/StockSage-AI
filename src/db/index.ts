import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema";
import { desc, asc, eq, and, ilike, sql, count } from "drizzle-orm";

const sql_client = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql_client, { schema });

export async function getMarketData(params: {
  page: number;
  limit: number;
  sort: string;
  sector: string;
  query?: string;
}) {
  const offset = (params.page - 1) * params.limit;

  const filters = [];
  if (params.sector !== "All") filters.push(eq(schema.stocks.sector, params.sector));
  if (params.query) filters.push(ilike(schema.stocks.symbol, `%${params.query}%`));

  const order = params.sort === "asc"
    ? asc(schema.stocks.changePercentage)
    : desc(schema.stocks.changePercentage);

  let countQuery = db.select({ count: count() }).from(schema.stocks);
  if (filters.length > 0) countQuery = countQuery.where(and(...filters)) as any;

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