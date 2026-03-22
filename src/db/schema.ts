import { pgTable, serial, varchar, numeric } from "drizzle-orm/pg-core";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  indexName: varchar("index_name", { length: 50 }),
  sector: varchar("sector", { length: 50 }),
  price: numeric("price", { precision: 10, scale: 2 }),
  changePercentage: numeric("change_percentage", { precision: 10, scale: 2 }),
});

export const indexes = pgTable("indexes", {
  id: serial("id").primaryKey(),
  indexName: varchar("index_name", { length: 50 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  changePercentage: numeric("change_percentage", { precision: 10, scale: 2 }),
});