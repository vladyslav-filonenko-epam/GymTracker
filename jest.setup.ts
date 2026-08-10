import 'jest-extended';
import 'react-native-reanimated/mock';

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
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));
