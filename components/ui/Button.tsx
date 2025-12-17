// File: components/ui/Button.tsx

import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import React from 'react';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ title, onPress, variant = 'primary', disabled, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === 'ghost' ? styles.textGhost : styles.textSolid,
          disabled && styles.textDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primary: { backgroundColor: '#0B63F6' },
  secondary: { backgroundColor: '#111827' },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E5E7EB' },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.99 }] },
  text: { fontSize: 16, fontWeight: '700' },
  textSolid: { color: '#FFFFFF' },
  textGhost: { color: '#111827' },
  textDisabled: { color: '#FFFFFF' },
});
