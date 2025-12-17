// File: app/tours/[id].tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addDaysISO, todayISO } from '../../utils/dates';

import { Button } from '../../components/ui/Button';
import { RatingStars } from '../../components/ui/RatingStars';
import { tours } from '../../data/tours';
import { useBookingStore } from '../../store/useBookingStore';
import { formatMoney } from '../../utils/money';

export default function TourDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tour = useMemo(() => tours.find((t) => t.id === id), [id]);

  const setDraft = useBookingStore((s) => s.setDraft);

  if (!tour) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: '800' }}>Tour not found.</Text>
      </View>
    );
  }

  const bookTour = () => {
    setDraft({
      kind: 'tour',
      itemId: tour.id,
      checkInISO: todayISO(),
      checkOutISO: addDaysISO(todayISO(), 1),
      guests: 2,
    });
    router.push('/booking/dates');
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 18 }}>
      <Image source={{ uri: tour.image }} style={styles.hero} />

      <View style={styles.body}>
        <Text style={styles.title}>{tour.title}</Text>
        <View style={styles.row}>
          <RatingStars rating={tour.rating} />
          <Text style={styles.price}>{formatMoney(tour.priceFrom)}/person</Text>
        </View>

        <Text style={styles.meta}>
          Duration: {tour.durationHours}h • Group size up to {tour.groupSize}
        </Text>

        <Text style={styles.section}>About</Text>
        <Text style={styles.text}>{tour.description}</Text>

        <Text style={styles.section}>Itinerary</Text>
        {tour.itinerary.map((x) => (
          <View key={x} style={styles.bullet}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>{x}</Text>
          </View>
        ))}

        <Text style={styles.section}>Included</Text>
        {tour.included.map((x) => (
          <Text key={x} style={styles.listText}>• {x}</Text>
        ))}

        <Text style={styles.section}>Not included</Text>
        {tour.notIncluded.map((x) => (
          <Text key={x} style={styles.listText}>• {x}</Text>
        ))}

        <View style={{ marginTop: 16 }}>
          <Button title="Book tour" onPress={bookTour} />
          <View style={{ height: 10 }} />
          <Button
            title="See reviews"
            variant="ghost"
            onPress={() => router.push({ pathname: '/reviews', params: { itemType: 'tour', itemId: tour.id } })}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  hero: { width: '100%', height: 260, backgroundColor: '#E5E7EB' },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  row: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: '900', color: '#111827' },
  meta: { marginTop: 8, color: '#6B7280', fontWeight: '700' },
  section: { marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: '900', color: '#111827' },
  text: { color: '#111827', lineHeight: 18, fontWeight: '600' },
  bullet: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#111827', marginRight: 10 },
  bulletText: { color: '#111827', fontWeight: '700' },
  listText: { color: '#111827', fontWeight: '700', marginBottom: 6 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
