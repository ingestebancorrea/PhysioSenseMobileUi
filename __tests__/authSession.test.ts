import { toAccountRole } from '@/constants/roles';
import { UserRoleId, type UserToReturnDto } from '@/types/auth';
import type { StoredSession } from '@/services/auth/tokenStorage';

const buildUser = (role: UserRoleId): UserToReturnDto => ({
  id: 7,
  role,
  email: 'laura@correo.com',
  displayName: 'Laura Martinez',
  photoURL: 'https://cdn.physiosense.com/laura.png',
});

const buildSession = (role: UserRoleId): StoredSession => ({
  accessToken: 'jwt-firmado',
  user: buildUser(role),
});

/** Fresh module per test: the storage keeps an in-memory cache of the session. */
const loadStorage = (): typeof import('@/services/auth/tokenStorage') => {
  jest.resetModules();

  return require('@/services/auth/tokenStorage');
};

const loadKeychain = (): typeof import('react-native-keychain') =>
  require('react-native-keychain');

describe('toAccountRole', () => {
  it('maps the numeric role reported by the auth service', () => {
    expect(toAccountRole(UserRoleId.FISIOTERAPEUTA)).toBe('fisioterapeuta');
    expect(toAccountRole(UserRoleId.PACIENTE)).toBe('paciente');
  });

  it('refuses a missing or unknown id instead of guessing a stack', () => {
    expect(toAccountRole(null)).toBeNull();
    expect(toAccountRole(undefined)).toBeNull();
    expect(toAccountRole(0)).toBeNull();
    expect(toAccountRole(99)).toBeNull();
  });
});

describe('session storage', () => {
  it('restores the token and the profile saved on sign-in', async () => {
    const { persistSession, hydrateSession, getAccessToken } = loadStorage();
    const session = buildSession(UserRoleId.FISIOTERAPEUTA);

    await persistSession(session);

    const restored = await hydrateSession();

    expect(restored).toEqual(session);
    expect(await getAccessToken()).toBe('jwt-firmado');
  });

  it('keeps serving the token after the cache was hydrated', async () => {
    const { persistSession, getAccessToken } = loadStorage();

    await persistSession(buildSession(UserRoleId.PACIENTE));
    await getAccessToken();

    expect(await getAccessToken()).toBe('jwt-firmado');
  });

  it('reports no session after logout', async () => {
    const { persistSession, clearSession, hydrateSession, getAccessToken } =
      loadStorage();

    await persistSession(buildSession(UserRoleId.PACIENTE));
    await clearSession();

    expect(await hydrateSession()).toBeNull();
    expect(await getAccessToken()).toBeNull();
  });

  it('treats an unreadable entry as no session', async () => {
    const Keychain = loadKeychain();
    const { hydrateSession } = loadStorage();

    await Keychain.setGenericPassword('session', 'no-es-json');

    expect(await hydrateSession()).toBeNull();
  });

  it('rejects a session without token instead of calling the keychain', async () => {
    const { persistSession } = loadStorage();

    await expect(
      persistSession({ accessToken: '', user: buildUser(UserRoleId.PACIENTE) }),
    ).rejects.toThrow('el token está vacío');
  });
});