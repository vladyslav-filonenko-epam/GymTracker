import { StatusBar } from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DbProvider } from 'src/shared/components';
import 'src/shared/localization';
import { ThemeProvider } from 'src/shared/theme';

import { RootNavigator } from './navigation/RootNavigator';

export const App = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <DbProvider>
        <RootNavigator />
      </DbProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);
