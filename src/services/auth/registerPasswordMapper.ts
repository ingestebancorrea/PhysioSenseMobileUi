import type { RegistrationData } from '@/context/RegistrationContext';
import type {
  PatientProfileRequest,
  PhysiotherapistProfileRequest,
  RegisterPasswordRequest,
} from '@/types/auth/register-password';
import { UserRoleId } from '@/types/auth';
import type { DominantHand } from '@/types/patient';
import { toIsoBirthDate } from '@/utils/validation/registrationValidation';

/**
 * Turns what the flow collected into the body of `POST /auth/register-password`.
 *
 * The form speaks camelCase and keeps some values as text because that is what
 * a text input is; the endpoint speaks snake_case and expects real types. All of
 * that translation happens here, so the screens never build a payload and the
 * DTO stays a plain description of the contract.
 */

const ROLE_ID_BY_ROLE = {
  fisioterapeuta: UserRoleId.FISIOTERAPEUTA,
  paciente: UserRoleId.PACIENTE,
} as const;

const trimOrUndefined = (value: string): string | undefined => {
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
};

const toYearsOfExperience = (value: string): number => {
  const parsed = Number.parseInt(value.trim(), 10);

  return Number.isNaN(parsed) ? 0 : parsed;
};

const toPhysiotherapistProfile = (
  data: RegistrationData,
): PhysiotherapistProfileRequest => ({
  specialty: data.specialty.trim(),
  license_number: data.licenseNumber.trim(),
  institution: trimOrUndefined(data.institution),
  years_of_experience: toYearsOfExperience(data.yearsExperience),
});

/**
 * Only the branch matching `role` is sent: the backend rejects the request when
 * the profile required by that role is missing, and an extra profile from the
 * other role would be stored nowhere.
 */
const toPatientProfile = (data: RegistrationData): PatientProfileRequest | null => {
  const birthDate = toIsoBirthDate(data.birthDate);

  if (birthDate === null) {
    return null;
  }

  return {
    birth_date: birthDate,
    country: data.country.trim(),
    city: data.city.trim(),
    dominant_hand: data.dominantHand as DominantHand,
  };
};

/**
 * Optional fields are omitted instead of sent empty: the backend treats `''` as
 * a value (`image_url ?? null` only covers `undefined`) and would store blank
 * text in the column.
 */
export const toRegisterPasswordRequest = (
  data: RegistrationData,
): RegisterPasswordRequest => {
  const roleId = ROLE_ID_BY_ROLE[data.role ?? 'paciente'];
  const patientProfile =
    roleId === UserRoleId.PACIENTE ? toPatientProfile(data) : null;

  return {
    username: data.email.trim(),
    password: data.password,
    confirm_password: data.confirmPassword,
    full_name: data.fullName.trim(),
    role: roleId,
    phone: trimOrUndefined(data.phone),
    notes: trimOrUndefined(data.notes),
    ...(roleId === UserRoleId.FISIOTERAPEUTA
      ? { physiotherapist_profile: toPhysiotherapistProfile(data) }
      : {}),
    ...(patientProfile !== null ? { patient_profile: patientProfile } : {}),
  };
};