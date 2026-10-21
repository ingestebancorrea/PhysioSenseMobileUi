import { ApiClientError } from '@/services/api/client';

/**
 * Mensaje de error para las alertas.
 *
 * Si la API contestó con un status HTTP se muestra también, porque
 * "Forbidden resource" sin el 403 al lado no dice nada sobre por qué falló
 * la petición.
 */
export const describeError = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    return error.status
      ? `${error.message} (HTTP ${error.status})`
      : error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado.';
};
