import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ExercisesListScreen } from 'src/features/exercises/screens';

type ExercisesStackParamList = {
  ExercisesList: undefined;
};

const Stack = createNativeStackNavigator<ExercisesStackParamList>();

export const ExercisesNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExercisesList" component={ExercisesListScreen} />
  </Stack.Navigator>
);
