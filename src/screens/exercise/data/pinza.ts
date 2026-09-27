import type { ImageSourcePropType } from 'react-native';
import type { ExerciseDetail } from '@/types/exerciseDetail';

const GLOVE_THUMBNAIL = require('../../../../assets/glove.png') as ImageSourcePropType;

export const PINZA_DETAIL: ExerciseDetail = {
  id: 'exercise_03',
  title: 'Pinza',
  videoThumbnailUri: GLOVE_THUMBNAIL,
  videoDuration: '0:45',
  description:
    'Este ejercicio mejora la precisión y la fuerza de la pinza fina entre el pulgar y el índice. Une las yemas con firmeza y suelta con control.',
  specs: {
    series: 4,
    repsPerSeries: 12,
    restTimeSeconds: 30,
    requirements: [
      'Usa el guante correctamente',
      'Fija la muñeca durante el movimiento',
      'Mantén la pinza firme en cada repetición',
    ],
  },
  targetMuscles: [
    'Flexor largo del pulgar',
    'Flexor profundo del índice',
    'Músculos de la eminencia tenar',
  ],
};
