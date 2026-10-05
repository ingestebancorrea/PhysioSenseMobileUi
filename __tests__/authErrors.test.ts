import { ApiClientError } from '@/services/api/client';
import { describeAuthError, isUnauthorized } from '@/services/auth/authErrors';

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
