export type ExerciseFlowParamList = {
  ExerciseList: undefined;
  /**
   * Detalle y guía: se identifican por el código estable del ejercicio
   * ("exercise_01"), que es lo que viaja desde el listado y lo que la API
   * espera en `GET /exercises/{ref}`.
   */
  CerrarMano: { exerciseId: string };
  AbrirMano: { exerciseId: string };
  Pinza: { exerciseId: string };
  OposicionPulgar: { exerciseId: string };
  CerrarManoGuide: { exerciseId: string };
  AbrirManoGuide: { exerciseId: string };
  PinzaGuide: { exerciseId: string };
  OposicionPulgarGuide: { exerciseId: string };
  Preparation: { exerciseId: string };
  Countdown: {
    exerciseId: string;
    currentRepetition?: number;
    currentSeries?: number;
    totalSeries?: number;
  };
  Execution: {
    exerciseId: string;
    currentRepetition?: number;
    currentSeries?: number;
    totalSeries?: number;
  };
  SeriesSummary: {
    exerciseId: string;
    currentSeries: number;
    totalSeries: number;
    averageForce: number;
    averageQuality: string;
    currentRepetition?: number;
  };
  ExerciseProgress: {
    exerciseId: string;
    completedSeries?: number;
    completedReps?: number;
    averageForce?: number;
    averageQuality?: string;
    totalTime?: number;
  };
};
