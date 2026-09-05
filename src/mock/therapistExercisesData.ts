import { Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import type { ExerciseItem } from '@/components/exercises/ExerciseCard';

const CLOSED_HAND_SOURCE = require('../../assets/closed-hand.png') as ImageSourcePropType;
const OPEN_HAND_SOURCE = require('../../assets/open-hand.png') as ImageSourcePropType;
const CLAMP_SOURCE = require('../../assets/clamp.png') as ImageSourcePropType;
const MOVE_THUMB_SOURCE = require('../../assets/move-thumb.png') as ImageSourcePropType;

const assetUri = (source: ImageSourcePropType): string | undefined =>
  Image.resolveAssetSource(source)?.uri;

export const THERAPIST_EXERCISES: ExerciseItem[] = [
  {
    id: 'exercise_01',
    title: 'Cerrar la mano',
    description: 'Fortalecimiento de los músculos flexores de la mano',
    series: '3 series',
    reps: '15 rep.',
    duration: '30 seg',
    imageUrl: assetUri(CLOSED_HAND_SOURCE),
  },
  {
    id: 'exercise_02',
    title: 'Abrir la mano',
    description: 'Movilidad y apertura completa de la mano',
    series: '3 series',
    reps: '15 rep.',
    duration: '30 seg',
    imageUrl: assetUri(OPEN_HAND_SOURCE),
  },
  {
    id: 'exercise_03',
    title: 'Pinza índice-pulgar',
    description: 'Precisión y fuerza en la pinza fina del pulgar e índice',
    series: '3 series',
    reps: '12 rep.',
    duration: '45 seg',
    imageUrl: assetUri(CLAMP_SOURCE),
  },
  {
    id: 'exercise_04',
    title: 'Flexión de muñeca',
    description: 'Movilidad articular y flexión completa de la muñeca',
    series: '3 series',
    reps: '10 rep.',
    duration: '40 seg',
    imageUrl: assetUri(MOVE_THUMB_SOURCE),
  },
];