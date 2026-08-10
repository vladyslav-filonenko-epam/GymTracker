import type { Translations } from './types';

// Merge into i18next's type system for type-safe t() calls
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: Translations;
    };
  }
}
