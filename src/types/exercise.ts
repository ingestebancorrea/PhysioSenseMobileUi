import type { ImageSourcePropType } from 'react-native';

export type ExerciseCategory = 'Todos' | 'Mano' | 'Dedos' | 'Muñeca';

export interface ExerciseListItem {
  id: string;
  title: string;
  description: string;
  series: number;
  reps: number;
  duration: string;
  category: ExerciseCategory;
  imageUri: ImageSourcePropType;
}
