// Metrics and analytics service

export interface Metrics {
  totalDatasets: number;
  totalImages: number;
  totalAnnotations: number;
  totalModels: number;
  totalTrainingJobs: number;
  averageAnnotationTime: number;
  averageTrainingTime: number;
}

export interface UserMetrics {
  userId: number;
  projectCount: number;
  datasetCount: number;
  annotationCount: number;
  modelCount: number;
  lastActivityTime: Date;
}

export interface DatasetMetrics {
  datasetId: number;
  imageCount: number;
  annotationCount: number;
  annotationCoverage: number;
  labelDistribution: { [label: string]: number };
  annotationTypes: { [type: string]: number };
}

export interface ModelMetrics {
  modelId: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  inferenceCount: number;
  averageInferenceTime: number;
}

export class MetricsCollector {
  private metrics: Map<string, number> = new Map();

  recordMetric(key: string, value: number): void {
    this.metrics.set(key, value);
  }

  getMetric(key: string): number | undefined {
    return this.metrics.get(key);
  }

  incrementMetric(key: string, value: number = 1): void {
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, current + value);
  }

  decrementMetric(key: string, value: number = 1): void {
    const current = this.metrics.get(key) || 0;
    this.metrics.set(key, Math.max(0, current - value));
  }

  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  reset(): void {
    this.metrics.clear();
  }
}

export const metricsCollector = new MetricsCollector();
