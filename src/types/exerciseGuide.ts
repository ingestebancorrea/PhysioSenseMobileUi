import type { ImageSourcePropType } from 'react-native';

export interface ExerciseGuideStep {
  id: string;
  title: string;
  description: string;
  imageUri?: ImageSourcePropType;
}

export interface ExerciseGuide {
  id: string;
  title: string;
  steps: ExerciseGuideStep[];
}
