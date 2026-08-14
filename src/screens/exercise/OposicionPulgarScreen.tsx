import React from 'react';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { OPOSICION_PULGAR_DETAIL } from './data/oposicionPulgar';

export const OposicionPulgarScreen: React.FC = () => (
  <ExerciseDetailScreen
    detail={OPOSICION_PULGAR_DETAIL}
    stepBadge="Paso 1 de 3"
  />
);
