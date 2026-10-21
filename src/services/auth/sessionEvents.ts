import type { StoredSession } from './tokenStorage';

export type SessionEstablishedListener = (session: StoredSession) => void;

export type SessionListener = () => void;

const establishedListeners = new Set<SessionEstablishedListener>();

const expiredListeners = new Set<SessionListener>();

export const onSessionEstablished = (
  listener: SessionEstablishedListener,
): (() => void) => {
  establishedListeners.add(listener);

  return () => {
    establishedListeners.delete(listener);
  };
};

/**
 * Carries the persisted session so the UI never has to read secure storage
 * again right after a sign-in, and the role always comes from the same payload
 * that was stored.
 */
export const emitSessionEstablished = (session: StoredSession): void => {
  establishedListeners.forEach(listener => listener(session));
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
