// src/navigation/navigators/RegisterFlowNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RegistrationProvider } from '@/context/RegistrationContext';
import { RegisterFlowParamList } from '@/navigation/types/registerFlowParams';
import RoleSelectionScreen from '@/screens/register/RoleSelectionScreen';
import CreateAccountScreen from '@/screens/register/CreateAccountScreen';
import ProfessionalInfoScreen from '@/screens/register/ProfessionalInfoScreen';
import PatientInfoScreen from '@/screens/register/PatientInfoScreen';
import AdditionalInfoScreen from '@/screens/register/AdditionalInfoScreen';
import ReviewInformationScreen from '@/screens/register/ReviewInformationScreen';
import FinalWelcomeScreen from '@/screens/register/FinalWelcomeScreen';

const Stack = createNativeStackNavigator<RegisterFlowParamList>();

export const RegisterFlowNavigator: React.FC = () => (
  <RegistrationProvider>
    <Stack.Navigator
      initialRouteName="RoleSelection"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="ProfessionalInfo" component={ProfessionalInfoScreen} />
      <Stack.Screen name="PatientInfo" component={PatientInfoScreen} />
      <Stack.Screen name="AdditionalInfo" component={AdditionalInfoScreen} />
      <Stack.Screen
        name="ReviewInformation"
        component={ReviewInformationScreen}
      />
      <Stack.Screen name="FinalWelcome" component={FinalWelcomeScreen} />
    </Stack.Navigator>
  </RegistrationProvider>
);
