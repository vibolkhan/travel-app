import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native'
import { Booking, Hotel, Room, Tour } from '../../types/models'
import { fetchHotelById, fetchRoomsByHotelId, fetchTourById } from '../../utils/api'
import { formatDate, getDaysDifference } from '../../utils/dates'

import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconSymbol } from '../../components/IconSymbol'
import { BackButton } from '../../components/ui/BackButton'
import { Button } from '../../components/ui/Button'
import { Colors } from '../../constants/Colors'
import { useAuth } from "../../context/AuthContext"
import { useBooking } from '../../context/BookingContext'

export default function BookingSummaryScreen() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = Colors[colorScheme]
  const { type, targetId, detailId, checkIn, checkOut, guests } = params as any

  const { addBooking } = useBooking()
  const { isAuthenticated } = useAuth()

  const insets = useSafeAreaInsets()

  const [target, setTarget] = React.useState<Hotel | Tour | null>(null)
  const [room, setRoom] = React.useState<Room | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isHotel = type === 'Hotel'

  React.useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, detailId])

  const loadData = async () => {
    try {
      setLoading(true)
      if (isHotel) {
        const hotelData = await fetchHotelById(targetId)
        setTarget(hotelData)

        if (detailId) {
          const hotelRooms = await fetchRoomsByHotelId(targetId)
          const selectedRoom = hotelRooms.find((r) => r.id === detailId)
          setRoom(selectedRoom || null)
        }
      } else {
        const tourData = await fetchTourById(targetId)
        setTarget(tourData)
      }
    } catch (error) {
      console.error('Failed to load summary data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    )
  }

  if (!target) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: themeColors.background }]}>
        <Text style={{ color: themeColors.text }}>Details not found</Text>
      </View>
    )
  }

  const pricePerUnit = isHotel
    ? room
      ? room.pricePerNight
      : (target as Hotel).pricePerNight
    : (target as Tour).price

  const priceNumber = Number(pricePerUnit) || 0

    // compute nights from check-in/check-out to avoid relying on passed 'days' param
    const computedDays = Math.max(1, getDaysDifference(String(checkIn || ''), String(checkOut || '')))
    const quantity = computedDays
    const basePrice = priceNumber * quantity

  const taxes = Math.round(basePrice * 0.1)
  const fees = Math.round(basePrice * 0.05)
  const total = basePrice + taxes + fees

  const badgeBg = colorScheme === 'dark' ? themeColors.card : themeColors.card
  const badgeText = themeColors.primary
  const secureGreen = '#4bb543'

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      const booking: Partial<Booking> = {
        type: type as "Hotel" | "Tour",
        targetId,
        checkIn,
        checkOut: isHotel ? checkOut : checkIn,
        totalPrice: total,
        details: isHotel
          ? { roomId: detailId, numGuests: parseInt(guests || "1") }
          : { numGuests: parseInt(guests || "1") },
      };

      await addBooking(booking);
      router.push("/booking/success");
    } catch (e: any) {
      console.error(e);

      const msg = String(e?.message || "");
      const status = e?.status || e?.response?.status;

      if (msg === "NO_TOKEN" || msg === "UNAUTHORIZED" || status === 401) {
        router.replace({
          pathname: "/auth/login",
          params: { redirectTo: "/booking/summary" },
        });
        return;
      }

      alert(e.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Stack.Screen
        options={{
          title: 'Confirm Booking',
          headerStyle: { backgroundColor: themeColors.background },
          headerTintColor: themeColors.text,
          headerLeft: () => <BackButton fallbackHref='/(tabs)/history' />,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Product Card */}
        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border, shadowColor: themeColors.border }]}>
        <Image
          source={typeof target.image === "string" ? { uri: target.image } : (target.image as any)}
          style={styles.cardImage}
        />
          <View style={styles.cardInfo}>
            <View style={[styles.typeBadge, { backgroundColor: badgeBg, borderColor: themeColors.border }]}>
              <Text style={[styles.typeText, { color: badgeText }]}>{String(type).toUpperCase()}</Text>
            </View>

            <Text style={[styles.name, { color: themeColors.text }]}>{target.name}</Text>

            <View style={styles.locationRow}>
              <IconSymbol
                name={isHotel ? 'mappin.and.ellipse' : 'clock.fill'}
                size={14}
                color={themeColors.subtext}
              />
              <Text style={[styles.locationText, { color: themeColors.subtext }]}>
                {isHotel ? (target as Hotel).location : (target as Tour).duration}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Stay Details</Text>

          <View style={[styles.detailsGrid, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.detailItem}>
              <View style={[styles.iconCircle, { backgroundColor: badgeBg, borderColor: themeColors.border }]}>
                <IconSymbol name="calendar" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.detailLabel, { color: themeColors.subtext }]}>{isHotel ? 'Check-in' : 'Date'}</Text>
                <Text style={[styles.detailValue, { color: themeColors.text }]}>{formatDate(checkIn)}</Text>
              </View>
            </View>

            {isHotel && (
              <View style={styles.detailItem}>
                <View style={[styles.iconCircle, { backgroundColor: badgeBg, borderColor: themeColors.border }]}>
                  <IconSymbol name="calendar" size={20} color={themeColors.primary} />
                </View>
                <View>
                  <Text style={[styles.detailLabel, { color: themeColors.subtext }]}>Check-out</Text>
                  <Text style={[styles.detailValue, { color: themeColors.text }]}>{formatDate(checkOut)}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailItem}>
              <View style={[styles.iconCircle, { backgroundColor: badgeBg, borderColor: themeColors.border }]}>
                <IconSymbol name="person.2.fill" size={20} color={themeColors.primary} />
              </View>
              <View>
                <Text style={[styles.detailLabel, { color: themeColors.subtext }]}>Guests</Text>
                <Text style={[styles.detailValue, { color: themeColors.text }]}>{guests} People</Text>
              </View>
            </View>

            {isHotel && room && (
              <View style={[styles.detailItem, { width: '100%', marginTop: 12 }]}>
                <View style={[styles.iconCircle, { backgroundColor: badgeBg, borderColor: themeColors.border }]}>
                  <IconSymbol name="bed.double.fill" size={20} color={themeColors.primary} />
                </View>
                <View>
                  <Text style={[styles.detailLabel, { color: themeColors.subtext }]}>Room Selected</Text>
                  <Text style={[styles.detailValue, { color: themeColors.text }]}>
                    {room.roomType} (Floor {room.floor})
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Price Breakdown Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Price Summary</Text>

          <View style={[styles.priceContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: themeColors.subtext }]}>
                {`${priceNumber} x ${computedDays} nights`}
              </Text>
              <Text style={[styles.value, { color: themeColors.text }]}>${basePrice}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { color: themeColors.subtext }]}>Service Fees</Text>
              <Text style={[styles.value, { color: themeColors.text }]}>${fees}</Text>
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { color: themeColors.subtext }]}>Taxes</Text>
              <Text style={[styles.value, { color: themeColors.text }]}>${taxes}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: themeColors.text }]}>Total Price</Text>
              <Text style={[styles.totalValue, { color: themeColors.primary }]}>${total}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Payment Method</Text>

          <View style={[styles.paymentCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <View style={[styles.paymentIcon, { backgroundColor: badgeBg, borderColor: themeColors.border }]}>
              <IconSymbol name="creditcard" size={24} color={themeColors.primary} />
            </View>

            <View style={styles.paymentInfo}>
              <Text style={[styles.cardType, { color: themeColors.text }]}>Visa ending in 4242</Text>
              <Text style={[styles.cardExpiry, { color: themeColors.subtext }]}>Expires 12/26</Text>
            </View>

            <IconSymbol name="chevron.right" size={16} color={themeColors.border} />
          </View>
        </View>

        {/* Secure Payment Footer */}
        <View style={styles.secureBadge}>
          <IconSymbol name="lock.fill" size={12} color={secureGreen} />
          <Text style={[styles.secureText, { color: secureGreen }]}>SECURE PROTOCOL ENABLED</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
        <Button
          title={isSubmitting ? 'Processing...' : `Complete Booking • $${total}`}
          onPress={handleConfirm}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.payButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 20,
  },

  card: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
    // shadowColor applied inline
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: 120,
    height: "100%",
    resizeMode: "cover",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    marginLeft: 4,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 20,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  priceContainer: {
    borderRadius: 20,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
  },

  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  paymentInfo: {
    flex: 1,
  },
  cardType: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 13,
  },

  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  secureText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 1,
  },

  footer: {
    padding: 24,
    paddingBottom: 34,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  payButton: {
    borderRadius: 16,
    height: 56,
  },
})
