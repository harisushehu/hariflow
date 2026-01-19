import { useState, useCallback, useEffect } from 'react';

interface HookiState {
  data: any;
  loading: boolean;
  error: Error | null;
}

export function useHooki(initialData?: any) {
  const [state, setState] = useState<HookiState>({
    data: initialData || null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (input?: any) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));
      setState((prev) => ({
        ...prev,
        data: input || { processed: true },
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error'),
        loading: false,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData || null,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return { ...state, execute, reset };
}

export default useHooki;
