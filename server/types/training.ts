// Training configuration
export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: 'adam' | 'sgd' | 'rmsprop';
  lossFunction: string;
  augmentation: boolean;
  augmentationParams?: {
    rotation: number;
    flip: boolean;
    brightness: number;
    contrast: number;
  };
}

// Training metrics
export interface TrainingMetrics {
  epoch: number;
  loss: number;
  valLoss: number;
  accuracy?: number;
  valAccuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  mAP?: number; // Mean Average Precision for detection
}

// Training job status
export type TrainingStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

// Model evaluation metrics
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mAP?: number;
  confusionMatrix?: number[][];
  classMetrics?: {
    [className: string]: {
      precision: number;
      recall: number;
      f1Score: number;
    };
  };
}

// Model configuration
export interface ModelConfig {
  architecture: string;
  inputSize: number;
  numClasses: number;
  pretrainedWeights?: boolean;
  freezeBackbone?: boolean;
}

// Training progress
export interface TrainingProgress {
  jobId: number;
  status: TrainingStatus;
  progress: number; // 0-100
  currentEpoch: number;
  totalEpochs: number;
  metrics: TrainingMetrics[];
  estimatedTimeRemaining?: number; // seconds
  error?: string;
}
