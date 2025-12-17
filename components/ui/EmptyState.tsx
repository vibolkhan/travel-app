// File: components/ui/EmptyState.tsx

import { StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { Button } from './Button';

type Props = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
};

export function EmptyState({ title, subtitle, ctaLabel, onCtaPress }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🧭</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {ctaLabel && onCtaPress ? (
        <Button title={ctaLabel} onPress={onCtaPress} style={{ marginTop: 14, width: 220 }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 42, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center' },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
