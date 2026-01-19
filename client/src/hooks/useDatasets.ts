import { trpc } from '@/lib/trpc';
import { useCallback } from 'react';

export function useDatasets(projectId?: number) {
  const utils = trpc.useUtils();

  const listQuery = trpc.datasets.list.useQuery(
    { projectId: projectId || 0 },
    { enabled: !!projectId }
  );

  const createMutation = trpc.datasets.create.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.datasets.list.invalidate({ projectId });
      }
    },
  });

  const statsQuery = (datasetId: number) =>
    trpc.datasets.getStats.useQuery({ datasetId });

  const updateStatusMutation = trpc.datasets.updateStatus.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.datasets.list.invalidate({ projectId });
      }
    },
  });

  const createSnapshotMutation = trpc.datasets.createSnapshot.useMutation({
    onSuccess: () => {
      if (projectId) {
        utils.datasets.list.invalidate({ projectId });
      }
    },
  });

  const createDataset = useCallback(
    async (data: { name: string; description?: string }) => {
      return createMutation.mutateAsync({
        projectId: projectId || 0,
        ...data,
      });
    },
    [createMutation, projectId]
  );

  const updateStatus = useCallback(
    async (datasetId: number, status: 'uploading' | 'ready' | 'processing' | 'error') => {
      return updateStatusMutation.mutateAsync({ datasetId, status });
    },
    [updateStatusMutation]
  );

  const createSnapshot = useCallback(
    async (datasetId: number, description?: string) => {
      return createSnapshotMutation.mutateAsync({ datasetId, description });
    },
    [createSnapshotMutation]
  );

  return {
    datasets: listQuery.data || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    createDataset,
    updateStatus,
    createSnapshot,
    getStats: statsQuery,
  };
}
