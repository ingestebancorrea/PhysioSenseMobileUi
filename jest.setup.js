/* eslint-env jest */
import React from 'react';
import { Text, View } from 'react-native';

const MockView = (props: Record<string, unknown>) => React.createElement(View, props);

const MockIcon = (props: Record<string, unknown>) =>
  React.createElement(Text, props);

jest.mock('react-native-screens', () => ({
  __esModule: true,
  Screen: MockView,
  ScreenContainer: MockView,
  ScreenStack: MockView,
  ScreenStackItem: MockView,
  ScreenFooter: MockView,
  ScreenStackHeaderBackButtonImage: MockView,
  ScreenStackHeaderCenterView: MockView,
  ScreenStackHeaderLeftView: MockView,
  ScreenStackHeaderRightView: MockView,
  ScreenStackHeaderSearchBarView: MockView,
  SearchBar: MockView,
  compatibilityFlags: {},
  isSearchBarAvailableForCurrentPlatform: () => false,
  enableScreens: jest.fn(),
  screensEnabled: () => false,
}));

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock.tsx').default,
);

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => MockIcon);
jest.mock('react-native-vector-icons/Ionicons', () => MockIcon);

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(async () => true),
    signIn: jest.fn(async () => ({ type: 'cancelled', data: null })),
    signOut: jest.fn(async () => null),
  },
}));

jest.mock('react-native-fbsdk-next', () => ({
  AccessToken: {
    getCurrentAccessToken: jest.fn(async () => null),
  },
  LoginManager: {
    logInWithPermissions: jest.fn(async () => ({ isCancelled: true })),
    logOut: jest.fn(async () => {}),
  },
}));

jest.mock('react-native-keychain', () => {
  const mockStore = new Map();
  const mockStorage = 'KeystoreAESGCM_NoAuth';

  return {
    ACCESSIBLE: {
      WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
    },
    SECURITY_LEVEL: { SECURE_SOFTWARE: 'SECURE_SOFTWARE' },
    STORAGE_TYPE: { AES_GCM_NO_AUTH: mockStorage },
    setGenericPassword: jest.fn(async (username, password) => {
      mockStore.set(username, password);
      return { service: username, storage: mockStorage };
    }),
    getGenericPassword: jest.fn(async () => {
      const entry = mockStore.entries().next().value;

      if (!entry) {
        return false;
      }

      const [username, password] = entry;
      return { username, password, service: username, storage: mockStorage };
    }),
    resetGenericPassword: jest.fn(async () => {
      mockStore.clear();
      return true;
    }),
  };
});
