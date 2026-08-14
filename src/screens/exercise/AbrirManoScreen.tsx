import React from 'react';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { ABRIR_MANO_DETAIL } from './data/abrirMano';

export const AbrirManoScreen: React.FC = () => (
  <ExerciseDetailScreen detail={ABRIR_MANO_DETAIL} stepBadge="Paso 1 de 3" />
);
