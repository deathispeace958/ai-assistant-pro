CREATE TABLE `blocked_animations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageUrl` text NOT NULL,
	`reason` text NOT NULL,
	`analysisResult` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blocked_animations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flagged_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('chat','image_generation','video_generation','animation') NOT NULL,
	`content` text NOT NULL,
	`reason` text NOT NULL,
	`blocked` boolean DEFAULT true,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `flagged_requests_id` PRIMARY KEY(`id`)
);
