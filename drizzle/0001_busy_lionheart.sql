CREATE TABLE "signal_backtest" (
	"id" serial PRIMARY KEY NOT NULL,
	"signal_type" text NOT NULL,
	"win_rate" double precision NOT NULL,
	"total_signals" integer DEFAULT 0,
	"correct_signals" integer DEFAULT 0,
	"last_backtest_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "sentiment_score" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "sentiment_label" SET DEFAULT 'NO_DATA';--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "rsi" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "volume" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "avg_volume" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "volume_spike" double precision DEFAULT 1;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "last_signal_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" text NOT NULL;