import type { ImageSourcePropType } from 'react-native';
import type { ExerciseGuide } from '@/types/exerciseGuide';

const GLOVE = require('../../../../assets/glove.png') as ImageSourcePropType;
const OPEN_HAND = require('../../../../assets/open-hand.png') as ImageSourcePropType;
const MOVE_THUMB = require('../../../../assets/move-thumb.png') as ImageSourcePropType;

export const OPOSICION_PULGAR_GUIDE: ExerciseGuide = {
  id: 'exercise_04',
  title: 'Oposición del pulgar',
  steps: [
    {
      id: 'step_1',
      title: 'Colócate el guante',
      description:
        'Ajusta el guante correctamente, con la palma de la mano hacia arriba.',
      imageUri: GLOVE,
    },
    {
      id: 'step_2',
      title: 'Posición inicial',
      description:
        'Mantén la mano abierta y la palma sin moverse durante todo el recorrido.',
      imageUri: OPEN_HAND,
    },
    {
      id: 'step_3',
      title: 'Toca cada dedo',
      description:
        'Lleva el pulgar a tocar la yema del índice, del medio, del anular y del meñique.',
      imageUri: MOVE_THUMB,
    },
    {
      id: 'step_4',
      title: 'Recorre en orden',
      description:
        'Realiza el recorrido de forma lenta y secuencial, sin saltarte ningún dedo.',
      imageUri: MOVE_THUMB,
    },
    {
      id: 'step_5',
      title: 'Repite la secuencia',
      description:
        'Vuelve al inicio y repite el recorrido completo en cada serie.',
      imageUri: OPEN_HAND,
    },
  ],
};
