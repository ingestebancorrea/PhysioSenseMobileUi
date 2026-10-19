import { apiClient } from '@/services/api/client';
import type { ExerciseItem } from '@/components/exercises/ExerciseCard';
import type { ExerciseResponseDto } from '@/types/exercise.dto';
import type { ExerciseListQueryDto } from '@/types/exercise.dto';

const EXERCISES_PATH = '/exercises';

/**
 * GET /exercises
 * Devuelve los ejercicios ya mapeados a ExerciseItem (listo para la UI).
 * apiClient inyecta automáticamente el header Authorization: Bearer <token>.
 * 401: el cliente limpia la sesión y lanza ApiClientError con status 401.
 */
export const listExercises = async (
  query?: ExerciseListQueryDto,
): Promise<ExerciseItem[]> => {
  const params = new URLSearchParams();

  if (query?.category) {
    params.append('category', query.category);
  }
  if (query?.search) {
    params.append('search', query.search);
  }

  const queryString = params.toString();
  const path = queryString ? `${EXERCISES_PATH}?${queryString}` : EXERCISES_PATH;

  const dtos = await apiClient.get<ExerciseResponseDto[]>(path);

  return dtos.map((dto) => ({
    id: dto.id,
    title: dto.title,
    description: dto.description ?? '',
    series: `${dto.series} series`,
    reps: `${dto.reps} rep.`,
    duration: dto.duration ? `${dto.duration}` : '—',
    imageUrl: dto.cover_image_url ?? dto.imageUri,
    coverImageUrl: dto.cover_image_url,
  }));
};
