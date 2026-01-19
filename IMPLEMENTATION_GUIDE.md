# Implementation Guide

## Getting Started

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL/TiDB database
- Manus OAuth credentials

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables (handled by Manus platform):
```
DATABASE_URL
JWT_SECRET
VITE_APP_ID
OAUTH_SERVER_URL
VITE_OAUTH_PORTAL_URL
OWNER_OPEN_ID
OWNER_NAME
BUILT_IN_FORGE_API_URL
BUILT_IN_FORGE_API_KEY
```

3. Initialize database:
```bash
pnpm db:push
```

4. Start development server:
```bash
pnpm dev
```

## Development Workflow

### Adding a New Feature

1. **Update Database Schema**
   - Edit `drizzle/schema.ts`
   - Run `pnpm db:push` to apply migrations

2. **Create Database Helpers**
   - Add query functions to `server/db.ts`
   - Return raw Drizzle rows for type safety

3. **Implement Service Layer**
   - Create service file in `server/services/`
   - Implement business logic
   - Handle validation and error cases

4. **Create tRPC Router**
   - Add router file in `server/routers/`
   - Define input/output schemas with Zod
   - Use service layer for operations
   - Register in `server/routers.ts`

5. **Build Frontend**
   - Create custom hook in `client/src/hooks/`
   - Build page/component in `client/src/pages/` or `client/src/components/`
   - Use `trpc.*` hooks for data fetching
   - Implement UI with shadcn/ui components

6. **Test**
   - Write Vitest tests in `server/*.test.ts`
   - Run `pnpm test`

### File Organization Best Practices

**Backend Services:**
- One service per domain (dataset, annotation, training, etc.)
- Group related functions in service classes
- Export typed interfaces for data structures
- Use consistent error handling

**Frontend Components:**
- One component per file
- Use TypeScript interfaces for props
- Leverage shadcn/ui for consistent styling
- Implement proper loading/error states

**Hooks:**
- One hook per feature
- Handle loading and error states
- Use optimistic updates where appropriate
- Invalidate cache on mutations

## Key Modules

### Dataset Service (`server/services/dataset/`)
- `datasetService.ts` - Core dataset operations
- `projectService.ts` - Project management
- `imageUploadService.ts` - Image upload handling
- `versioningService.ts` - Dataset versioning

### Annotation Service (`server/services/annotation/`)
- `annotationService.ts` - Annotation CRUD operations
- `labelService.ts` - Label management

### Training Service (`server/services/training/`)
- `trainingService.ts` - Training job management
- `modelService.ts` - Model operations and metrics

### Inference Service (`server/services/inference/`)
- `inferenceService.ts` - Prediction execution and history

### Export Service (`server/services/export/`)
- `exportService.ts` - Format conversion (COCO, YOLO, VOC, CSV, JSON)

### Validation Service (`server/services/validation/`)
- `validationService.ts` - Data quality checks

### Utilities
- `server/utils/helpers.ts` - General utility functions
- `server/utils/errors.ts` - Custom error classes
- `server/utils/auth.ts` - Authentication utilities
- `server/utils/logger.ts` - Logging utility
- `server/utils/api.ts` - API response formatting

### Constants
- `server/constants/config.ts` - Configuration constants
- `server/constants/errors.ts` - Error messages

## API Examples

### Creating a Project
```typescript
const { data } = await trpc.projects.create.useMutation();
await data.mutateAsync({
  name: 'My Project',
  description: 'Object detection project',
  type: 'detection',
});
```

### Uploading Images
```typescript
const uploadImage = async (file: File, datasetId: number) => {
  const buffer = await file.arrayBuffer();
  const result = await uploadImageToDataset(
    datasetId,
    Buffer.from(buffer),
    file.name,
    file.type
  );
  return result;
};
```

### Creating Annotations
```typescript
const { data } = await trpc.annotations.create.useMutation();
await data.mutateAsync({
  imageId: 123,
  datasetId: 456,
  type: 'bbox',
  label: 'person',
  data: { x: 10, y: 20, width: 100, height: 150 },
});
```

### Starting Training
```typescript
const { data } = await trpc.training.create.useMutation();
await data.mutateAsync({
  projectId: 123,
  datasetId: 456,
  name: 'Training Run 1',
  modelType: 'yolov8',
  config: {
    epochs: 100,
    batchSize: 16,
    learningRate: 0.001,
    optimizer: 'adam',
    lossFunction: 'crossentropy',
    augmentation: true,
  },
});
```

### Running Inference
```typescript
const { data } = await trpc.inference.predict.useMutation();
const result = await data.mutateAsync({
  modelId: 789,
  imageUrl: 'https://example.com/image.jpg',
  confidenceThreshold: 0.5,
});
```

### Exporting Dataset
```typescript
const { data } = await trpc.exports.export.useMutation();
const result = await data.mutateAsync({
  datasetId: 456,
  format: 'coco',
});
```

## Testing

### Running Tests
```bash
pnpm test
```

### Writing Tests
Create test files with `.test.ts` extension:
```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('Feature', () => {
  it('should do something', async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.feature.operation();
    expect(result).toEqual(expected);
  });
});
```

## Performance Optimization

### Caching
Use the cache service for frequently accessed data:
```typescript
import { cacheService } from '../services/cache/cacheService';

const data = await cacheService.getOrSet(
  'key',
  async () => fetchData(),
  5 * 60 * 1000 // 5 minutes TTL
);
```

### Async Jobs
Use the queue service for long-running operations:
```typescript
import { queueService } from '../services/queue/queueService';

const jobId = await queueService.enqueue('training', { datasetId: 123 });
```

### Pagination
Always paginate large result sets:
```typescript
const { items, total, page, pageSize } = createPaginatedResponse(
  results,
  total,
  currentPage,
  pageSize
);
```

## Deployment

1. Build the project:
```bash
pnpm build
```

2. Start production server:
```bash
pnpm start
```

The application will be available at the configured URL.

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correctly set
- Check database credentials
- Ensure database is running and accessible

### Authentication Issues
- Verify OAuth credentials are correct
- Check VITE_APP_ID and OAUTH_SERVER_URL
- Clear browser cookies and try again

### TypeScript Errors
- Run `pnpm check` to verify types
- Check that all imports are correct
- Ensure database schema is up to date

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Clear build cache: `rm -rf dist`
- Check for circular dependencies

## Contributing

When adding new features:
1. Follow the existing code structure
2. Add TypeScript types for all functions
3. Write tests for new functionality
4. Update documentation
5. Use consistent error handling
6. Follow naming conventions
