import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseDetailScreen } from './ExerciseDetailScreen';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const CerrarManoScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const route = useRoute<RouteProp<ExerciseFlowParamList, 'CerrarMano'>>();

  return (
    <ExerciseDetailScreen
      exerciseId={route.params.exerciseId}
      stepBadge="Paso 1 de 3"
      onContinue={() =>
        navigation.navigate('CerrarManoGuide', {
          exerciseId: route.params.exerciseId,
        })
      }
    />
  );
};
