CREATE TABLE `annotations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageId` int NOT NULL,
	`datasetId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('bbox','polygon','keypoint','classification') NOT NULL,
	`label` varchar(255) NOT NULL,
	`data` json NOT NULL,
	`confidence` decimal(5,4),
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `annotations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datasetVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetId` int NOT NULL,
	`version` int NOT NULL,
	`description` text,
	`imageCount` int NOT NULL,
	`annotatedCount` int NOT NULL,
	`changeLog` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `datasetVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `datasets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`imageCount` int NOT NULL DEFAULT 0,
	`annotatedCount` int NOT NULL DEFAULT 0,
	`status` enum('uploading','ready','processing','error') NOT NULL DEFAULT 'uploading',
	`version` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `datasets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exportLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetId` int NOT NULL,
	`userId` int NOT NULL,
	`format` enum('coco','yolo','voc','csv','json') NOT NULL,
	`exportUrl` text,
	`exportKey` varchar(512),
	`status` enum('processing','completed','failed') NOT NULL DEFAULT 'processing',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `exportLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileSize` int NOT NULL,
	`width` int,
	`height` int,
	`format` varchar(20) NOT NULL,
	`annotated` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `labels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(7) NOT NULL DEFAULT '#000000',
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `labels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`trainingJobId` int,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`modelType` varchar(100) NOT NULL,
	`modelUrl` text,
	`modelKey` varchar(512),
	`version` int NOT NULL DEFAULT 1,
	`accuracy` decimal(5,4),
	`precision` decimal(5,4),
	`recall` decimal(5,4),
	`f1Score` decimal(5,4),
	`status` enum('training','ready','archived','failed') NOT NULL DEFAULT 'training',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `models_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `predictions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`modelId` int NOT NULL,
	`imageId` int,
	`imageUrl` text,
	`userId` int NOT NULL,
	`results` json NOT NULL,
	`processingTime` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `predictions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` enum('detection','classification','segmentation','keypoint') NOT NULL,
	`status` enum('active','archived','completed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trainingJobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`datasetId` int NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`modelType` enum('yolov5','yolov8','resnet','efficientnet','custom') NOT NULL,
	`status` enum('queued','running','completed','failed','cancelled') NOT NULL DEFAULT 'queued',
	`epochs` int NOT NULL DEFAULT 100,
	`batchSize` int NOT NULL DEFAULT 16,
	`learningRate` decimal(6,5) DEFAULT '0.001',
	`trainSplit` decimal(3,2) DEFAULT '0.8',
	`valSplit` decimal(3,2) DEFAULT '0.1',
	`testSplit` decimal(3,2) DEFAULT '0.1',
	`metrics` json,
	`config` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `trainingJobs_id` PRIMARY KEY(`id`)
);
