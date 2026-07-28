import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SettingsScreen } from 'src/features/settings/screens';

type SettingsStackParamList = {
  Settings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);
