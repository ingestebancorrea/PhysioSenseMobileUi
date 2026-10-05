import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ExerciseGuideScreen } from './ExerciseGuideScreen';
import { CERRAR_MANO_GUIDE } from './data/guideCerrarMano';
import type { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';

export const CerrarManoGuideScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ExerciseFlowParamList>>();

  return (
    <ExerciseGuideScreen
      guide={CERRAR_MANO_GUIDE}
      onStart={() =>
        navigation.navigate('Preparation', { exerciseId: CERRAR_MANO_GUIDE.id })
      }
    />
  );
};
