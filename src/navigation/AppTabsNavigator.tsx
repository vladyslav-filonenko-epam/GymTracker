import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';

import { DumbbellIcon, ListChecksIcon, SettingsIcon } from 'src/shared/icons';
import { useTheme } from 'src/shared/theme';

import { ExercisesNavigator } from './ExercisesNavigator';
import { SettingsNavigator } from './SettingsNavigator';
import { createStyles } from './styles';
import { WorkoutNavigator } from './WorkoutNavigator';

type WorkoutStackParamList = { WorkoutList: undefined };
type ExercisesStackParamList = { ExercisesList: undefined };
type SettingsStackParamList = { Settings: undefined };

type AppTabParamList = {
  WorkoutTab: NavigatorScreenParams<WorkoutStackParamList>;
  ExercisesTab: NavigatorScreenParams<ExercisesStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const ICON_SIZE = 22;

export const AppTabsNavigator = () => {
  const { colors, spacing, radius } = useTheme();
  const styles = createStyles(colors, spacing, radius);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="WorkoutTab"
        component={WorkoutNavigator}
        options={{
          tabBarLabel: 'Workouts',
          tabBarIcon: ({ color }) => (
            <DumbbellIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ExercisesTab"
        component={ExercisesNavigator}
        options={{
          tabBarLabel: 'Exercises',
          tabBarIcon: ({ color }) => (
            <ListChecksIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <SettingsIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
