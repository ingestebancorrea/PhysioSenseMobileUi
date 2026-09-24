/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { PrivateTabBarProvider } from '../src/context/PrivateTabBarContext';
import { ExerciseGuideScreen } from '../src/screens/exercise-guide/ExerciseGuideScreen';
import { ABRIR_MANO_GUIDE } from '../src/screens/exercise-guide/data/guideAbrirMano';
import { CERRAR_MANO_GUIDE } from '../src/screens/exercise-guide/data/guideCerrarMano';
import { OPOSICION_PULGAR_GUIDE } from '../src/screens/exercise-guide/data/guideOposicionPulgar';
import { PINZA_GUIDE } from '../src/screens/exercise-guide/data/guidePinza';
import type { ExerciseGuide } from '../src/types/exerciseGuide';

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

const CASES: Array<{ name: string; guide: ExerciseGuide }> = [
  { name: 'Cerrar la mano', guide: CERRAR_MANO_GUIDE },
  { name: 'Abrir la mano', guide: ABRIR_MANO_GUIDE },
  { name: 'Pinza', guide: PINZA_GUIDE },
  { name: 'Oposición del pulgar', guide: OPOSICION_PULGAR_GUIDE },
];

test.each(CASES)(
  'renders the exercise guide with its own steps ($name)',
  async ({ guide }) => {
    const tree = await renderWithProviders(
      <ExerciseGuideScreen guide={guide} />,
    );

    expect(findText(tree.root, 'Cómo realizarlo')).toBe(true);
    expect(findText(tree.root, guide.steps[0].title)).toBe(true);
    expect(findText(tree.root, guide.steps[0].description)).toBe(true);
    expect(findText(tree.root, guide.steps[4].title)).toBe(true);
    expect(findText(tree.root, 'Entendido, comenzar')).toBe(true);
  },
);

test('renders an image for every step', async () => {
  const tree = await renderWithProviders(
    <ExerciseGuideScreen guide={CERRAR_MANO_GUIDE} />,
  );

  const images = tree.root.findAll(node => node.type === Image);
  expect(images).toHaveLength(CERRAR_MANO_GUIDE.steps.length);
});

test('calls onStart when the footer button is pressed', async () => {
  const onStart = jest.fn();
  const tree = await renderWithProviders(
    <ExerciseGuideScreen guide={CERRAR_MANO_GUIDE} onStart={onStart} />,
  );

  pressText(tree.root, 'Entendido, comenzar');

  expect(onStart).toHaveBeenCalledTimes(1);
});
