CREATE TABLE `indexes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`index_name` text NOT NULL,
	`price` real,
	`change_percentage` real
);
--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`index_name` text,
	`sector` text,
	`price` real,
	`change_percentage` real
);
