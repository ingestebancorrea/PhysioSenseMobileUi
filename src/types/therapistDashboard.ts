import type { IconName } from '@/constants/icons';

export interface TherapistStat {
  id: string;
  value: string;
  label: string;
}

export type ActivityTone = 'user' | 'warning' | 'device';

export type ActivityStatus = 'completed' | 'open';

export interface TherapistActivity {
  id: string;
  icon: IconName;
  tone: ActivityTone;
  titleHighlight: string;
  titleRest?: string;
  subtitlePrimary: string;
  subtitleSecondary?: string;
  status: ActivityStatus;
}

export interface HomeTabItem {
  key: string;
  label: string;
  icon: IconName;
}

export interface TherapistDashboardData {
  therapist: {
    name: string;
    unreadNotifications: number;
  };
  stats: TherapistStat[];
  activities: TherapistActivity[];
}
