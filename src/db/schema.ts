import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const indexes = sqliteTable("indexes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  indexName: text("index_name").notNull(),
  price: real("price"),
  changePercentage: real("change_percentage"),
});

export const stocks = sqliteTable("stocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  symbol: text("symbol").notNull(),
  indexName: text("index_name"),
  sector: text("sector"),
  price: real("price"),
  changePercentage: real("change_percentage"),
});