// File: app/booking/success.tsx

import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Button } from '../../components/ui/Button';

export default function BookingSuccess() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.icon}>
          <MaterialIcons name="check-circle" size={42} color="#16A34A" />
        </View>
        <Text style={styles.title}>Booking confirmed</Text>
        <Text style={styles.subtitle}>Your booking ID is {bookingId ?? '—'}.</Text>

        <View style={{ height: 14 }} />
        <Button title="View bookings" onPress={() => router.push('/history')} />
        <View style={{ height: 10 }} />
        <Button title="Back to explore" variant="secondary" onPress={() => router.push('/explore')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827', textAlign: 'center' },
  subtitle: { marginTop: 6, color: '#6B7280', fontWeight: '700', textAlign: 'center' },
});
