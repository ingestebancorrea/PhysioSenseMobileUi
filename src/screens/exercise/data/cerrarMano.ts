import type { ImageSourcePropType } from 'react-native';
import type { ExerciseDetail } from '@/types/exerciseDetail';

const GLOVE_THUMBNAIL = require('../../../../assets/glove.png') as ImageSourcePropType;

export const CERRAR_MANO_DETAIL: ExerciseDetail = {
  id: 'exercise_01',
  title: 'Cerrar la mano',
  videoThumbnailUri: GLOVE_THUMBNAIL,
  videoDuration: '0:45',
  description:
    'Este ejercicio ayuda a mejorar la fuerza y el control de los músculos flexores de la mano. Cierra el puño lentamente manteniendo una postura relajada.',
  specs: {
    series: 3,
    repsPerSeries: 15,
    restTimeSeconds: 30,
    requirements: [
      'Usa el guante correctamente',
      'Mantén la muñeca alineada con el antebrazo',
      'Realiza cada repetición de forma lenta y controlada',
    ],
  },
  targetMuscles: ['Flexores de los dedos', 'Flexor largo del pulgar'],
};
