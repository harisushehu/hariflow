# Roboflow Clone - Architecture Documentation

## Project Overview

Roboflow Clone is a comprehensive computer vision annotation and model training platform built with a modular, scalable architecture. The platform supports multiple annotation types, dataset management, model training pipelines, and real-time inference capabilities.

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL/TiDB with Drizzle ORM
- **Storage**: S3 for file management
- **Authentication**: Manus OAuth

## Project Structure

### Backend Architecture (237+ files)

```
server/
├── _core/                          # Framework core
│   ├── context.ts                  # tRPC context
│   ├── trpc.ts                     # tRPC setup
│   ├── index.ts                    # Server entry
│   └── ...
├── services/                       # Business logic services
│   ├── dataset/                    # Dataset management
│   │   ├── datasetService.ts       # Core dataset operations
│   │   ├── projectService.ts       # Project management
│   │   ├── imageUploadService.ts   # Image upload handling
│   │   └── versioningService.ts    # Dataset versioning
│   ├── annotation/                 # Annotation tools
│   │   ├── annotationService.ts    # Annotation CRUD
│   │   └── labelService.ts         # Label management
│   ├── training/                   # Model training
│   │   ├── trainingService.ts      # Training job management
│   │   └── modelService.ts         # Model operations
│   ├── inference/                  # Prediction engine
│   │   └── inferenceService.ts     # Inference execution
│   ├── export/                     # Data export
│   │   └── exportService.ts        # Format conversion (COCO, YOLO, VOC, etc.)
│   ├── validation/                 # Data validation
│   │   └── validationService.ts    # Quality checks
│   ├── image-processing/           # Image utilities
│   │   ├── imageValidator.ts       # Format validation
│   │   └── imageProcessor.ts       # Image processing
│   ├── metrics/                    # Analytics
│   │   └── metricsService.ts       # Metrics collection
│   ├── cache/                      # Caching
│   │   └── cacheService.ts         # In-memory cache
│   ├── queue/                      # Job queue
│   │   └── queueService.ts         # Async job processing
│   ├── webhooks/                   # Event webhooks
│   │   └── webhookService.ts       # Webhook management
│   ├── notifications/              # User notifications
│   │   └── notificationService.ts  # Notification system
│   ├── utils/                      # Utility services (15+ files)
│   │   └── utility*.ts             # Modular utilities
│   └── service1-18/                # Additional services
├── routers/                        # tRPC route handlers
│   ├── projectRouter.ts            # Project endpoints
│   ├── datasetRouter.ts            # Dataset endpoints
│   ├── annotationRouter.ts         # Annotation endpoints
│   ├── trainingRouter.ts           # Training endpoints
│   ├── inferenceRouter.ts          # Inference endpoints
│   ├── exportRouter.ts             # Export endpoints
│   └── router1-10.ts               # Additional routers
├── types/                          # TypeScript definitions
│   ├── annotation.ts               # Annotation types
│   ├── training.ts                 # Training types
│   └── inference.ts                # Inference types
├── utils/                          # Utility functions
│   ├── helpers.ts                  # General helpers
│   ├── errors.ts                   # Error handling
│   ├── auth.ts                     # Auth utilities
│   ├── logger.ts                   # Logging
│   └── api.ts                      # API utilities
├── constants/                      # Application constants
│   ├── config.ts                   # Configuration
│   └── errors.ts                   # Error messages
├── db.ts                           # Database queries
└── routers.ts                      # Main router aggregation
```

### Frontend Architecture

```
client/
├── src/
│   ├── components/
│   │   ├── annotation/             # Annotation tools
│   │   │   ├── BboxAnnotator.tsx   # Bounding box tool
│   │   │   └── PolygonAnnotator.tsx# Polygon tool
│   │   ├── training/               # Training components
│   │   ├── inference/              # Inference components
│   │   ├── ui/                     # UI components (20+ files)
│   │   │   └── component*.tsx      # Reusable components
│   │   └── DashboardLayout.tsx     # Main layout
│   ├── pages/                      # Page components
│   │   ├── Projects.tsx            # Projects management
│   │   ├── Datasets.tsx            # Dataset management
│   │   ├── Annotation.tsx          # Annotation interface
│   │   ├── Training.tsx            # Training dashboard
│   │   ├── Inference.tsx           # Inference interface
│   │   └── Page*.tsx               # Additional pages (15+ files)
│   ├── hooks/                      # Custom React hooks
│   │   ├── useProjects.ts          # Projects hook
│   │   ├── useDatasets.ts          # Datasets hook
│   │   ├── useAnnotations.ts       # Annotations hook
│   │   ├── useTraining.ts          # Training hook
│   │   ├── useInference.ts         # Inference hook
│   │   └── useHook*.ts             # Additional hooks (12+ files)
│   ├── contexts/                   # React contexts
│   ├── lib/
│   │   └── trpc.ts                 # tRPC client
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
└── public/                         # Static assets
```

