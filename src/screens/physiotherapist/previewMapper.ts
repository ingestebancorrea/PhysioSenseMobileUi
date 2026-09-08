import type { ImageSourcePropType } from 'react-native';
import type { ExerciseDetail, ExerciseDetailSpecs } from '@/types/exerciseDetail';
import type { ExerciseGuideStep } from '@/types/exerciseGuide';
import type { PickedMedia } from '@/services/media/mediaService';

export interface ExercisePreviewInput {
  title: string;
  description: string;
  instructions?: string;
  series: number;
  reps: number;
  rest: number;
  requirements: string[];
  targetMuscles: string[];
  coverImage: PickedMedia | null;
  videoDuration?: number;
}

const FALLBACK_THUMBNAIL: ImageSourcePropType = require('../../../assets/glove.png');

export const formatVideoDuration = (totalSeconds?: number): string => {
  if (typeof totalSeconds !== 'number' || !Number.isFinite(totalSeconds)) {
    return '0:00';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const buildPreviewThumbnail = (coverImage: PickedMedia | null): ImageSourcePropType => {
  if (coverImage?.uri) return { uri: coverImage.uri };
  if (coverImage?.url) return { uri: coverImage.url };
  return FALLBACK_THUMBNAIL;
};

export const buildPreviewSpecs = (input: ExercisePreviewInput): ExerciseDetailSpecs => ({
  series: input.series,
  repsPerSeries: input.reps,
  restTimeSeconds: input.rest,
  requirements: input.requirements.filter(Boolean),
});

export const buildPreviewGuideSteps = (instructions: string): ExerciseGuideStep[] =>
  instructions
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `step_${index + 1}`,
      title: `Paso ${index + 1}`,
      description: line,
    }));

export const buildExercisePreview = (input: ExercisePreviewInput): ExerciseDetail => ({
  id: 'preview',
  title: input.title.trim() || 'Sin título',
  videoThumbnailUri: buildPreviewThumbnail(input.coverImage),
  videoDuration: formatVideoDuration(input.videoDuration),
  description: input.description.trim() || 'Sin descripción.',
  specs: buildPreviewSpecs(input),
  targetMuscles: input.targetMuscles,
});