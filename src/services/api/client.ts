import { API_BASE_URL } from '@/config/env';

export class ApiClientError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
  }
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message =
      response.status === 401
        ? 'Sesión expirada. Inicia sesión nuevamente.'
        : `Error del servidor (${response.status})`;
    throw new ApiClientError(message, response.status);
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
  body?: unknown,
): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiClientError('No hay conexión con el servidor.');
  }

  return parseResponse<T>(response);
};

const requestMultipart = async <T>(method: string, path: string, formData: FormData): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      body: formData,
    });
  } catch {
    throw new ApiClientError('No hay conexión con el servidor.');
  }

  return parseResponse<T>(response);
};

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),

  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),

  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),

  postMultipart: <T>(path: string, formData: FormData) =>
    requestMultipart<T>('POST', path, formData),

  putMultipart: <T>(path: string, formData: FormData) =>
    requestMultipart<T>('PUT', path, formData),
};