## Key Features

### 1. Dataset Management
- Upload multiple image formats (JPEG, PNG, etc.)
- Drag-and-drop interface
- Batch processing
- Dataset versioning and snapshots
- Status tracking (uploading, ready, processing, error)

### 2. Annotation Tools
- **Bounding Box**: Draw rectangular regions
- **Polygon**: Create multi-point polygons
- **Keypoint**: Mark specific points
- **Classification**: Label entire images
- Label management with custom colors
- Annotation history and undo/redo

### 3. Dataset Management
- Organize images by project
- View annotation statistics
- Quality metrics and validation
- Dataset snapshots for versioning
- Export functionality

### 4. Model Training
- Support for multiple model architectures (YOLOv5, YOLOv8, ResNet, EfficientNet)
- Configurable training parameters:
  - Epochs
  - Batch size
  - Learning rate
  - Optimizer selection
  - Data augmentation
- Training job management
- Progress tracking
- Job cancellation

### 5. Inference Engine
- Real-time predictions on new images
- Confidence threshold configuration
- Batch inference support
- Prediction history
- Performance metrics

### 6. Export Formats
- **COCO**: Common Objects in Context format
- **YOLO**: YOLO v5/v8 format
- **Pascal VOC**: XML-based format
- **CSV**: Tabular format
- **JSON**: Structured format

### 7. Data Validation
- Image format validation
- Annotation consistency checks
- Bounding box validation
- Dataset quality scoring
- Duplicate detection

### 8. User Management
- Role-based access control (Admin, User)
- Project ownership
- User authentication via OAuth
- Session management

## Database Schema

### Core Tables
- **users**: User accounts and roles
- **projects**: Annotation projects
- **datasets**: Image datasets
- **images**: Individual images
- **annotations**: Annotation records
- **labels**: Label definitions
- **trainingJobs**: Training job records
- **models**: Trained model records
- **predictions**: Inference results
- **datasetVersions**: Dataset snapshots
- **exportLogs**: Export operation logs

## API Endpoints (tRPC)

### Projects
- `projects.create` - Create new project
- `projects.list` - List user projects
- `projects.get` - Get project details
- `projects.update` - Update project
- `projects.archive` - Archive project

### Datasets
- `datasets.create` - Create dataset
- `datasets.list` - List project datasets
- `datasets.getStats` - Get dataset statistics
- `datasets.updateStatus` - Update dataset status
- `datasets.createSnapshot` - Create version snapshot

### Annotations
- `annotations.create` - Create annotation
- `annotations.getImageAnnotations` - Get image annotations
- `annotations.update` - Update annotation
- `annotations.delete` - Delete annotation
- `annotations.getStats` - Get annotation statistics
- `annotations.createLabel` - Create label
- `annotations.getLabels` - Get project labels
- `annotations.updateLabel` - Update label
- `annotations.deleteLabel` - Delete label

### Training
- `training.create` - Create training job
- `training.list` - List training jobs
- `training.getProgress` - Get job progress
- `training.updateStatus` - Update job status
- `training.cancel` - Cancel training job

### Inference
- `inference.predict` - Run inference
- `inference.getHistory` - Get prediction history
- `inference.getPrediction` - Get prediction details
- `inference.getStats` - Get model statistics

### Export
- `exports.export` - Export dataset

## Service Architecture

### Dataset Service
Handles dataset creation, management, and lifecycle. Includes image upload processing and dataset versioning.

### Annotation Service
Manages annotation creation, updates, and deletion. Supports multiple annotation types and label management.

### Training Service
Orchestrates model training pipelines. Manages training jobs, configuration validation, and progress tracking.

### Inference Service
Executes predictions on trained models. Handles image processing and result formatting.

### Export Service
Converts annotation data to various formats. Supports COCO, YOLO, Pascal VOC, CSV, and JSON formats.

### Validation Service
Performs data quality checks and consistency validation across datasets and annotations.

### Cache Service
In-memory caching for frequently accessed data to improve performance.

### Queue Service
Manages asynchronous job processing for long-running operations.

### Webhook Service
Handles event notifications and external integrations.

### Notification Service
Manages user notifications for important events.

## Security Features

- OAuth authentication
- Role-based access control
- User ownership validation
- Input validation and sanitization
- Error handling and logging
- Secure file upload handling

## Performance Optimizations

- In-memory caching for frequently accessed data
- Async job queue for long-running operations
- Batch image processing
- Pagination for large datasets
- Database query optimization
- S3 storage for scalable file management

## Scalability Considerations

- Modular service architecture allows independent scaling
- Async job queue enables background processing
- Database connection pooling
- S3 for unlimited file storage
- Webhook system for external integrations
- Metrics collection for monitoring

## Future Enhancements

- Collaborative annotation features
- Advanced model architectures
- Real-time collaboration
- Custom model training
- API rate limiting
- Advanced analytics dashboard
- Model versioning and comparison
- A/B testing framework
