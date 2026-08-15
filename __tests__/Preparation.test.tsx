/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PrivateTabBarProvider } from '../src/context/PrivateTabBarContext';
import { PreparationScreen } from '../src/screens/preparation/PreparationScreen';

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

const renderWithProviders = async (
  children: React.ReactNode,
): Promise<ReactTestRenderer.ReactTestRenderer> => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <PrivateTabBarProvider>
        <NavigationContainer>{children}</NavigationContainer>
      </PrivateTabBarProvider>,
    );
  });

  return tree!;
};

const renderPreparation = (
  props: {
    exerciseId?: string;
    status?: 'connecting' | 'connected' | 'disconnected';
    onStart?: () => void;
    onRetry?: () => void;
  } = {},
): Promise<ReactTestRenderer.ReactTestRenderer> => {
  const Stack = createNativeStackNavigator();

  return renderWithProviders(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Preparation">
        {() => (
          <PreparationScreen
            exerciseId={props.exerciseId}
            status={props.status}
            onStart={props.onStart}
            onRetry={props.onRetry}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>,
  );
};

const pressText = (
  root: ReactTestRenderer.ReactTestInstance,
  text: string,
): void => {
  const textNode = root.findAll(
    node =>
      String(node.type) === 'Text' &&
      !Array.isArray(node.props.children) &&
      String(node.props.children) === text,
  )[0];

  expect(textNode).toBeTruthy();

  let target: ReactTestRenderer.ReactTestInstance = textNode;
  while (target.type !== TouchableOpacity) {
    target = target.parent!;
  }

  ReactTestRenderer.act(() => {
    target.props.onPress();
  });
};

test('renders the preparation screen with the glove status', async () => {
  const tree = await renderPreparation({ exerciseId: 'exercise_01' });

  expect(findText(tree.root, 'Preparación')).toBe(true);
  expect(findText(tree.root, 'Paso 3 de 3')).toBe(true);
  expect(findText(tree.root, 'Guante conectado')).toBe(true);
  expect(findText(tree.root, 'Dispositivo')).toBe(true);
  expect(findText(tree.root, 'Guante Sense')).toBe(true);
  expect(findText(tree.root, 'Señal')).toBe(true);
  expect(findText(tree.root, 'Excelente')).toBe(true);
  expect(findText(tree.root, 'Iniciar serie')).toBe(true);
});

test('calls onStart when the start button is pressed', async () => {
  const onStart = jest.fn();
  const tree = await renderPreparation({
    exerciseId: 'exercise_01',
    onStart,
  });

  pressText(tree.root, 'Iniciar serie');

  expect(onStart).toHaveBeenCalledTimes(1);
});

test('renders the connecting state without error values', async () => {
  const tree = await renderPreparation({
    exerciseId: 'exercise_01',
    status: 'connecting',
  });

  expect(findText(tree.root, 'Conectando guante…')).toBe(true);
  expect(findText(tree.root, 'Buscando guante…')).toBe(true);
  expect(findText(tree.root, 'Conectando…')).toBe(true);
  expect(findText(tree.root, 'No encontrado')).toBe(false);
  expect(findText(tree.root, 'Sin conexión')).toBe(false);
  expect(findText(tree.root, 'Guante conectado')).toBe(false);
  expect(findText(tree.root, 'Reconectar')).toBe(false);
  expect(findText(tree.root, 'Iniciar serie')).toBe(false);
});

test('renders the disconnected state when the glove fails', async () => {
  const tree = await renderPreparation({
    exerciseId: 'exercise_01',
    status: 'disconnected',
  });

  expect(findText(tree.root, 'No se detecta el guante')).toBe(true);
  expect(findText(tree.root, 'No encontrado')).toBe(true);
  expect(findText(tree.root, 'Sin conexión')).toBe(true);
  expect(findText(tree.root, 'Reconectar')).toBe(true);
  expect(findText(tree.root, 'Guante conectado')).toBe(false);
  expect(findText(tree.root, 'Iniciar serie')).toBe(false);
});

test('calls onRetry when the reconnect button is pressed', async () => {
  const onRetry = jest.fn();
  const tree = await renderPreparation({
    exerciseId: 'exercise_01',
    status: 'disconnected',
    onRetry,
  });

  pressText(tree.root, 'Reconectar');

  expect(onRetry).toHaveBeenCalledTimes(1);
});
