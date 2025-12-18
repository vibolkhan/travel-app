import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme,
} from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/IconSymbol';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Colors';
import { useBooking } from '../../context/BookingContext';
import { formatDate } from '../../utils/dates';

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const themeColors = Colors[colorScheme];
  const { bookings, cancelBooking, loading } = useBooking();

  const booking = bookings.find(b => b.id === id);

  const themed = {
    containerBg: themeColors.background,
    text: themeColors.text,
    subtext: themeColors.subtext,
    border: themeColors.border,
    card: themeColors.card,
    primary: themeColors.primary,
    error: themeColors.error,

    // status text readable on badge backgrounds
    badgeText: colorScheme === 'dark' ? '#eee' : '#333',

    // optional: image placeholder background (if image fails / loads)
    imageBg: colorScheme === 'dark' ? '#111' : '#eee',
  };

  const handleCancel = async () => {
    console.log('Canceling booking:', booking?.id);

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to cancel this booking?');
      if (!confirmed) return;

      try {
        if (booking) await cancelBooking(booking.id);
        router.back();
      } catch (e) {
        console.error('Cancellation failed:', e);
      }
      return;
    }

    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          try {
            if (booking) await cancelBooking(booking.id);
            router.back();
          } catch (e) {
            console.error('Cancellation failed:', e);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themed.containerBg }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={themed.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themed.containerBg }]}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Booking Details',
            headerLeft: () => <BackButton fallbackHref="/(tabs)/history" />,
            headerStyle: { backgroundColor: themed.containerBg },
            headerTintColor: themed.text,
            headerShadowVisible: false,
          }}
        />
        <View style={styles.center}>
          <Text style={{ color: themed.text }}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.containerBg }]} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Booking Details',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: themed.containerBg },
          headerTintColor: themed.text,
          headerLeft: () => <BackButton />,
        }}
      />

      <ScrollView style={styles.content}>
        <Image
          source={typeof booking.image === 'string' ? { uri: booking.image } : booking.image}
          style={[styles.image, { backgroundColor: themed.imageBg }]}
        />

        <View style={[styles.header, { borderBottomColor: themed.border }]}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor:
                      booking.type === 'Hotel'
                        ? colorScheme === 'dark'
                          ? '#1a237e'
                          : '#e3f2fd'
                        : colorScheme === 'dark'
                          ? '#4a148c'
                          : '#f3e5f5',
                    marginRight: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color:
                        booking.type === 'Hotel'
                          ? colorScheme === 'dark'
                            ? '#bbdefb'
                            : '#1565c0'
                          : colorScheme === 'dark'
                            ? '#e1bee7'
                            : '#7b1fa2',
                    },
                  ]}
                >
                  {booking.type}
                </Text>
              </View>

              <Text style={[styles.title, { color: themed.text }]}>{booking.title}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status, colorScheme) }]}>
            <Text style={[styles.statusText, { color: themed.badgeText }]}>{booking.status}</Text>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: themed.border }]}>
          <Text style={[styles.label, { color: themed.subtext }]}>Dates</Text>
          <View style={styles.row}>
            <IconSymbol name="calendar" size={20} color={themed.subtext} />
            <Text style={[styles.value, { color: themed.text }]}>
              {formatDate(booking.checkIn)} {booking.checkOut ? `- ${formatDate(booking.checkOut)}` : ''}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: themed.border }]}>
          <Text style={[styles.label, { color: themed.subtext }]}>Total Price</Text>
          <Text style={[styles.value, styles.price, { color: themed.primary }]}>${booking.totalPrice}</Text>
        </View>

        <View style={[styles.section, { borderBottomColor: themed.border }]}>
          <Text style={[styles.label, { color: themed.subtext }]}>Booking Details</Text>

          <View style={[styles.detailCard, { backgroundColor: themed.card }]}>
            <View style={styles.detailItem}>
              <IconSymbol name="person.2.fill" size={18} color={themed.subtext} />
              <Text style={[styles.detailText, { color: themed.text }]}>
                <Text style={[styles.detailLabel, { color: themed.subtext }]}>Guests: </Text>
                <Text style={styles.detailValue}>
                  {booking.numGuests || booking.details?.numGuests || '1'} People
                </Text>
              </Text>
            </View>

            {booking.type === 'Hotel' && booking.details?.roomNumber && (
              <View style={styles.detailItem}>
                <IconSymbol name="bed.double.fill" size={18} color={themed.subtext} />
                <Text style={[styles.detailText, { color: themed.text }]}>
                  <Text style={[styles.detailLabel, { color: themed.subtext }]}>Room: </Text>
                  <Text style={styles.detailValue}>#{booking.details.roomNumber}</Text>
                </Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <IconSymbol name="creditcard" size={18} color={themed.subtext} />
              <Text style={[styles.detailText, { color: themed.text }]}>
                <Text style={[styles.detailLabel, { color: themed.subtext }]}>Total Paid: </Text>
                <Text style={styles.detailValue}>${booking.totalPrice}</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {booking.status === 'pending' && (
        <View style={[styles.footer, { borderTopColor: themed.border }]}>
          <Button title="Cancel Booking" onPress={handleCancel} style={{ backgroundColor: themed.error }} />
        </View>
      )}
    </SafeAreaView>
  );
}

const getStatusColor = (status: string, scheme: 'light' | 'dark') => {
  switch (status) {
    case 'pending':
      return scheme === 'dark' ? '#1a237e' : '#e3f2fd';
    case 'completed':
      return scheme === 'dark' ? '#1b5e20' : '#e8f5e9';
    case 'cancelled':
      return scheme === 'dark' ? '#b71c1c' : '#ffebee';
    default:
      return scheme === 'dark' ? '#333' : '#f5f5f5';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },

  image: { width: '100%', height: 200, resizeMode: 'cover' },

  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: 'bold', flexShrink: 1 },

  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 12, fontWeight: 'bold' },

  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 14, fontWeight: '600' },

  section: { padding: 20, borderBottomWidth: 1 },
  label: { fontSize: 14, marginBottom: 8 },

  row: { flexDirection: 'row', alignItems: 'center' },
  value: { fontSize: 16, marginLeft: 8, fontWeight: '500' },

  price: { fontWeight: 'bold', fontSize: 20, marginLeft: 0 },

  detailCard: { borderRadius: 12, padding: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailText: { fontSize: 16, marginLeft: 12 },
  detailLabel: { fontWeight: '400' },

  // keep text readable but theme comes from parent Text color
  detailValue: {},

  footer: { padding: 20, borderTopWidth: 1 },
});
