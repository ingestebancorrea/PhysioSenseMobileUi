import type {
  ProgressPeriod,
  ProgressScreenData,
  ProgressWindow,
} from '@/types/progress';

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

export const PROGRESS_WINDOWS: Record<ProgressPeriod, ProgressWindow[]> = {
  Día: [
    {
      dateRange: '15 Mayo 2025',
      motionPoints: [
        { day: '8:00', value: 42, label: '42°' },
        { day: '10:00', value: 55, label: '55°' },
        { day: '12:00', value: 50, label: '50°' },
        { day: '14:00', value: 66, label: '66°' },
        { day: '16:00', value: 72, label: '72°' },
        { day: '18:00', value: 60, label: '60°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '85',
          percentage: '+6%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '38m',
          percentage: '+5%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: '8:00', count: 1 },
        { day: '10:00', count: 0 },
        { day: '12:00', count: 2 },
        { day: '14:00', count: 1 },
        { day: '16:00', count: 1 },
        { day: '18:00', count: 0 },
      ],
    },
    {
      dateRange: '16 Mayo 2025',
      motionPoints: [
        { day: '8:00', value: 44, label: '44°' },
        { day: '10:00', value: 58, label: '58°' },
        { day: '12:00', value: 53, label: '53°' },
        { day: '14:00', value: 68, label: '68°' },
        { day: '16:00', value: 74, label: '74°' },
        { day: '18:00', value: 62, label: '62°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '92',
          percentage: '+7%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '42m',
          percentage: '+6%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: '8:00', count: 1 },
        { day: '10:00', count: 1 },
        { day: '12:00', count: 1 },
        { day: '14:00', count: 2 },
        { day: '16:00', count: 2 },
        { day: '18:00', count: 0 },
      ],
    },
    {
      dateRange: '17 Mayo 2025',
      motionPoints: [
        { day: '8:00', value: 46, label: '46°' },
        { day: '10:00', value: 60, label: '60°' },
        { day: '12:00', value: 56, label: '56°' },
        { day: '14:00', value: 70, label: '70°' },
        { day: '16:00', value: 78, label: '78°' },
        { day: '18:00', value: 64, label: '64°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '104',
          percentage: '+9%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '47m',
          percentage: '+7%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: '8:00', count: 1 },
        { day: '10:00', count: 2 },
        { day: '12:00', count: 2 },
        { day: '14:00', count: 1 },
        { day: '16:00', count: 3 },
        { day: '18:00', count: 0 },
      ],
    },
  ],
  Semana: [
    {
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
    },
    {
      dateRange: '18 - 24 Mayo 2025',
      motionPoints: [
        { day: 'Lun', value: 50, label: '50°' },
        { day: 'Mar', value: 60, label: '60°' },
        { day: 'Mié', value: 52, label: '52°' },
        { day: 'Jue', value: 72, label: '72°' },
        { day: 'Vie', value: 85, label: '85°' },
        { day: 'Sáb', value: 80, label: '80°' },
        { day: 'Dom', value: 91, label: '91°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '870',
          percentage: '+13%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '4h 05m',
          percentage: '+9%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'Lun', count: 2 },
        { day: 'Mar', count: 1 },
        { day: 'Mié', count: 2 },
        { day: 'Jue', count: 2 },
        { day: 'Vie', count: 3 },
        { day: 'Sáb', count: 2 },
        { day: 'Dom', count: 4 },
      ],
    },
    {
      dateRange: '25 - 31 Mayo 2025',
      motionPoints: [
        { day: 'Lun', value: 52, label: '52°' },
        { day: 'Mar', value: 62, label: '62°' },
        { day: 'Mié', value: 55, label: '55°' },
        { day: 'Jue', value: 74, label: '74°' },
        { day: 'Vie', value: 86, label: '86°' },
        { day: 'Sáb', value: 82, label: '82°' },
        { day: 'Dom', value: 93, label: '93°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '925',
          percentage: '+14%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '4h 30m',
          percentage: '+10%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'Lun', count: 1 },
        { day: 'Mar', count: 2 },
        { day: 'Mié', count: 3 },
        { day: 'Jue', count: 2 },
        { day: 'Vie', count: 2 },
        { day: 'Sáb', count: 3 },
        { day: 'Dom', count: 5 },
      ],
    },
    {
      dateRange: '1 - 7 Jun 2025',
      motionPoints: [
        { day: 'Lun', value: 54, label: '54°' },
        { day: 'Mar', value: 64, label: '64°' },
        { day: 'Mié', value: 58, label: '58°' },
        { day: 'Jue', value: 76, label: '76°' },
        { day: 'Vie', value: 88, label: '88°' },
        { day: 'Sáb', value: 84, label: '84°' },
        { day: 'Dom', value: 95, label: '95°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '980',
          percentage: '+16%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '4h 50m',
          percentage: '+11%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'Lun', count: 2 },
        { day: 'Mar', count: 2 },
        { day: 'Mié', count: 1 },
        { day: 'Jue', count: 3 },
        { day: 'Vie', count: 3 },
        { day: 'Sáb', count: 2 },
        { day: 'Dom', count: 5 },
      ],
    },
  ],
  Mes: [
    {
      dateRange: 'Mayo 2025',
      motionPoints: [
        { day: 'S1', value: 52, label: '52°' },
        { day: 'S2', value: 62, label: '62°' },
        { day: 'S3', value: 70, label: '70°' },
        { day: 'S4', value: 78, label: '78°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '3.250',
          percentage: '+15%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '15h 20m',
          percentage: '+11%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'S1', count: 9 },
        { day: 'S2', count: 11 },
        { day: 'S3', count: 12 },
        { day: 'S4', count: 13 },
      ],
    },
    {
      dateRange: 'Junio 2025',
      motionPoints: [
        { day: 'S1', value: 54, label: '54°' },
        { day: 'S2', value: 64, label: '64°' },
        { day: 'S3', value: 72, label: '72°' },
        { day: 'S4', value: 80, label: '80°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '3.420',
          percentage: '+16%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '16h 10m',
          percentage: '+12%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'S1', count: 10 },
        { day: 'S2', count: 12 },
        { day: 'S3', count: 13 },
        { day: 'S4', count: 14 },
      ],
    },
    {
      dateRange: 'Julio 2025',
      motionPoints: [
        { day: 'S1', value: 56, label: '56°' },
        { day: 'S2', value: 66, label: '66°' },
        { day: 'S3', value: 74, label: '74°' },
        { day: 'S4', value: 82, label: '82°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '3.610',
          percentage: '+18%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '17h 00m',
          percentage: '+13%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'S1', count: 11 },
        { day: 'S2', count: 12 },
        { day: 'S3', count: 14 },
        { day: 'S4', count: 15 },
      ],
    },
  ],
  Año: [
    {
      dateRange: '2025',
      motionPoints: [
        { day: 'T1', value: 58, label: '58°' },
        { day: 'T2', value: 64, label: '64°' },
        { day: 'T3', value: 72, label: '72°' },
        { day: 'T4', value: 70, label: '70°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '41.200',
          percentage: '+21%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '196h',
          percentage: '+14%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'T1', count: 96 },
        { day: 'T2', count: 112 },
        { day: 'T3', count: 124 },
        { day: 'T4', count: 118 },
      ],
    },
    {
      dateRange: '2026',
      motionPoints: [
        { day: 'T1', value: 60, label: '60°' },
        { day: 'T2', value: 66, label: '66°' },
        { day: 'T3', value: 74, label: '74°' },
        { day: 'T4', value: 72, label: '72°' },
      ],
      metrics: [
        {
          title: 'Repeticiones',
          value: '45.100',
          percentage: '+24%',
          isPositive: true,
        },
        {
          title: 'Tiempo total',
          value: '210h',
          percentage: '+15%',
          isPositive: true,
        },
      ],
      completedSessions: [
        { day: 'T1', count: 104 },
        { day: 'T2', count: 120 },
        { day: 'T3', count: 132 },
        { day: 'T4', count: 126 },
      ],
    },
  ],
};