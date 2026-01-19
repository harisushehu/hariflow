import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { projectRouter } from "./routers/projectRouter";
import { datasetRouter } from "./routers/datasetRouter";
import { annotationRouter } from "./routers/annotationRouter";
import { trainingRouter } from "./routers/trainingRouter";
import { inferenceRouter } from "./routers/inferenceRouter";
import { exportRouter } from "./routers/exportRouter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Feature routers
  projects: projectRouter,
  datasets: datasetRouter,
  annotations: annotationRouter,
  training: trainingRouter,
  inference: inferenceRouter,
  exports: exportRouter,
});

export type AppRouter = typeof appRouter;
