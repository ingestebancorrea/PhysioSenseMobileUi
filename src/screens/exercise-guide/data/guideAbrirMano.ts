import type { ImageSourcePropType } from 'react-native';
import type { ExerciseGuide } from '@/types/exerciseGuide';

const GLOVE = require('../../../../assets/glove.png') as ImageSourcePropType;
const OPEN_HAND = require('../../../../assets/open-hand.png') as ImageSourcePropType;
const CLOSED_HAND = require('../../../../assets/closed-hand.png') as ImageSourcePropType;

export const ABRIR_MANO_GUIDE: ExerciseGuide = {
  id: 'exercise_02',
  title: 'Abrir la mano',
  steps: [
    {
      id: 'step_1',
      title: 'Colócate el guante',
      description:
        'Ajusta el guante correctamente, con la muñeca alineada con el antebrazo.',
      imageUri: GLOVE,
    },
    {
      id: 'step_2',
      title: 'Posición inicial',
      description:
        'Cierra la mano en un puño relajado, sin ejercer tensión en los dedos.',
      imageUri: CLOSED_HAND,
    },
    {
      id: 'step_3',
      title: 'Abre los dedos',
      description:
        'Separa los dedos al máximo de forma progresiva, sin forzar el movimiento.',
      imageUri: OPEN_HAND,
    },
    {
      id: 'step_4',
      title: 'Mantén la posición',
      description:
        'Sostén los dedos abiertos unos segundos sintiendo el estiramiento.',
      imageUri: OPEN_HAND,
    },
    {
      id: 'step_5',
      title: 'Regresa y repite',
      description:
        'Vuelve a cerrar la mano con control y repite el movimiento de apertura.',
      imageUri: CLOSED_HAND,
    },
  ],
};
