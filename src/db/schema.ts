import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const stocks = sqliteTable("stocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  changePercentage: real("change_percentage").notNull(),
  sector: text("sector"),
  sentimentScore: real("sentiment_score").default(0),
  sentimentLabel: text("sentiment_label").default("NEUTRAL"),
  aiSignal: text("ai_signal").default("NONE"),
  aiConfidence: real("ai_confidence").default(0),
});

export const indexes = sqliteTable("indexes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  indexName: text("index_name").notNull().unique(),
  price: real("price").notNull(),
  changePercentage: real("change_percentage").notNull(),
});

export const syncLogs = sqliteTable("sync_logs", {
  id: integer("id").primaryKey(),
  lastSuccess: text("last_success"),
  status: text("status"),
});