import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { exportDataset, validateExportFormat } from '../services/export/exportService';
import { getDatasetById } from '../db';
import { requireAuth } from '../utils/auth';
import { ValidationError } from '../utils/errors';

const exportInput = z.object({
  datasetId: z.number(),
  format: z.enum(['coco', 'yolo', 'voc', 'csv', 'json']),
  includeImages: z.boolean().optional(),
});

export const exportRouter = router({
  export: protectedProcedure
    .input(exportInput)
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      const dataset = await getDatasetById(input.datasetId);
      if (!dataset) throw new ValidationError('Dataset not found');
      
      if (dataset.userId !== user.id && user.role !== 'admin') {
        throw new ValidationError('Unauthorized');
      }
      
      const formatValidation = await validateExportFormat(input.format);
      if (!formatValidation.valid) {
        throw new ValidationError(formatValidation.error || 'Invalid export format');
      }
      
      try {
        const result = await exportDataset({
          datasetId: input.datasetId,
          format: input.format,
          userId: user.id,
          includeImages: input.includeImages,
        });
        
        return { success: true, ...result };
      } catch (error) {
        throw new ValidationError('Failed to export dataset');
      }
    }),
});
