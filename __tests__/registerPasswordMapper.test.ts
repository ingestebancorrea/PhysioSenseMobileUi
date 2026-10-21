import type { RegistrationData } from '../src/context/RegistrationContext';
import { toRegisterPasswordRequest } from '../src/services/auth/registerPasswordMapper';
import { UserRoleId } from '../src/types/auth';

const BASE_DATA: RegistrationData = {
  role: 'fisioterapeuta',
  fullName: '  Laura Martínez  ',
  email: '  laura@correo.com ',
  password: 'Rehab2026',
  confirmPassword: 'Rehab2026',
  acceptTerms: true,
  specialty: 'Terapia de mano',
  licenseNumber: ' TP-123456 ',
  institution: ' Universidad del Rosario ',
  yearsExperience: '5',
  birthDate: '',
  country: '',
  city: '',
  dominantHand: '',
  phone: '',
  notes: '',
  photoName: '',
};

describe('toRegisterPasswordRequest', () => {
  it('trims the shared fields and maps the email to username', () => {
    const body = toRegisterPasswordRequest(BASE_DATA);

    expect(body.username).toBe('laura@correo.com');
    expect(body.full_name).toBe('Laura Martínez');
    expect(body.password).toBe('Rehab2026');
    expect(body.confirm_password).toBe('Rehab2026');
  });

  it('maps the physiotherapist role to its numeric id', () => {
    expect(toRegisterPasswordRequest(BASE_DATA).role).toBe(
      UserRoleId.FISIOTERAPEUTA,
    );
  });

  it('maps the patient role to its numeric id', () => {
    expect(
      toRegisterPasswordRequest({ ...BASE_DATA, role: 'paciente' }).role,
    ).toBe(UserRoleId.PACIENTE);
  });

  it('builds the physiotherapist profile from the form fields', () => {
    const body = toRegisterPasswordRequest(BASE_DATA);

    expect(body.physiotherapist_profile).toEqual({
      specialty: 'Terapia de mano',
      license_number: 'TP-123456',
      institution: 'Universidad del Rosario',
      years_of_experience: 5,
    });
  });

  it('never sends a patient profile on the physiotherapist branch', () => {
    expect(toRegisterPasswordRequest(BASE_DATA).patient_profile).toBeUndefined();
  });

  it('never sends a physiotherapist profile on the patient branch', () => {
    const body = toRegisterPasswordRequest({
      ...BASE_DATA,
      role: 'paciente',
      birthDate: '15/03/1990',
      country: 'Colombia',
      city: 'Bogotá',
      dominantHand: 'Ambidiestro',
    });

    expect(body.physiotherapist_profile).toBeUndefined();
  });

  it('converts the birth date to the ISO format the date column takes', () => {
    const body = toRegisterPasswordRequest({
      ...BASE_DATA,
      role: 'paciente',
      birthDate: '15/03/1990',
      country: 'Colombia',
      city: 'Bogotá',
      dominantHand: 'Derecha',
    });

    expect(body.patient_profile).toEqual({
      birth_date: '1990-03-15',
      country: 'Colombia',
      city: 'Bogotá',
      dominant_hand: 'Derecha',
    });
  });

  it('omits the patient profile when the date cannot be read', () => {
    const body = toRegisterPasswordRequest({
      ...BASE_DATA,
      role: 'paciente',
      birthDate: '31/02/1990',
      country: 'Colombia',
      city: 'Bogotá',
      dominantHand: 'Derecha',
    });

    expect(body.patient_profile).toBeUndefined();
  });

  it('omits optional fields instead of sending empty strings', () => {
    const body = toRegisterPasswordRequest(BASE_DATA);

    expect(body.phone).toBeUndefined();
    expect(body.notes).toBeUndefined();
    expect(body).not.toHaveProperty('image_url');
  });

  it('sends the optional fields when they were filled', () => {
    const body = toRegisterPasswordRequest({
      ...BASE_DATA,
      phone: ' +57 300 123 4567 ',
      notes: ' Dolor de muñeca ',
    });

    expect(body.phone).toBe('+57 300 123 4567');
    expect(body.notes).toBe('Dolor de muñeca');
  });

  it('omits the institution when the user left it empty', () => {
    const body = toRegisterPasswordRequest({ ...BASE_DATA, institution: '   ' });

    expect(body.physiotherapist_profile?.institution).toBeUndefined();
  });
});