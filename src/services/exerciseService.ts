import { apiClient } from '@/services/api/client';
import { assertExerciseDto } from '@/services/exercise/exerciseAssertions';
import { MEDIA_LIMITS } from '@/config/env';
import type { PickedMedia } from '@/services/media/mediaService';
import type {
  ExerciseResponseDto,
  SaveExercisePayload,
} from '@/types/exercise.dto';

export type { SaveExercisePayload } from '@/types/exercise.dto';

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

const appendFile = (formData: FormData, file: Blob) => {
  formData.append('file', file);
};

/**
 * Servicio de escritura del catálogo de ejercicios:
 * POST /exercises, PUT /exercises/{ref}, PATCH /exercises/{ref}/deactivate y
 * subida de multimedia.
 */
export const exerciseService = {
  uploadVideo: async (media: PickedMedia): Promise<UploadedMedia> => {
    if (media.fileSize && media.fileSize > MEDIA_LIMITS.videoMaxBytes) {
      throw new Error('El video supera el tamaño máximo de 100MB.');
    }

    const formData = new FormData();
    appendFile(formData, toFormFile(media, 'exercise-video.mp4', 'video/mp4'));

    const result = await apiClient.postMultipart<UploadedMedia>(
      '/exercises/media/video',
      formData,
    );

    return { url: result.url, duration: media.duration ?? result.duration };
  },

  uploadCoverImage: async (media: PickedMedia): Promise<UploadedMedia> => {
    if (media.fileSize && media.fileSize > MEDIA_LIMITS.coverMaxBytes) {
      throw new Error('La imagen supera el tamaño máximo de 5MB.');
    }

    const formData = new FormData();
    appendFile(formData, toFormFile(media, 'exercise-cover.jpg', 'image/jpeg'));

    const result = await apiClient.postMultipart<UploadedMedia>(
      '/exercises/media/image',
      formData,
    );

    return result;
  },

  /**
   * POST /exercises
   * Crea un ejercicio y devuelve el DTO que responde el backend.
   */
  createExercise: async (
    payload: SaveExercisePayload,
  ): Promise<ExerciseResponseDto> => {
    const response = await apiClient.post<unknown>('/exercises', payload);

    return assertExerciseDto(response);
  },

  /**
   * PUT /exercises/{ref}
   * Actualiza un ejercicio. `ref` acepta el código estable ("exercise_01")
   * o el id numérico.
   */
  updateExercise: async (
    ref: string,
    payload: SaveExercisePayload,
  ): Promise<ExerciseResponseDto> => {
    const response = await apiClient.put<unknown>(
      `/exercises/${ref}`,
      payload,
    );

    return assertExerciseDto(response);
  },

  /**
   * PATCH /exercises/{ref}/deactivate
   *
   * Baja lógica: el ejercicio queda con `is_active = false` y desaparece del
   * catálogo en el próximo `GET /exercises`. No lo borra físicamente, así que
   * las sesiones que ya lo usaron conservan su historial.
   */
  deactivateExercise: async (ref: string): Promise<ExerciseResponseDto> => {
    const response = await apiClient.patch<unknown>(
      `/exercises/${ref}/deactivate`,
    );

    return assertExerciseDto(response);
  },
};
