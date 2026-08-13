import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (user: string, password: string) => boolean;
  registerAccount: () => void;
  logout: () => void;
}

const MOCK_CREDENTIALS = {
  user: 'admin',
  password: '123',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: (user: string, password: string): boolean => {
        const valid =
          user === MOCK_CREDENTIALS.user &&
          password === MOCK_CREDENTIALS.password;

        if (valid) {
          setIsAuthenticated(true);
        }

        return valid;
      },
      registerAccount: () => {
        setIsAuthenticated(true);
      },
      logout: () => {
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
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
