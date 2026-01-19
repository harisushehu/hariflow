// Prediction result for bounding box
export interface BboxPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

// Prediction result for classification
export interface ClassificationPrediction {
  class: string;
  confidence: number;
  probabilities?: {
    [className: string]: number;
  };
}

// Prediction result for segmentation
export interface SegmentationPrediction {
  mask: string; // Base64 encoded mask
  class: string;
  confidence: number;
}

// Prediction result for keypoint detection
export interface KeypointPrediction {
  keypoints: {
    x: number;
    y: number;
    name: string;
    confidence: number;
  }[];
  confidence: number;
}

// Generic prediction result
export type PredictionResult = 
  | BboxPrediction 
  | ClassificationPrediction 
  | SegmentationPrediction 
  | KeypointPrediction;

// Inference request
export interface InferenceRequest {
  modelId: number;
  imageUrl?: string;
  imageBase64?: string;
  confidenceThreshold?: number;
}

// Inference response
export interface InferenceResponse {
  predictionId: number;
  modelId: number;
  results: PredictionResult[];
  processingTime: number; // milliseconds
  timestamp: number;
  imageUrl?: string;
}

// Batch inference request
export interface BatchInferenceRequest {
  modelId: number;
  imageUrls: string[];
  confidenceThreshold?: number;
}

// Batch inference response
export interface BatchInferenceResponse {
  jobId: string;
  status: 'processing' | 'completed' | 'failed';
  results: InferenceResponse[];
  totalProcessingTime: number;
}
