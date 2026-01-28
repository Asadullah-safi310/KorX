export const palette = {
  primary: '#5E23DC',
  secondary: '#1E40AF',
  white: '#FFFFFF',
  black: '#0F172A',
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const lightTheme = {
  primary: palette.primary,
  secondary: palette.secondary,
  background: palette.white,
  surface: palette.gray[50],
  text: palette.black,
  mutedText: palette.gray[500],
  border: palette.gray[200],
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  white: palette.white,
  black: palette.black,
  transparent: 'transparent',
};

export const darkTheme = {
  primary: palette.primary,
  secondary: palette.secondary,
  background: palette.black,
  surface: palette.gray[900],
  text: palette.white,
  mutedText: palette.gray[400],
  border: palette.gray[800],
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  white: palette.white,
  black: palette.black,
  transparent: 'transparent',
};

export type ThemeColors = typeof lightTheme;
