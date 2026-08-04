// src/hooks/auth/useAuth.ts
import { useAppSelector } from '@/hooks/redux/useAppSelector';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  return { user, token, isAuthenticated, isLoading, error };
};