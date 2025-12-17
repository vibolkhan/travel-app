// File: app/booking/dates.tsx

import React, { useMemo } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { addDaysISO, diffNights, todayISO } from '../../utils/dates';

import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { useBookingStore } from '../../store/useBookingStore';

export default function BookingDates() {
  const draft = useBookingStore((s) => s.draft);
  const setDraft = useBookingStore((s) => s.setDraft);

  const safeDraft = useMemo(() => {
    if (draft) return draft;
    // Fallback (should not happen, but prevents route-not-found style crashes)
    return { kind: 'tour' as const, itemId: '', checkInISO: todayISO(), checkOutISO: addDaysISO(todayISO(), 1), guests: 2 };
  }, [draft]);

  const nights = diffNights(safeDraft.checkInISO, safeDraft.checkOutISO);

  const update = (patch: Partial<typeof safeDraft>) => {
    setDraft({ ...safeDraft, ...patch });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Select dates</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Check-in</Text>
          <View style={styles.row}>
            <Pressable style={styles.ctrl} onPress={() => update({ checkInISO: addDaysISO(safeDraft.checkInISO, -1) })}>
              <MaterialIcons name="remove" size={18} color="#111827" />
            </Pressable>
            <Text style={styles.value}>{safeDraft.checkInISO}</Text>
            <Pressable style={styles.ctrl} onPress={() => update({ checkInISO: addDaysISO(safeDraft.checkInISO, +1) })}>
              <MaterialIcons name="add" size={18} color="#111827" />
            </Pressable>
          </View>

          <View style={{ height: 12 }} />

          <Text style={styles.label}>Check-out</Text>
          <View style={styles.row}>
            <Pressable style={styles.ctrl} onPress={() => update({ checkOutISO: addDaysISO(safeDraft.checkOutISO, -1) })}>
              <MaterialIcons name="remove" size={18} color="#111827" />
            </Pressable>
            <Text style={styles.value}>{safeDraft.checkOutISO}</Text>
            <Pressable style={styles.ctrl} onPress={() => update({ checkOutISO: addDaysISO(safeDraft.checkOutISO, +1) })}>
              <MaterialIcons name="add" size={18} color="#111827" />
            </Pressable>
          </View>

          <View style={{ height: 12 }} />

          <Text style={styles.label}>Guests</Text>
          <View style={styles.row}>
            <Pressable style={styles.ctrl} onPress={() => update({ guests: Math.max(1, safeDraft.guests - 1) })}>
              <MaterialIcons name="remove" size={18} color="#111827" />
            </Pressable>
            <Text style={styles.value}>{safeDraft.guests}</Text>
            <Pressable style={styles.ctrl} onPress={() => update({ guests: Math.min(8, safeDraft.guests + 1) })}>
              <MaterialIcons name="add" size={18} color="#111827" />
            </Pressable>
          </View>

          <Text style={styles.note}>{nights} night(s)</Text>
        </View>

        <View style={{ marginTop: 14 }}>
          <Button title="Continue" onPress={() => router.push('/booking/summary')} disabled={!draft || !draft.itemId} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  card: { marginTop: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', padding: 12 },
  label: { color: '#6B7280', fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctrl: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 16, fontWeight: '900', color: '#111827' },
  note: { marginTop: 12, color: '#6B7280', fontWeight: '700' },
});
