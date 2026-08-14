import React from 'react';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { PINZA_DETAIL } from './data/pinza';

export const PinzaScreen: React.FC = () => (
  <ExerciseDetailScreen detail={PINZA_DETAIL} stepBadge="Paso 1 de 3" />
);
