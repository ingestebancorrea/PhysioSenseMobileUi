export type SessionStatus = 'Activa' | 'Programada' | 'Borrador' | 'Completada';

export interface Session {
  id: string;
  title: string;
  patientName: string;
  patientAvatarUrl: string;
  dateText: string;
  exerciseCount: number;
  durationMinutes: number;
  status: SessionStatus;
}
