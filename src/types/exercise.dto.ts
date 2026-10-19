/**
 * Contrato de respuesta del backend para GET /exercises.
 * Solo los campos que el frontend consume. No mezclar con lógica de UI.
 */

export interface ExerciseResponseDto {
  id: string;
  exercise_id: number;
  title: string;
  description?: string;
  category: string;
  series: number;
  reps: number;
  measure_unit: string;
  restSeconds: number;
  imageUri?: string;
  videoThumbnailUri?: string;
  video_url?: string;
  cover_image_url?: string;
  is_active: boolean;
  duration?: number;
  targetRange?: string;
  requirements?: string[];
  targetMuscles?: string[];
  guideSteps?: string[];
}

/**
 * Query params opcionales para GET /exercises.
 * Ambos son opcionales: si se omiten, el backend devuelve el catálogo completo.
 */
export interface ExerciseListQueryDto {
  category?: string;
  search?: string;
}
