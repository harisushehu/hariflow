import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { createNewAnnotation, getImageAnnotationsList, updateAnnotationData, deleteAnnotationById, getDatasetAnnotationStats, validateAnnotationData } from '../services/annotation/annotationService';
import { createNewLabel, getProjectLabelsList, updateLabelData, deleteLabelById } from '../services/annotation/labelService';
import { getImageById, getDatasetById } from '../db';
import { requireAuth } from '../utils/auth';
import { ValidationError } from '../utils/errors';

const createAnnotationInput = z.object({
  imageId: z.number(),
  datasetId: z.number(),
  type: z.enum(['bbox', 'polygon', 'keypoint', 'classification']),
  label: z.string(),
  data: z.any(),
  confidence: z.number().optional(),
});

const createLabelInput = z.object({
  projectId: z.number(),
  name: z.string(),
  color: z.string().optional(),
  description: z.string().optional(),
});

export const annotationRouter = router({
  create: protectedProcedure
    .input(createAnnotationInput)
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      const image = await getImageById(input.imageId);
      if (!image) throw new ValidationError('Image not found');
      
      const validation = await validateAnnotationData(input.type, input.data);
      if (!validation.valid) {
        throw new ValidationError(validation.error || 'Invalid annotation data');
      }
      
      const annotation = await createNewAnnotation({
        imageId: input.imageId,
        datasetId: input.datasetId,
        userId: user.id,
        type: input.type,
        label: input.label,
        data: input.data,
        confidence: input.confidence,
      });
      
      return { success: true, annotation };
    }),

  getImageAnnotations: protectedProcedure
    .input(z.object({ imageId: z.number() }))
    .query(async ({ input }) => {
      return getImageAnnotationsList(input.imageId);
    }),

  update: protectedProcedure
    .input(z.object({
      annotationId: z.number(),
      ...createAnnotationInput.shape,
    }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      await updateAnnotationData(input.annotationId, {
        label: input.label,
        data: input.data,
        confidence: input.confidence,
      });
      
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ annotationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      await deleteAnnotationById(input.annotationId);
      return { success: true };
    }),

  getStats: protectedProcedure
    .input(z.object({ datasetId: z.number() }))
    .query(async ({ input }) => {
      return getDatasetAnnotationStats(input.datasetId);
    }),

  // Label management
  createLabel: protectedProcedure
    .input(createLabelInput)
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      const label = await createNewLabel(input);
      return { success: true, label };
    }),

  getLabels: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      return getProjectLabelsList(input.projectId);
    }),

  updateLabel: protectedProcedure
    .input(z.object({
      labelId: z.number(),
      ...createLabelInput.shape,
    }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      await updateLabelData(input.labelId, {
        name: input.name,
        color: input.color,
        description: input.description,
      });
      return { success: true };
    }),

  deleteLabel: protectedProcedure
    .input(z.object({ labelId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      await deleteLabelById(input.labelId);
      return { success: true };
    }),
});
