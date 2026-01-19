import { trpc } from '@/lib/trpc';
import { useCallback } from 'react';

export function useAnnotations(imageId?: number, datasetId?: number) {
  const utils = trpc.useUtils();

  const listQuery = trpc.annotations.getImageAnnotations.useQuery(
    { imageId: imageId || 0 },
    { enabled: !!imageId }
  );

  const createMutation = trpc.annotations.create.useMutation({
    onSuccess: () => {
      if (imageId) {
        utils.annotations.getImageAnnotations.invalidate({ imageId });
      }
    },
  });

  const updateMutation = trpc.annotations.update.useMutation({
    onSuccess: () => {
      if (imageId) {
        utils.annotations.getImageAnnotations.invalidate({ imageId });
      }
    },
  });

  const deleteMutation = trpc.annotations.delete.useMutation({
    onSuccess: () => {
      if (imageId) {
        utils.annotations.getImageAnnotations.invalidate({ imageId });
      }
    },
  });

  const statsQuery = (dsId: number) =>
    trpc.annotations.getStats.useQuery({ datasetId: dsId });

  const createAnnotation = useCallback(
    async (data: {
      type: string;
      label: string;
      data: any;
      confidence?: number;
    }) => {
      return createMutation.mutateAsync({
        imageId: imageId || 0,
        datasetId: datasetId || 0,
        ...data,
      } as any);
    },
    [createMutation, imageId, datasetId]
  );

  const updateAnnotation = useCallback(
    async (annotationId: number, data: any) => {
      return updateMutation.mutateAsync({
        annotationId,
        imageId: imageId || 0,
        datasetId: datasetId || 0,
        ...data,
      } as any);
    },
    [updateMutation, imageId, datasetId]
  );

  const deleteAnnotation = useCallback(
    async (annotationId: number) => {
      return deleteMutation.mutateAsync({ annotationId });
    },
    [deleteMutation]
  );

  return {
    annotations: listQuery.data || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getStats: statsQuery,
  };
}
