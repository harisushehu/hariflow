import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { createNewTrainingJob, getProjectTrainingJobsList, updateTrainingJobStatus, getTrainingProgress, cancelTrainingJob, validateTrainingConfig } from '../services/training/trainingService';
import { getProjectById, getDatasetById } from '../db';
import { requireAuth } from '../utils/auth';
import { ValidationError } from '../utils/errors';

const trainingConfigInput = z.object({
  epochs: z.number().min(1).max(1000),
  batchSize: z.number().min(1).max(512),
  learningRate: z.number().min(0).max(1),
  optimizer: z.enum(['adam', 'sgd', 'rmsprop']),
  lossFunction: z.string(),
  augmentation: z.boolean(),
});

const createTrainingJobInput = z.object({
  projectId: z.number(),
  datasetId: z.number(),
  name: z.string().min(1).max(255),
  modelType: z.enum(['yolov5', 'yolov8', 'resnet', 'efficientnet', 'custom']),
  config: trainingConfigInput,
}).strict();

export const trainingRouter = router({
  create: protectedProcedure
    .input(createTrainingJobInput)
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      const project = await getProjectById(input.projectId);
      if (!project || (project.userId !== user.id && user.role !== 'admin')) {
        throw new ValidationError('Project not found or unauthorized');
      }
      
      const dataset = await getDatasetById(input.datasetId);
      if (!dataset) throw new ValidationError('Dataset not found');
      
      const configValidation = await validateTrainingConfig(input.config);
      if (!configValidation.valid) {
        throw new ValidationError(configValidation.error || 'Invalid training configuration');
      }
      
      const job = await createNewTrainingJob({
        projectId: input.projectId,
        datasetId: input.datasetId,
        userId: user.id,
        name: input.name,
        modelType: input.modelType,
        config: input.config as any,
      });
      
      return { success: true, job };
    }),

  list: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      const project = await getProjectById(input.projectId);
      if (!project || (project.userId !== user.id && user.role !== 'admin')) {
        throw new ValidationError('Project not found or unauthorized');
      }
      
      return getProjectTrainingJobsList(input.projectId);
    }),

  getProgress: protectedProcedure
    .input(z.object({ jobId: z.number() }))
    .query(async ({ input }) => {
      return getTrainingProgress(input.jobId);
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      jobId: z.number(),
      status: z.enum(['queued', 'running', 'completed', 'failed', 'cancelled']),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      await updateTrainingJobStatus(input.jobId, input.status);
      return { success: true };
    }),

  cancel: protectedProcedure
    .input(z.object({ jobId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      await cancelTrainingJob(input.jobId);
      return { success: true };
    }),
});
