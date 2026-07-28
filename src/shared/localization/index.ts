import { NativeModules, Platform } from 'react-native';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './locales/en';
import { ua } from './locales/ua';

const deviceLocale: string =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager?.settings?.AppleLocale ||
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
      'en'
    : NativeModules.I18nManager?.localeIdentifier || 'en';

const languageCode = deviceLocale.startsWith('uk') ? 'ua' : 'en';

i18next.use(initReactI18next).init({
  lng: languageCode,
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    ua: { translation: ua },
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});
