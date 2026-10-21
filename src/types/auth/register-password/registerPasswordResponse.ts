import type { AuthUserRecord } from '../responses';
import type { PatientProfileResponse } from './patientProfileResponse';
import type { PhysiotherapistProfileResponse } from './physiotherapistProfileResponse';

/**
 * Profile attached to the session right after registering: whichever branch
 * `role` selected on the backend.
 */
export type RegisterPasswordProfileResponse =
  | PhysiotherapistProfileResponse
  | PatientProfileResponse;

/**
 * `POST /auth/register-password` answer: the created user, the profile created
 * for its role and the token, already signed by the backend.
 *
 * The token is what makes this response different from a plain read, so the
 * caller can open the session without a second login round trip.
 */
export interface RegisterPasswordResponse extends AuthUserRecord {
  access_token: string;
  profile: RegisterPasswordProfileResponse;
}