import type { ImageSourcePropType } from 'react-native';
import { EXERCISES } from '@/mock/exerciseData';

interface ExerciseConfig {
  id: string;
  name: string;
  totalReps: number;
  series: number;
  targetRange: { min: number; max: number };
  gloveImage: ImageSourcePropType;
}

const GLOVE_IMAGES: Record<string, ImageSourcePropType> = {
  exercise_01: require('../../../assets/countdownCero.png'),
  exercise_02: require('../../../assets/countdownFive.png'),
  exercise_03: require('../../../assets/countdownTwo.png'),
  exercise_04: require('../../../assets/countdownFive.png'),
};

const TARGET_RANGES: Record<string, { min: number; max: number }> = {
  exercise_01: { min: 60, max: 90 },
  exercise_02: { min: 50, max: 80 },
  exercise_03: { min: 30, max: 60 },
  exercise_04: { min: 40, max: 70 },
};

export const EXERCISE_CONFIG: Record<string, ExerciseConfig> = EXERCISES.reduce(
  (acc, exercise) => {
    acc[exercise.id] = {
      id: exercise.id,
      name: exercise.title,
      totalReps: exercise.reps,
      series: exercise.series,
      targetRange: TARGET_RANGES[exercise.id] ?? { min: 0, max: 100 },
      gloveImage: GLOVE_IMAGES[exercise.id] ?? require('../../../assets/countdownCero.png'),
    };
    return acc;
  },
  {} as Record<string, ExerciseConfig>,
);

export const getExerciseConfig = (exerciseId?: string): ExerciseConfig =>
  EXERCISE_CONFIG[exerciseId ?? ''] ?? EXERCISE_CONFIG.exercise_01;
