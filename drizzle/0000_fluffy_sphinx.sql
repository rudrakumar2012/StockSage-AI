CREATE TABLE "indexes" (
	"id" serial PRIMARY KEY NOT NULL,
	"index_name" text NOT NULL,
	"price" double precision NOT NULL,
	"change_percentage" double precision NOT NULL,
	CONSTRAINT "indexes_index_name_unique" UNIQUE("index_name")
);
--> statement-breakpoint
CREATE TABLE "stocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"price" double precision NOT NULL,
	"change_percentage" double precision NOT NULL,
	"sector" text,
	"sentiment_score" double precision DEFAULT 0,
	"sentiment_label" text DEFAULT 'NEUTRAL',
	"ai_signal" text DEFAULT 'NONE',
	"ai_confidence" double precision DEFAULT 0,
	CONSTRAINT "stocks_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "sync_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"last_success" text,
	"status" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"subscription_tier" text DEFAULT 'FREE',
	"razorpay_customer_id" text,
	"subscription_expiry" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
