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

/**
 * Cuerpo de error del core: `{ statusCode, message, error }`. Se acepta
 * también un envoltorio `data` porque algunos endpoints envuelven la carga.
 */
type ErrorBody = ApiErrorResponse & {
  data?: { message?: string | string[] };
};

/**
 * Extrae el mensaje de error del cuerpo que devuelve el backend.
 *
 * El core responde siempre `{ statusCode, message, error }` con `message` como
 * string o como array (validación). También se acepta un envoltorio `data` y
 * el caso de un cuerpo que no es JSON (HTML de un proxy), que se devuelve
 * recortado para que al menos se vea qué contestó el servidor.
 */
const readErrorMessage = (raw: string, status: number): string => {
  const fallback = `Error del servidor (${status})`;

  if (!raw.trim()) {
    return fallback;
  }

  let body: ErrorBody | null = null;

  try {
    body = JSON.parse(raw) as ErrorBody;
  } catch {
    return raw.trim().slice(0, 200) || fallback;
  }

  const message = body?.message ?? body?.data?.message;

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (Array.isArray(message) && message.length > 0) {
    return message.join('\n');
  }

  if (typeof body?.error === 'string' && body.error.trim()) {
    return body.error;
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

/**
 * Lee el cuerpo de la respuesta como texto.
 *
 * Se usa `text()` para poder parsear el mismo cuerpo, pero algunos entornos
 * (y los mocks de los tests) sólo exponen `json()`.
 */
const readRawBody = async (response: Response): Promise<string> => {
  if (typeof response.text === 'function') {
    return response.text();
  }

  const data = await response.json?.();

  return data === undefined ? '' : JSON.stringify(data);
};

const parseResponse = async <T>(
  response: Response,
  raw: string,
  handleUnauthorized: boolean,
): Promise<T> => {
  if (!response.ok) {
    if (handleUnauthorized && response.status === UNAUTHORIZED_STATUS) {
      await expireSession();
    }

    throw new ApiClientError(
      readErrorMessage(raw, response.status),
      response.status,
    );
  }

  if (!raw.trim()) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    throw new ApiClientError(
      `La API respondió con un contenido inesperado (${
        contentType || 'sin content-type'
      }).`,
      response.status,
    );
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new ApiClientError(
      'La API respondió un JSON inválido.',
      response.status,
    );
  }
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

  const raw = await readRawBody(response);

  return parseResponse<T>(response, raw, handleUnauthorized);
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

  const raw = await readRawBody(response);

  return parseResponse<T>(response, raw, handleUnauthorized);
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

    patch: <T>(path: string, body?: unknown) =>
      request<T>('PATCH', path, body, baseUrl, handleUnauthorized),

    postMultipart: <T>(path: string, formData: FormData) =>
      requestMultipart<T>('POST', path, formData, baseUrl, handleUnauthorized),

    putMultipart: <T>(path: string, formData: FormData) =>
      requestMultipart<T>('PUT', path, formData, baseUrl, handleUnauthorized),
  };
};

export const apiClient = createApiClient(API_BASE_URL);
