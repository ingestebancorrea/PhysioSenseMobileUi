import React, { useCallback, useEffect, useState } from 'react';
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
import { SessionDetailScreen } from '@/screens/physiotherapist/SessionDetailScreen';
import { SettingsScreen } from '@/screens/private/SettingsScreen';
import { PersonalProfileScreen } from '@/screens/private/PersonalProfileScreen';
import { NotificationsSettingsScreen } from '@/screens/private/NotificationsSettingsScreen';
import { HelpSupportScreen } from '@/screens/private/HelpSupportScreen';
import { PreferencesScreen } from '@/screens/private/PreferencesScreen';
import { PrivacyScreen } from '@/screens/private/PrivacyScreen';
import { SecurityScreen } from '@/screens/private/SecurityScreen';
import { SessionsAndDevicesScreen } from '@/screens/private/SessionsAndDevicesScreen';
import { PatientHelpSupportScreen } from '@/screens/private/PatientHelpSupportScreen';
import { PatientEditProfileScreen } from '@/screens/patient/PatientEditProfileScreen';
import { PatientNotificationsSettingsScreen } from '@/screens/patient/PatientNotificationsSettingsScreen';
import { PatientPreferencesScreen } from '@/screens/patient/PatientPreferencesScreen';
import { PatientSecurityScreen } from '@/screens/patient/PatientSecurityScreen';
import { PatientSettingsScreen } from '@/screens/patient/PatientSettingsScreen';
import { TherapistHomeScreen } from '@/screens/private/TherapistHomeScreen';
import { CreateSessionScreen } from '@/screens/physiotherapist/CreateSessionScreen';
import { CreateExerciseScreen } from '@/screens/physiotherapist/CreateExerciseScreen';
import { THERAPIST_NOTIFICATIONS } from '@/mock/therapistNotificationsData';
import { THERAPIST_EXERCISES } from '@/mock/therapistExercisesData';
import { AssignSessionScreen } from '@/screens/physiotherapist/AssignSessionScreen';
import { getPatientById } from '@/mock/patientData';
import type { Session } from '@/types/session';
import type { ExerciseItem } from '@/components/exercises/ExerciseCard';

const SCREENS: Record<string, React.ComponentType> = {
  home: HomeScreen,
  exercises: ExerciseFlowNavigator,
  devices: DevicesScreen,
  profile: ProfileScreen,
};

type ProgressRoute = 'ProgressMain' | 'SessionHistory';

type PatientSettingsRoute =
  | 'main'
  | 'profile'
  | 'notifications'
  | 'preferences'
  | 'security';

const PatientNavigatorContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [progressRoute, setProgressRoute] = useState<ProgressRoute>(
    'ProgressMain',
  );
  const [showSettings, setShowSettings] = useState(false);
  const [settingsRoute, setSettingsRoute] =
    useState<PatientSettingsRoute>('main');
  const [showHelp, setShowHelp] = useState(false);
  const { isHidden, hide, show } = usePrivateTabBar();

  const overlayActive = showSettings || showHelp;

  useEffect(() => {
    if (overlayActive) {
      hide();
    } else {
      show();
    }
  }, [overlayActive, hide, show]);

  const handleTabPress = (tab: string) => {
    if (tab === 'progress') {
      setProgressRoute('ProgressMain');
    }
    setShowSettings(false);
    setShowHelp(false);
    setActiveTab(tab);
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'settings') {
      setShowHelp(false);
      setSettingsRoute('main');
      setShowSettings(true);
      return;
    }
    if (tab === 'help') {
      setShowSettings(false);
      setShowHelp(true);
      return;
    }
    if (tab === 'progress') {
      setProgressRoute('ProgressMain');
    }
    setShowSettings(false);
    setShowHelp(false);
    setActiveTab(tab);
  };

  const handleDrawerSelect = (key: string) => {
    if (key === 'settings') {
      setShowHelp(false);
      setSettingsRoute('main');
      setShowSettings(true);
      return;
    }
    if (key === 'help') {
      setShowSettings(false);
      setShowHelp(true);
      return;
    }
    setShowSettings(false);
    setShowHelp(false);

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

  const handleCloseSettings = () => {
    setSettingsRoute('main');
    setShowSettings(false);
  };

  const renderActiveScreen = () => {
    if (showHelp) {
      return (
        <PatientHelpSupportScreen
          onBack={() => {
            setShowHelp(false);
            setSettingsRoute('main');
          }}
        />
      );
    }

    if (showSettings) {
      if (settingsRoute === 'profile') {
        return (
          <PatientEditProfileScreen onBack={() => setSettingsRoute('main')} />
        );
      }
      if (settingsRoute === 'notifications') {
        return (
          <PatientNotificationsSettingsScreen
            onBack={() => setSettingsRoute('main')}
          />
        );
      }
      if (settingsRoute === 'preferences') {
        return (
          <PatientPreferencesScreen
            onBack={() => setSettingsRoute('main')}
            onOpenNotifications={() => setSettingsRoute('notifications')}
          />
        );
      }
      if (settingsRoute === 'security') {
        return (
          <PatientSecurityScreen onBack={() => setSettingsRoute('main')} />
        );
      }
      return (
        <PatientSettingsScreen
          onBack={handleCloseSettings}
          onOptionPress={route => {
            if (route === 'PersonalProfile') {
              setSettingsRoute('profile');
            }
            if (route === 'Notifications') {
              setSettingsRoute('notifications');
            }
            if (route === 'Preferences') {
              setSettingsRoute('preferences');
            }
            if (route === 'Security') {
              setSettingsRoute('security');
            }
          }}
        />
      );
    }

    if (activeTab === 'progress') {
      return (
        <ProgressFlowNavigator
          key={progressRoute}
          initialRouteName={progressRoute}
        />
      );
    }

    if (activeTab === 'notifications') {
      return (
        <NotificationsScreen
          onBack={() => setActiveTab('home')}
          onOpenSettings={() => {
            setSettingsRoute('notifications');
            setShowSettings(true);
          }}
        />
      );
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
type SessionRoute = 'list' | 'detail' | 'assign' | 'create';

const TherapistNavigatorContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [patientRoute, setPatientRoute] = useState<PatientRoute>('list');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [exerciseRoute, setExerciseRoute] = useState<ExerciseRoute>('list');
  const [sessionRoute, setSessionRoute] = useState<SessionRoute>('list');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [settingsRoute, setSettingsRoute] = useState<
    | 'main'
    | 'profile'
    | 'notifications'
    | 'preferences'
    | 'security'
    | 'devices'
    | 'privacy'
  >('main');
  const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(null);
  const [exercises, setExercises] = useState<ExerciseItem[]>(THERAPIST_EXERCISES);

  const handleDrawerSelect = (key: string) => {
    if (key === 'inicio' || key === 'pacientes' || key === 'sesiones' || key === 'ejercicios') {
      if (key === 'pacientes') {
        setPatientRoute('list');
      }
      setExerciseRoute('list');
      setSessionRoute('list');
      setShowNotifications(false);
      setShowHelp(false);
      setActiveTab(key);
    }

    if (key === 'settings') {
      setShowNotifications(false);
      setShowHelp(false);
      setActiveTab('mas');
    }

    if (key === 'help') {
      setShowNotifications(false);
      setShowHelp(true);
    }
  };

  const handleTabPress = (tab: string) => {
    if (tab === 'pacientes') {
      setPatientRoute('list');
    }
    setExerciseRoute('list');
    setSessionRoute('list');
    setShowNotifications(false);
    setShowHelp(false);
    setActiveTab(tab);
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'notifications') {
      setShowHelp(false);
      setShowNotifications(true);
      return;
    }
    setExerciseRoute('list');
    setSessionRoute('list');
    setShowNotifications(false);
    setShowHelp(false);
    setActiveTab(tab);
  };

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setSessionRoute('detail');
  };

  const handleOpenCreateSessionFromSessions = () => {
    setSessionRoute('assign');
  };

  const handleBackSessionsFromAssignSession = () => {
    setSessionRoute('list');
  };

  const handleOpenCreateFromAssignSession = () => {
    setSessionRoute('create');
  };

  const handleBackSessionsFromCreateSession = () => {
    setSessionRoute('assign');
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
    if (showHelp) {
      return <HelpSupportScreen onBack={() => setShowHelp(false)} />;
    }

    if (showNotifications) {
      return (
        <NotificationsScreen
          notifications={THERAPIST_NOTIFICATIONS}
          onBack={() => setShowNotifications(false)}
          onOpenSettings={() => {
            setShowNotifications(false);
            setSettingsRoute('notifications');
            setActiveTab('mas');
          }}
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
      if (sessionRoute === 'detail' && selectedSession) {
        return (
          <SessionDetailScreen
            session={selectedSession}
            onBack={() => setSessionRoute('list')}
          />
        );
      }
      if (sessionRoute === 'assign') {
        return (
          <AssignSessionScreen
            onBack={handleBackSessionsFromAssignSession}
            onCreateSession={handleOpenCreateFromAssignSession}
          />
        );
      }
      if (sessionRoute === 'create') {
        return (
          <CreateSessionScreen onBack={handleBackSessionsFromCreateSession} />
        );
      }
      return (
        <SessionsScreen
          onSelectSession={handleSelectSession}
          onCreateSession={handleOpenCreateSessionFromSessions}
        />
      );
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

    if (activeTab === 'mas') {
      if (settingsRoute === 'profile') {
        return (
          <PersonalProfileScreen onBack={() => setSettingsRoute('main')} />
        );
      }
      if (settingsRoute === 'notifications') {
        return (
          <NotificationsSettingsScreen
            onBack={() => setSettingsRoute('main')}
          />
        );
      }
      if (settingsRoute === 'preferences') {
        return (
          <PreferencesScreen
            onBack={() => setSettingsRoute('main')}
            onOpenNotifications={() => setSettingsRoute('notifications')}
          />
        );
      }
      if (settingsRoute === 'security') {
        return <SecurityScreen onBack={() => setSettingsRoute('main')} />;
      }
      if (settingsRoute === 'devices') {
        return (
          <SessionsAndDevicesScreen onBack={() => setSettingsRoute('main')} />
        );
      }
      if (settingsRoute === 'privacy') {
        return <PrivacyScreen onBack={() => setSettingsRoute('main')} />;
      }
      return (
        <SettingsScreen
          onBack={() => setActiveTab('inicio')}
          onOptionPress={route => {
            if (route === 'PersonalProfile') {
              setSettingsRoute('profile');
            }
            if (route === 'Notifications') {
              setSettingsRoute('notifications');
            }
            if (route === 'Preferences') {
              setSettingsRoute('preferences');
            }
            if (route === 'Security') {
              setSettingsRoute('security');
            }
            if (route === 'Devices') {
              setSettingsRoute('devices');
            }
            if (route === 'Privacy') {
              setSettingsRoute('privacy');
            }
          }}
        />
      );
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
