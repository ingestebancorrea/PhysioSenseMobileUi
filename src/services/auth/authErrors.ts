import { ApiClientError } from '@/services/api/client';
import { PASSWORD_MIN_LENGTH } from '@/utils/validation/registrationValidation';

const LOG_PREFIX = '[auth-error]';

const HTTP_UNAUTHORIZED = 401;
const HTTP_BAD_REQUEST = 400;

const GENERIC_MESSAGE =
  'No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo.';

const INVALID_CREDENTIALS_MESSAGE =
  'Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.';

const CREDENTIALS_REQUIRED_MESSAGE =
  'Escribe tu correo y tu contraseña para continuar.';

const PASSWORD_TOO_SHORT_MESSAGE = `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;

const INVALID_REQUEST_MESSAGE =
  'Revisa los datos que escribiste e inténtalo de nuevo.';

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
 *
 * Every sentence a login screen can show lives here too, next to the rule that
 * decides when it applies, so a screen only reads: "if this error, show this
 * message".
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
 * Whether the auth service refused the payload itself (a 400). What comes back
 * with it is the validation text of the backend, written in English and aimed at
 * whoever reads the logs ("password must be longer than or equal to 6
 * characters"), so it is logged and never shown.
 */
const isRejectedPayload = (error: unknown): boolean =>
  error instanceof ApiClientError && error.status === HTTP_BAD_REQUEST;

/**
 * Returns copy fit for a modal.
 *
 * An `Error` that carries a message wins, because `ApiClientError` already
 * carries what the auth service said ("Credenciales inválidas") or what went
 * wrong in transit ("No hay conexión con el servidor."). Anything else - a bare
 * object, a string, `null` - has nothing usable in it, and stringifying those
 * yields literal `[object Object]`, so it falls back to the generic message.
 *
 * A 400 is the exception: its message is the validation text of the backend, in
 * English and phrased for a developer, so it is answered with copy of our own.
 */
export const describeAuthError = (error: unknown): string => {
  logFailure(error);

  if (isRejectedPayload(error)) {
    return INVALID_REQUEST_MESSAGE;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return GENERIC_MESSAGE;
};

/**
 * Copy for the email and password form.
 *
 * A 401 from the auth service means one thing only there - the pair does not
 * open a session - so it gets wording that says it. Everything else (no
 * network, an SDK that gave up, a 500) goes through `describeAuthError`, which
 * explains what actually happened instead of blaming the password. Social
 * sign-in should not call this: there "bad password" would be wrong.
 */
export const describeCredentialError = (error: unknown): string =>
  isUnauthorized(error)
    ? INVALID_CREDENTIALS_MESSAGE
    : describeAuthError(error);

export type LoginCredentials = {
  username: string;
  password: string;
};

/**
 * Whether the login form can be sent, returning the sentence to show when it
 * cannot. `undefined` means "send it".
 *
 * The email is compared trimmed, because a copy-pasted address usually carries a
 * trailing space or newline and the request would fail for a reason nobody can
 * see. The password is not trimmed: a password is exactly what was typed.
 *
 * The minimum length repeats the rule the auth service enforces, for the same
 * reason registration does: without it the answer arrives as a 400 written in
 * English, and the person reading it learns nothing about their own password.
 */
export const validateLoginCredentials = ({
  username,
  password,
}: LoginCredentials): string | undefined => {
  if (username.trim().length === 0 || password.length === 0) {
    return CREDENTIALS_REQUIRED_MESSAGE;
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return PASSWORD_TOO_SHORT_MESSAGE;
  }

  return undefined;
};
