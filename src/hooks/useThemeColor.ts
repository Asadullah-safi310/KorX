import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';
import themeStore from '../stores/ThemeStore';

export function useThemeColor() {
  const system = useColorScheme() ?? 'light';
  const theme = themeStore.theme === 'system' ? system : themeStore.theme;
  return Colors[theme];
}

export function useCurrentTheme() {
  const system = useColorScheme() ?? 'light';
  return themeStore.theme === 'system' ? system : themeStore.theme;
}
