import type { TextStyle } from 'react-native';

export interface Colors {
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  surface: string;
  accent: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: string;
  status: {
    success: string;
    error: string;
    warning: string;
  };
  overlay: {
    subtle: string;
    border: string;
  };
  static: {
    white: string;
    black: string;
  };
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
  giant: number;
}

export interface Radius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface TypographyToken {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
}

export interface Typography {
  heading: {
    xl: TypographyToken;
    lg: TypographyToken;
    md: TypographyToken;
    sm: TypographyToken;
  };
  body: {
    lg: TypographyToken;
    md: TypographyToken;
    sm: TypographyToken;
  };
  caption: TypographyToken; // 12/400 — metadata, fine print
  label: TypographyToken; // 12/600 — section headers, uppercase UI labels
  display: {
    sm: TypographyToken; // 20/700 — brand/logo text
    md: TypographyToken; // 24/500 — large interactive keys (numpad)
  };
}

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}
