import { ApiClientError } from '@/services/api/client';
import {
  describeAuthError,
  describeCredentialError,
  isUnauthorized,
  validateLoginCredentials,
} from '@/services/auth/authErrors';

/** Every failure is logged on purpose; the noise is not interesting to read. */
let warn: jest.SpyInstance;

beforeEach(() => {
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warn.mockRestore();
});

/**
 * The auth service really answers a wrong password with
 * `{"statusCode":401,"message":"Credenciales inválidas","error":"Unauthorized"}`,
 * so these cases are pinned to that shape rather than invented ones.
 */
describe('describeAuthError', () => {
  it('shows what the auth service said and nothing else', () => {
    const message = describeAuthError(
      new ApiClientError('Credenciales inválidas', 401),
    );

    expect(message).toBe('Credenciales inválidas');
  });

  it('never leaks the class name into the modal', () => {
    const message = describeAuthError(
      new ApiClientError('No hay conexión con el servidor.'),
    );

    expect(message).not.toContain('ApiClientError');
    expect(message).not.toContain('Error');
  });

  it('never leaks a platform code from the social SDKs', () => {
    const sdkError = Object.assign(new Error('Login failed.'), { code: 190 });

    expect(describeAuthError(sdkError)).toBe('Login failed.');
  });

  it('falls back to the generic message when there is nothing usable', () => {
    const fallback =
      'No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo.';

    expect(describeAuthError(null)).toBe(fallback);
    expect(describeAuthError(undefined)).toBe(fallback);
    expect(describeAuthError(new Error(''))).toBe(fallback);
    expect(describeAuthError(new Error('   '))).toBe(fallback);
  });

  it('never renders [object Object] for a non-Error failure', () => {
    const message = describeAuthError({ code: 7500 });

    expect(message).not.toContain('[object Object]');
  });

  it('never shows the validation text of the backend, which is in English', () => {
    const backend = 'password must be longer than or equal to 6 characters';

    const message = describeAuthError(new ApiClientError(backend, 400));

    expect(message).not.toContain('password');
    expect(message).not.toContain('characters');
    expect(message).toBe(
      'Revisa los datos que escribiste e inténtalo de nuevo.',
    );
  });

  it('logs the rejected payload so the cause is still traceable', () => {
    describeAuthError(new ApiClientError('email must be an email', 400));

    expect(warn).toHaveBeenCalled();
  });
});

describe('isUnauthorized', () => {
  it('is true only for a 401 answered by the auth service', () => {
    expect(
      isUnauthorized(new ApiClientError('Credenciales inválidas', 401)),
    ).toBe(true);
    expect(
      isUnauthorized(new ApiClientError('Error del servidor (500)', 500)),
    ).toBe(false);
  });

  it('is false when the request never got a response', () => {
    expect(
      isUnauthorized(new ApiClientError('No hay conexión con el servidor.')),
    ).toBe(false);
  });

  it('is false for failures raised before the network', () => {
    expect(
      isUnauthorized(new Error('Google Play Services no está disponible')),
    ).toBe(false);
    expect(isUnauthorized(null)).toBe(false);
  });
});

describe('describeCredentialError', () => {
  it('blames the credentials on a 401 instead of echoing the server wording', () => {
    expect(
      describeCredentialError(new ApiClientError('Credenciales inválidas', 401)),
    ).toBe('Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.');
  });

  it('does not blame the password when the request never left the device', () => {
    expect(
      describeCredentialError(
        new ApiClientError('No hay conexión con el servidor.'),
      ),
    ).toBe('No hay conexión con el servidor.');
  });

  it('does not blame the password on a server error', () => {
    const message = describeCredentialError(
      new ApiClientError('Error del servidor (500)', 500),
    );

    expect(message).toBe('Error del servidor (500)');
    expect(message).not.toMatch(/contraseña incorrectos/i);
  });
});

describe('validateLoginCredentials', () => {
  it('asks for both fields when the form is empty', () => {
    const expected =
      'Escribe tu correo y tu contraseña para continuar.';

    expect(validateLoginCredentials({ username: '', password: '' })).toBe(
      expected,
    );
  });

  it('asks again when only the password is missing', () => {
    expect(
      validateLoginCredentials({ username: 'laura@correo.com', password: '' }),
    ).toBeTruthy();
  });

  it('treats an email made of spaces as missing', () => {
    expect(
      validateLoginCredentials({ username: '   ', password: 'Rehab2026' }),
    ).toBeTruthy();
  });

  it('accepts a password made of spaces, because it is what was typed', () => {
    expect(
      validateLoginCredentials({ username: 'laura@correo.com', password: '      ' }),
    ).toBeUndefined();
  });

  it('lets a complete form through even with padding around the email', () => {
    expect(
      validateLoginCredentials({
        username: '  laura@correo.com  ',
        password: 'Rehab2026',
      }),
    ).toBeUndefined();
  });

  it('explains a short password before asking the server', () => {
    expect(
      validateLoginCredentials({
        username: 'laura@correo.com',
        password: 'Re1',
      }),
    ).toBe('La contraseña debe tener al menos 6 caracteres.');
  });

  it('accepts a password that reaches the minimum length', () => {
    expect(
      validateLoginCredentials({
        username: 'laura@correo.com',
        password: 'R1b2c3',
      }),
    ).toBeUndefined();
  });
});
