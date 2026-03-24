CREATE TABLE `stocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`change_percentage` real NOT NULL,
	`sector` text,
	`sentiment_score` real DEFAULT 0,
	`sentiment_label` text DEFAULT 'NEUTRAL',
	`ai_signal` text DEFAULT 'NONE',
	`ai_confidence` real DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stocks_symbol_unique` ON `stocks` (`symbol`);--> statement-breakpoint
CREATE TABLE `indexes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`index_name` text NOT NULL,
	`price` real NOT NULL,
	`change_percentage` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `indexes_index_name_unique` ON `indexes` (`index_name`);--> statement-breakpoint
CREATE TABLE `sync_logs` (
	`id` integer PRIMARY KEY,
	`last_success` text,
	`status` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
    `subscription_tier` text DEFAULT 'FREE',
    `razorpay_customer_id` text,
    `subscription_expiry` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);