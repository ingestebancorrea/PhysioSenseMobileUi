/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { ProfileScreen } from '../src/screens/private/ProfileScreen';
import { AuthProvider } from '../src/context/AuthContext';

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

test('renders the patient profile screen', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <ProfileScreen />
      </AuthProvider>,
    );
  });

  expect(tree).toBeTruthy();
  expect(findText(tree!.root, 'Perfil')).toBe(true);
  expect(findText(tree!.root, 'Esteban Correa')).toBe(true);
  expect(findText(tree!.root, 'esteban@email.com')).toBe(true);
  expect(findText(tree!.root, '12 / 08 / 1992')).toBe(true);
  expect(findText(tree!.root, 'Derecha')).toBe(true);
  expect(findText(tree!.root, 'Rehabilitación post ACV')).toBe(true);
  expect(findText(tree!.root, 'Laura Martinez')).toBe(true);
  expect(findText(tree!.root, 'Cerrar sesión')).toBe(true);
});
