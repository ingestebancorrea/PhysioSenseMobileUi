export type SessionStatus = 'Activa' | 'Programada' | 'Borrador' | 'Completada' | 'Cancelada';

export interface Session {
  id: string;
  title: string;
  patientName: string;
  patientAvatarUrl: string;
  dateText: string;
  exerciseCount: number;
  durationMinutes: number;
  status: SessionStatus;
  objective?: string;
  progress?: number;
  exercises?: SessionExercise[];
}

export interface SessionExercise {
  id: string;
  title: string;
  sessions: string;
  repetitions: string;
  imageUrl?: string;
}

export interface SessionFormData {
  patientName: string;
  sessionTitle: string;
  sessionObjective: string;
  selectedDate: string;
  selectedTime: string;
  estimatedDuration: string;
  exercises: SessionExercise[];
}

/*──────────────────────────────────────────────────────────────
  DTOs de RESPUESTA del backend (NestJS / TypeORM)
  Coinciden con SessionResponseDto y PaginatedDto del microservicio.
──────────────────────────────────────────────────────────────*/

export type BackendSessionStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BackendSessionExercise {
  id: number;
  code: string;
  title: string;
  imageUrl?: string;
  series: number;
  reps: number;
  measure_unit: string;
  setsAndReps: string;
  completedRepetitions: number;
  progressPercentage: number;
  averageForce?: number | null;
  averageQuality?: string;
}

export interface BackendSessionResponse {
  id: number;
  patient_id: number;
  patientName: string;
  patientAvatarUrl?: string | null;
  therapist_id: number;
  title: string;
  objective?: string | null;
  scheduledAt: string; // ISO 8601
  durationMinutes: number;
  status: BackendSessionStatus;
  statusLabel: string; // 'Borrador' | 'Programada' | 'Activa' | 'Completada' | 'Cancelada'
  exerciseCount: number;
  progress: number;
  totalRepetitions: number;
  startedAt?: string | null;
  completedAt?: string | null;
  observations?: string | null;
  exercises?: BackendSessionExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedBackendSessions {
  items: BackendSessionResponse[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

/*──────────────────────────────────────────────────────────────
  Parámetros de consulta que el front envía al endpoint GET /sessions
  Coinciden con QuerySessionsDto del backend.
──────────────────────────────────────────────────────────────*/

export interface QuerySessionsParams {
  patient_id?: number;
  therapist_id?: number;
  status?: BackendSessionStatus;
  duration_range?: 'short' | 'medium' | 'long';
  search?: string;
  page?: number;
  limit?: number;
}

/*──────────────────────────────────────────────────────────────
  Resultado mapeado listo para la UI (ya transformado del backend)
──────────────────────────────────────────────────────────────*/

export interface SessionsPageResult {
  sessions: Session[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/*──────────────────────────────────────────────────────────────
  Plan de tratamiento (pantalla "Asignar sesión")
  Coincide con TreatmentPlanResponseDto / CreateTreatmentPlanDto
  del microservicio core (endpoints /sessions/plans).
──────────────────────────────────────────────────────────────*/

/** `GET /api/v1/sessions/plans/{patientId}` / `POST /api/v1/sessions/plans`. */
export interface TreatmentPlan {
  id: string;
  patientId: string;
  sessionId?: string;
  /** `YYYY-MM-DD`. */
  startDate: string;
  frequencyPerWeek: number;
  planDurationWeeks: number;
  notes?: string;
  isActive: boolean;
}

/** Body que espera `POST /api/v1/sessions/plans`. */
export interface CreateTreatmentPlanPayload {
  patientId: string;
  sessionId?: string;
  /** `YYYY-MM-DD` (el backend lo valida con `@IsDateString()`). */
  startDate: string;
  frequencyPerWeek: number;
  planDurationWeeks: number;
  notes?: string;
}

/** Respuesta cruda del backend para un plan de tratamiento. */
export interface TreatmentPlanDto {
  id: number;
  patient_id: number;
  session_id?: number | null;
  startDate: string;
  frequencyPerWeek: number;
  planDurationWeeks: number;
  notes?: string | null;
  is_active: boolean;
}
