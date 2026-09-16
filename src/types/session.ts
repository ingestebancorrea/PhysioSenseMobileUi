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

export interface SessionExercise {
  id: string;
  title: string;
  sessions: string;
  repetitions: string;
  imageUrl?: string;
}

export interface SessionFormData {
  patientName: string;
  sessionTitle: string;
  sessionObjective: string;
  selectedDate: string;
  selectedTime: string;
  estimatedDuration: string;
  exercises: SessionExercise[];
}
