import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WorkoutListScreen } from 'src/features/workout/screens';

type WorkoutStackParamList = {
  WorkoutList: undefined;
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export const WorkoutNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
  </Stack.Navigator>
);
