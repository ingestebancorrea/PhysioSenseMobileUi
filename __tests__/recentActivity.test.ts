/**
 * @format
 *
 * `Actividad reciente` del home del fisioterapeuta: se compone con las últimas
 * notificaciones y se traduce al modelo de `ActivityItem`.
 */

import { NOTIFICATION_SERVICE_BASE_URL } from '@/config/env';
import type { BackendNotification } from '@/services/notifications/notificationsApi';
import {
  fetchRecentActivity,
  RECENT_ACTIVITY_LIMIT,
  toRecentActivity,
} from '@/services/notifications/recentActivity';
import type { NotificationItem } from '@/types/notification';

const NOTIFICATION: NotificationItem = {
  id: 'ntf_01',
  title: 'Sesión completada',
  description: 'Terminaste tu sesión de ejercicios de mano.',
  timestamp: '10:30 a. m.',
  isRead: false,
  category: 'Progreso',
  section: 'Hoy',
};

const backendNotification = (index: number, status: 'SENT' | 'READ') =>
  ({
    id: index,
    userId: 26,
    channel: 'PUSH',
    status,
    priority: 'NORMAL',
    title: `Notificación ${index}`,
    body: `Contenido ${index}`,
    data: { category: 'General' },
    createdAt: new Date(2026, 4, 14, 10, index).toISOString(),
  } as BackendNotification);

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: {
    get: (header: string) =>
      header.toLowerCase() === 'content-type' ? 'application/json' : null,
  },
  text: async () => (body === undefined ? '' : JSON.stringify(body)),
});

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe('toRecentActivity', () => {
  it('mapea la notificación al row y deja como pendiente la no leída', () => {
    expect(toRecentActivity(NOTIFICATION)).toMatchObject({
      id: 'activity_ntf_01',
      icon: 'chart',
      tone: 'user',
      titleHighlight: 'Sesión completada',
      subtitlePrimary: '10:30 a. m.',
      subtitleSecondary: 'Terminaste tu sesión de ejercicios de mano.',
      status: 'open',
    });
  });

  it('marca como completada una notificación leída', () => {
    expect(
      toRecentActivity({ ...NOTIFICATION, isRead: true }).status,
    ).toBe('completed');
  });

  it('elige icono y tono según la categoría', () => {
    expect(
      toRecentActivity({ ...NOTIFICATION, category: 'Dispositivo' }),
    ).toMatchObject({ icon: 'bluetooth', tone: 'device' });
    expect(
      toRecentActivity({ ...NOTIFICATION, category: 'Recordatorio' }),
    ).toMatchObject({ icon: 'clock', tone: 'warning' });
    expect(
      toRecentActivity({ ...NOTIFICATION, category: 'General' }),
    ).toMatchObject({ icon: 'bell', tone: 'user' });
  });
});

describe('fetchRecentActivity', () => {
  it('pide las últimas notificaciones, muestra solo las recientes y cuenta las no leídas', async () => {
    const data = Array.from({ length: 6 }, (_, index) =>
      backendNotification(index + 1, index < 2 ? 'SENT' : 'READ'),
    );
    fetchMock.mockResolvedValue(jsonResponse({ data, total: data.length }));

    const result = await fetchRecentActivity(26);

    expect(fetchMock).toHaveBeenCalledWith(
      `${NOTIFICATION_SERVICE_BASE_URL}/notifications?userId=26&limit=50`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result.activities).toHaveLength(RECENT_ACTIVITY_LIMIT);
    expect(result.unreadCount).toBe(2);
  });

  it('devuelve actividad vacía cuando no hay notificaciones', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [], total: 0 }));

    await expect(fetchRecentActivity(26)).resolves.toEqual({
      activities: [],
      unreadCount: 0,
    });
  });
});
