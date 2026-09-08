import type { ProgressScreenData } from '@/types/progress';

export const MOCK_PROGRESS_DATA: ProgressScreenData = {
  activePeriod: 'Semana',
  dateRange: '11 - 17 Mayo 2025',
  motionPoints: [
    { day: 'Lun', value: 48, label: '48°' },
    { day: 'Mar', value: 58, label: '58°' },
    { day: 'Mié', value: 48, label: '48°' },
    { day: 'Jue', value: 70, label: '70°' },
    { day: 'Vie', value: 83, label: '83°' },
    { day: 'Sáb', value: 78, label: '78°' },
    { day: 'Dom', value: 89, label: '89°' },
  ],
  metrics: [
    {
      title: 'Repeticiones',
      value: '820',
      percentage: '+12%',
      isPositive: true,
    },
    {
      title: 'Tiempo total',
      value: '3h 45m',
      percentage: '+8%',
      isPositive: true,
    },
  ],
  completedSessions: [
    { day: 'Lun', count: 1 },
    { day: 'Mar', count: 2 },
    { day: 'Mié', count: 1 },
    { day: 'Jue', count: 3 },
    { day: 'Vie', count: 2 },
    { day: 'Sáb', count: 1 },
    { day: 'Dom', count: 4 },
  ],
};
