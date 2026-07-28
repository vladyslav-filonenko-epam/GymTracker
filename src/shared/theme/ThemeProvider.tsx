import React, { createContext, useState } from 'react';

import { storage } from 'src/shared/utils/storage';

import { darkColors, lightColors } from './colors';
import { radius, spacing, typography } from './tokens';
import type { Theme } from './types';

const defaultTheme: Theme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
  theme: 'dark',
  setTheme: () => undefined,
};

export const ThemeContext = createContext<Theme>(defaultTheme);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(() => {
    const stored = storage.getString('theme');

    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  });

  const setTheme = (theme: 'dark' | 'light') => {
    storage.set('theme', theme);
    setCurrentTheme(theme);
  };

  const value: Theme = {
    colors: currentTheme === 'dark' ? darkColors : lightColors,
    spacing,
    radius,
    typography,
    theme: currentTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
