import type { SessionDetail } from '@/types/progress';

export const MOCK_SESSION_DETAIL: SessionDetail = {
  id: 'session_2025_05_17',
  date: '17 Mayo 2025 - 10:30 a. m.',
  status: 'Completada',
  totalTime: '25:30',
  totalReps: 120,
  overallProgress: 72,
  exercises: [
    {
      id: 'exercise_01',
      name: 'Cerrar la mano',
      setsAndReps: '3 series - 15 rep',
      progressPercentage: 72,
    },
    {
      id: 'exercise_02',
      name: 'Abrir la mano',
      setsAndReps: '3 series - 15 rep',
      progressPercentage: 75,
    },
    {
      id: 'exercise_03',
      name: 'Pinza',
      setsAndReps: '2 series - 12 rep',
      progressPercentage: 70,
    },
  ],
  observations: 'Buen trabajo! Mantén la constancia.',
};
