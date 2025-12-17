// File: app/(tabs)/history.tsx

import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { hotels } from '../../data/hotels';
import { tours } from '../../data/tours';
import { useBookingStore } from '../../store/useBookingStore';
import { formatShortDate } from '../../utils/dates';
import { formatMoney } from '../../utils/money';

type Tab = 'Upcoming' | 'Completed' | 'Cancelled';
const tabs: Tab[] = ['Upcoming', 'Completed', 'Cancelled'];

export default function HistoryTab() {
  const [tab, setTab] = useState<Tab>('Upcoming');
  const bookings = useBookingStore((s) => s.bookings);

  const filtered = useMemo(() => {
    const status = tab.toLowerCase() as 'upcoming' | 'completed' | 'cancelled';
    return bookings.filter((b) => b.status === status);
  }, [bookings, tab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Bookings</Text>

        <View style={{ marginTop: 10 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tabs}
            keyExtractor={(x) => x}
            renderItem={({ item }) => <Chip label={item} selected={item === tab} onPress={() => setTab(item)} />}
          />
        </View>

        {filtered.length === 0 ? (
          <View style={{ marginTop: 30 }}>
            <EmptyState icon="event-note" title="No bookings here" subtitle="Your booking history will show up once you book a hotel or tour." />
          </View>
        ) : (
          <FlatList
            style={{ marginTop: 14 }}
            data={filtered}
            keyExtractor={(x) => x.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            renderItem={({ item }) => {
              const title =
                item.kind === 'hotel'
                  ? hotels.find((h) => h.id === item.itemId)?.name ?? 'Hotel'
                  : tours.find((t) => t.id === item.itemId)?.title ?? 'Tour';

              return (
                <View style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={styles.badge}>{tab}</Text>
                  </View>
                  <Text style={styles.meta}>
                    {formatShortDate(item.checkInISO)} → {formatShortDate(item.checkOutISO)} • {item.guests} guest(s)
                  </Text>
                  <View style={[styles.row, { marginTop: 10 }]}>
                    <Text style={styles.total}>{formatMoney(item.total)}</Text>
                    <Pressable style={styles.smallBtn} onPress={() => {}}>
                      <Text style={styles.smallBtnText}>Details</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  card: { borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#111827', flex: 1, marginRight: 10 },
  meta: { marginTop: 6, color: '#6B7280', fontWeight: '600' },
  total: { fontSize: 16, fontWeight: '900', color: '#111827' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F3F4F6', color: '#111827', fontWeight: '800', fontSize: 12 },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#111827' },
  smallBtnText: { color: '#FFFFFF', fontWeight: '800' },
});
