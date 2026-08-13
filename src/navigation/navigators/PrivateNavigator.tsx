import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrivateNavigation } from '@/navigation/privateNavigation/privateNavigation.tsx';
import { EjercicioListScreen } from '@/screens/private/EjercicioListScreen';
import { HomeScreen } from '@/screens/private/HomeScreen';
import { ProfileScreen } from '@/screens/private/ProfileScreen';
import { ProgressScreen } from '@/screens/private/ProgressScreen';

const SCREENS: Record<string, React.ComponentType> = {
  home: HomeScreen,
  exercises: EjercicioListScreen,
  progress: ProgressScreen,
  profile: ProfileScreen,
};

export const PrivateNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const ActiveScreen = SCREENS[activeTab];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActiveScreen />
      </View>
      <PrivateNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },
  content: {
    flex: 1,
  },
});
