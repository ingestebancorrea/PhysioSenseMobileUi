import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

import { NOTIFICATION_SERVICE_BASE_URL } from '@/config/env';

const REQUEST_TIMEOUT_MS = 10_000;

const ANDROID_PERMISSION_API = 33;

export interface PushRegistration {
  token: string;
  userId: string;
}

const withTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('Tiempo de espera agotado')),
          ms,
        );
      }),
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
};

const postJson = async (path: string, body: unknown): Promise<void> => {
  const response = await withTimeout(
    fetch(`${NOTIFICATION_SERVICE_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    REQUEST_TIMEOUT_MS,
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `Notificaciones (${response.status}): ${detail || response.statusText}`,
    );
  }
};

const ensureNotificationPermission = async (): Promise<boolean> => {
  if (
    Platform.OS === 'android' &&
    Number(Platform.Version) >= ANDROID_PERMISSION_API
  ) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  if (Platform.OS === 'ios') {
    const status = await requestPermission(getMessaging());

    return (
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL
    );
  }

  return true;
};

const buildDevicePayload = (userId: number, token: string) => {
  const android = Platform.constants as { Model?: string; Release?: string };

  return {
    userId: String(userId),
    token,
    platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    ...(Platform.OS === 'android'
      ? {
          deviceModel: android.Model ?? undefined,
          osVersion: android.Release ?? undefined,
        }
      : {}),
  };
};

/**
 * Pide permiso (Android 13+ / iOS), obtiene el token FCM y lo registra en el
 * microservicio de notificaciones local.
 *
 * Nunca lanza: un fallo de push no debe romper el login.
 */
export const registerPushToken = async (
  userId: number,
): Promise<PushRegistration | null> => {
  try {
    if (!(await ensureNotificationPermission())) {
      console.warn('[push] Permiso de notificaciones denegado');
      return null;
    }

    const messaging = getMessaging();

    if (Platform.OS === 'ios') {
      await registerDeviceForRemoteMessages(messaging);
    }

    const token = await getToken(messaging);

    if (!token) {
      console.warn('[push] Firebase no devolvio un token');
      return null;
    }

    await postJson('/devices/register', buildDevicePayload(userId, token));

    console.log(`[push] Token registrado para el usuario ${userId}`);

    return { token, userId: String(userId) };
  } catch (error) {
    console.warn('[push] No se pudo registrar el token:', error);
    return null;
  }
};

/** Marca el token del dispositivo como inactivo para ese usuario. */
export const unregisterPushToken = async (userId: number): Promise<void> => {
  try {
    const token = await getToken(getMessaging());

    if (!token) {
      return;
    }

    await postJson(
      `/devices/unregister?userId=${encodeURIComponent(String(userId))}`,
      { token },
    );

    console.log(`[push] Token desregistrado para el usuario ${userId}`);
  } catch (error) {
    console.warn('[push] No se pudo desregistrar el token:', error);
  }
};

/** Mantiene el backend al dia cuando Firebase rota el token. */
export const listenForTokenRefresh = (userId: number): (() => void) =>
  onTokenRefresh(getMessaging(), async token => {
    try {
      await postJson('/devices/register', buildDevicePayload(userId, token));
      console.log(`[push] Token renovado para el usuario ${userId}`);
    } catch (error) {
      console.warn('[push] No se pudo renovar el token:', error);
    }
  });

/**
 * Mensajes recibidos con la app abierta. Android no muestra la notificacion
 * automaticamente en foreground; se registra para poder reaccionar (o mostrar
 * una notificacion local con notifee).
 */
export const listenForForegroundMessages = (): (() => void) =>
  onMessage(getMessaging(), async remoteMessage => {
    console.log('[push] Mensaje en primer plano:', remoteMessage);
  });
