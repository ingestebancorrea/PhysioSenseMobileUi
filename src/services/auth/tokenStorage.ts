import * as Keychain from 'react-native-keychain';

export const ACCESS_TOKEN_SERVICE = 'com.physiosense.accessToken';

const ACCESS_TOKEN_ACCOUNT = 'accessToken';

const SET_OPTIONS: Keychain.SetOptions = {
  service: ACCESS_TOKEN_SERVICE,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
  storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
};

let cachedAccessToken: string | null = null;
let isCacheHydrated = false;

const readFromSecureStorage = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: ACCESS_TOKEN_SERVICE,
  }).catch((): false => false);

  return credentials === false ? null : credentials.password;
};

export const hydrateAccessToken = async (): Promise<string | null> => {
  if (isCacheHydrated) {
    return cachedAccessToken;
  }

  cachedAccessToken = await readFromSecureStorage();
  isCacheHydrated = true;

  return cachedAccessToken;
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!isCacheHydrated) {
    await hydrateAccessToken();
  }

  return cachedAccessToken;
};

export const setAccessToken = async (accessToken: string): Promise<void> => {
  const result = await Keychain.setGenericPassword(
    ACCESS_TOKEN_ACCOUNT,
    accessToken,
    SET_OPTIONS,
  );

  if (result === false) {
    throw new Error('No se pudo guardar el token en el almacen seguro.');
  }

  cachedAccessToken = accessToken;
  isCacheHydrated = true;
};

export const clearAccessToken = async (): Promise<void> => {
  cachedAccessToken = null;
  isCacheHydrated = true;

  await Keychain.resetGenericPassword({ service: ACCESS_TOKEN_SERVICE }).catch(
    () => false,
  );
};
