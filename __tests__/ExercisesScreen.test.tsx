/**
 * @format
 *
 * El listado de ejercicios del fisioterapeuta debe mostrar lo que responde
 * `GET /exercises` (mapeado a ExerciseItem), no una data quemada.
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { ExercisesScreen } from '../src/screens/private/ExercisesScreen';
import { AuthProvider } from '../src/context/AuthContext';
import { DrawerProvider } from '../src/context/DrawerContext';
import { PrivateNavigationProvider } from '../src/context/PrivateNavigationContext';
import { ToastProvider } from '../src/context/ToastContext';
import { listExercises } from '../src/services/exercise/exerciseList.service';
import { exerciseService } from '../src/services/exerciseService';
import { hydrateSession } from '../src/services/auth/tokenStorage';
import { ICONS } from '../src/constants/icons';
import { UserRoleId } from '../src/types/auth';
import type { ExerciseItem } from '../src/components/exercises/ExerciseCard';
import type { ExerciseResponseDto } from '../src/types/exercise.dto';

jest.mock('../src/services/exercise/exerciseList.service', () => ({
  listExercises: jest.fn(),
  toExerciseItem: jest.fn((dto: any) => ({
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    series: `${dto.series} series`,
    reps: `${dto.reps} rep.`,
    duration: dto.duration ?? '—',
    imageUrl: dto.cover_image_url ?? dto.imageUri ?? undefined,
    coverImageUrl: dto.cover_image_url ?? undefined,
  })),
}));

jest.mock('../src/services/exerciseService', () => ({
  exerciseService: {
    deactivateExercise: jest.fn(),
  },
}));

jest.mock('../src/services/auth/tokenStorage', () => ({
  ...jest.requireActual('../src/services/auth/tokenStorage'),
  hydrateSession: jest.fn(),
}));

const listExercisesMock = listExercises as jest.MockedFunction<
  typeof listExercises
>;
const deactivateMock = exerciseService.deactivateExercise as jest.MockedFunction<
  typeof exerciseService.deactivateExercise
>;
const hydrateSessionMock = hydrateSession as jest.MockedFunction<
  typeof hydrateSession
>;

const ITEMS: ExerciseItem[] = [
  {
    id: 'exercise_01',
    title: 'Cerrar la mano',
    description: 'Fortalecimiento de los flexores',
    series: '3 series',
    reps: '15 rep.',
    duration: '0:45',
  },
  {
    id: 'exercise_07',
    title: '13566',
    description: '',
    series: '3 series',
    reps: '15 rep.',
    duration: '—',
  },
];

const DEACTIVATED: ExerciseResponseDto = {
  id: 'exercise_01',
  exercise_id: 1,
  title: 'Cerrar la mano',
  category: 'HAND',
  series: 3,
  reps: 15,
  measure_unit: 'REPETITIONS',
  restSeconds: 30,
  is_active: false,
};

const textsOf = (tree: ReactTestRenderer.ReactTestRenderer): string[] =>
  tree.root
    .findAll(node => String(node.type) === 'Text')
    .map(node => {
      const children = node.props.children;
      return Array.isArray(children) ? children.join('') : String(children);
    });

/** Toca el ícono de la papelera de la primera tarjeta. */
const pressTrash = async (
  tree: ReactTestRenderer.ReactTestRenderer,
): Promise<void> => {
  const trash = tree.root.findAllByType(ICONS.trash)[0];

  if (!trash) {
    throw new Error('No se encontró el ícono de la papelera');
  }

  let pressable: ReactTestRenderer.ReactTestInstance | null = trash;

  while (pressable && typeof pressable.props?.onPress !== 'function') {
    pressable = pressable.parent;
  }

  await ReactTestRenderer.act(async () => {
    pressable?.props.onPress();
  });
};

/** Toca un botón del modal por su label. */
const pressModalButton = async (
  tree: ReactTestRenderer.ReactTestRenderer,
  label: string,
): Promise<void> => {
  const button = tree.root
    .findAll(node => String(node.type) === 'Text')
    .find(node => {
      const children = node.props.children;
      const text = Array.isArray(children) ? children.join('') : String(children);
      return text === label;
    });

  if (!button) {
    throw new Error(`No se encontró el botón "${label}"`);
  }

  let pressable: ReactTestRenderer.ReactTestInstance | null = button;

  while (pressable && typeof pressable.props?.onPress !== 'function') {
    pressable = pressable.parent;
  }

  await ReactTestRenderer.act(async () => {
    pressable?.props.onPress();
  });
};

