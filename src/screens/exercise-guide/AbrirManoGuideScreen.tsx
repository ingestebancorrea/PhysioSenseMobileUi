import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { ABRIR_MANO_GUIDE } from './data/guideAbrirMano';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const AbrirManoGuideScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseGuideScreen
      guide={ABRIR_MANO_GUIDE}
      onStart={() =>
        navigation.navigate('Preparation', { exerciseId: ABRIR_MANO_GUIDE.id })
      }
    />
  );
};
