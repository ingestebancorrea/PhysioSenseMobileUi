/**
 * Modelo que consume la pantalla de notificaciones.
 *
 * El microservicio devuelve el registro crudo (status, priority, body, fechas);
 * `notificationsApi` lo traduce a esta forma, que es la que pinta la UI.
 */

export type NotificationCategory =
  | 'Progreso'
  | 'Logro'
  | 'Ejercicio'
  | 'Recordatorio'
  | 'Dispositivo'
  | 'Meta'
  | 'Mensaje'
  | 'General';

export type NotificationSection =
  | 'Hoy'
  | 'Ayer'
  | 'Esta semana'
  | 'Anterior';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  category: NotificationCategory;
  section: NotificationSection;
  isImportant?: boolean;
}
