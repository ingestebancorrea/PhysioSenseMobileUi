/**
 * @format
 *
 * Al guardar un ejercicio:
 *
 * - Si el POST sale bien, se muestra el aviso flotante (no un modal) y se
 *   vuelve al listado, que recarga el catálogo con un GET nuevo.
 * - Si el POST falla, se muestra el modal de error y el usuario se queda en
 *   el formulario para poder reintentar.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { CreateExerciseScreen } from '../src/screens/physiotherapist/CreateExerciseScreen';
import { ToastProvider } from '../src/context/ToastContext';
import { exerciseService } from '../src/services/exerciseService';
import { getExercise } from '../src/services/exercise/exerciseDetail.service';
import type { ExerciseItem } from '../src/components/exercises/ExerciseCard';
import type { ExerciseResponseDto } from '../src/types/exercise.dto';

jest.mock('../src/services/exerciseService', () => ({
  exerciseService: {
    createExercise: jest.fn(),
    updateExercise: jest.fn(),
    uploadVideo: jest.fn(),
    uploadCoverImage: jest.fn(),
  },
}));

jest.mock('../src/services/exercise/exerciseDetail.service', () => ({
  getExercise: jest.fn(),
  getExerciseDetail: jest.fn(),
  getExerciseGuide: jest.fn(),
}));

jest.mock('../src/services/media/mediaService', () => ({
  mediaService: {
    pickVideo: jest.fn(),
    pickCoverImage: jest.fn(),
  },
}));

const createMock = exerciseService.createExercise as jest.MockedFunction<
  typeof exerciseService.createExercise
>;
const updateMock = exerciseService.updateExercise as jest.MockedFunction<
  typeof exerciseService.updateExercise
>;
const getExerciseMock = getExercise as jest.MockedFunction<typeof getExercise>;

const SAVED: ExerciseResponseDto = {
  id: 'exercise_09',
  exercise_id: 9,
  title: 'Cerrar la mano',
  description: 'Ejercicio de prueba',
  category: 'HAND',
  series: 3,
  reps: 15,
  measure_unit: 'REPETITIONS',
  restSeconds: 30,
  cover_image_url: 'https://cdn.physiosense.co/cover.jpg',
  is_active: true,
};

/** Lo que el listado conoce de un ejercicio: sólo el resumen. */
const LIST_ITEM: ExerciseItem = {
  id: 'exercise_01',
  title: 'Cerrar la mano',
  description: 'Fortalecimiento de los flexores',
  series: '3 series',
  reps: '15 rep.',
  duration: '0:45',
};

/** Lo que devuelve la API para ese mismo ejercicio. */
const FULL_EXERCISE: ExerciseResponseDto = {
  id: 'exercise_01',
  exercise_id: 1,
  title: 'Cerrar la mano (API)',
  description: 'Descripción que viene del backend',
  instructions: 'Colócate el guante\nCierra el puño',
  category: 'HAND',
  series: 4,
  reps: 12,
  measure_unit: 'REPETITIONS',
  restSeconds: 45,
  requirements: ['Requisito que viene de la API'],
  targetMuscles: ['Músculo que viene de la API'],
  video_url: 'https://cdn.physiosense.co/video.mp4',
  cover_image_url: 'https://cdn.physiosense.co/cover.jpg',
  is_active: true,
};

const textsOf = (tree: ReactTestRenderer.ReactTestRenderer): string[] =>
  tree.root
    .findAll(node => String(node.type) === 'Text')
    .map(node => {
      const children = node.props.children;
      return Array.isArray(children) ? children.join('') : String(children);
    });

const pressText = async (
  tree: ReactTestRenderer.ReactTestRenderer,
  label: string,
): Promise<void> => {
  const labelNode = tree.root
    .findAll(node => String(node.type) === 'Text')
    .find(node => {
      const children = node.props.children;
      const text = Array.isArray(children) ? children.join('') : String(children);
      return text === label;
    });

  if (!labelNode) {
    throw new Error(`No se encontró el texto "${label}"`);
  }

  // El label vive dentro del botón: se sube hasta el primer ancestro que
  // tenga `onPress`.
  let pressable: ReactTestRenderer.ReactTestInstance | null = labelNode;

  while (pressable && typeof pressable.props?.onPress !== 'function') {
    pressable = pressable.parent;
  }

  if (!pressable) {
    throw new Error(`El texto "${label}" no está dentro de un botón`);
  }

  await ReactTestRenderer.act(async () => {
    pressable?.props.onPress();
  });
};

/** Rellena el nombre y avanza hasta el paso 3 (revisión). */
const goToReviewStep = async (
  tree: ReactTestRenderer.ReactTestRenderer,
): Promise<void> => {
  const input = tree.root.findAll(
    node => String(node.type) === 'TextInput',
  )[0];

  await ReactTestRenderer.act(async () => {
    input.props.onChangeText('Cerrar la mano');
  });

  await pressText(tree, 'Siguiente');
  await pressText(tree, 'Siguiente');
};

/** Avanza hasta el paso 3 sin tocar los campos: ya vienen de la API. */
const goToReviewStepFilled = async (
  tree: ReactTestRenderer.ReactTestRenderer,
): Promise<void> => {
  await pressText(tree, 'Siguiente');
  await pressText(tree, 'Siguiente');
};

