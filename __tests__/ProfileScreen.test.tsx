/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { ProfileScreen } from '../src/screens/private/ProfileScreen';
import { AuthProvider } from '../src/context/AuthContext';
import { DrawerProvider } from '../src/context/DrawerContext';
import { PrivateNavigationProvider } from '../src/context/PrivateNavigationContext';
import { UserRoleId } from '../src/types/auth';
import { hydrateSession } from '../src/services/auth/tokenStorage';

jest.mock('../src/services/auth/tokenStorage', () => ({
  ...jest.requireActual('../src/services/auth/tokenStorage'),
  hydrateSession: jest.fn(),
}));

const hydrateSessionMock = hydrateSession as jest.MockedFunction<
  typeof hydrateSession
>;

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

test('renders the patient profile screen with the session identity', async () => {
  hydrateSessionMock.mockResolvedValue({
    accessToken: 'token',
    user: {
      id: 7,
      role: UserRoleId.PACIENTE,
      email: 'paciente@correo.com',
      displayName: 'Ana Torres',
      photoURL: '',
    },
  });

  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <DrawerProvider>
          <PrivateNavigationProvider onNavigate={jest.fn()}>
            <ProfileScreen />
          </PrivateNavigationProvider>
        </DrawerProvider>
      </AuthProvider>,
    );
  });

  expect(tree).toBeTruthy();
  expect(findText(tree!.root, 'Perfil')).toBe(true);
  expect(findText(tree!.root, 'Ana Torres')).toBe(true);
  expect(findText(tree!.root, 'paciente@correo.com')).toBe(true);
  expect(findText(tree!.root, '12 / 08 / 1992')).toBe(true);
  expect(findText(tree!.root, 'Derecha')).toBe(true);
  expect(findText(tree!.root, 'Rehabilitación post ACV')).toBe(true);
  expect(findText(tree!.root, 'Laura Martinez')).toBe(true);
  expect(findText(tree!.root, 'Cerrar sesión')).toBe(true);
});