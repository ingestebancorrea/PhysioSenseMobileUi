import type { IconName } from '@/constants/icons';

export type MetricTone = 'success' | 'primary';

export interface DashboardMetric {
  id: string;
  icon: IconName;
  tone: MetricTone;
  title: string;
  value: string;
  progress?: number;
}

export interface SessionExercise {
  id: string;
  icon: IconName;
  name: string;
  detail: string;
  progress: number;
}

export interface LastSession {
  id: string;
  date: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  exercises: SessionExercise[];
}

export interface DashboardMetrics {
  id: string;
  user: {
    firstName: string;
  };
  summary: DashboardMetric[];
  lastSession: LastSession;
}
