export type ExerciseFlowParamList = {
  ExerciseList: undefined;
  CerrarMano: undefined;
  AbrirMano: undefined;
  Pinza: undefined;
  OposicionPulgar: undefined;
  CerrarManoGuide: undefined;
  AbrirManoGuide: undefined;
  PinzaGuide: undefined;
  OposicionPulgarGuide: undefined;
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
