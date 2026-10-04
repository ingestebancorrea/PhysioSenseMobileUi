export type DominantHand = 'Derecha' | 'Izquierda' | 'Ambidiestra';

export type PatientStatus = 'Activo' | 'Inactivo';

/**
 * Clinical data of the signed-in patient.
 *
 * Identity fields (id, name, email, avatar) are intentionally absent: they come
 * from `UserToReturnDto` through `useCurrentUser`.
 */
export interface PatientProfile {
  phone: string;
  birthDate: string;
  dominantHand: DominantHand;
  diagnosis: string;
  assignedTherapist: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  avatarUrl: string;
  status: PatientStatus;
  lastSession: string;
  diagnosis?: string;
  startDate?: string;
  therapistName?: string;
  metrics?: {
    compliance: number;
    rom: number;
    strength: number;
  };
  lastSessionDetail?: {
    completedExercises: number;
    totalExercises: number;
  };
}
