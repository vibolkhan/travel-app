import { useTheme } from '@react-navigation/native';

// Convenience hook to access the app's themed color tokens.
// Our ThemeProvider injects extra tokens (subtext, icon, etc.) via `constants/navigationTheme`.
export function useAppColors() {
  const { colors } = useTheme();
  return colors as any;
}
