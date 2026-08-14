import React from 'react';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { CERRAR_MANO_GUIDE } from './data/guideCerrarMano';

export const CerrarManoGuideScreen: React.FC = () => (
  <ExerciseGuideScreen guide={CERRAR_MANO_GUIDE} />
);
