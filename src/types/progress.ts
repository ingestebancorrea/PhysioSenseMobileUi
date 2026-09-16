export type ProgressPeriod = 'Día' | 'Semana' | 'Mes' | 'Año';

export interface MotionChartPoint {
  day: string;
  value: number;
  label: string;
}

export interface ProgressMetric {
  title: string;
  value: string;
  percentage: string;
  isPositive: boolean;
}

export interface CompletedSessionPoint {
  day: string;
  count: number;
}

export interface ProgressScreenData {
  activePeriod: ProgressPeriod;
  dateRange: string;
  motionPoints: MotionChartPoint[];
  metrics: ProgressMetric[];
  completedSessions: CompletedSessionPoint[];
}

export type SessionStatus = 'completed' | 'in_progress' | 'cancelled';

export interface SessionRecord {
  id: string;
  date: string;
  duration: string;
  repetitions: number;
  exerciseCount: number;
  status: SessionStatus;
}

export interface Exercise {
  id: string;
  name: string;
  setsAndReps: string;
  progressPercentage: number;
}

export interface SessionDetail {
  id: string;
  date: string;
  status: 'Completada' | 'Pendiente' | 'Incompleta';
  totalTime: string;
  totalReps: number;
  overallProgress: number;
  exercises: Exercise[];
  observations?: string;
}
