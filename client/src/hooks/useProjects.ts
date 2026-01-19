import { trpc } from '@/lib/trpc';
import { useCallback } from 'react';

export function useProjects() {
  const utils = trpc.useUtils();

  const listQuery = trpc.projects.list.useQuery();

  const createMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
    },
  });

  const getQuery = (projectId: number) =>
    trpc.projects.get.useQuery({ projectId });

  const updateMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
    },
  });

  const archiveMutation = trpc.projects.archive.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
    },
  });

  const createProject = useCallback(
    async (data: { name: string; description?: string; type: string }) => {
      return createMutation.mutateAsync(data as any);
    },
    [createMutation]
  );

  const updateProject = useCallback(
    async (projectId: number, data: { name?: string; description?: string; type?: string }) => {
      return updateMutation.mutateAsync({ projectId, ...data } as any);
    },
    [updateMutation]
  );

  const archiveProject = useCallback(
    async (projectId: number) => {
      return archiveMutation.mutateAsync({ projectId });
    },
    [archiveMutation]
  );

  return {
    projects: listQuery.data || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    createProject,
    updateProject,
    archiveProject,
    getProject: getQuery,
  };
}
