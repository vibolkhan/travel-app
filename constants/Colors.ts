const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Extended palette for both light and dark themes
export const Colors = {
    light: {
        // Core colors
        background: '#ffffff',
        card: '#f9f9f9',
        text: '#11181c',
        subtext: '#666666',
        primary: '#0a7ea4', // brand primary
        tint: tintColorLight,
        icon: '#687076',
        tabIconDefault: '#687076',
        tabIconSelected: tintColorLight,
        border: '#f0f0f0',
        // Additional semantic colors
        error: '#ff4444',
        success: '#28a745',
        warning: '#ffb400',
        // Input colors
        inputBg: '#ffffff',
        inputText: '#11181c',
        placeholder: '#999999',
        // Overlay / shadow
        overlay: 'rgba(0,0,0,0.5)',
    },
    dark: {
        background: '#151718',
        card: '#1e1e1e',
        text: '#ecedee',
        subtext: '#999999',
        primary: '#0a7ea4',
        tint: tintColorDark,
        icon: '#9ba1a6',
        tabIconDefault: '#9ba1a6',
        tabIconSelected: tintColorDark,
        border: '#333333',
        error: '#ff6666',
        success: '#28c745',
        warning: '#ffb400',
        inputBg: '#2c2c2c',
        inputText: '#ecedee',
        placeholder: '#aaaaaa',
        overlay: 'rgba(0,0,0,0.7)',
    },
};

// Helper to retrieve the appropriate theme based on the color scheme
export type ThemeColors = typeof Colors.light;
export const getTheme = (scheme: 'light' | 'dark'): ThemeColors =>
    scheme === 'dark' ? Colors.dark : Colors.light;
