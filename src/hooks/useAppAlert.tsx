import { useCallback, useMemo, useState } from 'react';

import {
  AppAlertModal,
  type AlertVariant,
} from '@/components/common/alertModal/AppAlertModal';

export interface AppAlertOptions {
  title: string;
  message?: string;
  variant?: AlertVariant;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
}

interface AlertState {
  visible: boolean;
  options: AppAlertOptions;
}

const EMPTY: AppAlertOptions = {
  title: '',
  message: undefined,
  confirmText: 'Aceptar',
};

export const useAppAlert = () => {
  const [state, setState] = useState<AlertState>({
    visible: false,
    options: EMPTY,
  });

  const showAlert = useCallback((options: AppAlertOptions) => {
    setState({ visible: true, options: { ...EMPTY, ...options } });
  }, []);

  const hideAlert = useCallback(() => {
    setState(prev => ({ ...prev, visible: false }));
  }, []);

  const alertModal = useMemo(
    () => (
      <AppAlertModal
        visible={state.visible}
        title={state.options.title}
        message={state.options.message}
        variant={state.options.variant}
        confirmText={state.options.confirmText}
        cancelText={state.options.cancelText}
        onConfirm={() => {
          state.options.onConfirm?.();
          hideAlert();
        }}
        onCancel={() => {
          state.options.onCancel?.();
          hideAlert();
        }}
      />
    ),
    [state, hideAlert],
  );

  return { alertModal, showAlert, hideAlert };
};