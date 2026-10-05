import React, { createContext, useContext, useMemo, useState } from 'react';

interface PrivateTabBarContextValue {
  isHidden: boolean;
  hide: () => void;
  show: () => void;
}

const PrivateTabBarContext = createContext<PrivateTabBarContextValue | undefined>(
  undefined,
);

export const PrivateTabBarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const value = useMemo<PrivateTabBarContextValue>(
    () => ({
      isHidden,
      hide: () => setIsHidden(true),
      show: () => setIsHidden(false),
    }),
    [isHidden],
  );

  return (
    <PrivateTabBarContext.Provider value={value}>
      {children}
    </PrivateTabBarContext.Provider>
  );
};

export const usePrivateTabBar = (): PrivateTabBarContextValue => {
  const context = useContext(PrivateTabBarContext);

  if (!context) {
    throw new Error(
      'usePrivateTabBar debe usarse dentro de un PrivateTabBarProvider',
    );
  }

  return context;
};
