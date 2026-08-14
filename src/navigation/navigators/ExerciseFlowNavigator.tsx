import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import { EjercicioListScreen } from '@/screens/private/EjercicioListScreen';
import { AbrirManoScreen } from '@/screens/exercise/AbrirManoScreen';
import { CerrarManoScreen } from '@/screens/exercise/CerrarManoScreen';
import { OposicionPulgarScreen } from '@/screens/exercise/OposicionPulgarScreen';
import { PinzaScreen } from '@/screens/exercise/PinzaScreen';

const Stack = createNativeStackNavigator<ExerciseFlowParamList>();

export const ExerciseFlowNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="ExerciseList"
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="ExerciseList" component={EjercicioListScreen} />
    <Stack.Screen name="CerrarMano" component={CerrarManoScreen} />
    <Stack.Screen name="AbrirMano" component={AbrirManoScreen} />
    <Stack.Screen name="Pinza" component={PinzaScreen} />
    <Stack.Screen name="OposicionPulgar" component={OposicionPulgarScreen} />
  </Stack.Navigator>
);
