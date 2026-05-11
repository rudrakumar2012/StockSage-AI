import {
  pgTable,
  text,
  integer,
  doublePrecision,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  changePercentage: doublePrecision("change_percentage").notNull(),
  sector: text("sector"),
  sentimentScore: doublePrecision("sentiment_score"),
  sentimentLabel: text("sentiment_label").default("NO_DATA"),
  aiSignal: text("ai_signal").default("NONE"),
  aiConfidence: doublePrecision("ai_confidence").default(0),
  rsi: doublePrecision("rsi").default(0),
  volume: doublePrecision("volume").default(0),
  avgVolume: doublePrecision("avg_volume").default(0),
  volumeSpike: doublePrecision("volume_spike").default(1),
  lastSignalAt: timestamp("last_signal_at"),
});

export const indexes = pgTable("indexes", {
  id: serial("id").primaryKey(),
  indexName: text("index_name").notNull().unique(),
  price: doublePrecision("price").notNull(),
  changePercentage: doublePrecision("change_percentage").notNull(),
});

export const syncLogs = pgTable("sync_logs", {
  id: serial("id").primaryKey(),
  lastSuccess: text("last_success"),
  status: text("status"),
});

export const signalBacktest = pgTable("signal_backtest", {
  id: serial("id").primaryKey(),
  signalType: text("signal_type").notNull(),
  winRate: doublePrecision("win_rate").notNull(),
  totalSignals: integer("total_signals").default(0),
  correctSignals: integer("correct_signals").default(0),
  lastBacktestAt: timestamp("last_backtest_at").defaultNow(),
});