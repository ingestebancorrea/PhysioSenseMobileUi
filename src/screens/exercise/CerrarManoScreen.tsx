import React from 'react';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { CERRAR_MANO_DETAIL } from './data/cerrarMano';

export const CerrarManoScreen: React.FC = () => (
  <ExerciseDetailScreen detail={CERRAR_MANO_DETAIL} stepBadge="Paso 1 de 3" />
);
