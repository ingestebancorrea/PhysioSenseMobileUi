/**
 * Row saved by `createProfile` for the physiotherapist branch.
 *
 * `institution`, `phone` and `notes` are nullable because the backend defaults
 * them to `null` when the request omits them.
 */
export interface PhysiotherapistProfileResponse {
  id: number;
  specialty: string;
  license_number: string;
  institution: string | null;
  years_of_experience: number;
  phone: string | null;
  notes: string | null;
}