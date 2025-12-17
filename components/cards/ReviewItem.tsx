// File: components/cards/ReviewItem.tsx

import { Image, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { Review } from '../../types/models';
import { formatDateShort } from '../../utils/dates';
import { RatingStars } from '../ui/RatingStars';

export function ReviewItem({ item }: { item: Review }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {item.avatarUrl ? (
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>{item.userName.slice(0, 1).toUpperCase()}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.userName}</Text>
          <Text style={styles.date}>{formatDateShort(item.dateISO)}</Text>
        </View>
        <RatingStars rating={item.rating} />
      </View>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 999, marginRight: 10, backgroundColor: '#F3F4F6' },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 999,
    marginRight: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: { color: '#FFFFFF', fontWeight: '900' },
  name: { fontSize: 14, fontWeight: '900', color: '#111827' },
  date: { marginTop: 2, fontSize: 12, fontWeight: '700', color: '#6B7280' },
  text: { marginTop: 10, fontSize: 13, lineHeight: 18, color: '#111827', fontWeight: '600' },
});
