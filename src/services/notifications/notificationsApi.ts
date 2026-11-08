import { NOTIFICATION_SERVICE_BASE_URL } from '@/config/env';
import { ApiClientError, createApiClient } from '@/services/api/client';
import type {
  NotificationCategory,
  NotificationItem,
  NotificationSection,
} from '@/types/notification';

const NOTIFICATIONS_PATH = '/notifications';

/**
 * `handleUnauthorized: false` a propósito: un 401 de este microservicio no debe
 * cerrar la sesión del core. El listado se muestra como error y se reintenta.
 */
const notificationClient = createApiClient(NOTIFICATION_SERVICE_BASE_URL, {
  handleUnauthorized: false,
});

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'READ';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

/** Registro tal como lo devuelve `GET /api/v1/notifications`. */
export interface BackendNotification {
  /**
   * La entidad declara UUID, pero la base de prueba local responde ids
   * numéricos. Se aceptan ambos y se normalizan a string para la UI.
   */
  id: string | number;
  userId: string | number;
  channel: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  imageUrl?: string | null;
  actionUrl?: string | null;
  sentAt?: string | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface NotificationListResponse {
  data: BackendNotification[];
  total: number;
}

export interface FetchNotificationsOptions {
  limit?: number;
  offset?: number;
}

export interface NotificationListResult {
  items: NotificationItem[];
  total: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const CATEGORY_ALIASES: Record<string, NotificationCategory> = {
  progreso: 'Progreso',
  progress: 'Progreso',
  logro: 'Logro',
  achievement: 'Logro',
  ejercicio: 'Ejercicio',
  exercise: 'Ejercicio',
  recordatorio: 'Recordatorio',
  reminder: 'Recordatorio',
  dispositivo: 'Dispositivo',
  device: 'Dispositivo',
  meta: 'Meta',
  goal: 'Meta',
  mensaje: 'Mensaje',
  message: 'Mensaje',
  general: 'General',
};

const parseDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const daysAgo = (date: Date, now: Date): number =>
  Math.round((startOfDay(now) - startOfDay(date)) / MS_PER_DAY);

const formatClock = (date: Date): string => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const suffix = hours >= 12 ? 'p. m.' : 'a. m.';

  return `${hour12}:${minutes} ${suffix}`;
};

const toSection = (days: number): NotificationSection => {
  if (days <= 0) {
    return 'Hoy';
  }

  if (days === 1) {
    return 'Ayer';
  }

  if (days <= 7) {
    return 'Esta semana';
  }

  return 'Anterior';
};

const formatTimestamp = (date: Date, days: number): string => {
  if (days <= 0) {
    return formatClock(date);
  }

  if (days === 1) {
    return `Ayer, ${formatClock(date)}`;
  }

  return `${WEEKDAYS_ES[date.getDay()]}, ${date.getDate()} ${
    MONTHS_ES[date.getMonth()]
  }`;
};

const toCategory = (dto: BackendNotification): NotificationCategory => {
  const raw = dto.data?.category ?? dto.data?.type ?? dto.data?.categoryName;

  if (typeof raw !== 'string') {
    return 'General';
  }

  return CATEGORY_ALIASES[raw.trim().toLowerCase()] ?? 'General';
};

const isImportant = (dto: BackendNotification): boolean =>
  dto.priority === 'HIGH' ||
  dto.priority === 'URGENT' ||
  dto.data?.isImportant === true ||
  dto.data?.important === true;

/**
 * Traduce el registro del microservicio al modelo de la pantalla.
 *
 * No inventa contenido: si el backend no manda título o cuerpo se usan textos
 * neutros, y la fecha cae en `createdAt` (o `sentAt`) para no perder la
 * notificación por un campo opcional vacío.
 */
export const toNotificationItem = (
  dto: BackendNotification,
  now: Date = new Date(),
): NotificationItem => {
  const createdAt = parseDate(dto.createdAt) ?? parseDate(dto.sentAt) ?? now;
  const days = daysAgo(createdAt, now);

  return {
    id: String(dto.id),
    title: dto.title?.trim() || 'Notificación',
    description: dto.body?.trim() || 'Sin contenido.',
    timestamp: formatTimestamp(createdAt, days),
    isRead: dto.status === 'READ' || Boolean(dto.readAt),
    category: toCategory(dto),
    section: toSection(days),
    isImportant: isImportant(dto),
  };
};

const buildQuery = (
  userId: number | string,
  options: FetchNotificationsOptions = {},
): string => {
  const params = [`userId=${encodeURIComponent(String(userId))}`];

  if (options.limit !== undefined) {
    params.push(`limit=${options.limit}`);
  }

  if (options.offset !== undefined) {
    params.push(`offset=${options.offset}`);
  }

  return params.join('&');
};

/**
 * GET /notifications?userId=...
 *
 * El endpoint responde `{ data, total }` ordenado por `createdAt DESC`.
 * Cualquier respuesta que no traiga el arreglo `data` se rechaza para no
 * mostrar una lista vacía como si el usuario no tuviera notificaciones.
 */
export const fetchNotifications = async (
  userId: number | string,
  options: FetchNotificationsOptions = {},
): Promise<NotificationListResult> => {
  const response = await notificationClient.get<NotificationListResponse>(
    `${NOTIFICATIONS_PATH}?${buildQuery(userId, options)}`,
  );

  if (!response || !Array.isArray(response.data)) {
    throw new ApiClientError(
      'La API no devolvió las notificaciones con el formato esperado.',
    );
  }

  const items = response.data
    .filter(
      dto =>
        dto !== null &&
        typeof dto === 'object' &&
        (typeof dto.id === 'string' || typeof dto.id === 'number'),
    )
    .map(dto => toNotificationItem(dto));

  return {
    items,
    total:
      typeof response.total === 'number' ? response.total : items.length,
  };
};

/** PATCH /notifications/{id}/read?userId=... (204 sin cuerpo). */
export const markNotificationAsRead = async (
  id: string,
  userId: number | string,
): Promise<void> => {
  await notificationClient.patch<void>(
    `${NOTIFICATIONS_PATH}/${encodeURIComponent(
      id,
    )}/read?userId=${encodeURIComponent(String(userId))}`,
    {},
  );
};

/** PATCH /notifications/read-all?userId=... (204 sin cuerpo). */
export const markAllNotificationsAsRead = async (
  userId: number | string,
): Promise<void> => {
  await notificationClient.patch<void>(
    `${NOTIFICATIONS_PATH}/read-all?userId=${encodeURIComponent(
      String(userId),
    )}`,
    {},
  );
};
