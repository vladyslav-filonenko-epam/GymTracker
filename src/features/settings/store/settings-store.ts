import { create } from 'zustand';

import { storage } from 'src/shared/utils/storage';

interface SettingsState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

const storedTheme = storage.getString('theme');
const initialTheme: 'dark' | 'light' =
  storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark';

export const useSettingsStore = create<SettingsState>(set => ({
  theme: initialTheme,

  setTheme: theme => {
    set({ theme });
  },
}));
