import type { NavigatorScreenParams } from '@react-navigation/native';

import type { AuthStackParamList } from './AuthStackNavigator';
import type { ExercisesStackParamList } from './ExercisesNavigator';
import type { SettingsStackParamList } from './SettingsNavigator';
import type { WorkoutStackParamList } from './WorkoutNavigator';

export type { AuthStackParamList } from './AuthStackNavigator';
export type { ExercisesStackParamList } from './ExercisesNavigator';
export type { SettingsStackParamList } from './SettingsNavigator';
export type { WorkoutStackParamList } from './WorkoutNavigator';

export type AppTabParamList = {
  WorkoutTab: NavigatorScreenParams<WorkoutStackParamList>;
  ExercisesTab: NavigatorScreenParams<ExercisesStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabParamList>;
};
