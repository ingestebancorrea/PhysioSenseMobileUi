import type { ImageSourcePropType } from 'react-native';
import type { ExerciseDetail } from '@/types/exerciseDetail';

const GLOVE_THUMBNAIL = require('../../../../assets/glove.png') as ImageSourcePropType;

export const OPOSICION_PULGAR_DETAIL: ExerciseDetail = {
  id: 'exercise_04',
  title: 'Oposición del pulgar',
  videoThumbnailUri: GLOVE_THUMBNAIL,
  videoDuration: '0:45',
  description:
    'Este ejercicio desarrolla la coordinación del pulgar para tocar cada dedo de la mano. Recorre cada dedo de forma secuencial y controlada.',
  specs: {
    series: 3,
    repsPerSeries: 10,
    restTimeSeconds: 30,
    requirements: [
      'Usa el guante correctamente',
      'Toca cada dedo sin mover la palma',
      'Realiza el recorrido de forma lenta',
    ],
  },
  targetMuscles: [
    'Oponente del pulgar',
    'Flexor corto del pulgar',
    'Aductor del pulgar',
  ],
};
