/**
 * @format
 */

import {
  formatBirthDateInput,
  validateAccountStep,
  validateBirthDate,
  validateEmail,
  validateFullName,
  validateLicenseNumber,
  validatePassword,
  validatePasswordConfirmation,
  validatePatientStep,
  validatePhone,
  validateProfessionalStep,
  FULL_NAME_MAX_LENGTH,
  FULL_NAME_MIN_LENGTH,
  PHONE_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../src/utils/validation/registrationValidation';
import type { RegistrationData } from '../src/context/RegistrationContext';

const EMPTY_REGISTRATION_DATA: RegistrationData = {
  role: null,
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  specialty: '',
  licenseNumber: '',
  institution: '',
  yearsExperience: '',
  birthDate: '',
  country: '',
  city: '',
  dominantHand: '',
  phone: '',
  notes: '',
  photoName: '',
};

const NOW = new Date(2026, 0, 15);

describe('validateFullName', () => {
  it('rejects an empty name', () => {
    expect(validateFullName('   ')).toBe('Este campo es obligatorio.');
  });

  it('rejects a name shorter than the minimum length', () => {
    expect(validateFullName('Laura')).toBe(
      `Escribe al menos ${FULL_NAME_MIN_LENGTH} caracteres.`,
    );
  });

  it('accepts a name that reaches the minimum length', () => {
    expect(validateFullName('Lauraa')).toBeUndefined();
  });

  it('rejects digits', () => {
    expect(validateFullName('Laura 24')).toMatch(/letras/);
  });

  it('rejects a name longer than the maximum length', () => {
    expect(validateFullName('a'.repeat(FULL_NAME_MAX_LENGTH + 1))).toMatch(
      /No puede superar/,
    );
  });

  it('accepts accented names, hyphens and apostrophes', () => {
    expect(validateFullName("María José O'Neill-Smith")).toBeUndefined();
  });
});

describe('validateEmail', () => {
  it.each(['', '   ', 'laura', 'laura@', 'laura@correo', '@correo.com'])(
    'rejects %p',
    value => {
      expect(validateEmail(value)).toBeTruthy();
    },
  );

  it('accepts a normal address', () => {
    expect(validateEmail('laura.martinez@correo.com')).toBeUndefined();
  });
});

describe('validatePassword', () => {
  it('rejects an empty password', () => {
    expect(validatePassword('')).toBe('Este campo es obligatorio.');
  });

  it('rejects a password below the minimum length', () => {
    expect(validatePassword('Ab1')).toMatch(
      new RegExp(`al menos ${PASSWORD_MIN_LENGTH}`),
    );
  });

  it('rejects a password without a lowercase letter', () => {
    expect(validatePassword('REHAB2026')).toMatch(/minúscula/);
  });

  it('rejects a password without an uppercase letter', () => {
    expect(validatePassword('rehab2026')).toMatch(/mayúscula/);
  });

  it('rejects a password without a digit', () => {
    expect(validatePassword('RehabSinNumero')).toMatch(/número/);
  });

  it('accepts the exact combination the backend demands', () => {
    expect(validatePassword('Rehab2026')).toBeUndefined();
  });

  it('accepts a password that only reaches the minimum length', () => {
    expect(validatePassword('Reha1b')).toBeUndefined();
  });

  it('rejects a password above the maximum length', () => {
    expect(validatePassword(`Rehab1${'a'.repeat(PASSWORD_MAX_LENGTH)}`)).toMatch(
      new RegExp(`no puede superar ${PASSWORD_MAX_LENGTH}`),
    );
  });
});

describe('validatePasswordConfirmation', () => {
  it('requires the confirmation field', () => {
    expect(validatePasswordConfirmation('rehab2026', '')).toBeTruthy();
  });

  it('rejects a mismatch', () => {
    expect(validatePasswordConfirmation('rehab2026', 'otra2026')).toBe(
      'Las contraseñas no coinciden.',
    );
  });

  it('accepts a match', () => {
    expect(validatePasswordConfirmation('rehab2026', 'rehab2026')).toBeUndefined();
  });
});

describe('validateLicenseNumber', () => {
  it('rejects an empty license', () => {
    expect(validateLicenseNumber('')).toBe('Este campo es obligatorio.');
  });

  it('rejects symbols other than dashes', () => {
    expect(validateLicenseNumber('TP 12/34')).toMatch(/letras, números/);
  });

  it('accepts letters, digits and dashes', () => {
    expect(validateLicenseNumber('TP-123456')).toBeUndefined();
  });
});

describe('validateBirthDate', () => {
  it('rejects an empty date', () => {
    expect(validateBirthDate('', NOW)).toBe('Este campo es obligatorio.');
  });

  it('rejects a wrong format', () => {
    expect(validateBirthDate('12-08-1992', NOW)).toMatch(/DD \/ MM \/ AAAA/);
  });

  it('rejects a date that does not exist', () => {
    expect(validateBirthDate('31/02/1992', NOW)).toBe('Esa fecha no existe.');
  });

  it('rejects a date in the future', () => {
    expect(validateBirthDate('01/01/2030', NOW)).toBe(
      'La fecha no puede ser futura.',
    );
  });

  it('rejects a child below the minimum age', () => {
    expect(validateBirthDate('01/01/2024', NOW)).toMatch(/edad mínima/);
  });

  it('accepts an adult birthday that already happened this year', () => {
    expect(validateBirthDate('20/12/1992', NOW)).toBeUndefined();
  });

  it('counts the age as one less when the birthday has not happened yet', () => {
    // Turns 5 on 20/12/2026, so on 15/01/2026 they are still 4.
    expect(validateBirthDate('20/12/2021', NOW)).toMatch(/edad mínima/);
    // Turns 5 on 10/01/2026, already past: valid.
    expect(validateBirthDate('10/01/2021', NOW)).toBeUndefined();
  });
});

describe('formatBirthDateInput', () => {
  it.each([
    ['1', '1'],
    ['12', '12'],
    ['120', '12/0'],
    ['1208', '12/08'],
    ['12081992', '12/08/1992'],
    ['120819921234', '12/08/1992'],
    ['ab/12', '12'],
  ])('formats %p as %p', (input, expected) => {
    expect(formatBirthDateInput(input)).toBe(expected);
  });
});

describe('validatePhone', () => {
  it('allows an empty phone because the field is optional', () => {
    expect(validatePhone('')).toBeUndefined();
  });

  it('rejects a phone that is too short', () => {
    expect(validatePhone('12345')).toMatch(/entre 6 y 30/);
  });

  it('rejects a phone above the backend maximum', () => {
    expect(validatePhone('1'.repeat(PHONE_MAX_LENGTH + 1))).toMatch(
      /entre 6 y 30/,
    );
  });

  it('accepts a local number', () => {
    expect(validatePhone('300 123 4567')).toBeUndefined();
  });

  it('accepts an international number', () => {
    expect(validatePhone('+57 300 123 4567')).toBeUndefined();
  });

  it('accepts the parentheses the backend allows', () => {
    expect(validatePhone('(57) 300-123-4567')).toBeUndefined();
  });

  it('rejects letters', () => {
    expect(validatePhone('300abc4567')).toMatch(/números/);
  });
});

describe('validateAccountStep', () => {
  it('reports every empty field', () => {
    const errors = validateAccountStep(EMPTY_REGISTRATION_DATA);

    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining([
        'fullName',
        'email',
        'password',
        'confirmPassword',
        'acceptTerms',
      ]),
    );
  });

  it('is empty when both roles fill the form correctly', () => {
    const base = EMPTY_REGISTRATION_DATA;

    const asPatient = {
      ...base,
      role: 'paciente' as const,
      fullName: 'Laura Martínez',
      email: 'laura@correo.com',
password: 'Rehab2026',
  confirmPassword: 'Rehab2026',
      acceptTerms: true,
    };

    const asTherapist = { ...asPatient, role: 'fisioterapeuta' as const };

    expect(validateAccountStep(asPatient)).toEqual({});
    expect(validateAccountStep(asTherapist)).toEqual({});
  });
});

