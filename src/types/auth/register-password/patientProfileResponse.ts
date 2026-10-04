import type { DominantHand } from '@/types/patient';

/**
 * Patient row returned right after registering.
 *
 * It mirrors the `Patient` entity the auth service uses as its profile DTO, so
 * the primary key is `patient_id` (not `id`) and the link back to the user
 * travels as `user_id`.
 *
 * `dominant_hand` is the `dominant_hand_enum` column, whose values are
 * `Derecha`, `Izquierda` and `Ambidiestro`.
 *
 * `phone` and `notes` live on the profile (not on the user), and both are
 * nullable because the backend defaults them to `null`.
 */
export interface PatientProfileResponse {
  patient_id: number;
  birth_date: string;
  country: string;
  city: string;
  dominant_hand: DominantHand;
  phone: string | null;
  notes: string | null;
  user_id: number;
}