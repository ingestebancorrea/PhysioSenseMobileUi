import type { RegistrationData } from '@/context/RegistrationContext';
import { toRegisterPasswordRequest } from '@/services/auth/registerPasswordMapper';
import { UserRoleId } from '@/types/auth';

const RESPONSE_BODY = {
  id: 12,
  username: 'laura@correo.com',
  full_name: 'Laura Martínez',
  image_url: null,
  is_active: true,
  role: UserRoleId.FISIOTERAPEUTA,
  access_token: 'jwt-firmado',
  profile: {
    id: 3,
    specialty: 'Terapia de mano',
    license_number: 'TP-123456',
    institution: null,
    years_of_experience: 5,
    phone: null,
    notes: null,
  },
};

const PATIENT_DATA: RegistrationData = {
  role: 'fisioterapeuta',
  fullName: 'Laura Martínez',
  email: 'laura@correo.com',
  password: 'Rehab2026',
  confirmPassword: 'Rehab2026',
  acceptTerms: true,
  specialty: 'Terapia de mano',
  licenseNumber: 'TP-123456',
  institution: '',
  yearsExperience: '5',
  birthDate: '',
  country: '',
  city: '',
  dominantHand: '',
  phone: '',
  notes: '',
  photoName: '',
};

/** Fresh modules per test: the token storage keeps an in-memory session cache. */
const loadAuth = (): typeof import('@/services/auth/AuthService') => {
  jest.resetModules();

  return require('@/services/auth/AuthService');
};

const mockFetch = (body: unknown, status = 201): jest.Mock => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: status < 400,
    status,
    headers: { get: () => 'application/json' },
    json: async () => body,
  });

  globalThis.fetch = fetchMock as unknown as typeof fetch;

  return fetchMock;
};

describe('registerWithPassword', () => {
  it('posts the mapped body to /auth/register-password', async () => {
    const fetchMock = mockFetch(RESPONSE_BODY);
    const { registerWithPassword } = loadAuth();

    await registerWithPassword(toRegisterPasswordRequest(PATIENT_DATA));

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toContain('/auth/register-password');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({
      username: 'laura@correo.com',
      full_name: 'Laura Martínez',
      role: UserRoleId.FISIOTERAPEUTA,
      confirm_password: 'Rehab2026',
      physiotherapist_profile: {
        specialty: 'Terapia de mano',
        license_number: 'TP-123456',
        years_of_experience: 5,
      },
    });
  });

  it('does not open the session yet, so the welcome screen is reachable', async () => {
    mockFetch(RESPONSE_BODY);
    const { registerWithPassword } = loadAuth();

    const registration = await registerWithPassword(
      toRegisterPasswordRequest(PATIENT_DATA),
    );

    // Opening the session here would make RootNavigator swap the auth stack for
    // the private one and unmount the registration flow before the welcome.
    const { getAccessToken } = require('@/services/auth/tokenStorage');

    expect(await getAccessToken()).toBeNull();
    expect(registration.access_token).toBe('jwt-firmado');
  });

  it('opens the session with the identity of the created user', async () => {
    mockFetch(RESPONSE_BODY);
    const { registerWithPassword, openSessionWithRegistration } = loadAuth();

    const registration = await registerWithPassword(
      toRegisterPasswordRequest(PATIENT_DATA),
    );

    await openSessionWithRegistration(registration);

    const { getAccessToken, hydrateSession } =
      require('@/services/auth/tokenStorage');

    expect(await getAccessToken()).toBe('jwt-firmado');
    // The endpoint answers with the user row, not with UserToReturnDto, so the
    // session has to end up with a real email and name instead of empty strings.
    expect((await hydrateSession())?.user).toEqual({
      id: 12,
      role: UserRoleId.FISIOTERAPEUTA,
      email: 'laura@correo.com',
      displayName: 'Laura Martínez',
      photoURL: '',
    });
  });

  it('fails when the endpoint returns a 409', async () => {
    mockFetch(
      {
        statusCode: 409,
        message: 'El usuario ya está registrado',
        error: 'Conflict',
      },
      409,
    );
    const { registerWithPassword } = loadAuth();

    await expect(
      registerWithPassword(toRegisterPasswordRequest(PATIENT_DATA)),
    ).rejects.toThrow('El usuario ya está registrado');
  });

  it('refuses to open a session when the endpoint answered without a token', async () => {
    mockFetch({ ...RESPONSE_BODY, access_token: '' });
    const { registerWithPassword, openSessionWithRegistration } = loadAuth();

    const registration = await registerWithPassword(
      toRegisterPasswordRequest(PATIENT_DATA),
    );

    await expect(openSessionWithRegistration(registration)).rejects.toThrow(
      /token/i,
    );

    const { getAccessToken } = require('@/services/auth/tokenStorage');

    expect(await getAccessToken()).toBeNull();
  });

  it('refuses to open a session when the endpoint answered without a role', async () => {
    mockFetch({ ...RESPONSE_BODY, role: undefined });
    const { registerWithPassword, openSessionWithRegistration } = loadAuth();

    const registration = await registerWithPassword(
      toRegisterPasswordRequest(PATIENT_DATA),
    );

    await expect(openSessionWithRegistration(registration)).rejects.toThrow(
      /rol/i,
    );
  });
});