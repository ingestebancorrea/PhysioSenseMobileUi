import { apiClient } from '@/services/api/client';
import { MEDIA_LIMITS } from '@/config/env';
import type { PickedMedia } from '@/services/media/mediaService';

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
};