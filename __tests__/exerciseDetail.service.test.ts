/**
 * @format
 *
 * `GET /exercises/{ref}`: mappers y servicio.
 */

import { ApiClientError, apiClient } from '@/services/api/client';
import {
  getExerciseDetail,
  getExerciseGuide,
  toExerciseDetail,
  toExerciseGuide,
} from '@/services/exercise/exerciseDetail.service';
import type { ExerciseResponseDto } from '@/types/exercise.dto';

jest.mock('@/services/api/client', () => ({
  ...jest.requireActual('@/services/api/client'),
  apiClient: {
    get: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.MockedFunction<typeof apiClient.get>;

const FULL_DTO: ExerciseResponseDto = {
  id: 'exercise_01',
  exercise_id: 1,
  title: 'Cerrar la mano',
  description: 'Fortalecimiento de los flexores',
  category: 'HAND',
  series: 3,
  reps: 15,
  measure_unit: 'REPETITIONS',
  restSeconds: 30,
  duration: '0:45',
  videoDuration: '0:45',
  requirements: ['Usa el guante correctamente'],
  targetMuscles: ['Flexores de los dedos'],
  cover_image_url: 'https://cdn.physiosense.co/exercises/close.jpg',
  guideSteps: [
    { position: 1, title: 'Colócate el guante', description: 'Sin-optional' },
    { position: 2, title: 'Cierra el puño', image_url: 'https://cdn/step2.png' },
  ],
  is_active: true,
};

const MINIMAL_DTO: ExerciseResponseDto = {
  id: 'exercise_09',
  exercise_id: 9,
  title: '13566',
  category: 'HAND',
  series: 3,
  reps: 15,
  measure_unit: 'REPETITIONS',
  restSeconds: 30,
  is_active: true,
};

beforeEach(() => {
  getMock.mockReset();
});

describe('toExerciseDetail', () => {
  it('mapea el DTO completo del backend', () => {
    const detail = toExerciseDetail(FULL_DTO);

    expect(detail.id).toBe('exercise_01');
    expect(detail.title).toBe('Cerrar la mano');
    expect(detail.description).toBe('Fortalecimiento de los flexores');
    expect(detail.videoThumbnailUri).toEqual({
      uri: 'https://cdn.physiosense.co/exercises/close.jpg',
    });
    expect(detail.videoDuration).toBe('0:45');
    expect(detail.specs).toEqual({
      series: 3,
      repsPerSeries: 15,
      restTimeSeconds: 30,
      requirements: ['Usa el guante correctamente'],
    });
    expect(detail.targetMuscles).toEqual(['Flexores de los dedos']);
  });

  it('cae en los fallbacks cuando el DTO viene mínimo', () => {
    const detail = toExerciseDetail(MINIMAL_DTO);

    expect(detail.id).toBe('exercise_09');
    expect(detail.description).toBe('Sin descripción.');
    expect(detail.videoDuration).toBe('0:00');
    expect(detail.specs.requirements).toEqual([]);
    expect(detail.targetMuscles).toEqual([]);
    // Sin portada se usa la imagen local por defecto.
    expect(detail.videoThumbnailUri).toBeDefined();
    expect(detail.videoThumbnailUri).not.toEqual({ uri: undefined });
  });
});

describe('toExerciseGuide', () => {
  it('mapea los guideSteps del backend', () => {
    const guide = toExerciseGuide(FULL_DTO);

    expect(guide.id).toBe('exercise_01');
    expect(guide.title).toBe('Cerrar la mano');
    expect(guide.steps).toHaveLength(2);
    expect(guide.steps[0]).toEqual({
      id: 'exercise_01_step_1',
      title: 'Colócate el guante',
      description: 'Sin-optional',
      imageUri: undefined,
    });
    expect(guide.steps[1].imageUri).toEqual({ uri: 'https://cdn/step2.png' });
  });

  it('deriva los pasos de las instructions cuando no hay guideSteps', () => {
    const guide = toExerciseGuide({
      ...MINIMAL_DTO,
      instructions: 'Colócate el guante\nCierra el puño',
    });

    expect(guide.steps.map(step => step.title)).toEqual([
      'Colócate el guante',
      'Cierra el puño',
    ]);
  });

  it('deja la guía sin pasos cuando no hay guideSteps ni instructions', () => {
    expect(toExerciseGuide(MINIMAL_DTO).steps).toEqual([]);
  });
});

describe('getExerciseDetail', () => {
  it('pide el ejercicio por su código estable', async () => {
    getMock.mockResolvedValue(FULL_DTO);

    const detail = await getExerciseDetail('exercise_01');

    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith('/exercises/exercise_01');
    expect(detail.title).toBe('Cerrar la mano');
  });

  it('propaga el ApiClientError con el status del backend', async () => {
    getMock.mockRejectedValue(
      new ApiClientError('El ejercicio no existe', 404),
    );

    await expect(getExerciseDetail('exercise_99')).rejects.toMatchObject({
      message: 'El ejercicio no existe',
      status: 404,
    });
  });

  it('falla si la respuesta no viene con el formato del ejercicio', async () => {
    getMock.mockResolvedValue({ data: { id: 'exercise_01' } });

    await expect(getExerciseDetail('exercise_01')).rejects.toThrow(
      /formato esperado/,
    );
  });
});

describe('getExerciseGuide', () => {
  it('pide la guía por el mismo endpoint que el detalle', async () => {
    getMock.mockResolvedValue(FULL_DTO);

    const guide = await getExerciseGuide('exercise_01');

    expect(getMock).toHaveBeenCalledWith('/exercises/exercise_01');
    expect(guide.steps).toHaveLength(2);
  });
});
