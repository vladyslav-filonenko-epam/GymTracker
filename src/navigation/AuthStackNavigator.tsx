import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PincodeScreen } from 'src/features/auth/screens';

type AuthStackParamList = {
  Pincode: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Pincode" component={PincodeScreen} />
  </Stack.Navigator>
);
