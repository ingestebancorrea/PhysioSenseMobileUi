import type { TherapistDashboardData } from '@/types/therapistDashboard';

export const THERAPIST_DASHBOARD_DATA: TherapistDashboardData = {
  therapist: {
    name: 'Dr. Esteban',
    unreadNotifications: 5,
  },
  stats: [
    { id: 'stat_01', value: '12', label: 'Pacientes Activos' },
    { id: 'stat_02', value: '7', label: 'Sesiones hoy' },
    { id: 'stat_03', value: '18', label: 'Ejercicios asignados' },
    { id: 'stat_04', value: '5', label: 'Evaluaciones pendientes' },
  ],
  activities: [
    {
      id: 'activity_01',
      icon: 'user',
      tone: 'user',
      titleHighlight: 'María López',
      titleRest: ' completó su sesión.',
      subtitlePrimary: 'Hoy, 9:15 a. m.',
      status: 'completed',
    },
    {
      id: 'activity_02',
      icon: 'user',
      tone: 'user',
      titleHighlight: 'Carlos Ramirez',
      titleRest: ' inició su programa.',
      subtitlePrimary: 'Hoy, 8:40 a. m.',
      status: 'open',
    },
    {
      id: 'activity_03',
      icon: 'triangleAlert',
      tone: 'warning',
      titleHighlight: 'Nueva evaluación pendiente',
      subtitlePrimary: 'Ana Torres - Tamizaje de mano',
      subtitleSecondary: 'Ayer, 6:30 p. m.',
      status: 'open',
    },
    {
      id: 'activity_04',
      icon: 'bluetooth',
      tone: 'device',
      titleHighlight: 'Dispositivo Smart Glove sincronizado',
      subtitlePrimary: 'Juan Pérez - Hoy, 7:45 a. m.',
      status: 'open',
    },
  ],
};
