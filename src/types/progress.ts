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
