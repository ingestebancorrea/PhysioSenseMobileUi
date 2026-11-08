/**
 * @format
 *
 * La pantalla de notificaciones debe consumir el microservicio (sin mocks) y
 * mostrar un estado informativo con icono cuando el usuario no tiene ninguna.
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { NotificationsScreen } from '../src/screens/private/NotificationsScreen';
import { AuthProvider } from '../src/context/AuthContext';
import { hydrateSession } from '../src/services/auth/tokenStorage';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
} from '../src/services/notifications/notificationsApi';
import { UserRoleId } from '../src/types/auth';
import type { NotificationItem } from '../src/types/notification';

jest.mock('../src/context/ToastContext', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
  useAppToast: () => ({ showToast: jest.fn(), hideToast: jest.fn() }),
}));

jest.mock('../src/services/auth/tokenStorage', () => ({
  ...jest.requireActual('../src/services/auth/tokenStorage'),
  hydrateSession: jest.fn(),
}));

jest.mock('../src/services/notifications/pushNotifications', () => ({
  registerPushToken: jest.fn(async () => null),
  unregisterPushToken: jest.fn(async () => undefined),
  listenForTokenRefresh: jest.fn(() => jest.fn()),
  listenForForegroundMessages: jest.fn(() => jest.fn()),
}));

jest.mock('../src/services/notifications/notificationsApi', () => ({
  fetchNotifications: jest.fn(),
  markAllNotificationsAsRead: jest.fn(),
  markNotificationAsRead: jest.fn(),
}));

const hydrateSessionMock = hydrateSession as jest.MockedFunction<
  typeof hydrateSession
>;

const fetchNotificationsMock = fetchNotifications as jest.MockedFunction<
  typeof fetchNotifications
>;

const markAllNotificationsAsReadMock =
  markAllNotificationsAsRead as jest.MockedFunction<
    typeof markAllNotificationsAsRead
  >;

const SESSION = {
  accessToken: 'token',
  user: {
    id: 26,
    role: UserRoleId.PACIENTE,
    email: 'paciente@correo.com',
    displayName: 'Ana Torres',
    photoURL: '',
  },
};

const findText = (
  root: ReactTestRenderer.ReactTestInstance,
  text: string,
): boolean =>
  root.findAll(
    node =>
      String(node.type) === 'Text' &&
      Array.isArray(node.props.children) === false &&
      String(node.props.children) === text,
  ).length > 0;

const renderScreen = async (): Promise<ReactTestRenderer.ReactTestRenderer> => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <NotificationsScreen />
      </AuthProvider>,
    );
  });

  // VirtualizedList agenda un timer para calcular celdas; se deja correr dentro
  // de act para que el test no registre actualizaciones fuera de act.
  await ReactTestRenderer.act(async () => {
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 100);
    });
  });

  return tree as ReactTestRenderer.ReactTestRenderer;
};

beforeEach(() => {
  hydrateSessionMock.mockReset();
  fetchNotificationsMock.mockReset();
  markAllNotificationsAsReadMock.mockReset();
  hydrateSessionMock.mockResolvedValue(SESSION);
  markAllNotificationsAsReadMock.mockResolvedValue(undefined);
});

test('muestra el mensaje y el icono cuando no hay notificaciones', async () => {
  fetchNotificationsMock.mockResolvedValue({ items: [], total: 0 });

  const tree = await renderScreen();

  expect(fetchNotificationsMock).toHaveBeenCalledWith(26);
  expect(findText(tree.root, 'No tienes notificaciones')).toBe(true);
  expect(
    findText(tree.root, 'Cuando recibas novedades aparecerán aquí.'),
  ).toBe(true);

  // El estado vacío se acompaña de un icono, no solo de texto.
  const iconCircle = tree.root.findAll(
    node =>
      node.props?.style !== undefined &&
      JSON.stringify(node.props.style).includes('"width":72'),
  );

  expect(iconCircle.length).toBeGreaterThan(0);
});

test('pinta las notificaciones que devuelve el servicio', async () => {
  const item: NotificationItem = {
    id: '16',
    title: 'Actualización disponible',
    description: 'Hay una nueva versión de la aplicación disponible.',
    timestamp: 'Jue, 20 Octubre',
    isRead: false,
    category: 'General',
    section: 'Anterior',
  };

  fetchNotificationsMock.mockResolvedValue({ items: [item], total: 1 });

  const tree = await renderScreen();

  expect(findText(tree.root, 'Actualización disponible')).toBe(true);
  expect(
    findText(tree.root, 'Hay una nueva versión de la aplicación disponible.'),
  ).toBe(true);
  expect(findText(tree.root, 'Anterior')).toBe(true);
});

test('el botón marcar todas llama al servicio y oculta el aviso', async () => {
  const items: NotificationItem[] = [
    {
      id: '1',
      title: 'Sesión completada',
      description: 'Terminaste tu sesión de hoy.',
      timestamp: '10:30 a. m.',
      isRead: false,
      category: 'Progreso',
      section: 'Hoy',
    },
    {
      id: '2',
      title: 'Recordatorio',
      description: 'Tienes una sesión pendiente.',
      timestamp: '9:00 a. m.',
      isRead: false,
      category: 'Recordatorio',
      section: 'Hoy',
    },
  ];

  fetchNotificationsMock.mockResolvedValue({ items, total: items.length });

  const tree = await renderScreen();

  const markAllButton = tree.root
    .findAllByType(TouchableOpacity)
    .find(button =>
      button
        .findAll(
          node =>
            String(node.type) === 'Text' &&
            String(node.props.children) === 'Marcar todas como leídas',
        )
        .some(Boolean),
    );

  expect(markAllButton).toBeDefined();

  await ReactTestRenderer.act(async () => {
    await markAllButton?.props.onPress();
  });

  expect(markAllNotificationsAsReadMock).toHaveBeenCalledWith(26);
  expect(findText(tree.root, 'Marcar todas como leídas')).toBe(false);

  await ReactTestRenderer.act(async () => {
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 100);
    });
  });
});
