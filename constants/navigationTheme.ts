import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
} from '@react-navigation/native';

import { Colors } from './Colors';

// React Navigation themes + extra app tokens.
// Extra keys are safe at runtime; for TS we cast to `any` when needed.

export const LightTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.tint,

    // Extra tokens used across the app
    tint: Colors.light.tint,
    icon: Colors.light.icon,
    tabIconDefault: Colors.light.tabIconDefault,
    tabIconSelected: Colors.light.tabIconSelected,
    subtext: Colors.light.subtext,
    error: Colors.light.error,
    success: Colors.light.success,
    warning: Colors.light.warning,
    inputBg: Colors.light.inputBg,
    inputText: Colors.light.inputText,
    placeholder: Colors.light.placeholder,
    overlay: Colors.light.overlay,
  },
} as any;

export const DarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.tint,

    // Extra tokens used across the app
    tint: Colors.dark.tint,
    icon: Colors.dark.icon,
    tabIconDefault: Colors.dark.tabIconDefault,
    tabIconSelected: Colors.dark.tabIconSelected,
    subtext: Colors.dark.subtext,
    error: Colors.dark.error,
    success: Colors.dark.success,
    warning: Colors.dark.warning,
    inputBg: Colors.dark.inputBg,
    inputText: Colors.dark.inputText,
    placeholder: Colors.dark.placeholder,
    overlay: Colors.dark.overlay,
  },
} as any;
