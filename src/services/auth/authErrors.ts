import { ApiClientError } from '@/services/api/client';

const LOG_PREFIX = '[auth-error]';

const HTTP_UNAUTHORIZED = 401;

const GENERIC_MESSAGE =
  'No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo.';

/**
 * Sign-in runs through three very different layers (the Google/Facebook SDKs, the
 * secure storage and the HTTP client) and each one throws its own error type. This
 * module is the single place where all of that becomes a sentence a person can
 * act on.
 *
 * The rule it enforces: a modal shows the problem, never the plumbing. Class
 * names (`ApiClientError`), platform codes (`code: 190`) and `[object Object]`
 * belong in the console, where they help whoever is debugging, and not in front
 * of someone who mistyped their password.
 */

/** Logs the raw failure for debugging without ever putting it in front of a user. */
const logFailure = (error: unknown): void => {
  if (error instanceof ApiClientError) {
    console.warn(
      `${LOG_PREFIX} petición fallida (${error.status ?? 'sin respuesta'})`,
      error.message,
    );

    return;
  }

  console.warn(`${LOG_PREFIX} fallo inesperado`, error);
};

/**
 * Whether the auth service rejected who the user claims to be. Kept separate from
 * the copy so the caller that knows the form can pick the right wording: "bad
 * password" is correct on a password form and wrong on a social one.
 */
export const isUnauthorized = (error: unknown): boolean =>
  error instanceof ApiClientError && error.status === HTTP_UNAUTHORIZED;

/**
 * Returns copy fit for a modal.
 *
 * An `Error` that carries a message wins, because `ApiClientError` already
 * carries what the auth service said ("Credenciales inválidas") or what went
 * wrong in transit ("No hay conexión con el servidor."). Anything else - a bare
 * object, a string, `null` - has nothing usable in it, and stringifying those
 * yields literal `[object Object]`, so it falls back to the generic message.
 */
export const describeAuthError = (error: unknown): string => {
  logFailure(error);

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return GENERIC_MESSAGE;
};
