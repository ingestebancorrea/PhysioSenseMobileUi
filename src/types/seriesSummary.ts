import type { QualityLevel } from '@/types/execution';

export interface SeriesSummaryData {
  exerciseId: string;
  exerciseName: string;
  currentSeries: number;
  totalSeries: number;
  completedReps: number;
  totalReps: number;
  averageQuality: QualityLevel;
  averageForce: number;
  restDuration: number;
}
