import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from 'src/features/auth';

import { AppTabsNavigator } from './AppTabsNavigator';
import { AuthStackNavigator } from './AuthStackNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppTabsNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
