import { trpc } from '@/lib/trpc';
import { useCallback } from 'react';

export function useTraining(projectId?: number) {
  const utils = trpc.useUtils();

  const listQuery = trpc.training.list.useQuery(
    { projectId: projectId || 0 },
    { enabled: !!projectId }
  );

  const createMutation = trpc.training.create.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.training.list.invalidate({ projectId });
      }
    },
  });

  const progressQuery = (jobId: number) =>
    trpc.training.getProgress.useQuery({ jobId });

  const updateStatusMutation = trpc.training.updateStatus.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.training.list.invalidate({ projectId });
      }
    },
  });

  const cancelMutation = trpc.training.cancel.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.training.list.invalidate({ projectId });
      }
    },
  });

  const createTrainingJob = useCallback(
    async (data: {
      name: string;
      datasetId: number;
      modelType: string;
      config: any;
    }) => {
      return createMutation.mutateAsync({
        projectId: projectId || 0,
        ...data,
      } as any);
    },
    [createMutation, projectId]
  );

  const updateStatus = useCallback(
    async (jobId: number, status: string) => {
      return updateStatusMutation.mutateAsync({ jobId, status } as any);
    },
    [updateStatusMutation]
  );

  const cancelJob = useCallback(
    async (jobId: number) => {
      return cancelMutation.mutateAsync({ jobId });
    },
    [cancelMutation]
  );

  return {
    trainingJobs: listQuery.data || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    createTrainingJob,
    updateStatus,
    cancelJob,
    getProgress: progressQuery,
  };
}
