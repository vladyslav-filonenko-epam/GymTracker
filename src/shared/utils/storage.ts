import { MMKV } from 'react-native-mmkv';

export const MMKV_KEYS = {
  THEME: 'theme',
  EXERCISES_SEEDED: 'exercises_seeded',
} as const;

export const storage = new MMKV({ id: 'gymtracker' });
