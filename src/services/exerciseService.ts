import { apiClient } from '@/services/api/client';
import { MEDIA_LIMITS } from '@/config/env';
import type { PickedMedia } from '@/services/media/mediaService';
import type { ExerciseItem } from '@/components/exercises/ExerciseCard';

export interface ExerciseResponseDto {
  id: string;
  exercise_id: number;
  title: string;
  description?: string;
  category: string;
  series: number;
  reps: number;
  measure_unit: string;
  restSeconds: number;
  imageUri?: string;
  videoThumbnailUri?: string;
  video_url?: string;
  cover_image_url?: string;
  is_active: boolean;
  duration?: number;
  targetRange?: string;
  requirements?: string[];
  targetMuscles?: string[];
  guideSteps?: string[];
}

/** Query params opcionales para GET /exercises. */
export interface ExerciseListQueryDto {
  category?: string;
  search?: string;
}

/**
 * Mapea un ExerciseResponseDto del backend al ExerciseItem que consume la UI.
 */
export const toExerciseItem = (dto: ExerciseResponseDto): ExerciseItem => ({
  id: dto.id,
  title: dto.title,
  description: dto.description ?? '',
  series: `${dto.series} series`,
  reps: `${dto.reps} rep.`,
  duration: dto.duration ? `${dto.duration}` : '—',
  imageUrl: dto.cover_image_url ?? dto.imageUri,
  coverImageUrl: dto.cover_image_url,
});

export interface SaveExercisePayload {
  title: string;
  description: string;
  instructions: string;
  series: number;
  reps: number;
  restSeconds: number;
  requirements: string[];
  targetMuscles: string[];
  videoUrl: string;
  coverImageUrl: string;
}

interface UploadedMedia {
  url: string;
  duration?: number;
}

const toFormFile = (media: PickedMedia, fallbackName: string, fallbackType: string) =>
  ({
    uri: media.uri,
    name: media.fileName ?? fallbackName,
    type: media.fileType ?? fallbackType,
  }) as unknown as Blob;

const appendFile = (formData: FormData, media: PickedMedia, fallbackName: string, fallbackType: string) => {
  formData.append('file', toFormFile(media, fallbackName, fallbackType));
};

export const exerciseService = {
  uploadVideo: async (media: PickedMedia): Promise<UploadedMedia> => {
    if (media.fileSize && media.fileSize > MEDIA_LIMITS.videoMaxBytes) {
      throw new Error('El video supera el tamaño máximo de 100MB.');
    }

    const formData = new FormData();
    appendFile(formData, media, 'exercise-video.mp4', 'video/mp4');

    const result = await apiClient.postMultipart<UploadedMedia>('/exercises/media/video', formData);

    return { url: result.url, duration: media.duration ?? result.duration };
  },

  uploadCoverImage: async (media: PickedMedia): Promise<UploadedMedia> => {
    if (media.fileSize && media.fileSize > MEDIA_LIMITS.coverMaxBytes) {
      throw new Error('La imagen supera el tamaño máximo de 5MB.');
    }

    const formData = new FormData();
    appendFile(formData, media, 'exercise-cover.jpg', 'image/jpeg');

    const result = await apiClient.postMultipart<UploadedMedia>('/exercises/media/image', formData);

    return result;
  },

  createExercise: (payload: SaveExercisePayload) =>
    apiClient.post('/exercises', payload),

  updateExercise: (id: string, payload: SaveExercisePayload) =>
    apiClient.put(`/exercises/${id}`, payload),

  /**
   * GET /exercises
   * Lista el catálogo de ejercicios. Ambos query params son opcionales.
   * Lanza `ApiClientError` (status 401 si no hay token válido).
   *
   * Ejemplo de uso desde un componente:
   * ```ts
   * import { exerciseService, type ExerciseResponseDto } from '@/services/exerciseService';
   *
   * const [exercises, setExercises] = useState<ExerciseResponseDto[]>([]);
   * const [error, setError] = useState<string | null>(null);
   *
   * useEffect(() => {
   *   exerciseService
   *     .getExercises({ search: 'mano' })
   *     .then(setExercises)
   *     .catch((err) => {
   *       if (err instanceof ApiClientError && err.status === 401) {
   *         // redirigir a login / solicitar autenticación
   *       } else {
   *         setError(err.message);
   *       }
   *     });
   * }, []);
   * ```
   */
  getExercises: async (query?: ExerciseListQueryDto): Promise<ExerciseResponseDto[]> => {
    const params = new URLSearchParams();

    if (query?.category) {
      params.append('category', query.category);
    }
    if (query?.search) {
      params.append('search', query.search);
    }

    const queryString = params.toString();
    const path = queryString ? `/exercises?${queryString}` : '/exercises';

    return apiClient.get<ExerciseResponseDto[]>(path);
  },
};