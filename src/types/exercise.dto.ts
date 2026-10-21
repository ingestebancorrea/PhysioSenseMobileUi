/**
 * Contrato de respuesta del backend para GET/POST/PUT /exercises.
 * Solo los campos que el frontend consume. No mezclar con lógica de UI.
 */

/** Un paso de la guía del ejercicio (`guideSteps`). */
export interface ExerciseGuideStepDto {
  position: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
}

export interface ExerciseResponseDto {
  /** Código estable del ejercicio (ej. "exercise_01"). */
  id: string;
  exercise_id: number;
  title: string;
  description?: string | null;
  instructions?: string | null;
  category: string;
  series: number;
  reps: number;
  measure_unit: string;
  restSeconds: number;
  /** Duración del video en formato "M:SS" (ej. "0:45"). */
  duration?: string | null;
  targetRange?: { min: number; max: number } | null;
  requirements?: string[] | null;
  targetMuscles?: string[] | null;
  imageUri?: string | null;
  videoThumbnailUri?: string | null;
  videoDuration?: string | null;
  video_url?: string | null;
  cover_image_url?: string | null;
  guideSteps?: ExerciseGuideStepDto[] | null;
  is_active: boolean;
}

/**
 * Query params opcionales de GET /exercises.
 * Si se omiten, el backend devuelve el catálogo completo.
 */
export interface ExerciseListQueryDto {
  category?: string;
  search?: string;
}

/**
 * Body de POST /exercises y PUT /exercises/{ref}.
 *
 * Ojo con el contrato: la app manda camelCase (`restSeconds`, `targetMuscles`,
 * `videoUrl`, `coverImageUrl`) y el backend los acepta tal cual; en la base el
 * nombre es snake_case.
 */
export interface SaveExercisePayload {
  title: string;
  description: string;
  instructions: string;
  series: number;
  reps: number;
  restSeconds: number;
  requirements: string[];
  targetMuscles: string[];
  videoUrl: string;
  coverImageUrl: string;
}
