CREATE TABLE `sync_logs` (
	`id` integer PRIMARY KEY NOT NULL,
	`last_success` text,
	`status` text
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_indexes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`index_name` text NOT NULL,
	`price` real NOT NULL,
	`change_percentage` real NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_indexes`("id", "index_name", "price", "change_percentage") SELECT "id", "index_name", "price", "change_percentage" FROM `indexes`;--> statement-breakpoint
DROP TABLE `indexes`;--> statement-breakpoint
ALTER TABLE `__new_indexes` RENAME TO `indexes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `indexes_index_name_unique` ON `indexes` (`index_name`);--> statement-breakpoint
CREATE TABLE `__new_stocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`name` text NOT NULL,
	`price` real NOT NULL,
	`change_percentage` real NOT NULL,
	`sector` text,
	`sentiment_score` real DEFAULT 0,
	`sentiment_label` text DEFAULT 'NEUTRAL'
);
--> statement-breakpoint
INSERT INTO `__new_stocks`("id", "symbol", "name", "price", "change_percentage", "sector", "sentiment_score", "sentiment_label") SELECT "id", "symbol", "name", "price", "change_percentage", "sector", "sentiment_score", "sentiment_label" FROM `stocks`;--> statement-breakpoint
DROP TABLE `stocks`;--> statement-breakpoint
ALTER TABLE `__new_stocks` RENAME TO `stocks`;--> statement-breakpoint
CREATE UNIQUE INDEX `stocks_symbol_unique` ON `stocks` (`symbol`);