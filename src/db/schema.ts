import {
  pgTable,
  text,
  integer,
  doublePrecision,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const stocks = pgTable("stocks", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  changePercentage: doublePrecision("change_percentage").notNull(),
  sector: text("sector"),
  sentimentScore: doublePrecision("sentiment_score").default(0),
  sentimentLabel: text("sentiment_label").default("NEUTRAL"),
  aiSignal: text("ai_signal").default("NONE"),
  aiConfidence: doublePrecision("ai_confidence").default(0),
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

// New table for user authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  subscriptionTier: text("subscription_tier").default("FREE"), // FREE or PRO
  razorpayCustomerId: text("razorpay_customer_id"),
  subscriptionExpiry: timestamp("subscription_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
