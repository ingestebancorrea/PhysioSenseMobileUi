import * as Keychain from 'react-native-keychain';

import type { UserToReturnDto } from '@/types/auth';

export const ACCESS_TOKEN_SERVICE = 'com.physiosense.accessToken';

/**
 * Keychain only offers a username/password pair, so the username slot holds a
 * stable label and the whole session travels as the password. Keeping token and
 * profile in a single entry is what makes a cold start able to restore the role:
 * two entries could disagree and route the user to the wrong stack.
 */
const SESSION_ACCOUNT = 'session';

const SET_OPTIONS: Keychain.SetOptions = {
  service: ACCESS_TOKEN_SERVICE,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
  storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
};

export interface StoredSession {
  accessToken: string;
  user: UserToReturnDto;
}

const EMPTY_TOKEN_ERROR_MESSAGE =
  'No se pudo guardar la sesión: el token está vacío.';

const EMPTY_USER_ERROR_MESSAGE =
  'No se pudo guardar la sesión: el usuario está vacío.';

/**
 * Guards the values the keychain declares as non-null on Android. A `null`
 * there does not fail with the app message but with an opaque
 * `Parameter specified as non-null is null`.
 */
const assertStorable = (session: StoredSession): void => {
  if (typeof session.accessToken !== 'string' || session.accessToken.length === 0) {
    throw new Error(EMPTY_TOKEN_ERROR_MESSAGE);
  }

  if (session.user === null || session.user === undefined) {
    throw new Error(EMPTY_USER_ERROR_MESSAGE);
  }
};

/**
 * Anything already stored is untrusted: a schema change, a partial write or a
 * hand-edited entry would otherwise crash the boot with an undefined role. An
 * unreadable entry is treated as "no session" so the user simply signs in again.
 */
const parseSession = (payload: string): StoredSession | null => {
  try {
    const parsed: unknown = JSON.parse(payload);

    if (parsed === null || typeof parsed !== 'object') {
      return null;
    }

    const candidate = parsed as Partial<StoredSession>;

    if (
      typeof candidate.accessToken !== 'string' ||
      candidate.accessToken.length === 0 ||
      candidate.user === null ||
      typeof candidate.user !== 'object' ||
      typeof candidate.user.id !== 'number' ||
      typeof candidate.user.role !== 'number'
    ) {
      return null;
    }

    return {
      accessToken: candidate.accessToken,
      user: candidate.user,
    };
  } catch {
    return null;
  }
};

let cachedSession: StoredSession | null = null;
let isCacheHydrated = false;

const writeToSecureStorage = async (session: StoredSession): Promise<void> => {
  const result = await Keychain.setGenericPassword(
    SESSION_ACCOUNT,
    JSON.stringify(session),
    SET_OPTIONS,
  );

  if (result === false) {
    throw new Error('No se pudo guardar la sesión en el almacen seguro.');
  }
};

const readFromSecureStorage = async (): Promise<StoredSession | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: ACCESS_TOKEN_SERVICE,
  }).catch((): false => false);

  if (credentials === false) {
    return null;
  }

  const session = parseSession(credentials.password);

  if (session === null) {
    await clearSecureStorage();
  }

  return session;
};

const clearSecureStorage = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_SERVICE }).catch(
    () => false,
  );
};

/** Restores the session saved on the last successful sign-in. */
export const hydrateSession = async (): Promise<StoredSession | null> => {
  if (!isCacheHydrated) {
    cachedSession = await readFromSecureStorage();
    isCacheHydrated = true;
  }

  return cachedSession;
};

/** Token for the `Authorization` header. Read on every authenticated request. */
export const getAccessToken = async (): Promise<string | null> => {
  if (!isCacheHydrated) {
    await hydrateSession();
  }

  return cachedSession?.accessToken ?? null;
};

export const persistSession = async (session: StoredSession): Promise<void> => {
  assertStorable(session);
  await writeToSecureStorage(session);

  cachedSession = session;
  isCacheHydrated = true;
};

export const clearSession = async (): Promise<void> => {
  cachedSession = null;
  isCacheHydrated = true;

  await clearSecureStorage();
};