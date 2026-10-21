import { toAccountRole } from '@/constants/roles';
import { AUTH_SERVICE_BASE_URL } from '@/config/env';
import { createApiClient } from '@/services/api/client';
import { emitSessionEstablished } from '@/services/auth/sessionEvents';
import { persistSession } from '@/services/auth/tokenStorage';
import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LoginPasswordRequest,
  LoginResponse,
  SocialLoginRequest,
  SocialRegisterRequest,
  SocialRegisterResponse,
  UserRoleId,
  UserToReturnDto,
} from '@/types/auth';
import type {
  RegisterPasswordRequest,
  RegisterPasswordResponse,
} from '@/types/auth/register-password';

export {
  ACCESS_TOKEN_SERVICE,
  clearSession,
  hydrateSession,
  type StoredSession,
} from './tokenStorage';

const authApi = createApiClient(AUTH_SERVICE_BASE_URL, {
  handleUnauthorized: false,
});

const MISSING_TOKEN_ERROR_MESSAGE =
  'El servicio de autenticación no devolvió un token de acceso.';

const MISSING_ROLE_ERROR_MESSAGE =
  'El servicio de autenticación no devolvió un rol válido.';

/**
 * Minimum contract an endpoint must meet to open a session: the token and the
 * numeric role. The profile fields are optional because the register endpoints
 * still answer with `AuthUserRecord`; they can become required once the service
 * returns `UserToReturnDto` on every entry point.
 */
interface SessionResponse {
  id: number;
  role: UserRoleId;
  access_token: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

const toSessionUser = (response: SessionResponse): UserToReturnDto => ({
  id: response.id,
  role: response.role,
  email: response.email ?? '',
  displayName: response.displayName ?? '',
  photoURL: response.photoURL ?? '',
});

/**
 * Single choke point for every entry point that starts a session (password
 * login, social login, social register).
 *
 * Token, profile and role are persisted together in one secure entry and only
 * then the session is announced, so a cold start restores exactly what this
 * call resolved. The role is validated before persisting: an unknown id cannot
 * be routed, and failing here is friendlier than landing the user in a stack
 * that does not belong to them.
 */
const establishSession = async (response: SessionResponse): Promise<void> => {
  const role = toAccountRole(response.role);

  if (typeof response.access_token !== 'string' || response.access_token.length === 0) {
    throw new Error(MISSING_TOKEN_ERROR_MESSAGE);
  }

  if (role === null) {
    throw new Error(MISSING_ROLE_ERROR_MESSAGE);
  }

  const session = { accessToken: response.access_token, user: toSessionUser(response) };

  await persistSession(session);
  emitSessionEstablished(session);
};

export const loginWithPassword = async (
  credentials: LoginPasswordRequest,
): Promise<LoginResponse> => {
  const response = await authApi.post<LoginResponse>(
    '/auth/login-password',
    credentials,
  );

  await establishSession(response);

  return response;
};

export const loginWithProvider = async (
  credentials: SocialLoginRequest,
): Promise<LoginResponse> => {
  const response = await authApi.post<LoginResponse>(
    '/auth/login',
    credentials,
  );

  await establishSession(response);

  return response;
};

export const requestPasswordReset = async (
  credentials: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  const response = await authApi.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    credentials,
  );

  return response;
};

export const registerWithProvider = async (
  credentials: SocialRegisterRequest,
): Promise<SocialRegisterResponse> => {
  const response = await authApi.post<SocialRegisterResponse>(
    '/auth/register',
    credentials,
  );

  await establishSession(response);

  return response;
};

/**
 * `POST /auth/register-password`.
 *
 * The session is NOT opened here on purpose. This endpoint answers with the
 * created user row spread at the root (`username`, `full_name`, `image_url`)
 * instead of the `UserToReturnDto` the other entry points return, and opening
 * the session right away would swap the whole navigation tree for the private
 * one, unmounting the registration flow before the user sees the welcome
 * screen. The welcome screen calls `openSessionWithRegistration` instead.
 */
export const registerWithPassword = async (
  data: RegisterPasswordRequest,
): Promise<RegisterPasswordResponse> =>
  authApi.post<RegisterPasswordResponse>('/auth/register-password', data);

/**
 * Renames the identity of a registration answer into the session shape.
 *
 * Without this the user would finish registration with a blank name and avatar
 * in the whole app, because the created user row uses the column names.
 */
const toSessionResponse = (
  registration: RegisterPasswordResponse,
): SessionResponse => ({
  id: registration.id,
  role: registration.role,
  access_token: registration.access_token,
  email: registration.username,
  displayName: registration.full_name,
  photoURL: registration.image_url ?? '',
});

/**
 * Opens the session with the token the registration already returned, so the
 * user lands on the app instead of having to type the credentials again.
 */
export const openSessionWithRegistration = async (
  registration: RegisterPasswordResponse,
): Promise<void> => {
  await establishSession(toSessionResponse(registration));
};