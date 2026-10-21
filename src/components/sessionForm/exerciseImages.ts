import { ImageSourcePropType } from 'react-native';

export interface ExerciseImageOption {
  key: string;
  source: ImageSourcePropType;
}

const countdownCero = require('../../../assets/countdownCero.png') as ImageSourcePropType;
const countdownOne = require('../../../assets/countdownOne.png') as ImageSourcePropType;
const countdownTwo = require('../../../assets/countdownTwo.png') as ImageSourcePropType;
const countdownThree = require('../../../assets/countdownThree.png') as ImageSourcePropType;
const countdownFour = require('../../../assets/countdownFour.png') as ImageSourcePropType;
const countdownFive = require('../../../assets/countdownFive.png') as ImageSourcePropType;

export const EXERCISE_IMAGE_OPTIONS: ExerciseImageOption[] = [
  { key: 'countdownCero', source: countdownCero },
  { key: 'countdownOne', source: countdownOne },
  { key: 'countdownTwo', source: countdownTwo },
  { key: 'countdownThree', source: countdownThree },
  { key: 'countdownFour', source: countdownFour },
  { key: 'countdownFive', source: countdownFive },
];

const BY_KEY: Record<string, ImageSourcePropType> = {};
EXERCISE_IMAGE_OPTIONS.forEach((opt) => {
  BY_KEY[opt.key] = opt.source;
});

export const getExerciseImage = (key?: string): ImageSourcePropType =>
  (key ? BY_KEY[key] : undefined) ?? countdownFive;
