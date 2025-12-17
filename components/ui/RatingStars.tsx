// File: components/ui/RatingStars.tsx

import { StyleSheet, Text, View } from 'react-native';

import React from 'react';

export function RatingStars({ rating, size = 12 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, 5 - full - half);

  return (
    <View style={styles.row}>
      <Text style={[styles.star, { fontSize: size }]}>{'★'.repeat(full)}</Text>
      {half ? <Text style={[styles.star, { fontSize: size }]}>{'⯨'}</Text> : null}
      <Text style={[styles.starEmpty, { fontSize: size }]}>{'☆'.repeat(empty)}</Text>
      <Text style={[styles.value, { fontSize: size }]}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { color: '#F59E0B', marginRight: 2 },
  starEmpty: { color: '#D1D5DB', marginRight: 6 },
  value: { color: '#6B7280', fontWeight: '700' },
});
