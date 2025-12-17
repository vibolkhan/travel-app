// File: components/ui/Chip.tsx

import { Pressable, StyleSheet, Text } from 'react-native';

import React from 'react';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  selected: { backgroundColor: '#111827', borderColor: '#111827' },
  unselected: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  pressed: { opacity: 0.85 },
  text: { fontSize: 13, fontWeight: '700' },
  textSelected: { color: '#FFFFFF' },
  textUnselected: { color: '#111827' },
});
