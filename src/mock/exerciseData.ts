import type { ImageSourcePropType } from 'react-native';
import type { ExerciseListItem } from '@/types/exercise';

const CLOSED_HAND_IMAGE = require('../../assets/closed-hand.png') as ImageSourcePropType;
const OPEN_HAND_IMAGE = require('../../assets/open-hand.png') as ImageSourcePropType;
const CLAMP_IMAGE = require('../../assets/clamp.png') as ImageSourcePropType;
const MOVE_THUMB_IMAGE = require('../../assets/move-thumb.png') as ImageSourcePropType;

export const EXERCISES: ExerciseListItem[] = [
  {
    id: 'exercise_01',
    title: 'Cerrar la mano',
    description: 'Fortalecimiento de los músculos flexores de la mano',
    series: 3,
    reps: 15,
    duration: '30 seg',
    category: 'Mano',
    imageUri: CLOSED_HAND_IMAGE,
  },
  {
    id: 'exercise_02',
    title: 'Abrir la mano',
    description: 'Movilidad y apertura completa de la mano',
    series: 3,
    reps: 15,
    duration: '30 seg',
    category: 'Mano',
    imageUri: OPEN_HAND_IMAGE,
  },
  {
    id: 'exercise_03',
    title: 'Pinza',
    description: 'Precisión y fuerza en la pinza fina del pulgar e índice',
    series: 4,
    reps: 12,
    duration: '45 seg',
    category: 'Dedos',
    imageUri: CLAMP_IMAGE,
  },
  {
    id: 'exercise_04',
    title: 'Oposición del pulgar',
    description: 'Coordinación del pulgar para tocar cada dedo de la mano',
    series: 3,
    reps: 10,
    duration: '40 seg',
    category: 'Muñeca',
    imageUri: MOVE_THUMB_IMAGE,
  },
];
