import React from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const OposicionPulgarGuideScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();
  const route = useRoute<
    RouteProp<ExerciseFlowParamList, 'OposicionPulgarGuide'>
  >();

  return (
    <ExerciseGuideScreen
      exerciseId={route.params.exerciseId}
      onStart={() =>
        navigation.navigate('Preparation', {
          exerciseId: route.params.exerciseId,
        })
      }
    />
  );
};
