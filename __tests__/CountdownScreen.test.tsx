/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PrivateTabBarProvider } from '../src/context/PrivateTabBarContext';
import { CountdownScreen } from '../src/screens/countdown/CountdownScreen';

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

const renderCountdown = (): Promise<ReactTestRenderer.ReactTestRenderer> => {
  const Stack = createNativeStackNavigator();

  return renderWithProviders(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Countdown"
        component={CountdownScreen}
        initialParams={{ exerciseId: 'exercise_01' }}
      />
      <Stack.Screen name="Execution">
        {({ route }) => (
          <Text>{`EXEC:${(route.params as { exerciseId?: string })?.exerciseId}`}</Text>
        )}
      </Stack.Screen>
    </Stack.Navigator>,
  );
};

jest.useFakeTimers();

test('renders the countdown screen with the exercise header', async () => {
  const tree = await renderCountdown();

  expect(findText(tree.root, 'Cerrar la mano')).toBe(true);
  expect(findText(tree.root, 'Serie 1 de 3')).toBe(true);
  expect(findText(tree.root, 'Comenzamos en')).toBe(true);
  expect(findText(tree.root, 'Prepárate')).toBe(true);
  expect(findText(tree.root, 'Consejo')).toBe(true);
  expect(findText(tree.root, '¡Ya!')).toBe(false);
});

test('shows "¡Ya!" when the countdown finishes', async () => {
  const tree = await renderCountdown();

  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(5000);
  });

  expect(findText(tree.root, 'Prepárate')).toBe(false);
  expect(findText(tree.root, '¡Ya!')).toBe(true);
});

test('navigates to Execution with the exerciseId after finishing', async () => {
  const tree = await renderCountdown();

  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(5000);
  });
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(800);
  });

  expect(findText(tree.root, 'EXEC:exercise_01')).toBe(true);
});
