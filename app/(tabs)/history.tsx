import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { useBooking } from '@/context/BookingContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from '../../components/ui/Chip';
import { EmptyState } from '../../components/ui/EmptyState';
import { Colors } from '../../constants/Colors';
import { Booking } from '../../types/models';
import { formatDate } from '../../utils/dates';

const TABS = ['pending', 'completed', 'cancelled'] as const;

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const themeColors = Colors[colorScheme];

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('pending');
  const { getBookingsByStatus, loading, refreshBookings } = useBooking();
  const bookings = getBookingsByStatus(activeTab);

  const themed = useMemo(
    () => ({
      bg: themeColors.background,
      card: themeColors.card,
      text: themeColors.text,
      subtext: themeColors.subtext,
      border: themeColors.border,
      primary: themeColors.primary,
      imageBg: colorScheme === 'dark' ? '#111' : '#eee',
    }),
    [themeColors, colorScheme]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return themed.primary;
      case 'completed':
        return colorScheme === 'dark' ? '#4caf50' : 'green';
      case 'cancelled':
        return colorScheme === 'dark' ? '#f44336' : 'red';
      default:
        return themed.subtext;
    }
  };

  const getTypeBadge = (type: string) => {
    const isHotel = type === 'Hotel';
    return {
      bg: isHotel ? (colorScheme === 'dark' ? '#1a237e' : '#e3f2fd') : (colorScheme === 'dark' ? '#4a148c' : '#f3e5f5'),
      text: isHotel ? (colorScheme === 'dark' ? '#bbdefb' : '#1565c0') : (colorScheme === 'dark' ? '#e1bee7' : '#7b1fa2'),
    };
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const badge = getTypeBadge(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: themed.card, borderColor: themed.border }]}
        activeOpacity={0.9}
        onPress={() => router.push(`/booking/${item.id}`)}
      >
        <Image
          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
          style={[styles.image, { backgroundColor: themed.imageBg }]}
        />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.cardTitle, { color: themed.text }]} numberOfLines={2}>
              {item.title}
            </Text>

            <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.typeText, { color: badge.text }]}>{item.type}</Text>
            </View>
          </View>

          <Text style={[styles.date, { color: themed.subtext }]}>
            {formatDate(item.checkIn)} {item.checkOut ? `- ${formatDate(item.checkOut)}` : ''}
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.price, { color: themed.text }]}>${item.totalPrice}</Text>
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.bg }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: themed.primary }]}>My Trips</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map(tab => (
          <Chip key={tab} label={tab} selected={activeTab === tab} onPress={() => setActiveTab(tab)} />
        ))}
      </View>

      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={refreshBookings}
        ListEmptyComponent={
          <EmptyState title="No Trips" message={`You have no ${activeTab.toLowerCase()} trips.`} icon="airplane" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: { paddingHorizontal: 20, marginTop: 10, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold' },

  tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 },

  listContent: { paddingHorizontal: 20, paddingBottom: 20 },

  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },

  image: { width: 100, height: '100%', resizeMode: 'cover' },

  content: { flex: 1, padding: 12, justifyContent: 'space-between' },

  cardTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8, marginBottom: 4 },

  date: { fontSize: 14 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },

  price: { fontWeight: 'bold' },

  status: { fontSize: 12, fontWeight: '600' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },

  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', flexShrink: 0 },

  typeText: { fontSize: 10, fontWeight: 'bold' },
});
