import React, { createContext, useCallback, useContext, useMemo } from 'react';

type NavigateFn = (tab: string) => void;

interface PrivateNavigationContextValue {
  navigate: NavigateFn;
}

const PrivateNavigationContext = createContext<PrivateNavigationContextValue | undefined>(
  undefined,
);

interface ProviderProps {
  onNavigate: NavigateFn;
  children: React.ReactNode;
}

export const PrivateNavigationProvider: React.FC<ProviderProps> = ({
  onNavigate,
  children,
}) => {
  const navigate = useCallback(
    (tab: string) => onNavigate(tab),
    [onNavigate],
  );

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <PrivateNavigationContext.Provider value={value}>
      {children}
    </PrivateNavigationContext.Provider>
  );
};

export const useNavigate = (): NavigateFn => {
  const ctx = useContext(PrivateNavigationContext);

  if (!ctx) {
    throw new Error('useNavigate debe usarse dentro de un PrivateNavigationProvider');
  }

  return ctx.navigate;
};
