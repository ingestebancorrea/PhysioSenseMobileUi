import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { DrawerMenu } from '@/components/drawer/DrawerMenu';
import { DrawerProvider } from '@/context/DrawerContext';
import { PrivateNavigationProvider } from '@/context/PrivateNavigationContext';
import { PrivateTabBarProvider, usePrivateTabBar } from '@/context/PrivateTabBarContext';
import { HomeTabBar } from '@/components/dashboard/HomeTabBar';
import { ExerciseFlowNavigator } from '@/navigation/navigators/ExerciseFlowNavigator';
import { ProgressFlowNavigator } from '@/navigation/navigators/ProgressFlowNavigator';
import { PrivateNavigation } from '@/navigation/privateNavigation/privateNavigation.tsx';
import { DevicesScreen } from '@/screens/private/DevicesScreen';
import { ExercisesScreen } from '@/screens/private/ExercisesScreen';
import { HomeScreen } from '@/screens/private/HomeScreen';
import { NotificationsScreen } from '@/screens/private/NotificationsScreen';
import { PatientDetailScreen } from '@/screens/private/PatientDetailScreen';
import { PatientsListScreen } from '@/screens/private/PatientsListScreen';
import { PlaceholderScreen } from '@/screens/private/PlaceholderScreen';
import { ProfileScreen } from '@/screens/private/ProfileScreen';
import { SessionsScreen } from '@/screens/private/SessionsScreen';
import { SettingsScreen } from '@/screens/private/SettingsScreen';
import { TherapistHomeScreen } from '@/screens/private/TherapistHomeScreen';
import { CreateSessionScreen } from '@/screens/physiotherapist/CreateSessionScreen';
import { CreateExerciseScreen } from '@/screens/physiotherapist/CreateExerciseScreen';
import { THERAPIST_NOTIFICATIONS } from '@/mock/therapistNotificationsData';
import { THERAPIST_EXERCISES } from '@/mock/therapistExercisesData';
import { AssignSessionScreen } from '@/screens/physiotherapist/AssignSessionScreen';
import { getPatientById } from '@/mock/patientData';
import type { ExerciseItem } from '@/components/exercises/ExerciseCard';

const SCREENS: Record<string, React.ComponentType> = {
  home: HomeScreen,
  exercises: ExerciseFlowNavigator,
  devices: DevicesScreen,
  profile: ProfileScreen,
};

type ProgressRoute = 'ProgressMain' | 'SessionHistory';

