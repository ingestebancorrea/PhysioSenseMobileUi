import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { PINZA_DETAIL } from './data/pinza';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const PinzaScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseDetailScreen
      detail={PINZA_DETAIL}
      stepBadge="Paso 1 de 3"
      onContinue={() => navigation.navigate('PinzaGuide')}
    />
  );
};
