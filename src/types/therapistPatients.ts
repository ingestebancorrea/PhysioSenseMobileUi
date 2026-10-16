/**
 * Wire DTOs for physiosense-core-be-microservice.
 * Snake/camel mix mirrors the OpenAPI spec (`/api-json`).
 */

export type CorePatientStatus = 'ACTIVE' | 'INACTIVE';

/** One row of `GET /therapists/patients` (`PatientListItemResponseDto`). */
export interface TherapistPatientItemDto {
  id: number;
  user_id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  age?: number;
  birthDate?: string;
  status: CorePatientStatus;
  statusLabel: string;
  diagnosis?: string;
  startDate?: string;
  compliance?: number;
  rom?: number;
  strength?: number;
  phone?: string;
  dominantHand?: string;
  notes?: string;
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
export interface TherapistPatientDetailDto {
  id: number;
  user_id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  age?: number;
  birthDate?: string;
  status: CorePatientStatus;
  statusLabel: string;
  diagnosis?: string;
  startDate?: string;
  therapistName?: string;
  therapist_id?: number;
  compliance?: number;
  rom?: number;
  strength?: number;
  phone?: string;
  dominantHand?: string;
  notes?: string;
  isActive: boolean;
  lastSessionCompletedExercises?: number;
  lastSessionTotalExercises?: number;
  lastSessionAt?: string;
  createdAt: string;
  updatedAt: string;
}
