import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrivateTabBarProvider, usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { ExerciseFlowNavigator } from '@/navigation/navigators/ExerciseFlowNavigator';
import { PrivateNavigation } from '@/navigation/privateNavigation/privateNavigation.tsx';
import { HomeScreen } from '@/screens/private/HomeScreen';
import { ProfileScreen } from '@/screens/private/ProfileScreen';
import { ProgressScreen } from '@/screens/private/ProgressScreen';

const SCREENS: Record<string, React.ComponentType> = {
  home: HomeScreen,
  exercises: ExerciseFlowNavigator,
  progress: ProgressScreen,
  profile: ProfileScreen,
};

const PrivateNavigatorContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { isHidden } = usePrivateTabBar();

  const ActiveScreen = SCREENS[activeTab];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActiveScreen />
      </View>
      {!isHidden && (
        <PrivateNavigation activeTab={activeTab} onTabPress={setActiveTab} />
      )}
    </View>
  );
};

export const PrivateNavigator: React.FC = () => (
  <PrivateTabBarProvider>
    <PrivateNavigatorContent />
  </PrivateTabBarProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FE',
  },
  content: {
    flex: 1,
  },
});
