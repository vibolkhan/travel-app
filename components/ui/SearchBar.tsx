// File: components/ui/SearchBar.tsx

import { StyleSheet, TextInput, View } from 'react-native';

import React from 'react';

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search…' }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        {/* no icon library: keep it simple */}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
  },
  iconCircle: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
    marginRight: 10,
  },
  input: { flex: 1, fontSize: 16, color: '#111827', fontWeight: '600' },
});
