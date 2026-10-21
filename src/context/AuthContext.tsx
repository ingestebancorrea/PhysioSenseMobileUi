import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { toAccountRole } from '@/constants/roles';
import {
  clearSession,
  hydrateSession,
  loginWithPassword,
  loginWithProvider as loginWithProviderRequest,
  registerWithProvider as registerWithProviderRequest,
  type StoredSession,
} from '@/services/auth/AuthService';
import {
  onSessionEstablished,
  onSessionExpired,
} from '@/services/auth/sessionEvents';
import type {
  LoginPasswordRequest,
  SocialLoginRequest,
  SocialRegisterRequest,
  UserAccountRole,
  UserToReturnDto,
} from '@/types/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isSessionExpired: boolean;
  /** Profile returned by the auth service on the last successful sign-in. */
  user: UserToReturnDto | null;
  /** Role the navigator branches on. Never invented: `null` until the service answers. */
  role: UserAccountRole | null;
  login: (credentials: LoginPasswordRequest) => Promise<void>;
  loginWithProvider: (credentials: SocialLoginRequest) => Promise<void>;
  registerWithProvider: (credentials: SocialRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [user, setUser] = useState<UserToReturnDto | null>(null);
  const [role, setRole] = useState<UserAccountRole | null>(null);

  /**
   * Token, profile and role are restored together, so the app never keeps a
   * session whose role it cannot prove.
   */
  const applySession = (session: StoredSession | null): void => {
    setUser(session?.user ?? null);
    setRole(session === null ? null : toAccountRole(session.user.role));
  };

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      const session = await hydrateSession();

      if (!isActive) {
        return;
      }

      applySession(session);
      setIsAuthenticated(session !== null);
      setIsBootstrapping(false);
    };

    bootstrap();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(
    () =>
      onSessionEstablished(session => {
        applySession(session);
        setIsSessionExpired(false);
        setIsAuthenticated(true);
      }),
    [],
  );

  useEffect(
    () =>
      onSessionExpired(() => {
        setIsAuthenticated(false);
        applySession(null);
        setIsSessionExpired(true);
      }),
    [],
  );

  const login = useCallback(async (credentials: LoginPasswordRequest) => {
    await loginWithPassword(credentials);
  }, []);

  const loginWithProvider = useCallback(
    async (credentials: SocialLoginRequest) => {
      await loginWithProviderRequest(credentials);
    },
    [],
  );

  const registerWithProvider = useCallback(
    async (credentials: SocialRegisterRequest) => {
      await registerWithProviderRequest(credentials);
    },
    [],
  );

  const logout = useCallback(async () => {
    await clearSession();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    setIsSessionExpired(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isBootstrapping,
      isSessionExpired,
      user,
      role,
      login,
      loginWithProvider,
      registerWithProvider,
      logout,
    }),
    [
      isAuthenticated,
      isBootstrapping,
      isSessionExpired,
      user,
      role,
      login,
      loginWithProvider,
      registerWithProvider,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};