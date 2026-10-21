import type { RegistrationData } from '@/context/RegistrationContext';

/**
 * Rules for the create-account flow.
 *
 * Every step of the flow validates against these functions, so the same rule is
 * never written twice in a screen. Messages live next to the rule that produces
 * them: changing a limit or a wording is a one-line edit in this file.
 */

/** Fields of `RegistrationData` that a step can complain about. */
export type RegistrationField = keyof RegistrationData;

export type RegistrationErrors = Partial<
  Record<RegistrationField, string>
> & {
  role?: string;
};

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 150;
export const FULL_NAME_MIN_LENGTH = 6;
export const FULL_NAME_MAX_LENGTH = 80;
export const INSTITUTION_MIN_LENGTH = 3;
export const CITY_MIN_LENGTH = 2;
export const PHONE_MIN_LENGTH = 6;
export const PHONE_MAX_LENGTH = 30;
export const LICENSE_MIN_LENGTH = 4;
export const LICENSE_MAX_LENGTH = 20;
export const MIN_PATIENT_AGE = 5;
export const MAX_PATIENT_AGE = 120;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Letters and marks of any script, plus the apostrophes and dashes that appear in
// real names. Digits are rejected on purpose: this is a person's name.
const NAME_PATTERN = /^[\p{L}\p{M}'’\- ]+$/u;
const LICENSE_PATTERN = /^[A-Z0-9-]+$/;
const DIGITS_PATTERN = /\d/;
const LOWERCASE_PATTERN = /[a-z]/;
const UPPERCASE_PATTERN = /[A-Z]/;
// Same character class the backend accepts on `phone`, so a phone the form
// accepts is never rejected by the column.
const PHONE_PATTERN = /^[0-9+\-\s()]+$/;

const REQUIRED = 'Este campo es obligatorio.';

const isRealDate = (day: number, month: number, year: number): boolean => {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const validateFullName = (value: string): string | undefined => {
  const name = value.trim();

  if (!name) {
    return REQUIRED;
  }

  if (name.length < FULL_NAME_MIN_LENGTH) {
    return `Escribe al menos ${FULL_NAME_MIN_LENGTH} caracteres.`;
  }

  if (name.length > FULL_NAME_MAX_LENGTH) {
    return `No puede superar ${FULL_NAME_MAX_LENGTH} caracteres.`;
  }

  if (!NAME_PATTERN.test(name)) {
    return 'Solo se permiten letras, espacios y guiones.';
  }

  return undefined;
};

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();

  if (!email) {
    return REQUIRED;
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Escribe un correo electrónico válido.';
  }

  return undefined;
};

/**
 * Password rule of `RegisterPasswordDto`: 6-150 characters with at least one
 * uppercase letter, one lowercase letter and one digit.
 *
 * The form repeats the check instead of trusting the server so the user finds
 * out before the round trip. It has to stay a subset of the backend regex: a
 * stricter front rule would lock valid passwords out, and a looser one would
 * only delay the 400.
 */
export const validatePassword = (value: string): string | undefined => {
  if (!value) {
    return REQUIRED;
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }

  if (value.length > PASSWORD_MAX_LENGTH) {
    return `La contraseña no puede superar ${PASSWORD_MAX_LENGTH} caracteres.`;
  }

  if (!LOWERCASE_PATTERN.test(value)) {
    return 'Debe incluir al menos una letra minúscula.';
  }

  if (!UPPERCASE_PATTERN.test(value)) {
    return 'Debe incluir al menos una letra mayúscula.';
  }

  if (!DIGITS_PATTERN.test(value)) {
    return 'Debe incluir al menos un número.';
  }

  return undefined;
};

export const validatePasswordConfirmation = (
  password: string,
  confirmation: string,
): string | undefined => {
  if (!confirmation) {
    return REQUIRED;
  }

  if (password && confirmation !== password) {
    return 'Las contraseñas no coinciden.';
  }

  return undefined;
};

export const validateAcceptTerms = (accepted: boolean): string | undefined =>
  accepted ? undefined : 'Debes aceptar los términos y la política de privacidad.';

export const validateLicenseNumber = (value: string): string | undefined => {
  const license = value.trim();

  if (!license) {
    return REQUIRED;
  }

  if (
    license.length < LICENSE_MIN_LENGTH ||
    license.length > LICENSE_MAX_LENGTH
  ) {
    return `Debe tener entre ${LICENSE_MIN_LENGTH} y ${LICENSE_MAX_LENGTH} caracteres.`;
  }

  if (!LICENSE_PATTERN.test(license)) {
    return 'Solo se permiten letras, números y guiones.';
  }

  return undefined;
};

export const validateBirthDate = (
  value: string,
  now: Date = new Date(),
): string | undefined => {
  const raw = value.trim();

  if (!raw) {
    return REQUIRED;
  }

  const [day, month, year] = raw.split('/').map(Number);

  if ([day, month, year].some(Number.isNaN)) {
    return 'Usa el formato DD / MM / AAAA.';
  }

  if (!isRealDate(day, month, year)) {
    return 'Esa fecha no existe.';
  }

  const birthDate = new Date(year, month - 1, day);

  if (birthDate.getTime() > now.getTime()) {
    return 'La fecha no puede ser futura.';
  }

  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() &&
      now.getDate() >= birthDate.getDate());

  if (!hasHadBirthday) {
    age -= 1;
  }

  if (age < MIN_PATIENT_AGE) {
    return `La edad mínima es de ${MIN_PATIENT_AGE} años.`;
  }

  if (age > MAX_PATIENT_AGE) {
    return 'Revisa el año de nacimiento.';
  }

  return undefined;
};

