import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { ABRIR_MANO_DETAIL } from './data/abrirMano';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const AbrirManoScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseDetailScreen
      detail={ABRIR_MANO_DETAIL}
      stepBadge="Paso 1 de 3"
      onContinue={() => navigation.navigate('AbrirManoGuide')}
    />
  );
};