const PatientNavigatorContent: React.FC = () => {
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

const THERAPIST_TAB_TITLES: Record<string, string> = {
  pacientes: 'Pacientes',
  sesiones: 'Sesiones',
  ejercicios: 'Ejercicios',
};

type PatientRoute = 'list' | 'detail' | 'assign' | 'create';
type ExerciseRoute = 'list' | 'form';

const TherapistNavigatorContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [patientRoute, setPatientRoute] = useState<PatientRoute>('list');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [exerciseRoute, setExerciseRoute] = useState<ExerciseRoute>('list');
  const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(null);
  const [exercises, setExercises] = useState<ExerciseItem[]>(THERAPIST_EXERCISES);

  const handleDrawerSelect = (key: string) => {
    if (key === 'inicio' || key === 'pacientes' || key === 'sesiones' || key === 'ejercicios') {
      if (key === 'pacientes') {
        setPatientRoute('list');
      }
      setExerciseRoute('list');
      setShowNotifications(false);
      setActiveTab(key);
    }

    if (key === 'settings') {
      setShowNotifications(false);
      setActiveTab('configuracion');
    }
  };

  const handleTabPress = (tab: string) => {
    if (tab === 'pacientes') {
      setPatientRoute('list');
    }
    setExerciseRoute('list');
    setShowNotifications(false);
    setActiveTab(tab);
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'notifications') {
      setShowNotifications(true);
      return;
    }
    setExerciseRoute('list');
    setShowNotifications(false);
    setActiveTab(tab);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setPatientRoute('detail');
  };

  const handleBackToPatientList = () => {
    setPatientRoute('list');
    setSelectedPatientId('');
  };

  const handleOpenAssignSession = () => {
    setPatientRoute('assign');
  };

  const handleBackFromAssignSession = () => {
    setPatientRoute('list');
    setSelectedPatientId('');
  };

  const handleOpenCreateSession = () => {
    setPatientRoute('create');
  };

  const handleBackFromCreateSession = () => {
    setPatientRoute('assign');
  };

  const handleOpenCreateExercise = () => {
    setEditingExercise(null);
    setExerciseRoute('form');
  };

  const handleOpenEditExercise = (exercise: ExerciseItem) => {
    setEditingExercise(exercise);
    setExerciseRoute('form');
  };

  const handleBackFromExerciseForm = () => {
    setExerciseRoute('list');
    setEditingExercise(null);
  };

  const handleExerciseSaved = useCallback((exercise: ExerciseItem) => {
    setExercises((prev) => {
      const exists = prev.some((item) => item.id === exercise.id);
      return exists
        ? prev.map((item) => (item.id === exercise.id ? exercise : item))
        : [exercise, ...prev];
    });
  }, []);

  const renderActiveScreen = () => {
    if (showNotifications) {
      return (
        <NotificationsScreen
          notifications={THERAPIST_NOTIFICATIONS}
          onBack={() => setShowNotifications(false)}
        />
      );
    }

    if (activeTab === 'inicio') {
      return <TherapistHomeScreen />;
    }

    if (activeTab === 'pacientes') {
      if (patientRoute === 'detail' && selectedPatientId) {
        return (
          <PatientDetailScreen
            patientId={selectedPatientId}
            onBack={handleBackToPatientList}
            onCreateSession={handleOpenAssignSession}
          />
        );
      }
      if (patientRoute === 'assign') {
        return (
          <AssignSessionScreen
            onBack={handleBackFromAssignSession}
            onCreateSession={handleOpenCreateSession}
            initialPatient={selectedPatientId ? getPatientById(selectedPatientId)?.name : undefined}
          />
        );
      }
      if (patientRoute === 'create') {
        return (
          <CreateSessionScreen onBack={handleBackFromCreateSession} />
        );
      }
      return (
        <PatientsListScreen
          onSelectPatient={handleSelectPatient}
        />
      );
    }

    if (activeTab === 'sesiones') {
      return <SessionsScreen />;
    }

    if (activeTab === 'ejercicios') {
      if (exerciseRoute === 'form') {
        return (
          <CreateExerciseScreen
            onBack={handleBackFromExerciseForm}
            initialExercise={editingExercise}
            onSaved={handleExerciseSaved}
          />
        );
      }
      return (
        <ExercisesScreen
          exercises={exercises}
          onExercisesChange={setExercises}
          onCreate={handleOpenCreateExercise}
          onEditExercise={handleOpenEditExercise}
        />
      );
    }

    if (activeTab === 'configuracion') {
      return <SettingsScreen />;
    }

    return (
      <PlaceholderScreen
        title={THERAPIST_TAB_TITLES[activeTab] ?? 'FisioSense'}
      />
    );
  };

  return (
    <View style={styles.container}>
      <PrivateNavigationProvider onNavigate={handleNavigate}>
        <View style={styles.content}>{renderActiveScreen()}</View>
      </PrivateNavigationProvider>
      <HomeTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      <DrawerMenu activeItem={activeTab} onSelect={handleDrawerSelect} />
    </View>
  );
};

export const PrivateNavigator: React.FC = () => {
  const { role } = useAuth();

  if (role === 'fisioterapeuta') {
    return (
      <DrawerProvider>
        <TherapistNavigatorContent />
      </DrawerProvider>
    );
  }

  return (
    <PrivateTabBarProvider>
      <DrawerProvider>
        <PatientNavigatorContent />
      </DrawerProvider>
    </PrivateTabBarProvider>
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
