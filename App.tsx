/**
 * PhysioSense - RehabHand
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { AuthStackNavigator } from '@/navigation/navigators/AuthStackNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'light-content'} />
      <NavigationContainer>
        <AuthStackNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
