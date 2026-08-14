import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import { CERRAR_MANO_DETAIL } from './data/cerrarMano';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const CerrarManoScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseDetailScreen
      detail={CERRAR_MANO_DETAIL}
      stepBadge="Paso 1 de 3"
      onContinue={() => navigation.navigate('CerrarManoGuide')}
    />
  );
};
