import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { OPOSICION_PULGAR_DETAIL } from './data/oposicionPulgar';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const OposicionPulgarScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseDetailScreen
      detail={OPOSICION_PULGAR_DETAIL}
      stepBadge="Paso 1 de 3"
      onContinue={() => navigation.navigate('OposicionPulgarGuide')}
    />
  );
};
