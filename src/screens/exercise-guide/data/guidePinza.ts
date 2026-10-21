import type { ImageSourcePropType } from 'react-native';
import type { ExerciseGuide } from '@/types/exerciseGuide';

const GLOVE = require('../../../../assets/glove.png') as ImageSourcePropType;
const OPEN_HAND = require('../../../../assets/open-hand.png') as ImageSourcePropType;
const CLAMP = require('../../../../assets/clamp.png') as ImageSourcePropType;

export const PINZA_GUIDE: ExerciseGuide = {
  id: 'exercise_03',
  title: 'Pinza',
  steps: [
    {
      id: 'step_1',
      title: 'Colócate el guante',
      description:
        'Ajusta el guante correctamente y fija la muñeca durante todo el movimiento.',
      imageUri: GLOVE,
    },
    {
      id: 'step_2',
      title: 'Posición inicial',
      description:
        'Mantén la palma abierta con los dedos relajados y extendidos.',
      imageUri: OPEN_HAND,
    },
    {
      id: 'step_3',
      title: 'Une las yemas',
      description:
        'Junta la yema del pulgar con la del índice ejerciendo una pinza firme.',
      imageUri: CLAMP,
    },
    {
      id: 'step_4',
      title: 'Mantén la pinza',
      description:
        'Sostén la pinza durante unos segundos sin despegar las yemas.',
      imageUri: CLAMP,
    },
    {
      id: 'step_5',
      title: 'Suelta y repite',
      description:
        'Afloja con control y repite la pinza en cada repetición de la serie.',
      imageUri: OPEN_HAND,
    },
  ],
};
