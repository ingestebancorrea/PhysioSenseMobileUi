import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { OPOSICION_PULGAR_GUIDE } from './data/guideOposicionPulgar';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const OposicionPulgarGuideScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseGuideScreen
      guide={OPOSICION_PULGAR_GUIDE}
      onStart={() =>
        navigation.navigate('Preparation', {
          exerciseId: OPOSICION_PULGAR_GUIDE.id,
        })
      }
    />
  );
};
