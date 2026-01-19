import {
  createAnnotation,
  getImageAnnotations,
  getAnnotationById,
  updateAnnotation,
  deleteAnnotation,
  getDatasetAnnotations,
} from '../../db';
import { Annotation } from '../../../drizzle/schema';
import { AnnotationData } from '../../types/annotation';

export interface CreateAnnotationInput {
  imageId: number;
  datasetId: number;
  userId: number;
  type: 'bbox' | 'polygon' | 'keypoint' | 'classification';
  label: string;
  data: AnnotationData;
  confidence?: number;
}

export interface AnnotationStats {
  totalAnnotations: number;
  byType: {
    bbox: number;
    polygon: number;
    keypoint: number;
    classification: number;
  };
  byLabel: {
    [label: string]: number;
  };
}

export async function createNewAnnotation(input: CreateAnnotationInput): Promise<Annotation> {
  const result = await createAnnotation({
    imageId: input.imageId,
    datasetId: input.datasetId,
    userId: input.userId,
    type: input.type,
    label: input.label,
    data: input.data as any,
    confidence: input.confidence ? (parseFloat(input.confidence.toString()) as any) : undefined,
    version: 1,
  });

  const annotationId = (result as any).insertId;
  const annotation = await getAnnotationById(annotationId);
  if (!annotation) throw new Error('Failed to create annotation');
  return annotation;
}

export async function getImageAnnotationsList(imageId: number): Promise<Annotation[]> {
  return getImageAnnotations(imageId);
}

export async function updateAnnotationData(
  annotationId: number,
  updates: Partial<CreateAnnotationInput>
): Promise<void> {
  const annotation = await getAnnotationById(annotationId);
  if (!annotation) throw new Error('Annotation not found');

  const updateData: any = {
    version: annotation.version + 1,
  };

  if (updates.label) updateData.label = updates.label;
  if (updates.data) updateData.data = updates.data;
  if (updates.confidence !== undefined) updateData.confidence = updates.confidence;
  if (updates.type) updateData.type = updates.type;

  await updateAnnotation(annotationId, updateData);
}

export async function deleteAnnotationById(annotationId: number): Promise<void> {
  await deleteAnnotation(annotationId);
}

export async function getDatasetAnnotationStats(datasetId: number): Promise<AnnotationStats> {
  const annotations = await getDatasetAnnotations(datasetId);

  const stats: AnnotationStats = {
    totalAnnotations: annotations.length,
    byType: {
      bbox: 0,
      polygon: 0,
      keypoint: 0,
      classification: 0,
    },
    byLabel: {},
  };

  annotations.forEach((ann) => {
    stats.byType[ann.type]++;
    stats.byLabel[ann.label] = (stats.byLabel[ann.label] || 0) + 1;
  });

  return stats;
}

export async function getAnnotationsByLabel(datasetId: number, label: string): Promise<Annotation[]> {
  const allAnnotations = await getDatasetAnnotations(datasetId);
  return allAnnotations.filter((ann) => ann.label === label);
}

export async function getAnnotationsByType(
  datasetId: number,
  type: 'bbox' | 'polygon' | 'keypoint' | 'classification'
): Promise<Annotation[]> {
  const allAnnotations = await getDatasetAnnotations(datasetId);
  return allAnnotations.filter((ann) => ann.type === type);
}

export async function validateAnnotationData(
  type: string,
  data: AnnotationData
): Promise<{ valid: boolean; error?: string }> {
  switch (type) {
    case 'bbox': {
      const bbox = data as any;
      if (typeof bbox.x !== 'number' || typeof bbox.y !== 'number') {
        return { valid: false, error: 'Bounding box must have x and y coordinates' };
      }
      if (typeof bbox.width !== 'number' || typeof bbox.height !== 'number') {
        return { valid: false, error: 'Bounding box must have width and height' };
      }
      if (bbox.x < 0 || bbox.y < 0 || bbox.width <= 0 || bbox.height <= 0) {
        return { valid: false, error: 'Bounding box coordinates must be positive' };
      }
      return { valid: true };
    }

    case 'polygon': {
      const polygon = data as any;
      if (!Array.isArray(polygon.points) || polygon.points.length < 3) {
        return { valid: false, error: 'Polygon must have at least 3 points' };
      }
      for (const point of polygon.points) {
        if (typeof point.x !== 'number' || typeof point.y !== 'number') {
          return { valid: false, error: 'Each polygon point must have x and y coordinates' };
        }
      }
      return { valid: true };
    }

    case 'keypoint': {
      const keypoints = Array.isArray(data) ? data : (data as any).keypoints;
      if (!Array.isArray(keypoints)) {
        return { valid: false, error: 'Keypoints must be an array' };
      }
      for (const kp of keypoints) {
        if (typeof kp.x !== 'number' || typeof kp.y !== 'number') {
          return { valid: false, error: 'Each keypoint must have x and y coordinates' };
        }
      }
      return { valid: true };
    }

    case 'classification': {
      const classification = data as any;
      if (typeof classification.className !== 'string') {
        return { valid: false, error: 'Classification must have a className' };
      }
      return { valid: true };
    }

    default:
      return { valid: false, error: 'Unknown annotation type' };
  }
}
