// src/services/auth/socialAuth.ts
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { ANDROID_CLIENT_ID } from '@/config/env';

const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];

const LOG_PREFIX = '[auth-social]';

const PLAY_SERVICES_ERROR_MESSAGE =
  'Google Play Services no está disponible en este dispositivo.';

const FACEBOOK_TOKEN_ERROR_MESSAGE = 'No se obtuvo un token de Facebook.';

const log = (message: string, detail?: unknown): void => {
  console.warn(`${LOG_PREFIX} ${message}`, detail ?? '');
};

export const configureSocialSignIn = (): void => {
  GoogleSignin.configure({
    webClientId: ANDROID_CLIENT_ID,
    offlineAccess: false,
  });

  log('configure', { webClientId: ANDROID_CLIENT_ID });
};

export const getGoogleIdToken = async (): Promise<string | null> => {
  const hasPlayService = await GoogleSignin.hasPlayServices();

  log('hasPlayServices', hasPlayService);

  if (!hasPlayService) {
    throw new Error(PLAY_SERVICES_ERROR_MESSAGE);
  }

  const response = await GoogleSignin.signIn();

  log('signIn', {
    type: response.type,
    hasIdToken: Boolean(response.data?.idToken),
    error: (response as { error?: unknown }).error,
  });

  if (response.type !== 'success' || !response.data?.idToken) {
    return null;
  }

  log('idToken listo', {
    length: response.data.idToken.length,
  });

  return response.data.idToken;
};

export const getFacebookAccessToken = async (): Promise<string | null> => {
  const result = await LoginManager.logInWithPermissions(FACEBOOK_PERMISSIONS);

  log('logInWithPermissions', {
    isCancelled: result.isCancelled,
    grantedPermissions: result.grantedPermissions,
  });

  if (result.isCancelled) {
    return null;
  }

  const currentToken = await AccessToken.getCurrentAccessToken();

  log('accessToken', {
    hasToken: Boolean(currentToken),
    userID: currentToken?.userID,
  });

  if (!currentToken) {
    throw new Error(FACEBOOK_TOKEN_ERROR_MESSAGE);
  }

  return currentToken.accessToken;
};

export const describeSocialAuthError = (error: unknown): string => {
  log('error', error);

  if (error === null || error === undefined) {
    return 'Error desconocido.';
  }

  if (!(error instanceof Error)) {
    return String(error);
  }

  const code = (error as Error & { code?: unknown }).code;
  const lines = [error.message, error.name];

  if (code !== undefined) {
    lines.push(`code: ${String(code)}`);
  }

  return lines.filter(Boolean).join('\n');
};
