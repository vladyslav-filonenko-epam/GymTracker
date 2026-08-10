import { MMKV } from 'react-native-mmkv';

export const MMKV_KEYS = {
  THEME: 'theme',
} as const;

export const storage = new MMKV({ id: 'gymtracker' });
