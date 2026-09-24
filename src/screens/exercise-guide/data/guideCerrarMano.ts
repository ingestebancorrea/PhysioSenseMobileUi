import type { ImageSourcePropType } from 'react-native';
import type { ExerciseGuide } from '@/types/exerciseGuide';

const GLOVE = require('../../../../assets/glove.png') as ImageSourcePropType;
const OPEN_HAND = require('../../../../assets/open-hand.png') as ImageSourcePropType;
const CLOSED_HAND = require('../../../../assets/closed-hand.png') as ImageSourcePropType;

export const CERRAR_MANO_GUIDE: ExerciseGuide = {
  id: 'exercise_01',
  title: 'Cerrar la mano',
  steps: [
    {
      id: 'step_1',
      title: 'Colócate el guante',
      description:
        'Ajusta el guante correctamente, verificando que la muñeca quede alineada con el antebrazo.',
      imageUri: GLOVE,
    },
    {
      id: 'step_2',
      title: 'Posición inicial',
      description:
        'Mantén la mano abierta y relajada apoyada sobre una superficie estable.',
      imageUri: OPEN_HAND,
    },
    {
      id: 'step_3',
      title: 'Cierra el puño',
      description:
        'Flexiona los dedos lentamente hasta cerrar el puño sin forzar la muñeca.',
      imageUri: CLOSED_HAND,
    },
    {
      id: 'step_4',
      title: 'Mantén la posición',
      description:
        'Sostén el puño cerrado durante unos segundos manteniendo la postura.',
      imageUri: CLOSED_HAND,
    },
    {
      id: 'step_5',
      title: 'Regresa y repite',
      description:
        'Abre la mano con control y repite el movimiento durante toda la serie.',
      imageUri: OPEN_HAND,
    },
  ],
};
