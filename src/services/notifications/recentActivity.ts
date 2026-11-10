import type { IconName } from '@/constants/icons';
import type { NotificationCategory, NotificationItem } from '@/types/notification';
import type {
  ActivityTone,
  TherapistActivity,
} from '@/types/therapistDashboard';
import { fetchNotifications } from './notificationsApi';

/**
 * La actividad reciente del home del fisioterapeuta se compone con las últimas
 * notificaciones del usuario: es información del mismo tipo y ya está ordenada
 * de más nueva a más antigua por el microservicio.
 */
export const RECENT_ACTIVITY_LIMIT = 4;

/** Notificaciones que se traen para poder calcular también las no leídas. */
const NOTIFICATIONS_FETCH_LIMIT = 50;

const CATEGORY_ICONS: Record<NotificationCategory, IconName> = {
  Progreso: 'chart',
  Logro: 'circleCheck',
  Ejercicio: 'hand',
  Recordatorio: 'clock',
  Dispositivo: 'bluetooth',
  Meta: 'activity',
  Mensaje: 'bell',
  General: 'bell',
};

const CATEGORY_TONES: Record<NotificationCategory, ActivityTone> = {
  Progreso: 'user',
  Logro: 'user',
  Ejercicio: 'user',
  Recordatorio: 'warning',
  Dispositivo: 'device',
  Meta: 'warning',
  Mensaje: 'user',
  General: 'user',
};

/**
 * Traduce una notificación al modelo que pinta `ActivityItem`.
 *
 * `completed` representa una notificación ya leída y `open` una pendiente, de
 * modo que el check/chevron del row siga comunicando algo útil.
 */
export const toRecentActivity = (
  notification: NotificationItem,
): TherapistActivity => ({
  id: `activity_${notification.id}`,
  icon: CATEGORY_ICONS[notification.category] ?? 'bell',
  tone: CATEGORY_TONES[notification.category] ?? 'user',
  titleHighlight: notification.title,
  subtitlePrimary: notification.timestamp,
  subtitleSecondary: notification.description,
  status: notification.isRead ? 'completed' : 'open',
});

export interface RecentActivityResult {
  activities: TherapistActivity[];
  unreadCount: number;
}

/**
 * `GET /notifications?userId=...` acotado a la actividad que muestra el home.
 *
 * Se piden 50 registros (el máximo por defecto del servicio) para que el badge
 * de no leídas no se limite a las cuatro filas visibles.
 */
export const fetchRecentActivity = async (
  userId: number | string,
  limit: number = RECENT_ACTIVITY_LIMIT,
): Promise<RecentActivityResult> => {
  const { items } = await fetchNotifications(userId, {
    limit: NOTIFICATIONS_FETCH_LIMIT,
  });

  return {
    activities: items.slice(0, limit).map(toRecentActivity),
    unreadCount: items.filter(item => !item.isRead).length,
  };
};
