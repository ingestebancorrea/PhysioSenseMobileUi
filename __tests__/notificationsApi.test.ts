/**
 * @format
 *
 * `GET /notifications`: mapeo del registro del microservicio al modelo de la
 * pantalla y llamadas que consume la UI.
 */

import { NOTIFICATION_SERVICE_BASE_URL } from '@/config/env';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  toNotificationItem,
  type BackendNotification,
} from '@/services/notifications/notificationsApi';

const NOW = new Date(2026, 4, 14, 15, 0, 0);

const BASE_DTO: BackendNotification = {
  id: 'ntf_01',
  userId: '26',
  channel: 'PUSH',
  status: 'SENT',
  priority: 'NORMAL',
  title: 'Sesión completada',
  body: 'Terminaste tu sesión de ejercicios de mano.',
  data: { category: 'Progreso' },
  createdAt: new Date(2026, 4, 14, 10, 30).toISOString(),
};

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: {
    get: (header: string) =>
      header.toLowerCase() === 'content-type' ? 'application/json' : null,
  },
  text: async () =>
    body === undefined ? '' : JSON.stringify(body),
});

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe('toNotificationItem', () => {
  it('mapea título, cuerpo, categoría y sección de hoy', () => {
    const item = toNotificationItem(BASE_DTO, NOW);

    expect(item).toMatchObject({
      id: 'ntf_01',
      title: 'Sesión completada',
      description: 'Terminaste tu sesión de ejercicios de mano.',
      timestamp: '10:30 a. m.',
      isRead: false,
      category: 'Progreso',
      section: 'Hoy',
      isImportant: false,
    });
  });

  it('considera leída una notificación con status READ o readAt', () => {
    expect(
      toNotificationItem({ ...BASE_DTO, status: 'READ' }, NOW).isRead,
    ).toBe(true);
    expect(
      toNotificationItem(
        { ...BASE_DTO, readAt: new Date(2026, 4, 14, 11).toISOString() },
        NOW,
      ).isRead,
    ).toBe(true);
  });

  it('agrupa ayer y días anteriores con su fecha', () => {
    const yesterday = toNotificationItem(
      {
        ...BASE_DTO,
        createdAt: new Date(2026, 4, 13, 18, 0).toISOString(),
      },
      NOW,
    );
    const lastWeek = toNotificationItem(
      {
        ...BASE_DTO,
        createdAt: new Date(2026, 4, 11, 9, 0).toISOString(),
      },
      NOW,
    );
    const older = toNotificationItem(
      {
        ...BASE_DTO,
        createdAt: new Date(2026, 3, 20, 9, 0).toISOString(),
      },
      NOW,
    );

    expect(yesterday.section).toBe('Ayer');
    expect(yesterday.timestamp).toBe('Ayer, 6:00 p. m.');
    expect(lastWeek.section).toBe('Esta semana');
    expect(lastWeek.timestamp).toBe('Lun, 11 Mayo');
    expect(older.section).toBe('Anterior');
    expect(older.timestamp).toBe('Lun, 20 Abril');
  });

  it('marca como importante la prioridad alta y normaliza categorías', () => {
    const item = toNotificationItem(
      {
        ...BASE_DTO,
        priority: 'URGENT',
        data: { category: 'recordatorio' },
      },
      NOW,
    );

    expect(item.isImportant).toBe(true);
    expect(item.category).toBe('Recordatorio');
  });

  it('cae en General cuando el backend no manda categoría conocida', () => {
    const item = toNotificationItem({ ...BASE_DTO, data: null }, NOW);

    expect(item.category).toBe('General');
  });

  it('normaliza ids numéricos y lee data.isImportant del backend local', () => {
    const item = toNotificationItem(
      {
        ...BASE_DTO,
        id: 16,
        data: { category: 'General', isImportant: true },
      },
      NOW,
    );

    expect(item.id).toBe('16');
    expect(item.isImportant).toBe(true);
  });
});

describe('fetchNotifications', () => {
  it('consume el endpoint local con el userId y mapea la respuesta', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ data: [BASE_DTO], total: 1 }),
    );

    const result = await fetchNotifications(26);

    expect(fetchMock).toHaveBeenCalledWith(
      `${NOTIFICATION_SERVICE_BASE_URL}/notifications?userId=26`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].category).toBe('Progreso');
  });

  it('envía limit y offset cuando se piden', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [], total: 0 }));

    await fetchNotifications('26', { limit: 20, offset: 40 });

    expect(fetchMock).toHaveBeenCalledWith(
      `${NOTIFICATION_SERVICE_BASE_URL}/notifications?userId=26&limit=20&offset=40`,
      expect.anything(),
    );
  });

  it('devuelve lista vacía cuando el usuario no tiene notificaciones', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ data: [], total: 0 }));

    const result = await fetchNotifications(26);

    expect(result).toEqual({ items: [], total: 0 });
  });

  it('falla si la API no devuelve el formato esperado', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ total: 0 }));

    await expect(fetchNotifications(26)).rejects.toThrow(/formato esperado/);
  });
});

describe('marcar como leídas', () => {
  it('marca una notificación', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(undefined, 204),
    );

    await markNotificationAsRead('ntf_01', 26);

    expect(fetchMock).toHaveBeenCalledWith(
      `${NOTIFICATION_SERVICE_BASE_URL}/notifications/ntf_01/read?userId=26`,
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('marca todas las notificaciones', async () => {
    fetchMock.mockResolvedValue(jsonResponse(undefined, 204));

    await markAllNotificationsAsRead('26');

    expect(fetchMock).toHaveBeenCalledWith(
      `${NOTIFICATION_SERVICE_BASE_URL}/notifications/read-all?userId=26`,
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('marca todas aunque el 204 no permita leer el cuerpo', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
      headers: { get: () => null },
      text: async () => {
        throw new Error('No hay cuerpo que leer');
      },
    });

    await expect(markAllNotificationsAsRead('26')).resolves.toBeUndefined();
  });
});
