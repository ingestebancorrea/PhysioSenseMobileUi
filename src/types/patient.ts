export type DominantHand = 'Derecha' | 'Izquierda' | 'Ambidiestra';

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  birthDate: string;
  dominantHand: DominantHand;
  diagnosis: string;
  assignedTherapist: string;
}
