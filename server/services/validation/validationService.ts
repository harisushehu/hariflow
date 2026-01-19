import { getDatasetAnnotations, getDatasetImages } from '../../db';

export interface ValidationReport {
  datasetId: number;
  totalImages: number;
  totalAnnotations: number;
  issues: ValidationIssue[];
  warnings: ValidationWarning[];
  score: number; // 0-100
}

export interface ValidationIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  affectedItems: number;
}

export interface ValidationWarning {
  type: string;
  message: string;
  count: number;
}

export async function validateDataset(datasetId: number): Promise<ValidationReport> {
  const images = await getDatasetImages(datasetId);
  const annotations = await getDatasetAnnotations(datasetId);

  const issues: ValidationIssue[] = [];
  const warnings: ValidationWarning[] = [];

  // Check for unannotated images
  const annotatedImageIds = new Set(annotations.map((a) => a.imageId));
  const unannotatedCount = images.filter((img: any) => !annotatedImageIds.has(img.id)).length;

  if (unannotatedCount > 0) {
    issues.push({
      type: 'unannotated_images',
      severity: 'warning',
      message: `${unannotatedCount} images have no annotations`,
      affectedItems: unannotatedCount,
    });
  }

  // Check for images without dimensions
  const noDimensionsCount = images.filter((img: any) => !img.width || !img.height).length;
  if (noDimensionsCount > 0) {
    warnings.push({
      type: 'missing_dimensions',
      message: `${noDimensionsCount} images are missing dimension information`,
      count: noDimensionsCount,
    });
  }

  // Check for duplicate annotations
  const annotationPairs = new Set<string>();
  let duplicateCount = 0;
  for (const ann of annotations) {
    const pair = `${ann.imageId}-${JSON.stringify(ann.data)}`;
    if (annotationPairs.has(pair)) {
      duplicateCount++;
    }
    annotationPairs.add(pair);
  }

  if (duplicateCount > 0) {
    warnings.push({
      type: 'duplicate_annotations',
      message: `${duplicateCount} potential duplicate annotations detected`,
      count: duplicateCount,
    });
  }

  // Check for invalid bounding boxes
  let invalidBboxCount = 0;
  for (const ann of annotations) {
    if (ann.type === 'bbox') {
      const data = ann.data as any;
      if ((data.width || 0) <= 0 || (data.height || 0) <= 0 || (data.x || 0) < 0 || (data.y || 0) < 0) {
        invalidBboxCount++;
      }
    }
  }

  if (invalidBboxCount > 0) {
    issues.push({
      type: 'invalid_bboxes',
      severity: 'error',
      message: `${invalidBboxCount} bounding boxes have invalid coordinates`,
      affectedItems: invalidBboxCount,
    });
  }

  // Calculate quality score
  const maxIssues = images.length + annotations.length;
  const errorCount = issues.filter((i) => i.severity === 'error').reduce((sum, i) => sum + i.affectedItems, 0);
  const warningCount = warnings.reduce((sum, w) => sum + w.count, 0);
  const score = Math.max(0, 100 - (errorCount * 5 + warningCount * 2));

  return {
    datasetId,
    totalImages: images.length,
    totalAnnotations: annotations.length,
    issues,
    warnings,
    score,
  };
}

export async function validateAnnotationConsistency(datasetId: number): Promise<{
  consistent: boolean;
  issues: string[];
}> {
  const annotations = await getDatasetAnnotations(datasetId);
  const issues: string[] = [];

  // Check label consistency
  const labels = new Set(annotations.map((a) => a.label));
  if (labels.size === 0) {
    issues.push('No labels found in dataset');
  }

  // Check annotation type consistency
  const types = new Set(annotations.map((a) => a.type));
  if (types.size > 1) {
    issues.push(`Mixed annotation types detected: ${Array.from(types).join(', ')}`);
  }

  // Check for empty annotations
  const emptyAnnotations = annotations.filter((a) => !a.data || Object.keys(a.data).length === 0);
  if (emptyAnnotations.length > 0) {
    issues.push(`${emptyAnnotations.length} annotations have empty data`);
  }

  return {
    consistent: issues.length === 0,
    issues,
  };
}

export async function getDatasetQualityMetrics(datasetId: number) {
  const images = await getDatasetImages(datasetId);
  const annotations = await getDatasetAnnotations(datasetId);

  const annotatedImages = new Set(annotations.map((a) => a.imageId)).size;
  const annotationDensity = images.length > 0 ? annotations.length / images.length : 0;

  const labelDistribution: { [label: string]: number } = {};
  const typeDistribution: { [type: string]: number } = {};

  for (const ann of annotations) {
    labelDistribution[ann.label] = (labelDistribution[ann.label] || 0) + 1;
    typeDistribution[ann.type] = (typeDistribution[ann.type] || 0) + 1;
  }

  return {
    totalImages: images.length,
    annotatedImages,
    annotationCoverage: (annotatedImages / images.length) * 100,
    totalAnnotations: annotations.length,
    annotationDensity,
    labelDistribution,
    typeDistribution,
    averageAnnotationsPerImage: annotations.length / images.length,
  };
}
