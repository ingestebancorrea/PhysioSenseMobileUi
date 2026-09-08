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
