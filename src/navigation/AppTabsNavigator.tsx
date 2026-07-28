import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { DumbbellIcon, ListChecksIcon, SettingsIcon } from 'src/shared/icons';

import { ExercisesNavigator } from './ExercisesNavigator';
import { SettingsNavigator } from './SettingsNavigator';
import { useStyles } from './styles';
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
  const { t } = useTranslation();
  const { styles, colors } = useStyles();

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
          tabBarLabel: t('navigation.workoutsTab'),
          tabBarIcon: ({ color }) => (
            <DumbbellIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ExercisesTab"
        component={ExercisesNavigator}
        options={{
          tabBarLabel: t('navigation.exercisesTab'),
          tabBarIcon: ({ color }) => (
            <ListChecksIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsNavigator}
        options={{
          tabBarLabel: t('navigation.settingsTab'),
          tabBarIcon: ({ color }) => (
            <SettingsIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
