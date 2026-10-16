import { CORE_SERVICE_BASE_URL } from '@/config/env';
import { createApiClient } from '@/services/api/client';
import type { Patient, PatientStatus } from '@/types/patient';
import type {
  CorePatientStatus,
  TherapistPatientDetailDto,
  TherapistPatientItemDto,
  TherapistPatientsResponse,
} from '@/types/therapistPatients';

const coreApi = createApiClient(CORE_SERVICE_BASE_URL);

const STATUS_BY_CODE: Record<CorePatientStatus, PatientStatus> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
};

const MONTHS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const pad = (value: number): string => String(value).padStart(2, '0');

const ageFromBirthDate = (birthDate?: string): number | undefined => {
  if (!birthDate) {
    return undefined;
  }

  const timestamp = Date.parse(birthDate);
  if (Number.isNaN(timestamp)) {
    return undefined;
  }

  const age = Math.floor((Date.now() - timestamp) / (365.25 * 24 * 60 * 60 * 1000));
  return age >= 0 ? age : undefined;
};

/** Formats `YYYY-MM-DD` (or ISO) as `15 Abril, 2024`, mapping style used by the UI. */
const formatDate = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    return value;
  }

  const [, year, month, day] = match;
  const monthLabel = MONTHS_ES[Number(month) - 1] ?? month;
  return `${Number(day)} ${monthLabel}, ${year}`;
};

/** Formats an ISO timestamp in local time as `15 Agosto, 2024, 9:15 a. m.`. */
const formatDateTime = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  const hours24 = date.getHours();
  const period = hours24 < 12 ? 'a. m.' : 'p. m.';
  const hours12 = hours24 % 12 || 12;

  return `${date.getDate()} ${MONTHS_ES[date.getMonth()]}, ${date.getFullYear()}, ${hours12}:${pad(
    date.getMinutes(),
  )} ${period}`;
};

const toMetrics = (
  compliance?: number,
  rom?: number,
  strength?: number,
): Patient['metrics'] =>
  compliance !== undefined || rom !== undefined || strength !== undefined
    ? { compliance: compliance ?? 0, rom: rom ?? 0, strength: strength ?? 0 }
    : undefined;

const toPatient = (dto: TherapistPatientItemDto): Patient => ({
  id: String(dto.id),
  name: dto.name,
  age: dto.age ?? ageFromBirthDate(dto.birthDate) ?? 0,
  avatarUrl: dto.avatarUrl ?? '',
  status: STATUS_BY_CODE[dto.status] ?? 'Activo',
  diagnosis: dto.diagnosis,
  startDate: formatDate(dto.startDate),
  metrics: toMetrics(dto.compliance, dto.rom, dto.strength),
});

const toPatientDetail = (dto: TherapistPatientDetailDto): Patient => {
  const hasLastSession =
    dto.lastSessionCompletedExercises !== undefined ||
    dto.lastSessionTotalExercises !== undefined;

  return {
    id: String(dto.id),
    name: dto.name,
    age: dto.age ?? ageFromBirthDate(dto.birthDate) ?? 0,
    avatarUrl: dto.avatarUrl ?? '',
    status: STATUS_BY_CODE[dto.status] ?? 'Activo',
    diagnosis: dto.diagnosis,
    startDate: formatDate(dto.startDate),
    therapistName: dto.therapistName,
    metrics: toMetrics(dto.compliance, dto.rom, dto.strength),
    lastSession: formatDateTime(dto.lastSessionAt),
    lastSessionDetail: hasLastSession
      ? {
          completedExercises: dto.lastSessionCompletedExercises ?? 0,
          totalExercises: dto.lastSessionTotalExercises ?? 0,
        }
      : undefined,
  };
};

export interface TherapistPatientsResult {
  message: string | null;
  patients: Patient[];
}

export const patientService = {
  /**
   * GET /api/v1/therapists/patients
   * Pacientes asignados al fisioterapeuta autenticado (requiere Bearer token).
   */
  getMyPatients: async (): Promise<TherapistPatientsResult> => {
    const response = await coreApi.get<TherapistPatientsResponse>(
      '/therapists/patients',
    );

    return {
      message: response?.message ?? null,
      patients: (response?.items ?? []).map(toPatient),
    };
  },

  /**
   * GET /api/v1/therapists/patients/{id}
   * Detalle de un paciente asignado al fisioterapeuta autenticado.
   * Rechaza con `ApiClientError` (status 404) si no está asignado o no existe.
   */
  getPatientById: async (id: string): Promise<Patient> => {
    const response = await coreApi.get<TherapistPatientDetailDto>(
      `/therapists/patients/${id}`,
    );

    return toPatientDetail(response);
  },
};
