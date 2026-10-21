import type { ImageSourcePropType } from 'react-native';

import { apiClient } from '@/services/api/client';
import { assertExerciseDto } from '@/services/exercise/exerciseAssertions';
import type { ExerciseResponseDto } from '@/types/exercise.dto';
import type { ExerciseDetail } from '@/types/exerciseDetail';
import type { ExerciseGuide, ExerciseGuideStep } from '@/types/exerciseGuide';

const EXERCISES_PATH = '/exercises';

// Misma ruta relativa que usa previewMapper.ts (src/services/exercise → raíz/assets).
const FALLBACK_THUMBNAIL: ImageSourcePropType = require('../../../assets/glove.png');

/** Mapea el DTO del backend al `ExerciseDetail` que consume la UI. */
export const toExerciseDetail = (dto: ExerciseResponseDto): ExerciseDetail => ({
  id: dto.id,
  title: dto.title,
  videoThumbnailUri: dto.cover_image_url
    ? ({ uri: dto.cover_image_url } as ImageSourcePropType)
    : FALLBACK_THUMBNAIL,
  videoDuration: dto.videoDuration ?? dto.duration ?? '0:00',
  description: dto.description ?? 'Sin descripción.',
  specs: {
    series: dto.series,
    repsPerSeries: dto.reps,
    restTimeSeconds: dto.restSeconds,
    requirements: dto.requirements ?? [],
  },
  targetMuscles: dto.targetMuscles ?? [],
});

/**
 * Pasos de la guía derivados de `instructions`.
 *
 * El backend guarda las instrucciones como un bloque de texto donde cada
 * línea es un paso, así que cuando el ejercicio todavía no tiene pasos
 * materializados se pueden reconstruir desde ahí. No se inventa nada: si no
 * hay instrucciones, la guía queda sin pasos.
 */
const stepsFromInstructions = (dto: ExerciseResponseDto): ExerciseGuideStep[] =>
  (dto.instructions ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `${dto.id}_step_${index + 1}`,
      title: line,
      description: '',
    }));

/** Mapea el DTO del backend a la `ExerciseGuide` que consume la UI. */
export const toExerciseGuide = (dto: ExerciseResponseDto): ExerciseGuide => {
  const steps = (dto.guideSteps ?? []).map((step) => ({
    id: `${dto.id}_step_${step.position}`,
    title: step.title,
    description: step.description ?? '',
    imageUri: step.image_url
      ? ({ uri: step.image_url } as ImageSourcePropType)
      : undefined,
  }));

  return {
    id: dto.id,
    title: dto.title,
    steps: steps.length > 0 ? steps : stepsFromInstructions(dto),
  };
};

/**
 * GET /exercises/{ref}
 *
 * `ref` acepta el código estable ("exercise_01") o el id numérico.
 * Ojo: este endpoint NO filtra por `is_active`, así que un ejercicio dado de
 * baja se sigue pudiendo abrir en detalle aunque ya no esté en el listado.
 *
 * Devuelve el DTO crudo: es lo que necesita el formulario de editar para
 * armar el cuerpo del `PUT /exercises/{ref}`.
 *
 * 404: "El ejercicio no existe" (ApiClientError status 404).
 */
export const getExercise = async (
  ref: string,
): Promise<ExerciseResponseDto> => {
  const dto = assertExerciseDto(
    await apiClient.get<unknown>(`${EXERCISES_PATH}/${ref}`),
  );

  return dto;
};

/**
 * GET /exercises/{ref}
 *
 * El detalle que pinta la UI: título, portada, specs y músculos.
 */
export const getExerciseDetail = async (
  ref: string,
): Promise<ExerciseDetail> => toExerciseDetail(await getExercise(ref));

/**
 * GET /exercises/{ref}
 *
 * La guía sale del mismo endpoint que el detalle: `guideSteps` viene en el
 * mismo DTO.
 */
export const getExerciseGuide = async (ref: string): Promise<ExerciseGuide> =>
  toExerciseGuide(await getExercise(ref));
