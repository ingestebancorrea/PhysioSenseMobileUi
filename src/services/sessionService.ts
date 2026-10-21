import { CORE_SERVICE_BASE_URL } from '@/config/env';
import { createApiClient } from '@/services/api/client';
import type {
  BackendSessionExercise,
  BackendSessionResponse,
  CreateTreatmentPlanPayload,
  PaginatedBackendSessions,
  QuerySessionsParams,
  SessionsPageResult,
  Session,
  SessionExercise,
  TreatmentPlan,
  TreatmentPlanDto,
} from '@/types/session';

const coreApi = createApiClient(CORE_SERVICE_BASE_URL);

/**
 * Mapea los estados del backend al vocabulario que usa la app móvil.
 * Vocabulario front: 'Activa' | 'Programada' | 'Borrador' | 'Completada'
 * Nota: el backend también puede enviar 'Cancelada', que el tipo
 * SessionStatus del front no contempla. En ese caso se devuelve tal cual
 * para que no rompa el tipado y la pantalla decida cómo mostrarlo.
 */
const STATUS_MAP: Record<BackendSessionResponse['status'], string> = {
  DRAFT: 'Borrador',
  SCHEDULED: 'Programada',
  IN_PROGRESS: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
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

/**
 * Convierte una fecha ISO (`scheduledAt`) al formato de texto que usa la UI:
 * - Hoy / Ayer / 15 May, 10:00 a. m.
 */
const formatDateText = (iso?: string | null): string => {
  if (!iso) return '';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const hours24 = date.getHours();
  const period = hours24 < 12 ? 'a. m.' : 'p. m.';
  const hours12 = hours24 % 12 || 12;
  const minutes = pad(date.getMinutes());

  if (isToday) return `Hoy, ${hours12}:${minutes} ${period}`;
  if (isYesterday) return `Ayer, ${hours12}:${minutes} ${period}`;

  const monthLabel = MONTHS_ES[date.getMonth()] ?? String(date.getMonth() + 1);
  return `${date.getDate()} ${monthLabel}, ${hours12}:${minutes} ${period}`;
};

const mapExercise = (
  item: BackendSessionExercise,
): SessionExercise => ({
  id: String(item.id),
  title: item.title,
  sessions: item.setsAndReps, // ej. "3 series - 15 rep"
  repetitions: `${item.reps} ${item.measure_unit.toLowerCase()}`, // ej. "15 rep" o "20 seg"
  imageUrl: item.imageUrl ?? undefined,
});

export const mapSessionFromBackend = (
  dto: BackendSessionResponse,
): Session => ({
  id: String(dto.id),
  title: dto.title,
  patientName: dto.patientName,
  patientAvatarUrl: dto.patientAvatarUrl ?? '',
  dateText: formatDateText(dto.scheduledAt),
  exerciseCount: dto.exerciseCount,
  durationMinutes: dto.durationMinutes,
  status: (STATUS_MAP[dto.status] ?? dto.status) as
    | 'Activa'
    | 'Programada'
    | 'Borrador'
    | 'Completada',
  objective: dto.objective ?? undefined,
  progress: dto.progress,
  exercises: dto.exercises?.map(mapExercise),
});

/** Mapea la respuesta cruda del backend a un plan de tratamiento. */
export const mapTreatmentPlan = (dto: TreatmentPlanDto): TreatmentPlan => ({
  id: String(dto.id),
  patientId: String(dto.patient_id),
  sessionId: dto.session_id ? String(dto.session_id) : undefined,
  startDate: dto.startDate,
  frequencyPerWeek: dto.frequencyPerWeek,
  planDurationWeeks: dto.planDurationWeeks,
  notes: dto.notes ?? undefined,
  isActive: dto.is_active,
});

/**
 * Servicio de sesiones para el fisioterapeuta.
 * Consume: GET /sessions  (el fisioterapeuta ve todas las sesiones)
 */
export const sessionService = {
  /**
   * GET /sessions
   * @param params Filtros opcionales (página, límite, estado, búsqueda, etc.)
   * @returns Sesiones ya mapeadas al tipo `Session` de la app, con paginación.
   * Lanza `ApiClientError` en 401, 403, 400 o 500.
   *
   * Nota sobre `search`: el backend filtra por título de la sesión (el nombre
   * del paciente vive en el microservicio de autenticación y no se filtra por
   * SQL).
   */
  getSessions: async (
    params?: QuerySessionsParams,
  ): Promise<SessionsPageResult> => {
    const query = new URLSearchParams();

    if (params?.patient_id !== undefined)
      query.append('patient_id', String(params.patient_id));
    if (params?.therapist_id !== undefined)
      query.append('therapist_id', String(params.therapist_id));
    if (params?.status !== undefined) query.append('status', params.status);
    if (params?.duration_range !== undefined)
      query.append('duration_range', params.duration_range);
    if (params?.search) query.append('search', params.search);
    if (params?.page !== undefined) query.append('page', String(params.page));
    if (params?.limit !== undefined) query.append('limit', String(params.limit));

    const path = `/sessions?${query.toString()}`;
    const response = await coreApi.get<PaginatedBackendSessions>(path);

    return {
      sessions: (response?.items ?? []).map(mapSessionFromBackend),
      total: response?.total ?? 0,
      page: response?.page ?? 1,
      limit: response?.limit ?? 20,
      totalPages: response?.total_pages ?? 0,
    };
  },

  /**
   * GET /sessions?patient_id={id}
   * Sesiones que pertenecen a un paciente concreto (las que se pueden asignar).
   */
  getSessionsForPatient: async (
    patientId: string | number,
    params?: QuerySessionsParams,
  ): Promise<SessionsPageResult> => {
    const numericId = Number(patientId);

    return sessionService.getSessions({
      page: 1,
      limit: 50,
      ...params,
      patient_id: Number.isFinite(numericId) ? numericId : params?.patient_id,
    });
  },

  getSessionById: async (id: number | string): Promise<Session> => {
    const response = await coreApi.get<BackendSessionResponse>(
      `/sessions/${id}`,
    );

    return mapSessionFromBackend(response);
  },

  /**
   * POST /sessions/plans
   * Crea el plan de tratamiento de la pantalla "Asignar sesión".
   */
  createTreatmentPlan: async (
    payload: CreateTreatmentPlanPayload,
  ): Promise<TreatmentPlan> => {
    const response = await coreApi.post<TreatmentPlanDto>('/sessions/plans', {
      patient_id: Number(payload.patientId),
      session_id:
        payload.sessionId !== undefined ? Number(payload.sessionId) : undefined,
      start_date: payload.startDate,
      frequency_per_week: payload.frequencyPerWeek,
      plan_duration_weeks: payload.planDurationWeeks,
      notes: payload.notes,
    });

    return mapTreatmentPlan(response);
  },
};
