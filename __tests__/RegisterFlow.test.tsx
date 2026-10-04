/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from '../src/context/AuthContext';
import { RegisterFlowNavigator } from '../src/navigation/navigators/RegisterFlowNavigator';

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

/** Types into the nth TextInput rendered on the current screen. */
const typeIntoField = (
  tree: ReactTestRenderer.ReactTestRenderer,
  index: number,
  text: string,
): void => {
  const input = tree.root.findAll(node => String(node.type) === 'TextInput')[index];

  if (!input) {
    throw new Error(`No hay TextInput en la posición ${index}`);
  }

  input.props.onChangeText(text);
};

const pressText = (
  tree: ReactTestRenderer.ReactTestRenderer,
  text: string,
): void => {
  const textNode = tree.root.findAll(
    node =>
      String(node.type) === 'Text' &&
      Array.isArray(node.props.children) === false &&
      String(node.props.children) === text,
  )[0];

  if (!textNode) {
    return;
  }

  let node: ReactTestRenderer.ReactTestInstance | null = textNode;
  while (node && typeof node.props.onPress !== 'function') {
    node = node.parent;
  }
  if (node && typeof node.props.onPress === 'function') {
    node.props.onPress();
  }
};

/** The terms checkbox renders nested <Text>, so it is matched by its role. */
const pressTermsCheckbox = (
  tree: ReactTestRenderer.ReactTestRenderer,
): void => {
  const checkbox = tree.root.findAll(
    node => node.props.accessibilityRole === 'checkbox',
  )[0];

  if (!checkbox) {
    throw new Error('No se encontró el checkbox de términos');
  }

  checkbox.props.onPress();
};

test('renders registration step 0 (role selection)', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <NavigationContainer>
          <RegisterFlowNavigator />
        </NavigationContainer>
      </AuthProvider>,
    );
  });

  expect(tree).toBeTruthy();
  expect(findText(tree!.root, '¿Cómo utilizarás PhysioSense?')).toBe(true);
  expect(findText(tree!.root, 'Soy fisioterapeuta')).toBe(true);
  expect(findText(tree!.root, 'Soy paciente')).toBe(true);
});

test('selecting fisioterapeuta navigates to Crea tu cuenta', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <NavigationContainer>
          <RegisterFlowNavigator />
        </NavigationContainer>
      </AuthProvider>,
    );
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Soy fisioterapeuta');
  });

  expect(findText(tree!.root, 'Crea tu cuenta')).toBe(true);
  expect(findText(tree!.root, 'o regístrate con')).toBe(true);
  expect(findText(tree!.root, 'Google')).toBe(true);
  expect(findText(tree!.root, 'Facebook')).toBe(true);
});

test('an empty account form shows the errors and stays on the same step', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <NavigationContainer>
          <RegisterFlowNavigator />
        </NavigationContainer>
      </AuthProvider>,
    );
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Soy fisioterapeuta');
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Continuar');
  });

  // Still on "Crea tu cuenta": navigation was blocked.
  expect(findText(tree!.root, 'Crea tu cuenta')).toBe(true);
  expect(findText(tree!.root, 'Este campo es obligatorio.')).toBe(true);
  expect(
    findText(
      tree!.root,
      'Debes aceptar los términos y la política de privacidad.',
    ),
  ).toBe(true);
});

test('a valid account form moves the physiotherapist to the professional step', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <NavigationContainer>
          <RegisterFlowNavigator />
        </NavigationContainer>
      </AuthProvider>,
    );
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Soy fisioterapeuta');
  });

  await ReactTestRenderer.act(async () => {
    typeIntoField(tree!, 0, 'Laura Martínez');
    typeIntoField(tree!, 1, 'laura@correo.com');
    typeIntoField(tree!, 2, 'Rehab2026');
    typeIntoField(tree!, 3, 'Rehab2026');
    pressTermsCheckbox(tree!);
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Continuar');
  });

  expect(findText(tree!.root, 'Número de licencia profesional')).toBe(true);
  expect(findText(tree!.root, 'Completa tu información profesional.')).toBe(
    true,
  );
  expect(findText(tree!.root, 'Este campo es obligatorio.')).toBe(false);
});

test('a valid account form moves the patient to the patient step', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <NavigationContainer>
          <RegisterFlowNavigator />
        </NavigationContainer>
      </AuthProvider>,
    );
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Soy paciente');
  });

  await ReactTestRenderer.act(async () => {
    typeIntoField(tree!, 0, 'Carlos Ramírez');
    typeIntoField(tree!, 1, 'carlos@correo.com');
    typeIntoField(tree!, 2, 'Rehab2026');
    typeIntoField(tree!, 3, 'Rehab2026');
    pressTermsCheckbox(tree!);
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Continuar');
  });

  expect(findText(tree!.root, 'Fecha de nacimiento')).toBe(true);
  expect(findText(tree!.root, 'Completa tu información personal.')).toBe(true);
  expect(findText(tree!.root, 'Este campo es obligatorio.')).toBe(false);
});
