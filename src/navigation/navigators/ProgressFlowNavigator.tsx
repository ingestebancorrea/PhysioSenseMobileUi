import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProgressFlowParamList } from '@/navigation/types/progressFlowParams';
import { ProgressScreen } from '@/screens/private/ProgressScreen';
import { SessionDetailScreen } from '@/screens/private/SessionDetailScreen';
import { SessionHistoryScreen } from '@/screens/private/SessionHistoryScreen';

const Stack = createNativeStackNavigator<ProgressFlowParamList>();

interface ProgressFlowNavigatorProps {
  initialRouteName?: keyof ProgressFlowParamList;
}

export const ProgressFlowNavigator: React.FC<ProgressFlowNavigatorProps> = ({
  initialRouteName = 'ProgressMain',
}) => (
  <Stack.Navigator
    initialRouteName={initialRouteName}
    screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
  >
    <Stack.Screen name="ProgressMain" component={ProgressScreen} />
    <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
    <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
  </Stack.Navigator>
);
