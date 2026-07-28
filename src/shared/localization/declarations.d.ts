import type { en } from './locales/en';

// Merge into i18next's type system for type-safe t() calls
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof en;
    };
  }
}
