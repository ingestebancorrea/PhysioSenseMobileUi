import React, { createContext, useContext, useMemo, useState } from 'react';

interface DrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<DrawerContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};

export const useDrawer = (): DrawerContextValue => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawer debe usarse dentro de un DrawerProvider');
  }

  return context;
};