/**
 * Turns what the user types into `DD / MM / AAAA`.
 *
 * The birth date field uses `number-pad`, so separators can never be typed: they
 * are inserted here instead of being asked for.
 */
export const formatBirthDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

/**
 * `DD/MM/AAAA` -> `YYYY-MM-DD`, the format the `birth_date` date column takes.
 *
 * It lives next to the rest of the date handling on purpose: the form format is
 * a single fact, and the mapper should not have to know it.
 *
 * Returns `null` for anything that is not a complete date, so a caller that
 * skipped validation cannot quietly send `NaN-NaN-NaN` to a date column.
 */
export const toIsoBirthDate = (value: string): string | null => {
  const [day, month, year] = value.trim().split('/').map(Number);

  if ([day, month, year].some(Number.isNaN) || !isRealDate(day, month, year)) {
    return null;
  }

  const pad = (part: number) => String(part).padStart(2, '0');

  return `${year}-${pad(month)}-${pad(day)}`;
};

/**
 * Optional field, so an empty value is accepted, but when it is filled it has to
 * satisfy the backend pattern `/^[0-9+\-\s()]{6,30}$/`.
 */
export const validatePhone = (value: string): string | undefined => {
  const raw = value.trim();

  if (!raw) {
    return undefined;
  }

  if (raw.length < PHONE_MIN_LENGTH || raw.length > PHONE_MAX_LENGTH) {
    return `Debe tener entre ${PHONE_MIN_LENGTH} y ${PHONE_MAX_LENGTH} caracteres.`;
  }

  if (!PHONE_PATTERN.test(raw)) {
    return 'Solo se permiten números, espacios y los signos + - ( )';
  }

  return undefined;
};

const requiredText = (
  value: string,
  minLength: number,
  message: string,
): string | undefined => {
  const text = value.trim();

  if (!text) {
    return REQUIRED;
  }

  if (text.length < minLength) {
    return message;
  }

  return undefined;
};

const requiredSelection = (value: string, message: string): string | undefined =>
  value ? undefined : message;

/** Step 1. Shared by both roles. */
export const validateAccountStep = (
  data: RegistrationData,
): RegistrationErrors => ({
  fullName: validateFullName(data.fullName),
  email: validateEmail(data.email),
  password: validatePassword(data.password),
  confirmPassword: validatePasswordConfirmation(
    data.password,
    data.confirmPassword,
  ),
  acceptTerms: validateAcceptTerms(data.acceptTerms),
});

/** Step 2a. Physiotherapist only. */
export const validateProfessionalStep = (
  data: RegistrationData,
): RegistrationErrors => ({
  specialty: requiredSelection(
    data.specialty,
    'Selecciona tu especialidad.',
  ),
  licenseNumber: validateLicenseNumber(data.licenseNumber),
  institution: requiredText(
    data.institution,
    INSTITUTION_MIN_LENGTH,
    `Escribe al menos ${INSTITUTION_MIN_LENGTH} caracteres.`,
  ),
  yearsExperience: requiredSelection(
    data.yearsExperience,
    'Selecciona tus años de experiencia.',
  ),
});

/** Step 2b. Patient only. */
export const validatePatientStep = (
  data: RegistrationData,
): RegistrationErrors => ({
  birthDate: validateBirthDate(data.birthDate),
  country: requiredSelection(data.country, 'Selecciona tu país.'),
  city: requiredText(
    data.city,
    CITY_MIN_LENGTH,
    `Escribe al menos ${CITY_MIN_LENGTH} caracteres.`,
  ),
  dominantHand: requiredSelection(
    data.dominantHand,
    'Selecciona tu mano dominante.',
  ),
});

/** Optional fields, validated only when the user filled them in. */
export const validateAdditionalStep = (
  data: RegistrationData,
): RegistrationErrors => ({
  phone: validatePhone(data.phone),
});