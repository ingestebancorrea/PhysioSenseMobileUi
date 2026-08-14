import React from 'react';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { ABRIR_MANO_GUIDE } from './data/guideAbrirMano';

export const AbrirManoGuideScreen: React.FC = () => (
  <ExerciseGuideScreen guide={ABRIR_MANO_GUIDE} />
);
