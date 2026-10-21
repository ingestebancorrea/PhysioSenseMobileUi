import type { UserRoleId } from '../enums';
import type { PatientProfileRequest } from './patientProfileRequest';
import type { PhysiotherapistProfileRequest } from './physiotherapistProfileRequest';

/**
 * Body of `POST /auth/register-password` (`RegisterPasswordDto`).
 *
 * Field names mirror the backend DTO exactly (snake_case) so no translation is
 * needed inside the service and a validation error can be mapped back to the
 * form by the same key.
 *
 * The two profile objects are a discriminated pair on the wire: only the one
 * matching `role` is sent, and the backend rejects the request when the profile
 * required by that role is missing.
 *
 * Backend rules worth keeping in mind when the form is validated:
 * - `password`: 6-150 chars, at least one uppercase, one lowercase and one digit.
 * - `full_name`: 6-150 chars.
 * - `phone`: optional, `/^[0-9+\-\s()]{6,30}$/`.
 * - `notes`: optional, max 2000 chars.
 */
export interface RegisterPasswordRequest {
  username: string;
  password: string;
  confirm_password: string;
  full_name: string;
  role: UserRoleId;
  image_url?: string;
  phone?: string;
  notes?: string;
  physiotherapist_profile?: PhysiotherapistProfileRequest;
  patient_profile?: PatientProfileRequest;
}