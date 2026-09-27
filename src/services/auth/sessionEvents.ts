export type SessionListener = () => void;

const establishedListeners = new Set<SessionListener>();

const expiredListeners = new Set<SessionListener>();

export const onSessionEstablished = (listener: SessionListener): (() => void) => {
  establishedListeners.add(listener);

  return () => {
    establishedListeners.delete(listener);
  };
};

export const emitSessionEstablished = (): void => {
  establishedListeners.forEach((listener) => listener());
};

export const onSessionExpired = (listener: SessionListener): (() => void) => {
  expiredListeners.add(listener);

  return () => {
    expiredListeners.delete(listener);
  };
};

export const emitSessionExpired = (): void => {
  expiredListeners.forEach((listener) => listener());
};