const inputValuesOf = (
  tree: ReactTestRenderer.ReactTestRenderer,
): string[] =>
  tree.root
    .findAll(node => String(node.type) === 'TextInput')
    .map(node => String(node.props.value ?? ''));

beforeEach(() => {
  createMock.mockReset();
  createMock.mockResolvedValue(SAVED);

  updateMock.mockReset();
  updateMock.mockResolvedValue(SAVED);

  getExerciseMock.mockReset();
  getExerciseMock.mockResolvedValue(FULL_EXERCISE);
});

test('muestra el aviso flotante y vuelve al listado cuando el POST sale bien', async () => {
  const onBack = jest.fn();
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <ToastProvider>
        <CreateExerciseScreen onBack={onBack} />
      </ToastProvider>,
    );
  });

  const renderer = tree as ReactTestRenderer.ReactTestRenderer;

  await goToReviewStep(renderer);
  await pressText(renderer, 'Guardar ejercicio');

  expect(createMock).toHaveBeenCalledTimes(1);

  const texts = textsOf(renderer);

  // El aviso flotante, no el modal.
  expect(texts).toContain('Ejercicio creado');
  expect(texts).toContain('"Cerrar la mano" se guardó correctamente.');
  expect(texts).not.toContain('No se pudo guardar el ejercicio');

  // Se vuelve al listado para que recargue con el GET.
  expect(onBack).toHaveBeenCalledTimes(1);

  // El aviso se autodestruye: hay que desmontarlo para que no quede el timer
  // vivo después del test.
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
}, 30000);

test('en edición pide el ejercicio a la API y llena el formulario con eso', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <ToastProvider>
        <CreateExerciseScreen initialExercise={LIST_ITEM} />
      </ToastProvider>,
    );
  });

  const renderer = tree as ReactTestRenderer.ReactTestRenderer;

  // La petición va por el código estable del ejercicio.
  expect(getExerciseMock).toHaveBeenCalledTimes(1);
  expect(getExerciseMock).toHaveBeenCalledWith('exercise_01');

  // El formulario quedó con los datos de la API, no con los del listado.
  expect(inputValuesOf(renderer)).toContain('Cerrar la mano (API)');
  expect(inputValuesOf(renderer)).toContain('Descripción que viene del backend');

  // Los requisitos y los músculos se ven en el paso 2. Los requisitos son
  // campos editables, así que van en el valor del input.
  await pressText(renderer, 'Siguiente');

  expect(inputValuesOf(renderer)).toContain('Requisito que viene de la API');
  expect(textsOf(renderer)).toContain('Músculo que viene de la API');

  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
}, 30000);

test('en edición guarda con PUT /exercises/{ref} y el cuerpo armado por el formulario', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <ToastProvider>
        <CreateExerciseScreen initialExercise={LIST_ITEM} />
      </ToastProvider>,
    );
  });

  const renderer = tree as ReactTestRenderer.ReactTestRenderer;

  await goToReviewStepFilled(renderer);
  await pressText(renderer, 'Guardar ejercicio');

  expect(createMock).not.toHaveBeenCalled();
  expect(updateMock).toHaveBeenCalledTimes(1);
  expect(updateMock).toHaveBeenCalledWith(
    'exercise_01',
    expect.objectContaining({
      title: 'Cerrar la mano (API)',
      description: 'Descripción que viene del backend',
      instructions: 'Colócate el guante\nCierra el puño',
      series: 4,
      reps: 12,
      restSeconds: 45,
      requirements: ['Requisito que viene de la API'],
      targetMuscles: ['Músculo que viene de la API'],
      // El media remoto se reusa: no se vuelve a subir.
      videoUrl: 'https://cdn.physiosense.co/video.mp4',
      coverImageUrl: 'https://cdn.physiosense.co/cover.jpg',
    }),
  );

  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
}, 30000);

test('si el ejercicio no se puede cargar, muestra el error y no deja editar', async () => {
  getExerciseMock.mockRejectedValue(
    new Error('El ejercicio no existe (HTTP 404)'),
  );

  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <ToastProvider>
        <CreateExerciseScreen initialExercise={LIST_ITEM} />
      </ToastProvider>,
    );
  });

  const renderer = tree as ReactTestRenderer.ReactTestRenderer;
  const texts = textsOf(renderer);

  expect(texts).toContain('El ejercicio no existe (HTTP 404)');
  expect(texts).toContain('Reintentar');
  expect(texts).not.toContain('Guardar ejercicio');

  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
}, 30000);

test('muestra el modal de error y se queda en el formulario si el POST falla', async () => {
  const onBack = jest.fn();
  createMock.mockRejectedValue(new Error('Forbidden resource (HTTP 403)'));

  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <ToastProvider>
        <CreateExerciseScreen onBack={onBack} />
      </ToastProvider>,
    );
  });

  const renderer = tree as ReactTestRenderer.ReactTestRenderer;

  await goToReviewStep(renderer);
  await pressText(renderer, 'Guardar ejercicio');

  const texts = textsOf(renderer);

  expect(texts).toContain('No se pudo guardar el ejercicio');
  expect(texts).toContain('Forbidden resource (HTTP 403)');
  expect(texts).not.toContain('Ejercicio creado');

  // No se sale del formulario: el usuario puede volver a intentarlo.
  expect(onBack).not.toHaveBeenCalled();

  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
}, 30000);
