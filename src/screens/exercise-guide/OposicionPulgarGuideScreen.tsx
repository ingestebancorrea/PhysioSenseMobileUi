import React from 'react';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { OPOSICION_PULGAR_GUIDE } from './data/guideOposicionPulgar';

export const OposicionPulgarGuideScreen: React.FC = () => (
  <ExerciseGuideScreen guide={OPOSICION_PULGAR_GUIDE} />
);
