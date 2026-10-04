import { API_BASE_URL } from '@/config/env';
import { emitSessionExpired } from '@/services/auth/sessionEvents';
import { clearSession, getAccessToken } from '@/services/auth/tokenStorage';
import type { ApiErrorResponse } from '@/types/auth';

const UNAUTHORIZED_STATUS = 401;

const NETWORK_ERROR_MESSAGE = 'No hay conexión con el servidor.';

export interface ApiClientOptions {
  handleUnauthorized?: boolean;
}

export class ApiClientError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

const readErrorMessage = async (response: Response): Promise<string> => {
  const fallback = `Error del servidor (${response.status})`;
  const body = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | null;
  const message = body?.message;

  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join('\n');
  }

  return fallback;
};

const buildHeaders = async (
  hasJsonBody: boolean,
): Promise<Record<string, string>> => {
  const token = await getAccessToken();
  const headers: Record<string, string> = {};

  if (hasJsonBody) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const expireSession = async (): Promise<void> => {
  const hadToken = (await getAccessToken()) !== null;

  await clearSession();

  if (hadToken) {
    emitSessionExpired();
  }
};

const parseResponse = async <T>(
  response: Response,
  handleUnauthorized: boolean,
): Promise<T> => {
  if (!response.ok) {
    if (handleUnauthorized && response.status === UNAUTHORIZED_STATUS) {
      await expireSession();
    }

    throw new ApiClientError(await readErrorMessage(response), response.status);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  return undefined as T;
};

const request = async <T>(
  method: string,
  path: string,
  body: unknown,
  baseUrl: string,
  handleUnauthorized: boolean,
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: await buildHeaders(body !== undefined),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiClientError(NETWORK_ERROR_MESSAGE);
  }

  return parseResponse<T>(response, handleUnauthorized);
};

const requestMultipart = async <T>(
  method: string,
  path: string,
  formData: FormData,
  baseUrl: string,
  handleUnauthorized: boolean,
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: await buildHeaders(false),
      body: formData,
    });
  } catch {
    throw new ApiClientError(NETWORK_ERROR_MESSAGE);
  }

  return parseResponse<T>(response, handleUnauthorized);
};

export const createApiClient = (
  baseUrl: string,
  options: ApiClientOptions = {},
) => {
  const handleUnauthorized = options.handleUnauthorized ?? true;

  return {
    get: <T>(path: string) =>
      request<T>('GET', path, undefined, baseUrl, handleUnauthorized),

    post: <T>(path: string, body: unknown) =>
      request<T>('POST', path, body, baseUrl, handleUnauthorized),

    put: <T>(path: string, body: unknown) =>
      request<T>('PUT', path, body, baseUrl, handleUnauthorized),

    postMultipart: <T>(path: string, formData: FormData) =>
      requestMultipart<T>('POST', path, formData, baseUrl, handleUnauthorized),

    putMultipart: <T>(path: string, formData: FormData) =>
      requestMultipart<T>('PUT', path, formData, baseUrl, handleUnauthorized),
  };
};

export const apiClient = createApiClient(API_BASE_URL);
