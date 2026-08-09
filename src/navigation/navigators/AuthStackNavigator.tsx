// src/navigation/navigators/AuthStackNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackParamList } from '@/navigation/types/authStackParams';
import { WelcomeScreen } from '@/screens/welcome/WelcomeScreen';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import EmailSentScreen from '@/screens/auth/EmailSentScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="EmailSent" component={EmailSentScreen} />
  </Stack.Navigator>
);
