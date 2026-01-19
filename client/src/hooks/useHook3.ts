import { useState, useCallback } from 'react';

export function useHook3() {
  const [state, setState] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (data: any) => {
    setLoading(true);
    try {
      // Hook 3 logic
      setState(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, loading, execute };
}
