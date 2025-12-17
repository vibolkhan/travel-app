// File: app/hotels/[id]/rooms.tsx

import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { RoomCard } from '../../../components/cards/RoomCard';
import { hotels } from '../../../data/hotels';
import { rooms } from '../../../data/rooms';
import { useBookingStore } from '../../../store/useBookingStore';

export default function RoomsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // hotelId
  const hotel = useMemo(() => hotels.find((h) => h.id === id), [id]);
  const list = useMemo(() => rooms.filter((r) => r.hotelId === id), [id]);

  const draft = useBookingStore((s) => s.draft);
  const setDraft = useBookingStore((s) => s.setDraft);

  if (!hotel) {
    return (
      <View style={styles.center}>
        <Text style={{ fontWeight: '800' }}>Hotel not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Rooms • {hotel.name}</Text>

        <FlatList
          style={{ marginTop: 12 }}
          data={list}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <RoomCard
              item={item}
              onSelect={() => {
                // Ensure we have a hotel draft (created in hotel detail)
                const base = draft?.kind === 'hotel' && draft.itemId === hotel.id ? draft : null;
                const next = {
                  kind: 'hotel' as const,
                  itemId: hotel.id,
                  roomId: item.id,
                  checkInISO: base?.checkInISO ?? new Date().toISOString().slice(0, 10),
                  checkOutISO: base?.checkOutISO ?? new Date().toISOString().slice(0, 10),
                  guests: base?.guests ?? 2,
                };
                setDraft(next);
                router.push('/booking/dates');
              }}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '900', color: '#111827' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
