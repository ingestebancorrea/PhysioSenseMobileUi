import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DrawerMenu } from '@/components/drawer/DrawerMenu';
import { DrawerProvider } from '@/context/DrawerContext';
import { PrivateNavigationProvider } from '@/context/PrivateNavigationContext';
import { PrivateTabBarProvider, usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { ExerciseFlowNavigator } from '@/navigation/navigators/ExerciseFlowNavigator';
import { ProgressFlowNavigator } from '@/navigation/navigators/ProgressFlowNavigator';
import { PrivateNavigation } from '@/navigation/privateNavigation/privateNavigation.tsx';
import { DevicesScreen } from '@/screens/private/DevicesScreen';
import { HomeScreen } from '@/screens/private/HomeScreen';
import { NotificationsScreen } from '@/screens/private/NotificationsScreen';
import { ProfileScreen } from '@/screens/private/ProfileScreen';

const SCREENS: Record<string, React.ComponentType> = {
  home: HomeScreen,
  exercises: ExerciseFlowNavigator,
  devices: DevicesScreen,
  profile: ProfileScreen,
};

type ProgressRoute = 'ProgressMain' | 'SessionHistory';

const PrivateNavigatorContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [progressRoute, setProgressRoute] = useState<ProgressRoute>(
    'ProgressMain',
  );
  const { isHidden } = usePrivateTabBar();

  const handleTabPress = (tab: string) => {
    if (tab === 'progress') {
      setProgressRoute('ProgressMain');
    }
    setActiveTab(tab);
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'progress') {
      setProgressRoute('ProgressMain');
    }
    setActiveTab(tab);
  };

  const handleDrawerSelect = (key: string) => {
    switch (key) {
      case 'home':
        setActiveTab('home');
        break;
      case 'exercises':
        setActiveTab('exercises');
        break;
      case 'devices':
        setActiveTab('devices');
        break;
      case 'progress':
        setProgressRoute('ProgressMain');
        setActiveTab('progress');
        break;
      case 'history':
        setProgressRoute('SessionHistory');
        setActiveTab('progress');
        break;
      case 'notifications':
        setActiveTab('notifications');
        break;
      case 'profile':
        setActiveTab('profile');
        break;
      default:
        break;
    }
  };

  const renderActiveScreen = () => {
    if (activeTab === 'progress') {
      return (
        <ProgressFlowNavigator
          key={progressRoute}
          initialRouteName={progressRoute}
        />
      );
    }

    if (activeTab === 'notifications') {
      return <NotificationsScreen onBack={() => setActiveTab('home')} />;
    }

    const Screen = SCREENS[activeTab];
    return <Screen />;
  };

  return (
    <View style={styles.container}>
      <PrivateNavigationProvider onNavigate={handleNavigate}>
        <View style={styles.content}>{renderActiveScreen()}</View>
      </PrivateNavigationProvider>
      {!isHidden && (
        <PrivateNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      )}
      <DrawerMenu activeItem={activeTab} onSelect={handleDrawerSelect} />
    </View>
  );
};

export const PrivateNavigator: React.FC = () => (
  <PrivateTabBarProvider>
    <DrawerProvider>
      <PrivateNavigatorContent />
    </DrawerProvider>
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
