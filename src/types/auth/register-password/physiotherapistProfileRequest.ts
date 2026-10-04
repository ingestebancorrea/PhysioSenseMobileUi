/**
 * Physiotherapist branch of `POST /auth/register-password`
 * (`PhysiotherapistProfileDto` on the auth service).
 *
 * The backend requires this object when the role is `FISIOTERAPEUTA`; sending
 * the request without it fails validation, which is why it is a first-class
 * DTO and not a loose bag of extra fields.
 *
 * `years_of_experience` is a number here even though the form keeps it as text:
 * the conversion belongs to the mapper, so the transport contract stays honest.
 */
export interface PhysiotherapistProfileRequest {
  specialty: string;
  license_number: string;
  institution?: string | null;
  years_of_experience: number;
}