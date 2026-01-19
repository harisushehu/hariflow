import { getProjectModels, getModelById, updateModel } from '../../db';
import { Model } from '../../../drizzle/schema';

export interface ModelSummary {
  model: Model;
  inferenceCount: number;
  averageInferenceTime: number;
}

export async function getProjectModelsList(projectId: number): Promise<Model[]> {
  return getProjectModels(projectId);
}

export async function getModelDetails(modelId: number): Promise<Model | undefined> {
  return getModelById(modelId);
}

export async function updateModelMetrics(
  modelId: number,
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
  }
): Promise<void> {
  const updateData: any = {};

  if (metrics.accuracy !== undefined) {
    updateData.accuracy = metrics.accuracy.toString();
  }
  if (metrics.precision !== undefined) {
    updateData.precision = metrics.precision.toString();
  }
  if (metrics.recall !== undefined) {
    updateData.recall = metrics.recall.toString();
  }
  if (metrics.f1Score !== undefined) {
    updateData.f1Score = metrics.f1Score.toString();
  }

  await updateModel(modelId, updateData);
}

export async function archiveModel(modelId: number): Promise<void> {
  await updateModel(modelId, { status: 'archived' });
}

export async function activateModel(modelId: number): Promise<void> {
  await updateModel(modelId, { status: 'ready' });
}

export async function compareModels(modelIds: number[]): Promise<Model[]> {
  const models = await Promise.all(modelIds.map((id) => getModelById(id)));
  return models.filter((m) => m !== undefined) as Model[];
}

export function calculateModelScore(model: Model): number {
  const accuracy = parseFloat(model.accuracy?.toString() || '0');
  const precision = parseFloat(model.precision?.toString() || '0');
  const recall = parseFloat(model.recall?.toString() || '0');

  if (accuracy === 0 && precision === 0 && recall === 0) return 0;

  return (accuracy + precision + recall) / 3;
}

export function rankModels(models: Model[]): Model[] {
  return [...models].sort((a, b) => calculateModelScore(b) - calculateModelScore(a));
}
