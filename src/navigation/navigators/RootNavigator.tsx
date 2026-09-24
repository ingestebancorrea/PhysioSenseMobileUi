import React from 'react';

import { useAuth } from '@/context/AuthContext';
import { AuthStackNavigator } from '@/navigation/navigators/AuthStackNavigator';
import { PrivateNavigator } from '@/navigation/navigators/PrivateNavigator';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <PrivateNavigator /> : <AuthStackNavigator />;
};
