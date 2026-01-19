import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean, longtext } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Projects table
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["detection", "classification", "segmentation", "keypoint"]).notNull(),
  status: mysqlEnum("status", ["active", "archived", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// Datasets table
export const datasets = mysqlTable("datasets", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageCount: int("imageCount").default(0).notNull(),
  annotatedCount: int("annotatedCount").default(0).notNull(),
  status: mysqlEnum("status", ["uploading", "ready", "processing", "error"]).default("uploading").notNull(),
  version: int("version").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = typeof datasets.$inferInsert;

// Images table
export const images = mysqlTable("images", {
  id: int("id").autoincrement().primaryKey(),
  datasetId: int("datasetId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileSize: int("fileSize").notNull(),
  width: int("width"),
  height: int("height"),
  format: varchar("format", { length: 20 }).notNull(),
  annotated: boolean("annotated").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Image = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;

// Annotations table
export const annotations = mysqlTable("annotations", {
  id: int("id").autoincrement().primaryKey(),
  imageId: int("imageId").notNull(),
  datasetId: int("datasetId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["bbox", "polygon", "keypoint", "classification"]).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  data: json("data").notNull(), // Stores coordinates and metadata
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  version: int("version").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Annotation = typeof annotations.$inferSelect;
export type InsertAnnotation = typeof annotations.$inferInsert;

// Labels/Classes table
export const labels = mysqlTable("labels", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).default("#000000").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Label = typeof labels.$inferSelect;
export type InsertLabel = typeof labels.$inferInsert;

// Training Jobs table
export const trainingJobs = mysqlTable("trainingJobs", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  datasetId: int("datasetId").notNull(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  modelType: mysqlEnum("modelType", ["yolov5", "yolov8", "resnet", "efficientnet", "custom"]).notNull(),
  status: mysqlEnum("status", ["queued", "running", "completed", "failed", "cancelled"]).default("queued").notNull(),
  epochs: int("epochs").default(100).notNull(),
  batchSize: int("batchSize").default(16).notNull(),
  learningRate: decimal("learningRate", { precision: 6, scale: 5 }).default("0.001"),
  trainSplit: decimal("trainSplit", { precision: 3, scale: 2 }).default("0.8"),
  valSplit: decimal("valSplit", { precision: 3, scale: 2 }).default("0.1"),
  testSplit: decimal("testSplit", { precision: 3, scale: 2 }).default("0.1"),
  metrics: json("metrics"), // Stores training metrics
  config: json("config"), // Stores training configuration
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type TrainingJob = typeof trainingJobs.$inferSelect;
export type InsertTrainingJob = typeof trainingJobs.$inferInsert;

// Models table
export const models = mysqlTable("models", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  trainingJobId: int("trainingJobId"),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  modelType: varchar("modelType", { length: 100 }).notNull(),
  modelUrl: text("modelUrl"),
  modelKey: varchar("modelKey", { length: 512 }),
  version: int("version").default(1).notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 4 }),
  precision: decimal("precision", { precision: 5, scale: 4 }),
  recall: decimal("recall", { precision: 5, scale: 4 }),
  f1Score: decimal("f1Score", { precision: 5, scale: 4 }),
  status: mysqlEnum("status", ["training", "ready", "archived", "failed"]).default("training").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Model = typeof models.$inferSelect;
export type InsertModel = typeof models.$inferInsert;

// Predictions table
export const predictions = mysqlTable("predictions", {
  id: int("id").autoincrement().primaryKey(),
  modelId: int("modelId").notNull(),
  imageId: int("imageId"),
  imageUrl: text("imageUrl"),
  userId: int("userId").notNull(),
  results: json("results").notNull(), // Stores prediction results
  processingTime: int("processingTime"), // milliseconds
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

// Dataset Versions table
export const datasetVersions = mysqlTable("datasetVersions", {
  id: int("id").autoincrement().primaryKey(),
  datasetId: int("datasetId").notNull(),
  version: int("version").notNull(),
  description: text("description"),
  imageCount: int("imageCount").notNull(),
  annotatedCount: int("annotatedCount").notNull(),
  changeLog: json("changeLog"), // Stores what changed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DatasetVersion = typeof datasetVersions.$inferSelect;
export type InsertDatasetVersion = typeof datasetVersions.$inferInsert;

// Export Logs table
export const exportLogs = mysqlTable("exportLogs", {
  id: int("id").autoincrement().primaryKey(),
  datasetId: int("datasetId").notNull(),
  userId: int("userId").notNull(),
  format: mysqlEnum("format", ["coco", "yolo", "voc", "csv", "json"]).notNull(),
  exportUrl: text("exportUrl"),
  exportKey: varchar("exportKey", { length: 512 }),
  status: mysqlEnum("status", ["processing", "completed", "failed"]).default("processing").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ExportLog = typeof exportLogs.$inferSelect;
export type InsertExportLog = typeof exportLogs.$inferInsert;