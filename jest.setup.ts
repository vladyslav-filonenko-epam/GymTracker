import type { ReactNode } from 'react';

import 'jest-extended';
import 'react-native-reanimated/mock';

jest.mock('drizzle-orm/op-sqlite/migrator', () => ({
  useMigrations: jest.fn(() => ({ success: true, error: undefined })),
}));

jest.mock('src/db/migrations/migrations', () => ({ default: {} }));

jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(() => ({ execute: jest.fn(), close: jest.fn() })),
}));

jest.mock('drizzle-orm/op-sqlite', () => ({
  drizzle: jest.fn(() => ({})),
}));

jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => {
    const store = new Map<string, unknown>();

    return {
      set: (k: string, v: unknown) => store.set(k, v),
      getString: (k: string) => store.get(k) as string | undefined,
      getBoolean: (k: string) => store.get(k) as boolean | undefined,
      delete: (k: string) => store.delete(k),
    };
  }),
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue({ password: 'hashed_pin' }),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), replace: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

jest.mock('react-native-biometrics', () => ({
  default: jest.fn(() => ({
    isSensorAvailable: jest.fn().mockResolvedValue({ available: true, biometryType: 'FaceID' }),
    simplePrompt: jest.fn().mockResolvedValue({ success: true }),
  })),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@shopify/flash-list', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { FlatList } = require('react-native');

  return { FlashList: FlatList };
});
