import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import type {
  MockAccount,
  UserAccountRole,
} from '@/types/auth';

const MOCK_ACCOUNTS: Record<UserAccountRole, MockAccount> = {
  fisioterapeuta: {
    user: 'fisioterapeuta',
    password: 'fisio123',
  },
  paciente: {
    user: 'paciente',
    password: 'paciente123',
  },
};

interface AuthContextValue {
  isAuthenticated: boolean;
  role: UserAccountRole | null;
  login: (user: string, password: string) => boolean;
  registerAccount: (role?: UserAccountRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserAccountRole | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      role,
      login: (user: string, password: string): boolean => {
        const accounts = Object.entries(MOCK_ACCOUNTS) as [
          UserAccountRole,
          MockAccount,
        ][];
        const matched = accounts.find(
          ([, account]) =>
            account.user === user && account.password === password,
        );

        if (!matched) {
          return false;
        }

        setRole(matched[0]);
        setIsAuthenticated(true);

        return true;
      },
      registerAccount: (registeredRole: UserAccountRole = 'paciente') => {
        setRole(registeredRole);
        setIsAuthenticated(true);
      },
      logout: () => {
        setIsAuthenticated(false);
        setRole(null);
      },
    }),
    [isAuthenticated, role],
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
