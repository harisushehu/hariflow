import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { createNewDataset, getDatasetStats, listProjectDatasets, updateDatasetStatus, createDatasetSnapshot } from '../services/dataset/datasetService';
import { getProjectById } from '../db';
import { requireAuth } from '../utils/auth';
import { ValidationError } from '../utils/errors';

const createDatasetInput = z.object({
  projectId: z.number(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export const datasetRouter = router({
  create: protectedProcedure
    .input(createDatasetInput)
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      const project = await getProjectById(input.projectId);
      if (!project || (project.userId !== user.id && user.role !== 'admin')) {
        throw new ValidationError('Project not found or unauthorized');
      }
      
      const dataset = await createNewDataset({
        projectId: input.projectId,
        userId: user.id,
        name: input.name,
        description: input.description,
      });
      
      return { success: true, dataset };
    }),

  list: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      const project = await getProjectById(input.projectId);
      if (!project || (project.userId !== user.id && user.role !== 'admin')) {
        throw new ValidationError('Project not found or unauthorized');
      }
      
      return listProjectDatasets(input.projectId);
    }),

  getStats: protectedProcedure
    .input(z.object({ datasetId: z.number() }))
    .query(async ({ input }) => {
      return getDatasetStats(input.datasetId);
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      datasetId: z.number(),
      status: z.enum(['uploading', 'ready', 'processing', 'error']),
    }))
    .mutation(async ({ input }) => {
      await updateDatasetStatus(input.datasetId, input.status);
      return { success: true };
    }),

  createSnapshot: protectedProcedure
    .input(z.object({
      datasetId: z.number(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await createDatasetSnapshot(input.datasetId, input.description);
      return { success: true };
    }),
});
