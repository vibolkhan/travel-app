// File: app/booking/summary.tsx

import React, { useMemo } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { formatMoney, round2 } from '../../utils/money';

import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { hotels } from '../../data/hotels';
import { rooms } from '../../data/rooms';
import { tours } from '../../data/tours';
import { useBookingStore } from '../../store/useBookingStore';
import type { BookingRecord } from '../../types/models';
import { diffNights } from '../../utils/dates';

export default function BookingSummary() {
  const draft = useBookingStore((s) => s.draft);
  const addBooking = useBookingStore((s) => s.addBooking);
  const clearDraft = useBookingStore((s) => s.clearDraft);

  const computed = useMemo(() => {
    if (!draft) return null;

    const nights = diffNights(draft.checkInISO, draft.checkOutISO);
    let base = 0;
    let title = '';

    if (draft.kind === 'hotel') {
      const hotel = hotels.find((h) => h.id === draft.itemId);
      const room = rooms.find((r) => r.id === draft.roomId);
      title = hotel?.name ?? 'Hotel';
      const price = room?.pricePerNight ?? hotel?.pricePerNight ?? 0;
      base = price * nights;
    } else {
      const tour = tours.find((t) => t.id === draft.itemId);
      title = tour?.title ?? 'Tour';
      base = (tour?.priceFrom ?? 0) * draft.guests;
    }

    const taxes = round2(base * 0.1);
    const fees = round2(4.5);
    const total = round2(base + taxes + fees);

    return { title, nights, base, taxes, fees, total };
  }, [draft]);

  const confirm = () => {
    if (!draft || !computed) return;

    // Mock payment
    Alert.alert('Payment', 'Mock payment success ✅', [
      {
        text: 'OK',
        onPress: () => {
          const booking: BookingRecord = {
            id: `BK-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
            kind: draft.kind,
            itemId: draft.itemId,
            roomId: draft.roomId,
            checkInISO: draft.checkInISO,
            checkOutISO: draft.checkOutISO,
            guests: draft.guests,
            base: computed.base,
            taxes: computed.taxes,
            fees: computed.fees,
            total: computed.total,
            status: 'upcoming',
            createdAtISO: new Date().toISOString(),
          };
          addBooking(booking);
          clearDraft();
          router.replace({ pathname: '/booking/success', params: { bookingId: booking.id } });
        },
      },
    ]);
  };

  if (!draft || !computed) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>Summary</Text>
          <Text style={{ marginTop: 12, color: '#6B7280', fontWeight: '700' }}>
            No booking draft found. Start from a hotel room or a tour.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Summary</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{computed.title}</Text>
          <Text style={styles.meta}>
            {draft.checkInISO} → {draft.checkOutISO} • {draft.guests} guest(s)
            {draft.kind === 'hotel' ? ` • ${computed.nights} night(s)` : ''}
          </Text>

          <View style={styles.line} />
          <Row label="Base" value={formatMoney(computed.base)} />
          <Row label="Taxes (10%)" value={formatMoney(computed.taxes)} />
          <Row label="Fees" value={formatMoney(computed.fees)} />
          <View style={styles.line} />
          <Row label="Total" value={formatMoney(computed.total)} bold />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment method</Text>
          <Text style={styles.meta}>Mock card • **** 4242</Text>
        </View>

        <View style={{ marginTop: 14 }}>
          <Button title="Confirm booking" onPress={confirm} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && { fontWeight: '900', color: '#111827' }]}>{label}</Text>
      <Text style={[styles.rowValue, bold && { fontWeight: '900', color: '#111827' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  card: { marginTop: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  meta: { marginTop: 6, color: '#6B7280', fontWeight: '700' },
  line: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { color: '#6B7280', fontWeight: '800' },
  rowValue: { color: '#111827', fontWeight: '800' },
});
