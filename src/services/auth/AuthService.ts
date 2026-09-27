import { AUTH_SERVICE_BASE_URL } from '@/config/env';
import { createApiClient } from '@/services/api/client';
import { emitSessionEstablished } from '@/services/auth/sessionEvents';
import { setAccessToken } from '@/services/auth/tokenStorage';
import type {
  LoginPasswordRequest,
  LoginResponse,
  RegisterPasswordResponse,
  SocialLoginRequest,
  SocialRegisterRequest,
} from '@/types/auth';

export {
  ACCESS_TOKEN_SERVICE,
  clearAccessToken,
  hydrateAccessToken,
} from './tokenStorage';

const authApi = createApiClient(AUTH_SERVICE_BASE_URL, {
  handleUnauthorized: false,
});

const establishSession = async (accessToken: string): Promise<void> => {
  await setAccessToken(accessToken);
  emitSessionEstablished();
};

export const loginWithPassword = async (
  credentials: LoginPasswordRequest,
): Promise<LoginResponse> => {
  const response = await authApi.post<LoginResponse>(
    '/auth/login-password',
    credentials,
  );

  await establishSession(response.access_token);

  return response;
};

export const loginWithProvider = async (
  credentials: SocialLoginRequest,
): Promise<LoginResponse> => {
  const response = await authApi.post<LoginResponse>(
    '/auth/login',
    credentials,
  );

  await establishSession(response.access_token);

  return response;
};

export const registerWithProvider = async (
  credentials: SocialRegisterRequest,
): Promise<RegisterPasswordResponse> => {
  const response = await authApi.post<RegisterPasswordResponse>(
    '/auth/register',
    credentials,
  );

  await establishSession(response.access_token);

  return response;
};
