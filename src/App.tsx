import React from 'react';

import { StatusBar } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from 'src/shared/theme';

import { RootNavigator } from './navigation/RootNavigator';

export const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <RootNavigator />
    </ThemeProvider>
  </SafeAreaProvider>
);
