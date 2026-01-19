import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { runInference, getPredictionHistory, getPredictionDetails, validateInferenceRequest, getModelInferenceStats } from '../services/inference/inferenceService';
import { getModelById } from '../db';
import { requireAuth } from '../utils/auth';
import { ValidationError } from '../utils/errors';

const inferenceRequestInput = z.object({
  modelId: z.number(),
  imageUrl: z.string().optional(),
  imageBase64: z.string().optional(),
  confidenceThreshold: z.number().min(0).max(1).optional(),
});

export const inferenceRouter = router({
  predict: protectedProcedure
    .input(inferenceRequestInput)
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      const model = await getModelById(input.modelId);
      if (!model) throw new ValidationError('Model not found');
      
      const validation = await validateInferenceRequest(input);
      if (!validation.valid) {
        throw new ValidationError(validation.error || 'Invalid inference request');
      }
      
      const response = await runInference(input, user.id);
      return response;
    }),

  getHistory: protectedProcedure
    .input(z.object({
      modelId: z.number(),
      limit: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      return getPredictionHistory(input.modelId, input.limit);
    }),

  getPrediction: protectedProcedure
    .input(z.object({ predictionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      return getPredictionDetails(input.predictionId);
    }),

  getStats: protectedProcedure
    .input(z.object({ modelId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      return getModelInferenceStats(input.modelId);
    }),
});
