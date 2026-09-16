/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';

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

test('renders registration step 0 (role selection)', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <NavigationContainer>
        <RegisterFlowNavigator />
      </NavigationContainer>,
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
      <NavigationContainer>
        <RegisterFlowNavigator />
      </NavigationContainer>,
    );
  });

  await ReactTestRenderer.act(async () => {
    pressText(tree!, 'Soy fisioterapeuta');
  });

  expect(findText(tree!.root, 'Crea tu cuenta')).toBe(true);
});
