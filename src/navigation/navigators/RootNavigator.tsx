import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { AuthStackNavigator } from '@/navigation/navigators/AuthStackNavigator';
import { PrivateNavigator } from '@/navigation/navigators/PrivateNavigator';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return isAuthenticated ? <PrivateNavigator /> : <AuthStackNavigator />;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
