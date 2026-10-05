import type { ImageSourcePropType } from 'react-native';

export interface ExerciseDetailSpecs {
  series: number;
  repsPerSeries: number;
  restTimeSeconds: number;
  requirements: string[];
}

export interface ExerciseDetail {
  id: string;
  title: string;
  videoThumbnailUri: ImageSourcePropType;
  videoDuration: string;
  description: string;
  specs: ExerciseDetailSpecs;
  targetMuscles: string[];
}
