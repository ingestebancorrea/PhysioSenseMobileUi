import type { DominantHand } from '@/types/patient';

/**
 * Patient branch of `POST /auth/register-password`.
 *
 * The auth service validates this body with the `Patient` entity itself, so the
 * keys below are the column names and the limits are the column limits:
 * `country`/`city` are `varchar(80)` and `birth_date` is a `date` column, which
 * travels as `YYYY-MM-DD`. The form collects `DD/MM/AAAA`, so the mapper has to
 * convert it before the call; a localised date would be rejected.
 *
 * `phone` and `notes` are deliberately absent: `createProfile` reads them from
 * the root of the body, not from the profile.
 */
export interface PatientProfileRequest {
  birth_date: string;
  country: string;
  city: string;
  dominant_hand: DominantHand;
}