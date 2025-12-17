// File: components/cards/RoomCard.tsx

import { Image, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { Room } from '../../types/models';
import { formatMoney } from '../../utils/money';
import { Button } from '../ui/Button';

export function RoomCard({ item, onSelect }: { item: Room; onSelect: () => void }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.meta}>
          👥 {item.capacity} • 🛏 {item.bedType}
        </Text>
        <Text style={styles.amenities} numberOfLines={1}>
          {item.amenities.map((a) => `• ${a}`).join('  ')}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>{formatMoney(item.pricePerNight)} / night</Text>
          <Button title="Select room" onPress={onSelect} variant="primary" style={{ width: 130 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: '100%', height: 150, backgroundColor: '#F3F4F6' },
  content: { padding: 12 },
  title: { fontSize: 15, fontWeight: '800', color: '#111827' },
  meta: { marginTop: 4, fontSize: 12, color: '#6B7280', fontWeight: '700' },
  amenities: { marginTop: 8, fontSize: 12, color: '#6B7280', fontWeight: '600' },
  row: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 14, fontWeight: '900', color: '#111827' },
});
