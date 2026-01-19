import React, { createContext, useContext, useState } from 'react';

interface ContextiValue {
  data: any;
  setData: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const Contexti = createContext<ContextiValue | undefined>(undefined);

export function ContextiProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const value: ContextiValue = {
    data,
    setData,
    loading,
    setLoading,
  };

  return (
    <Contexti.Provider value={value}>
      {children}
    </Contexti.Provider>
  );
}

export function useContexti() {
  const context = useContext(Contexti);
  if (!context) {
    throw new Error('useContexti must be used within ContextiProvider');
  }
  return context;
}
