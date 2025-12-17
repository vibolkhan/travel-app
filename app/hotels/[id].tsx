// File: app/hotels/[id].tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addDaysISO, todayISO } from '../../utils/dates';

import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { RatingStars } from '../../components/ui/RatingStars';
import { hotels } from '../../data/hotels';
import { useBookingStore } from '../../store/useBookingStore';
import { formatMoney } from '../../utils/money';

export default function HotelDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hotel = useMemo(() => hotels.find((h) => h.id === id), [id]);

  const [guests, setGuests] = useState(2);
  const [checkInISO, setCheckInISO] = useState(todayISO());
  const [checkOutISO, setCheckOutISO] = useState(addDaysISO(todayISO(), 2));

  const setDraft = useBookingStore((s) => s.setDraft);

  if (!hotel) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: '800' }}>Hotel not found.</Text>
      </View>
    );
  }

  const startBooking = () => {
    // Draft will be finalized after choosing a room
    setDraft({
      kind: 'hotel',
      itemId: hotel.id,
      roomId: undefined,
      checkInISO,
      checkOutISO,
      guests,
    });
    router.push({ pathname: '/hotels/[id]/rooms', params: { id: hotel.id } });
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 18 }}>
      <Image source={{ uri: hotel.image }} style={styles.hero} />

      <View style={styles.body}>
        <Text style={styles.title}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>

        <View style={styles.row}>
          <RatingStars rating={hotel.rating} />
          <Text style={styles.price}>{formatMoney(hotel.pricePerNight)}/night</Text>
        </View>

        <Text style={styles.section}>Amenities</Text>
        <View style={styles.pills}>
          {hotel.amenities.map((a) => (
            <View key={a} style={styles.pill}>
              <Text style={styles.pillText}>{a}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Dates & Guests</Text>
        <View style={styles.selectorRow}>
          <Pressable style={styles.selector} onPress={() => setCheckInISO(addDaysISO(checkInISO, -1))}>
            <MaterialIcons name="remove" size={18} color="#111827" />
            <Text style={styles.selectorText}>Check-in: {checkInISO}</Text>
          </Pressable>
          <Pressable style={styles.selector} onPress={() => setCheckInISO(addDaysISO(checkInISO, +1))}>
            <MaterialIcons name="add" size={18} color="#111827" />
            <Text style={styles.selectorText}>+1 day</Text>
          </Pressable>
        </View>

        <View style={styles.selectorRow}>
          <Pressable style={styles.selector} onPress={() => setCheckOutISO(addDaysISO(checkOutISO, -1))}>
            <MaterialIcons name="remove" size={18} color="#111827" />
            <Text style={styles.selectorText}>Check-out: {checkOutISO}</Text>
          </Pressable>
          <Pressable style={styles.selector} onPress={() => setCheckOutISO(addDaysISO(checkOutISO, +1))}>
            <MaterialIcons name="add" size={18} color="#111827" />
            <Text style={styles.selectorText}>+1 day</Text>
          </Pressable>
        </View>

        <View style={styles.selectorRow}>
          <Pressable style={styles.selector} onPress={() => setGuests((g) => Math.max(1, g - 1))}>
            <MaterialIcons name="remove" size={18} color="#111827" />
            <Text style={styles.selectorText}>Guests: {guests}</Text>
          </Pressable>
          <Pressable style={styles.selector} onPress={() => setGuests((g) => Math.min(8, g + 1))}>
            <MaterialIcons name="add" size={18} color="#111827" />
            <Text style={styles.selectorText}>Add guest</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>About</Text>
        <Text style={styles.text}>{hotel.description}</Text>

        <View style={{ marginTop: 16 }}>
          <Button title="Choose a room" onPress={startBooking} />
          <View style={{ height: 10 }} />
          <Button
            title="See reviews"
            variant="ghost"
            onPress={() => router.push({ pathname: '/reviews', params: { itemType: 'hotel', itemId: hotel.id } })}
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
  pills: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F3F4F6', marginRight: 6, marginBottom: 6 },
  pillText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  selectorRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  selector: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorText: { marginLeft: 8, fontWeight: '800', color: '#111827' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
