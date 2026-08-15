import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { PINZA_GUIDE } from './data/guidePinza';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const PinzaGuideScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseGuideScreen
      guide={PINZA_GUIDE}
      onStart={() => navigation.navigate('Preparation', { exerciseId: PINZA_GUIDE.id })}
    />
  );
};
