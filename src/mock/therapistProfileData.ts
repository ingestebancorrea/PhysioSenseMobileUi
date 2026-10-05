/**
 * Professional data of the signed-in therapist.
 *
 * Name, email and avatar are not here: they come from `UserToReturnDto`.
 */
export interface TherapistProfessionalData {
  phone: string;
  specialty: string;
  license: string;
}

export const THERAPIST_PROFESSIONAL_DATA: TherapistProfessionalData = {
  phone: '+57 300 123 4567',
  specialty: 'Fisioterapia de mano',
  license: 'LP-123456',
};