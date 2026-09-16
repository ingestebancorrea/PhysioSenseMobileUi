import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ExerciseFlowParamList } from '@/navigation/types/exerciseFlowParams';
import { EjercicioListScreen } from '@/screens/private/EjercicioListScreen';
import { AbrirManoScreen } from '@/screens/exercise/AbrirManoScreen';
import { AbrirManoGuideScreen } from '@/screens/exercise-guide/AbrirManoGuideScreen';
import { CerrarManoScreen } from '@/screens/exercise/CerrarManoScreen';
import { CerrarManoGuideScreen } from '@/screens/exercise-guide/CerrarManoGuideScreen';
import { OposicionPulgarScreen } from '@/screens/exercise/OposicionPulgarScreen';
import { OposicionPulgarGuideScreen } from '@/screens/exercise-guide/OposicionPulgarGuideScreen';
import { PinzaScreen } from '@/screens/exercise/PinzaScreen';
import { PinzaGuideScreen } from '@/screens/exercise-guide/PinzaGuideScreen';
import { PreparationScreen } from '@/screens/preparation/PreparationScreen';
import { CountdownScreen } from '@/screens/countdown/CountdownScreen';
import { ExecutionScreen } from '@/screens/execution/ExecutionScreen';
import { SeriesSummaryScreen } from '@/screens/seriesSummary/SeriesSummaryScreen';
import { ExerciseProgressScreen } from '@/screens/exerciseProgress/ExerciseProgressScreen';

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
    <Stack.Screen name="CerrarManoGuide" component={CerrarManoGuideScreen} />
    <Stack.Screen name="AbrirManoGuide" component={AbrirManoGuideScreen} />
    <Stack.Screen name="PinzaGuide" component={PinzaGuideScreen} />
    <Stack.Screen name="OposicionPulgarGuide" component={OposicionPulgarGuideScreen} />
    <Stack.Screen name="Preparation" component={PreparationScreen} />
    <Stack.Screen name="Countdown" component={CountdownScreen} />
    <Stack.Screen name="Execution" component={ExecutionScreen} />
    <Stack.Screen name="SeriesSummary" component={SeriesSummaryScreen} />
    <Stack.Screen name="ExerciseProgress" component={ExerciseProgressScreen} />
  </Stack.Navigator>
);
