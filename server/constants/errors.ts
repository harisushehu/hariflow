// Error messages constants

export const ERROR_MESSAGES = {
  // Authentication
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Session expired',
  AUTHENTICATION_REQUIRED: 'Authentication required',

  // Validation
  INVALID_INPUT: 'Invalid input',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_FILE_FORMAT: 'Invalid file format',
  FILE_TOO_LARGE: 'File is too large',

  // Resources
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  CANNOT_DELETE: 'Cannot delete resource',
  CANNOT_UPDATE: 'Cannot update resource',

  // Projects
  PROJECT_NOT_FOUND: 'Project not found',
  PROJECT_ALREADY_EXISTS: 'Project already exists',
  INVALID_PROJECT_TYPE: 'Invalid project type',

  // Datasets
  DATASET_NOT_FOUND: 'Dataset not found',
  DATASET_EMPTY: 'Dataset is empty',
  DATASET_NOT_READY: 'Dataset is not ready for training',
  INVALID_DATASET_STATUS: 'Invalid dataset status',

  // Images
  IMAGE_NOT_FOUND: 'Image not found',
  IMAGE_UPLOAD_FAILED: 'Image upload failed',
  INVALID_IMAGE_FORMAT: 'Invalid image format',

  // Annotations
  ANNOTATION_NOT_FOUND: 'Annotation not found',
  INVALID_ANNOTATION_TYPE: 'Invalid annotation type',
  INVALID_ANNOTATION_DATA: 'Invalid annotation data',

  // Labels
  LABEL_NOT_FOUND: 'Label not found',
  LABEL_ALREADY_EXISTS: 'Label already exists',
  INVALID_LABEL_NAME: 'Invalid label name',

  // Training
  TRAINING_JOB_NOT_FOUND: 'Training job not found',
  TRAINING_JOB_FAILED: 'Training job failed',
  INVALID_TRAINING_CONFIG: 'Invalid training configuration',
  INSUFFICIENT_DATA: 'Insufficient data for training',

  // Models
  MODEL_NOT_FOUND: 'Model not found',
  MODEL_NOT_READY: 'Model is not ready for inference',
  INVALID_MODEL_TYPE: 'Invalid model type',

  // Inference
  INFERENCE_FAILED: 'Inference failed',
  INVALID_IMAGE_URL: 'Invalid image URL',
  INVALID_CONFIDENCE_THRESHOLD: 'Invalid confidence threshold',

  // Export
  EXPORT_FAILED: 'Export failed',
  INVALID_EXPORT_FORMAT: 'Invalid export format',

  // Server
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service unavailable',
  TIMEOUT: 'Request timeout',
  DATABASE_ERROR: 'Database error',
};

export const SUCCESS_MESSAGES = {
  // General
  SUCCESS: 'Operation successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Projects
  PROJECT_CREATED: 'Project created successfully',
  PROJECT_UPDATED: 'Project updated successfully',
  PROJECT_ARCHIVED: 'Project archived successfully',

  // Datasets
  DATASET_CREATED: 'Dataset created successfully',
  DATASET_UPDATED: 'Dataset updated successfully',
  IMAGES_UPLOADED: 'Images uploaded successfully',

  // Annotations
  ANNOTATION_CREATED: 'Annotation created successfully',
  ANNOTATION_UPDATED: 'Annotation updated successfully',
  ANNOTATION_DELETED: 'Annotation deleted successfully',

  // Training
  TRAINING_STARTED: 'Training started successfully',
  TRAINING_CANCELLED: 'Training cancelled successfully',

  // Export
  EXPORT_STARTED: 'Export started successfully',
};
