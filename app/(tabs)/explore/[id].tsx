// File: app/explore/[id].tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { RatingStars } from '../../../components/ui/RatingStars';
import { destinations } from '../../../data/destinations';
import { formatMoney } from '../../../utils/money';

export default function DestinationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dest = useMemo(() => destinations.find((d) => d.id === id), [id]);

  if (!dest) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: '800' }}>Destination not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 18 }}>
      <Image source={{ uri: dest.image }} style={styles.hero} />

      <View style={styles.body}>
        <Text style={styles.title}>{dest.name}</Text>
        <Text style={styles.location}>{dest.location}</Text>

        <View style={styles.row}>
          <RatingStars rating={dest.rating} />
          <Text style={styles.price}>{formatMoney(dest.priceFrom)}/day</Text>
        </View>

        <Text style={styles.section}>About</Text>
        <Text style={styles.text}>{dest.description}</Text>

        <Text style={styles.section}>Highlights</Text>
        {dest.highlights.map((h) => (
          <View key={h} style={styles.bullet}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>{h}</Text>
          </View>
        ))}

        <View style={{ marginTop: 16 }}>
          <Button
            title="View hotels"
            onPress={() => router.push({ pathname: '/hotels', params: { destinationId: dest.id } })}
          />
          <View style={{ height: 10 }} />
          <Button
            title="View tours"
            variant="secondary"
            onPress={() => router.push({ pathname: '/tours', params: { destinationId: dest.id } })}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            title="See reviews"
            variant="ghost"
            onPress={() => router.push({ pathname: '/reviews', params: { itemType: 'destination', itemId: dest.id } })}
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
  location: { marginTop: 4, color: '#6B7280', fontWeight: '700' },
  row: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: '900', color: '#111827' },
  section: { marginTop: 16, marginBottom: 8, fontSize: 16, fontWeight: '900', color: '#111827' },
  text: { color: '#111827', lineHeight: 18, fontWeight: '600' },
  bullet: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#111827', marginRight: 10 },
  bulletText: { color: '#111827', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
