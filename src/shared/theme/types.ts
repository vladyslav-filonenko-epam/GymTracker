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

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  radius: Radius;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}
