import {
  createTrainingJob,
  getProjectTrainingJobs,
  getTrainingJobById,
  updateTrainingJob,
  createModel,
  getProjectModels,
} from '../../db';
import { TrainingJob, Model } from '../../../drizzle/schema';
import { TrainingConfig, TrainingMetrics, TrainingStatus } from '../../types/training';

export interface CreateTrainingJobInput {
  projectId: number;
  datasetId: number;
  userId: number;
  name: string;
  modelType: 'yolov5' | 'yolov8' | 'resnet' | 'efficientnet' | 'custom';
  config: TrainingConfig;
}

export interface TrainingJobWithProgress extends TrainingJob {
  progress: number;
  estimatedTimeRemaining?: number;
}

export async function createNewTrainingJob(input: CreateTrainingJobInput): Promise<TrainingJob> {
  const result = await createTrainingJob({
    projectId: input.projectId,
    datasetId: input.datasetId,
    userId: input.userId,
    name: input.name,
    modelType: input.modelType,
    epochs: input.config.epochs,
    batchSize: input.config.batchSize,
    learningRate: input.config.learningRate.toString() as any,
    trainSplit: input.config.augmentation ? '0.8' : '0.7' as any,
    valSplit: '0.1' as any,
    testSplit: '0.1' as any,
    config: input.config as any,
    status: 'queued',
  });

  const jobId = (result as any).insertId;
  const job = await getTrainingJobById(jobId);
  if (!job) throw new Error('Failed to create training job');
  return job;
}

export async function getProjectTrainingJobsList(projectId: number): Promise<TrainingJob[]> {
  return getProjectTrainingJobs(projectId);
}

export async function updateTrainingJobStatus(
  jobId: number,
  status: TrainingStatus,
  metrics?: TrainingMetrics[]
): Promise<void> {
  const updateData: any = { status };
  
  if (metrics) {
    updateData.metrics = metrics;
  }

  if (status === 'completed') {
    updateData.completedAt = new Date();
  }

  await updateTrainingJob(jobId, updateData);
}

export async function addTrainingMetrics(
  jobId: number,
  metrics: TrainingMetrics
): Promise<void> {
  const job = await getTrainingJobById(jobId);
  if (!job) throw new Error('Training job not found');

  const existingMetrics = (job.metrics as any) || [];
  const updatedMetrics = Array.isArray(existingMetrics) ? existingMetrics : [];
  updatedMetrics.push(metrics);

  await updateTrainingJob(jobId, {
    metrics: updatedMetrics as any,
  });
}

export async function cancelTrainingJob(jobId: number): Promise<void> {
  const job = await getTrainingJobById(jobId);
  if (!job) throw new Error('Training job not found');

  if (job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') {
    throw new Error(`Cannot cancel a job with status: ${job.status}`);
  }

  await updateTrainingJobStatus(jobId, 'cancelled');
}

export async function getTrainingProgress(jobId: number): Promise<TrainingJobWithProgress> {
  const job = await getTrainingJobById(jobId);
  if (!job) throw new Error('Training job not found');

  const metrics = (job.metrics as any) || [];
  const progress = metrics.length > 0 ? (metrics.length / job.epochs) * 100 : 0;

  return {
    ...job,
    progress: Math.min(progress, 100),
  };
}

export async function createModelFromTrainingJob(
  jobId: number,
  modelName: string,
  modelUrl: string,
  modelKey: string,
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
  }
): Promise<Model> {
  const job = await getTrainingJobById(jobId);
  if (!job) throw new Error('Training job not found');

  const result = await createModel({
    projectId: job.projectId,
    trainingJobId: jobId,
    userId: job.userId,
    name: modelName,
    modelType: job.modelType,
    modelUrl,
    modelKey,
    version: 1,
    accuracy: metrics.accuracy as any,
    precision: metrics.precision as any,
    recall: metrics.recall as any,
    f1Score: metrics.f1Score as any,
    status: 'ready',
  });

  const modelId = (result as any).insertId;
  const model = await getProjectModels(job.projectId);
  return model.find(m => m.id === modelId) || ({} as Model);
}

export async function validateTrainingConfig(config: TrainingConfig): Promise<{ valid: boolean; error?: string }> {
  if (config.epochs < 1 || config.epochs > 1000) {
    return { valid: false, error: 'Epochs must be between 1 and 1000' };
  }
  if (config.batchSize < 1 || config.batchSize > 512) {
    return { valid: false, error: 'Batch size must be between 1 and 512' };
  }
  if (config.learningRate <= 0 || config.learningRate > 1) {
    return { valid: false, error: 'Learning rate must be between 0 and 1' };
  }
  return { valid: true };
}
