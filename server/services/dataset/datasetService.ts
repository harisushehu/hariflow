import {
  createDataset,
  getDatasetById,
  updateDataset,
  getProjectDatasets,
  createImage,
  getDatasetImages,
  getDatasetImageCount,
  createDatasetVersion,
  getDatasetVersions,
} from '../../db';
import { Dataset, Image } from '../../../drizzle/schema';

export interface CreateDatasetInput {
  projectId: number;
  userId: number;
  name: string;
  description?: string;
}

export interface DatasetStats {
  totalImages: number;
  annotatedImages: number;
  pendingImages: number;
  annotationPercentage: number;
}

export async function createNewDataset(input: CreateDatasetInput): Promise<Dataset> {
  const result = await createDataset({
    projectId: input.projectId,
    userId: input.userId,
    name: input.name,
    description: input.description,
    imageCount: 0,
    annotatedCount: 0,
    status: 'uploading',
    version: 1,
  });

  const datasetId = (result as any).insertId;
  const dataset = await getDatasetById(datasetId);
  if (!dataset) throw new Error('Failed to create dataset');
  return dataset;
}

export async function getDatasetStats(datasetId: number): Promise<DatasetStats> {
  const dataset = await getDatasetById(datasetId);
  if (!dataset) throw new Error('Dataset not found');

  const totalImages = dataset.imageCount;
  const annotatedImages = dataset.annotatedCount;
  const pendingImages = totalImages - annotatedImages;
  const annotationPercentage = totalImages > 0 ? (annotatedImages / totalImages) * 100 : 0;

  return {
    totalImages,
    annotatedImages,
    pendingImages,
    annotationPercentage,
  };
}

export async function updateDatasetStatus(
  datasetId: number,
  status: 'uploading' | 'ready' | 'processing' | 'error'
): Promise<void> {
  await updateDataset(datasetId, { status });
}

export async function incrementDatasetImageCount(datasetId: number, count: number = 1): Promise<void> {
  const dataset = await getDatasetById(datasetId);
  if (!dataset) throw new Error('Dataset not found');
  
  await updateDataset(datasetId, {
    imageCount: dataset.imageCount + count,
  });
}

export async function incrementAnnotatedImageCount(datasetId: number, count: number = 1): Promise<void> {
  const dataset = await getDatasetById(datasetId);
  if (!dataset) throw new Error('Dataset not found');
  
  await updateDataset(datasetId, {
    annotatedCount: dataset.annotatedCount + count,
  });
}

export async function createDatasetSnapshot(
  datasetId: number,
  description?: string
): Promise<void> {
  const dataset = await getDatasetById(datasetId);
  if (!dataset) throw new Error('Dataset not found');

  const newVersion = dataset.version + 1;

  await createDatasetVersion({
    datasetId,
    version: newVersion,
    description,
    imageCount: dataset.imageCount,
    annotatedCount: dataset.annotatedCount,
    changeLog: {
      timestamp: new Date().toISOString(),
      description,
    },
  });

  await updateDataset(datasetId, { version: newVersion });
}

export async function getDatasetSummary(datasetId: number) {
  const dataset = await getDatasetById(datasetId);
  if (!dataset) throw new Error('Dataset not found');

  const stats = await getDatasetStats(datasetId);
  const versions = await getDatasetVersions(datasetId);

  return {
    dataset,
    stats,
    versions,
  };
}

export async function listProjectDatasets(projectId: number) {
  const datasets = await getProjectDatasets(projectId);
  
  const withStats = await Promise.all(
    datasets.map(async (dataset) => {
      const stats = await getDatasetStats(dataset.id);
      return { ...dataset, stats };
    })
  );

  return withStats;
}
