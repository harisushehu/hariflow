import { z } from 'zod';
import { protectedProcedure, router } from '../_core/trpc';
import { createNewProject, getUserProjectsList, getProjectSummary, updateProjectData, archiveProject } from '../services/dataset/projectService';
import { requireAuth } from '../utils/auth';
import { ValidationError, NotFoundError } from '../utils/errors';

const createProjectInput = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['detection', 'classification', 'segmentation', 'keypoint']),
});

const updateProjectInput = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  type: z.enum(['detection', 'classification', 'segmentation', 'keypoint']).optional(),
});

export const projectRouter = router({
  create: protectedProcedure
    .input(createProjectInput)
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      
      try {
        const project = await createNewProject({
          userId: user.id,
          name: input.name,
          description: input.description,
          type: input.type,
        });
        
        return { success: true, project };
      } catch (error) {
        throw new ValidationError('Failed to create project');
      }
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      const user = requireAuth(ctx.user);
      const projects = await getUserProjectsList(user.id);
      return projects;
    }),

  get: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      const summary = await getProjectSummary(input.projectId);
      
      if (summary.project.userId !== user.id && user.role !== 'admin') {
        throw new ValidationError('Unauthorized');
      }
      
      return summary;
    }),

  update: protectedProcedure
    .input(z.object({ projectId: z.number(), ...updateProjectInput.shape }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      const project = await getProjectSummary(input.projectId);
      
      if (project.project.userId !== user.id && user.role !== 'admin') {
        throw new ValidationError('Unauthorized');
      }
      
      await updateProjectData(input.projectId, {
        name: input.name,
        description: input.description,
        type: input.type,
      });
      
      return { success: true };
    }),

  archive: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = requireAuth(ctx.user);
      const project = await getProjectSummary(input.projectId);
      
      if (project.project.userId !== user.id && user.role !== 'admin') {
        throw new ValidationError('Unauthorized');
      }
      
      await archiveProject(input.projectId);
      return { success: true };
    }),
});
