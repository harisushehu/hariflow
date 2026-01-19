// Application configuration constants

export const APP_CONFIG = {
  name: 'Roboflow Clone',
  version: '1.0.0',
  description: 'Computer Vision Annotation and Model Training Platform',
};

export const LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_BATCH_SIZE: 100,
  MAX_DATASET_SIZE: 100000,
  MAX_ANNOTATIONS_PER_IMAGE: 1000,
  MAX_TRAINING_JOBS: 10,
  MAX_MODELS_PER_PROJECT: 50,
};

export const TIMEOUTS = {
  IMAGE_UPLOAD: 30000, // 30 seconds
  TRAINING_JOB: 3600000, // 1 hour
  INFERENCE: 30000, // 30 seconds
  EXPORT: 300000, // 5 minutes
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const ANNOTATION_TYPES = {
  BBOX: 'bbox',
  POLYGON: 'polygon',
  KEYPOINT: 'keypoint',
  CLASSIFICATION: 'classification',
};

export const PROJECT_TYPES = {
  DETECTION: 'detection',
  CLASSIFICATION: 'classification',
  SEGMENTATION: 'segmentation',
  KEYPOINT: 'keypoint',
};

export const MODEL_TYPES = {
  YOLOV5: 'yolov5',
  YOLOV8: 'yolov8',
  RESNET: 'resnet',
  EFFICIENTNET: 'efficientnet',
  CUSTOM: 'custom',
};

export const EXPORT_FORMATS = {
  COCO: 'coco',
  YOLO: 'yolo',
  VOC: 'voc',
  CSV: 'csv',
  JSON: 'json',
};

export const DATASET_STATUS = {
  UPLOADING: 'uploading',
  READY: 'ready',
  PROCESSING: 'processing',
  ERROR: 'error',
};

export const TRAINING_STATUS = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const MODEL_STATUS = {
  TRAINING: 'training',
  READY: 'ready',
  ARCHIVED: 'archived',
  FAILED: 'failed',
};

export const CACHE_KEYS = {
  PROJECT: (id: number) => `project:${id}`,
  DATASET: (id: number) => `dataset:${id}`,
  MODEL: (id: number) => `model:${id}`,
  USER_PROJECTS: (userId: number) => `user:${userId}:projects`,
};

export const WEBHOOK_EVENTS = {
  DATASET_CREATED: 'dataset.created',
  DATASET_UPDATED: 'dataset.updated',
  ANNOTATION_CREATED: 'annotation.created',
  ANNOTATION_UPDATED: 'annotation.updated',
  TRAINING_STARTED: 'training.started',
  TRAINING_COMPLETED: 'training.completed',
  MODEL_CREATED: 'model.created',
  INFERENCE_COMPLETED: 'inference.completed',
};