let currentTree: ReactTestRenderer.ReactTestRenderer | undefined;

const render = async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <AuthProvider>
        <ToastProvider>
          <DrawerProvider>
            <PrivateNavigationProvider onNavigate={jest.fn()}>
              <ExercisesScreen />
            </PrivateNavigationProvider>
          </DrawerProvider>
        </ToastProvider>
      </AuthProvider>,
    );
  });

  currentTree = tree as ReactTestRenderer.ReactTestRenderer;

  return currentTree;
};

/**
 * El aviso flotante se autodestruye con un timer: sin desmontar el árbol
 * queda vivo y dispara después de que el entorno de test se cerró.
 */
afterEach(async () => {
  if (currentTree) {
    const tree = currentTree;
    currentTree = undefined;

    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  }
});

beforeEach(() => {
  listExercisesMock.mockReset();
  listExercisesMock.mockResolvedValue(ITEMS);

  deactivateMock.mockReset();
  deactivateMock.mockResolvedValue(DEACTIVATED);

  hydrateSessionMock.mockReset();
  hydrateSessionMock.mockResolvedValue({
    accessToken: 'token',
    user: {
      id: 7,
      role: UserRoleId.FISIOTERAPEUTA,
      email: 'fisio@correo.com',
      displayName: 'Laura Martínez',
      photoURL: '',
    },
  });
});

test('lista los ejercicios que devuelve GET /exercises', async () => {
  const tree = await render();
  const texts = textsOf(tree);

  expect(listExercisesMock).toHaveBeenCalledTimes(1);
  expect(texts).toContain('Cerrar la mano');
  // El ejercicio creado en el backend también debe aparecer.
  expect(texts).toContain('13566');
}, 30000);

test('muestra el loader mientras carga y la lista cuando termina', async () => {
  let resolve: (items: ExerciseItem[]) => void = () => {};
  listExercisesMock.mockReturnValue(
    new Promise<ExerciseItem[]>(r => {
      resolve = r;
    }),
  );

  const tree = await render();

  expect(textsOf(tree)).toContain('Cargando tus ejercicios');

  await ReactTestRenderer.act(async () => {
    resolve(ITEMS);
  });

  const texts = textsOf(tree);
  expect(texts).not.toContain('Cargando tus ejercicios');
  expect(texts).toContain('Cerrar la mano');
}, 30000);

test('la papelera abre la confirmación y no dispara la petición', async () => {
  const tree = await render();

  await pressTrash(tree);

  const texts = textsOf(tree);

  expect(texts).toContain('Dar de baja el ejercicio');
  expect(texts).toContain(
    '"Cerrar la mano" dejará de estar disponible en el catálogo. Las sesiones que ya lo usen conservan su historial. ¿Deseas continuar?',
  );
  expect(deactivateMock).not.toHaveBeenCalled();
}, 30000);

test('confirmar da de baja el ejercicio y vuelve a pedir la lista', async () => {
  const tree = await render();

  await pressTrash(tree);
  await pressModalButton(tree, 'Dar de baja');

  expect(deactivateMock).toHaveBeenCalledTimes(1);
  expect(deactivateMock).toHaveBeenCalledWith('exercise_01');

  // La lista se vuelve a pedir para repintarla sin el ejercicio dado de baja.
  expect(listExercisesMock).toHaveBeenCalledTimes(2);

  const texts = textsOf(tree);
  expect(texts).toContain('Ejercicio dado de baja');
  expect(texts).toContain('"Cerrar la mano" ya no aparece en el catálogo.');
}, 30000);

test('si la baja falla se muestra el modal con el detalle del error', async () => {
  deactivateMock.mockRejectedValue(new Error('El ejercicio no existe (HTTP 404)'));

  const tree = await render();

  await pressTrash(tree);
  await pressModalButton(tree, 'Dar de baja');

  const texts = textsOf(tree);

  expect(texts).toContain('No se pudo dar de baja el ejercicio');
  expect(texts).toContain('El ejercicio no existe (HTTP 404)');
  expect(texts).not.toContain('Ejercicio dado de baja');

  // No se repinta la lista cuando la baja falló.
  expect(listExercisesMock).toHaveBeenCalledTimes(1);
}, 30000);
