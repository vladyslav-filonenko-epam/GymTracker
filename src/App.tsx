import { StatusBar, StyleSheet } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DailyScreen, HomeScreen, SettingsScreen, WorkScreen } from './screens';
import { AccountIcon, CalendarIcon, HomeIcon, ListViewIcon } from './shared/icons';
import { navigationColors } from './shared/theme';

const Tab = createBottomTabNavigator();

const ICON_SIZE = 24;

export const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: navigationColors.tabBarActive,
            tabBarInactiveTintColor: navigationColors.tabBarInactive,
            tabBarShowLabel: true,
            tabBarLabelStyle: styles.tabBarLabel,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerTransparent: true,
              tabBarIcon: ({ color }) => (
                <HomeIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Work"
            component={WorkScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <ListViewIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Daily"
            component={DailyScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <CalendarIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
              ),
            }}
          />

          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <AccountIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: navigationColors.tabBarBorder,
    marginHorizontal: 20,
    bottom: 24,
    borderRadius: 20,
    height: 64,
    backgroundColor: navigationColors.tabBarBackground,
    shadowColor: navigationColors.tabBarShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
