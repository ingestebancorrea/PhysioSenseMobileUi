/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import {
  PrivateTabBarProvider,
  usePrivateTabBar,
} from '../src/context/PrivateTabBarContext';
import { ExerciseDetailScreen } from '../src/screens/exercise/ExerciseDetailScreen';
import { ABRIR_MANO_DETAIL } from '../src/screens/exercise/data/abrirMano';
import { CERRAR_MANO_DETAIL } from '../src/screens/exercise/data/cerrarMano';
import { OPOSICION_PULGAR_DETAIL } from '../src/screens/exercise/data/oposicionPulgar';
import { PINZA_DETAIL } from '../src/screens/exercise/data/pinza';
import { getExerciseDetail } from '../src/services/exercise/exerciseDetail.service';
import { ApiClientError } from '../src/services/api/client';
import type { ExerciseDetail } from '../src/types/exerciseDetail';

jest.mock('../src/services/exercise/exerciseDetail.service', () => ({
  getExerciseDetail: jest.fn(),
  getExerciseGuide: jest.fn(),
}));

const getExerciseDetailMock = getExerciseDetail as jest.MockedFunction<
  typeof getExerciseDetail
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

const CASES: Array<{ name: string; detail: ExerciseDetail; reps: string }> = [
  { name: 'Cerrar la mano', detail: CERRAR_MANO_DETAIL, reps: '15 por serie' },
  { name: 'Abrir la mano', detail: ABRIR_MANO_DETAIL, reps: '15 por serie' },
  { name: 'Pinza', detail: PINZA_DETAIL, reps: '12 por serie' },
  {
    name: 'Oposición del pulgar',
    detail: OPOSICION_PULGAR_DETAIL,
    reps: '10 por serie',
  },
];

test.each(CASES)(
  'renders the exercise detail with its own data ($name)',
  async ({ name, detail, reps }) => {
    const tree = await renderWithProviders(
      <ExerciseDetailScreen detail={detail} stepBadge="Paso 1 de 3" />,
    );

    expect(findText(tree.root, 'Información del ejercicio')).toBe(true);
    expect(findText(tree.root, name)).toBe(true);
    expect(findText(tree.root, 'Series')).toBe(true);
    expect(findText(tree.root, reps)).toBe(true);
    expect(findText(tree.root, 'Requisitos')).toBe(true);
    expect(findText(tree.root, 'Usa el guante correctamente')).toBe(true);
    expect(findText(tree.root, detail.targetMuscles[0])).toBe(true);
    expect(findText(tree.root, detail.videoDuration)).toBe(true);
    expect(findText(tree.root, 'Continuar')).toBe(true);
    expect(findText(tree.root, 'Paso 1 de 3')).toBe(true);
  },
);

test('does not show the step badge when it is not provided', async () => {
  const tree = await renderWithProviders(
    <ExerciseDetailScreen detail={CERRAR_MANO_DETAIL} />,
  );

  expect(findText(tree.root, 'Paso 1 de 3')).toBe(false);
});

test('calls onContinue when the continue button is pressed', async () => {
  const onContinue = jest.fn();
  const tree = await renderWithProviders(
    <ExerciseDetailScreen detail={CERRAR_MANO_DETAIL} onContinue={onContinue} />,
  );

  pressText(tree.root, 'Continuar');

  expect(onContinue).toHaveBeenCalledTimes(1);
});

test('hides the tab bar on mount and restores it on unmount', async () => {
  const Harness = () => {
    const { isHidden } = usePrivateTabBar();
    const [mounted, setMounted] = React.useState(true);

    return (
      <>
        <Text>{isHidden ? 'oculto' : 'visible'}</Text>
        <TouchableOpacity onPress={() => setMounted(false)}>
          <Text>desmontar</Text>
        </TouchableOpacity>
        {mounted ? (
          <ExerciseDetailScreen detail={CERRAR_MANO_DETAIL} />
        ) : null}
      </>
    );
  };

  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <PrivateTabBarProvider>
        <NavigationContainer>
          <Harness />
        </NavigationContainer>
      </PrivateTabBarProvider>,
    );
  });

  expect(findText(tree!.root, 'oculto')).toBe(true);

  pressText(tree!.root, 'desmontar');

  expect(findText(tree!.root, 'visible')).toBe(true);
});

beforeEach(() => {
  getExerciseDetailMock.mockReset();
});

test('muestra el loader mientras carga y después el título que devuelve la API', async () => {
  let resolve: (detail: ExerciseDetail) => void = () => {};
  getExerciseDetailMock.mockReturnValue(
    new Promise<ExerciseDetail>(r => {
      resolve = r;
    }),
  );

  const tree = await renderWithProviders(
    <ExerciseDetailScreen exerciseId="exercise_01" />,
  );

  // Mientras carga no se pinta el detalle: se ve el loader y nada más.
  expect(findText(tree.root, CERRAR_MANO_DETAIL.title)).toBe(false);
  expect(tree.root.findAll(node => node.type === Image).length).toBe(1);

  await ReactTestRenderer.act(async () => {
    resolve({ ...CERRAR_MANO_DETAIL, title: 'Cerrar la mano (API)' });
  });

  expect(getExerciseDetailMock).toHaveBeenCalledWith('exercise_01');
  expect(findText(tree.root, 'Cerrar la mano (API)')).toBe(true);
}, 30000);

test('muestra el modal de error cuando la API no encuentra el ejercicio', async () => {
  getExerciseDetailMock.mockRejectedValue(
    new ApiClientError('El ejercicio no existe', 404),
  );

  const tree = await renderWithProviders(
    <ExerciseDetailScreen exerciseId="exercise_99" />,
  );

  expect(findText(tree.root, 'No se pudo cargar el ejercicio')).toBe(true);
  expect(findText(tree.root, 'El ejercicio no existe (HTTP 404)')).toBe(true);

  // Queda el estado de error en pantalla con la opción de reintentar.
  expect(findText(tree.root, 'Reintentar')).toBe(true);
  expect(findText(tree.root, 'Volver')).toBe(true);
}, 30000);
