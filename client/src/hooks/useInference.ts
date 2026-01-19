import { trpc } from '@/lib/trpc';
import { useCallback } from 'react';

export function useInference(modelId?: number) {
  const utils = trpc.useUtils();

  const historyQuery = trpc.inference.getHistory.useQuery(
    { modelId: modelId || 0, limit: 50 },
    { enabled: !!modelId }
  );

  const predictMutation = trpc.inference.predict.useMutation({
    onSuccess: () => {
      if (modelId) {
        utils.inference.getHistory.invalidate({ modelId, limit: 50 });
      }
    },
  });

  const statsQuery = (mId: number) =>
    trpc.inference.getStats.useQuery({ modelId: mId });

  const predict = useCallback(
    async (data: {
      imageUrl?: string;
      imageBase64?: string;
      confidenceThreshold?: number;
    }) => {
      return predictMutation.mutateAsync({
        modelId: modelId || 0,
        ...data,
      } as any);
    },
    [predictMutation, modelId]
  );

  return {
    predictions: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    error: historyQuery.error,
    predict,
    getStats: statsQuery,
    isPredicting: predictMutation.isPending,
  };
}
