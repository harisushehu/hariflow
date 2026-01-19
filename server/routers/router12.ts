import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';

export const routerModule = router({
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return {
        id: input.id,
        userId: ctx.user?.id,
        data: 'Router data',
        timestamp: new Date(),
      };
    }),

  list: protectedProcedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(10) }))
    .query(async ({ input, ctx }) => {
      return {
        items: Array.from({ length: input.limit }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          userId: ctx.user?.id,
        })),
        total: 100,
        page: input.page,
        limit: input.limit,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        id: Math.floor(Math.random() * 10000),
        name: input.name,
        description: input.description,
        userId: ctx.user?.id,
        createdAt: new Date(),
      };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        id: input.id,
        name: input.name,
        updatedAt: new Date(),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return {
        success: true,
        deletedId: input.id,
      };
    }),
});
