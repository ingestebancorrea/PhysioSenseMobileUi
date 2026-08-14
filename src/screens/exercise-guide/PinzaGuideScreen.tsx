import React from 'react';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { PINZA_GUIDE } from './data/guidePinza';

export const PinzaGuideScreen: React.FC = () => (
  <ExerciseGuideScreen guide={PINZA_GUIDE} />
);
