import { eq, and, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, projects, datasets, images, annotations, labels, 
  trainingJobs, models, predictions, datasetVersions, exportLogs,
  Project, Dataset, Image, Annotation, Label, TrainingJob, Model, Prediction, DatasetVersion, ExportLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Project queries
export async function createProject(projectData: typeof projects.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(projectData);
  return result;
}

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
}

export async function getProjectById(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return result[0];
}

export async function updateProject(projectId: number, updates: Partial<Project>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(projects).set(updates).where(eq(projects.id, projectId));
}

// Dataset queries
export async function createDataset(datasetData: typeof datasets.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(datasets).values(datasetData);
  return result;
}

export async function getProjectDatasets(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(datasets).where(eq(datasets.projectId, projectId)).orderBy(desc(datasets.createdAt));
}

export async function getDatasetById(datasetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(datasets).where(eq(datasets.id, datasetId)).limit(1);
  return result[0];
}

export async function updateDataset(datasetId: number, updates: Partial<Dataset>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(datasets).set(updates).where(eq(datasets.id, datasetId));
}

// Image queries
export async function createImage(imageData: typeof images.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(images).values(imageData);
}

export async function getDatasetImages(datasetId: number, limit?: number, offset?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let query: any = db.select().from(images).where(eq(images.datasetId, datasetId)).orderBy(asc(images.createdAt));
  if (limit) query = query.limit(limit);
  if (offset) query = query.offset(offset);
  return query;
}

export async function getImageById(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(images).where(eq(images.id, imageId)).limit(1);
  return result[0];
}

export async function updateImage(imageId: number, updates: Partial<Image>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(images).set(updates).where(eq(images.id, imageId));
}

export async function getDatasetImageCount(datasetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(images).where(eq(images.datasetId, datasetId));
  return result[0]?.count || 0;
}

// Annotation queries
export async function createAnnotation(annotationData: typeof annotations.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(annotations).values(annotationData);
}

export async function getImageAnnotations(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(annotations).where(eq(annotations.imageId, imageId)).orderBy(desc(annotations.createdAt));
}

export async function getAnnotationById(annotationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(annotations).where(eq(annotations.id, annotationId)).limit(1);
  return result[0];
}

export async function updateAnnotation(annotationId: number, updates: Partial<Annotation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(annotations).set(updates).where(eq(annotations.id, annotationId));
}

export async function deleteAnnotation(annotationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(annotations).where(eq(annotations.id, annotationId));
}

export async function getDatasetAnnotations(datasetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(annotations).where(eq(annotations.datasetId, datasetId));
}

// Label queries
export async function createLabel(labelData: typeof labels.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(labels).values(labelData);
}

export async function getProjectLabels(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(labels).where(eq(labels.projectId, projectId)).orderBy(asc(labels.name));
}

export async function getLabelById(labelId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(labels).where(eq(labels.id, labelId)).limit(1);
  return result[0];
}

export async function updateLabel(labelId: number, updates: Partial<Label>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(labels).set(updates).where(eq(labels.id, labelId));
}

export async function deleteLabel(labelId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(labels).where(eq(labels.id, labelId));
}

// Training Job queries
export async function createTrainingJob(jobData: typeof trainingJobs.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(trainingJobs).values(jobData);
}

export async function getProjectTrainingJobs(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(trainingJobs).where(eq(trainingJobs.projectId, projectId)).orderBy(desc(trainingJobs.createdAt));
}

export async function getTrainingJobById(jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(trainingJobs).where(eq(trainingJobs.id, jobId)).limit(1);
  return result[0];
}

export async function updateTrainingJob(jobId: number, updates: Partial<TrainingJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(trainingJobs).set(updates).where(eq(trainingJobs.id, jobId));
}

// Model queries
export async function createModel(modelData: typeof models.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(models).values(modelData);
}

export async function getProjectModels(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(models).where(eq(models.projectId, projectId)).orderBy(desc(models.createdAt));
}

export async function getModelById(modelId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(models).where(eq(models.id, modelId)).limit(1);
  return result[0];
}

export async function updateModel(modelId: number, updates: Partial<Model>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(models).set(updates).where(eq(models.id, modelId));
}

// Prediction queries
export async function createPrediction(predictionData: typeof predictions.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(predictions).values(predictionData);
}

export async function getModelPredictions(modelId: number, limit?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let query: any = db.select().from(predictions).where(eq(predictions.modelId, modelId)).orderBy(desc(predictions.createdAt));
  if (limit) query = query.limit(limit);
  return query;
}

export async function getPredictionById(predictionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(predictions).where(eq(predictions.id, predictionId)).limit(1);
  return result[0];
}

// Dataset Version queries
export async function createDatasetVersion(versionData: typeof datasetVersions.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(datasetVersions).values(versionData);
}

export async function getDatasetVersions(datasetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(datasetVersions).where(eq(datasetVersions.datasetId, datasetId)).orderBy(desc(datasetVersions.version));
}

export async function getDatasetVersionById(versionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(datasetVersions).where(eq(datasetVersions.id, versionId)).limit(1);
  return result[0];
}

// Export Log queries
export async function createExportLog(exportData: typeof exportLogs.inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(exportLogs).values(exportData);
}

export async function getDatasetExports(datasetId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(exportLogs).where(eq(exportLogs.datasetId, datasetId)).orderBy(desc(exportLogs.createdAt));
}

export async function getExportLogById(exportId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(exportLogs).where(eq(exportLogs.id, exportId)).limit(1);
  return result[0];
}

export async function updateExportLog(exportId: number, updates: Partial<ExportLog>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(exportLogs).set(updates).where(eq(exportLogs.id, exportId));
}
