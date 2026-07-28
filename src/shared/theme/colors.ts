import type { Colors } from './types';

export const darkColors: Colors = {
  background: {
    primary: '#0C0C0E',
    secondary: '#1E1E22',
    card: '#161618',
  },
  surface: '#2A2A2F',
  accent: {
    primary: '#C8FF00',
    secondary: '#A8D900',
  },
  text: {
    primary: '#F0F0F2',
    secondary: '#888896',
    muted: '#555560',
  },
  border: 'rgba(255, 255, 255, 0.08)',
  status: {
    success: '#4CAF50',
    error: '#FF3B5C',
    warning: '#FF9800',
  },
  overlay: {
    subtle: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.2)',
  },
  static: {
    white: '#FFFFFF',
    black: '#000000',
  },
};

export const lightColors: Colors = {
  background: {
    primary: '#F5F5F5',
    secondary: '#FFFFFF',
    card: '#FFFFFF',
  },
  surface: '#EFEFEF',
  accent: {
    primary: '#C8FF00',
    secondary: '#A8D900',
  },
  text: {
    primary: '#0D0D0D',
    secondary: '#555555',
    muted: '#999999',
  },
  border: '#E0E0E0',
  status: {
    success: '#4CAF50',
    error: '#FF3B5C',
    warning: '#FF9800',
  },
  overlay: {
    subtle: 'rgba(0,0,0,0.04)',
    border: 'rgba(0,0,0,0.15)',
  },
  static: {
    white: '#FFFFFF',
    black: '#000000',
  },
};
