// File: components/cards/HotelCard.tsx

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import React from 'react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { Hotel } from '../../types/models';
import { formatMoney } from '../../utils/money';
import { RatingStars } from '../ui/RatingStars';

export function HotelCard({ item, onPress }: { item: Hotel; onPress: () => void }) {
  const isFav = useFavoritesStore((s) => s.isFavorite('hotel', item.id));
  const toggle = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Pressable
        onPress={() => toggle('hotel', item.id)}
        style={({ pressed }) => [styles.heart, pressed && { opacity: 0.8 }]}
        hitSlop={10}
      >
        <Text style={styles.heartText}>{isFav ? '♥' : '♡'}</Text>
      </Pressable>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.title}>
          {item.name}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {item.location}
        </Text>
        <View style={styles.row}>
          <RatingStars rating={item.rating} />
          <Text style={styles.price}>{formatMoney(item.pricePerNightFrom)} / night</Text>
        </View>

        <View style={styles.amenities}>
          <Text style={styles.amenityText} numberOfLines={1}>
            {item.amenities.map((a) => `• ${a}`).join('  ')}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  pressed: { opacity: 0.92 },
  image: { width: '100%', height: 140, backgroundColor: '#F3F4F6' },
  content: { padding: 12 },
  title: { fontSize: 15, fontWeight: '800', color: '#111827' },
  meta: { marginTop: 3, fontSize: 12, color: '#6B7280', fontWeight: '600' },
  row: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 12, color: '#111827', fontWeight: '800' },
  amenities: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  amenityText: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(17,24,39,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});
