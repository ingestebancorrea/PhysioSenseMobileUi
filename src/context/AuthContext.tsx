import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  clearAccessToken,
  hydrateAccessToken,
  loginWithPassword,
  loginWithProvider as loginWithProviderRequest,
  registerWithProvider as registerWithProviderRequest,
} from '@/services/auth/AuthService';
import {
  onSessionEstablished,
  onSessionExpired,
} from '@/services/auth/sessionEvents';
import { USER_ROLE_BY_ALIAS } from '@/constants/roles';
import type {
  LoginPasswordRequest,
  SocialLoginRequest,
  SocialRegisterRequest,
  UserAccountRole,
} from '@/types/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isSessionExpired: boolean;
  role: UserAccountRole | null;
  pendingRole: UserAccountRole | null;
  login: (credentials: LoginPasswordRequest) => Promise<void>;
  loginWithProvider: (credentials: SocialLoginRequest) => Promise<void>;
  registerWithProvider: (credentials: SocialRegisterRequest) => Promise<void>;
  setPendingRole: (role?: UserAccountRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_ROLE: UserAccountRole = 'paciente';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [role, setRole] = useState<UserAccountRole | null>(null);
  const [pendingRole, setPendingRoleState] = useState<UserAccountRole | null>(
    null,
  );

  const pendingRoleRef = useRef<UserAccountRole | null>(null);

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      const token = await hydrateAccessToken();

      if (!isActive) {
        return;
      }

      setIsAuthenticated(token !== null);
      setIsBootstrapping(false);
    };

    bootstrap();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(
    () =>
      onSessionEstablished(() => {
        setRole(pendingRoleRef.current ?? DEFAULT_ROLE);
        setIsSessionExpired(false);
        setIsAuthenticated(true);
      }),
    [],
  );

  useEffect(
    () =>
      onSessionExpired(() => {
        setIsAuthenticated(false);
        setRole(null);
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
      pendingRoleRef.current = USER_ROLE_BY_ALIAS[credentials.alias_role];
      setPendingRoleState(pendingRoleRef.current);

      await registerWithProviderRequest(credentials);
    },
    [],
  );

  const setPendingRole = useCallback((selectedRole?: UserAccountRole) => {
    const nextRole = selectedRole ?? DEFAULT_ROLE;

    pendingRoleRef.current = nextRole;
    setPendingRoleState(nextRole);
  }, []);

  const logout = useCallback(async () => {
    await clearAccessToken();
    setIsAuthenticated(false);
    setRole(null);
    setIsSessionExpired(false);
    pendingRoleRef.current = null;
    setPendingRoleState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isBootstrapping,
      isSessionExpired,
      role,
      pendingRole,
      login,
      loginWithProvider,
      registerWithProvider,
      setPendingRole,
      logout,
    }),
    [
      isAuthenticated,
      isBootstrapping,
      isSessionExpired,
      role,
      pendingRole,
      login,
      loginWithProvider,
      registerWithProvider,
      setPendingRole,
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
