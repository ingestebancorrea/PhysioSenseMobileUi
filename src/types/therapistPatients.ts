/**
 * Wire DTOs for physiosense-core-be-microservice.
 * Snake/camel mix mirrors the OpenAPI spec (`/api-json`).
 */

export type CorePatientStatus = 'ACTIVE' | 'INACTIVE';

/**
 * Campos que comparten `PatientListItemResponseDto` (GET /therapists/patients)
 * y `PatientResponseDto` (GET /patients/mine). Permite mapear ambas respuestas
 * con el mismo mapper.
 */
export interface CorePatientRowDto {
  id: number;
  user_id: number;
  /** Puede venir `null` si el servicio de autenticación no tiene identidad. */
  name: string | null;
  email: string | null;
  avatarUrl?: string | null;
  age?: number | null;
  birthDate?: string | null;
  status: CorePatientStatus;
  statusLabel: string;
  diagnosis?: string | null;
  startDate?: string | null;
  compliance?: number | null;
  rom?: number | null;
  strength?: number | null;
  phone?: string | null;
  dominantHand?: string | null;
  notes?: string | null;
}

/** One row of `GET /therapists/patients` (`PatientListItemResponseDto`). */
export interface TherapistPatientItemDto extends CorePatientRowDto {
  is_active: boolean;
  is_primary: boolean;
  assigned_at: string;
}

/** `GET /api/v1/therapists/patients` response (`PatientListResponseDto`). */
export interface TherapistPatientsResponse {
  /** Informational message; `null` when there are results. */
  message?: string | null;
  items: TherapistPatientItemDto[];
}

/** `GET /api/v1/therapists/patients/{id}` response (`PatientResponseDto`). */
export interface TherapistPatientDetailDto extends CorePatientRowDto {
  therapistName?: string;
  therapist_id?: number;
  isActive: boolean;
  lastSessionCompletedExercises?: number;
  lastSessionTotalExercises?: number;
  lastSessionAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * `GET /api/v1/patients/mine` response (`PaginatedDto<PatientResponseDto>`).
 * Es el endpoint que soporta la búsqueda por nombre o id del backend.
 */
export interface TherapistPatientsPageResponse {
  items: TherapistPatientDetailDto[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

/**
 * Filtros opcionales del listado de pacientes asignados.
 *
 * - `search`: el backend busca por nombre o por id, sin distinguir mayúsculas.
 */
export interface TherapistPatientsQuery {
  search?: string;
  page?: number;
  limit?: number;
}
