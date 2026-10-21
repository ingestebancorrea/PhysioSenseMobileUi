import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppToast,
} from '@/components/common/toast/AppToast';
import type { AppToastOptions } from '@/types/toast';

interface ToastContextValue {
  showToast: (options: AppToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastState = AppToastOptions & { id: number };

/**
 * Avisos flotantes de toda la app.
 *
 * Vive por encima del `NavigationContainer` a propósito: el aviso tiene que
 * sobrevivir al cambio de pantalla (por ejemplo, al volver del formulario de
 * ejercicios al listado, que recarga con un GET nuevo).
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const counter = useRef(0);

  const showToast = useCallback((options: AppToastOptions) => {
    counter.current += 1;
    setToast({ ...options, id: counter.current });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({ showToast, hideToast }),
    [showToast, hideToast],
  );

  return (
    <ToastContext.Provider value={value}>
      <View style={styles.root}>
        {children}

        <AppToast
          visible={toast !== null}
          id={toast?.id}
          message={toast?.message ?? ''}
          title={toast?.title}
          variant={toast?.variant}
          duration={toast?.duration}
          onHide={hideToast}
        />
      </View>
    </ToastContext.Provider>
  );
};

/**
 * Muestra avisos flotantes desde cualquier pantalla.
 *
 * El error se sigue reportando con el modal de alerta; esto es para las
 * confirmaciones.
 */
export const useAppToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useAppToast debe usarse dentro de ToastProvider.');
  }

  return context;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
