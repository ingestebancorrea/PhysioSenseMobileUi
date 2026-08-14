import type { ImageSourcePropType } from 'react-native';
import type { ExerciseDetail } from '@/types/exerciseDetail';

const GLOVE_THUMBNAIL = require('../../../../assets/glove.png') as ImageSourcePropType;

export const ABRIR_MANO_DETAIL: ExerciseDetail = {
  id: 'exercise_02',
  title: 'Abrir la mano',
  videoThumbnailUri: GLOVE_THUMBNAIL,
  videoDuration: '0:45',
  description:
    'Este ejercicio favorece la movilidad y la apertura completa de la mano. Separa los dedos al máximo sin forzar y regresa a la posición inicial.',
  specs: {
    series: 3,
    repsPerSeries: 15,
    restTimeSeconds: 30,
    requirements: [
      'Usa el guante correctamente',
      'Abre los dedos de forma progresiva',
      'Evita movimientos bruscos',
    ],
  },
  targetMuscles: [
    'Extensores de los dedos',
    'Extensor común de los dedos',
    'Músculos interóseos dorsales',
  ],
};
