import type { DashboardMetrics } from '@/types/dashboard';

export const DASHBOARD_DATA: DashboardMetrics = {
  id: 'dashboard_2025_05_17',
  user: {
    firstName: 'Esteban',
  },
  summary: [
    {
      id: 'metric_01',
      icon: 'circleCheck',
      tone: 'success',
      title: 'Ejercicios realizados',
      value: '3 / 5',
    },
    {
      id: 'metric_02',
      icon: 'clock',
      tone: 'success',
      title: 'Tiempo total',
      value: '25 min',
    },
    {
      id: 'metric_03',
      icon: 'activity',
      tone: 'primary',
      title: 'Repeticiones',
      value: '120',
    },
    {
      id: 'metric_04',
      icon: 'chart',
      tone: 'primary',
      title: 'Progreso',
      value: '72%',
      progress: 72,
    },
  ],
  lastSession: {
    id: 'session_2025_05_17',
    date: '17 Mayo 2025 - 10:30 a. m.',
    status: 'completed',
    exercises: [
      {
        id: 'exercise_01',
        icon: 'hand',
        name: 'Cerrar la mano',
        detail: '3 series - 15 repeticiones',
        progress: 72,
      },
    ],
  },
};
