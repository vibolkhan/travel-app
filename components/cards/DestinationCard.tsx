// File: components/cards/DestinationCard.tsx

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatMoney } from '@/utils/money';
import React from 'react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { Destination } from '../../types/models';
import { RatingStars } from '../ui/RatingStars';

export function DestinationCard({
  item,
  onPress,
}: {
  item: Destination;
  onPress: () => void;
}) {
  const isFav = useFavoritesStore((s) => s.isFavorite('destination', item.id));
  const toggle = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Pressable
        onPress={() => toggle('destination', item.id)}
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
          {item.location} • {item.category}
        </Text>
        <View style={styles.row}>
          <RatingStars rating={item.rating} />
          <Text style={styles.price}>from {formatMoney(item.priceFrom)}</Text>
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
  image: { width: '100%', height: 130, backgroundColor: '#F3F4F6' },
  content: { padding: 12 },
  title: { fontSize: 15, fontWeight: '800', color: '#111827' },
  meta: { marginTop: 3, fontSize: 12, color: '#6B7280', fontWeight: '600' },
  row: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 12, color: '#111827', fontWeight: '800' },
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