describe('validateProfessionalStep', () => {
  const base = EMPTY_REGISTRATION_DATA;

  it('requires specialty, license, institution and experience', () => {
    expect(Object.keys(validateProfessionalStep(base))).toEqual([
      'specialty',
      'licenseNumber',
      'institution',
      'yearsExperience',
    ]);
  });

  it('is empty with a complete professional profile', () => {
    const errors = validateProfessionalStep({
      ...base,
      role: 'fisioterapeuta',
      specialty: 'Terapia de mano',
      licenseNumber: 'TP-123456',
      institution: 'Universidad del Rosario',
      yearsExperience: '3 - 5 años',
    });

    expect(errors).toEqual({});
  });
});

describe('validatePatientStep', () => {
  const base = EMPTY_REGISTRATION_DATA;

  it('requires birth date, country, city and dominant hand', () => {
    expect(Object.keys(validatePatientStep(base))).toEqual([
      'birthDate',
      'country',
      'city',
      'dominantHand',
    ]);
  });

  it('is empty with a complete patient profile', () => {
    const errors = validatePatientStep({
      ...base,
      role: 'paciente',
      birthDate: '12/08/1992',
      country: 'Colombia',
      city: 'Bogotá',
      dominantHand: 'Derecha',
    });

    expect(errors).toEqual({});
  });
});