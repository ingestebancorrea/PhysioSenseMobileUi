import { ApiClientError } from '@/services/api/client';
import type { ExerciseResponseDto } from '@/types/exercise.dto';

/**
 * El backend responde el DTO del ejercicio (`ExerciseResponseDto`).
 *
 * Si la forma no es la esperada (envoltorio, 204 sin cuerpo o una respuesta
 * del proxy) es mejor fallar con un mensaje claro que mapear un ejercicio
 * vacío y dejar al usuario creyendo que se guardó o se cargó.
 *
 * Vive aparte para que el servicio de escritura y el de detalle compartan la
 * misma validación.
 */
export const assertExerciseDto = (value: unknown): ExerciseResponseDto => {
  const dto = value as ExerciseResponseDto | undefined;

  if (!dto || typeof dto.id !== 'string' || typeof dto.title !== 'string') {
    throw new ApiClientError(
      'La API no devolvió el ejercicio con el formato esperado.',
    );
  }

  return dto;
};
