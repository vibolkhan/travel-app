import { useColorScheme } from 'react-native';
import { getTheme, ThemeColors } from '../constants/Colors';

/**
 * Hook that returns the appropriate theme colors based on the device color scheme.
 * Falls back to 'light' if the scheme is undefined.
 */
export const useThemeColors = (): ThemeColors => {
    const scheme = useColorScheme();
    return getTheme(scheme === 'dark' ? 'dark' : 'light');
};
