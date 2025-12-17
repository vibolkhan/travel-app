// File: app/reviews/index.tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ReviewItem } from '../../components/cards/ReviewItem';
import { Button } from '../../components/ui/Button';
import { RatingStars } from '../../components/ui/RatingStars';
import { useBookingStore } from '../../store/useBookingStore';

export default function ReviewsIndex() {
  const { itemType, itemId } = useLocalSearchParams<{ itemType: 'destination' | 'hotel' | 'tour'; itemId: string }>();
  const getReviewsFor = useBookingStore((s) => s.getReviewsFor);

  const list = useMemo(() => getReviewsFor(itemType, itemId), [getReviewsFor, itemType, itemId]);
  const avg = useMemo(() => {
    if (list.length === 0) return 0;
    const sum = list.reduce((a, r) => a + r.rating, 0);
    return sum / list.length;
  }, [list]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
          <Button
            title="Write"
            onPress={() => router.push({ pathname: '/reviews/write', params: { itemType, itemId } })}
            style={{ height: 40 }}
          />
        </View>

        <View style={styles.summary}>
          <Text style={styles.big}>{avg.toFixed(1)}</Text>
          <View>
            <RatingStars rating={avg} size={18} />
            <Text style={styles.small}>{list.length} review(s)</Text>
          </View>
        </View>

        <FlatList
          style={{ marginTop: 12 }}
          data={list}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => <ReviewItem item={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  summary: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  big: { fontSize: 40, fontWeight: '900', color: '#111827', marginRight: 14 },
  small: { marginTop: 4, color: '#6B7280', fontWeight: '700' },
});
