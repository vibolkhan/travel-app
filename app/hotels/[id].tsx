import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { IconSymbol } from '../../components/IconSymbol'
import { BackButton } from '../../components/ui/BackButton'
import { Button } from '../../components/ui/Button'
import { RatingStars } from '../../components/ui/RatingStars'
import { useFavorites } from '../../context/FavoritesContext'
import { useThemeColors } from '../../hooks/useThemeColors'
import { Hotel } from '../../types/models'
import { fetchHotelById } from '../../utils/api'

// rooms import removed - not used in this screen




export default function HotelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const colors = useThemeColors()

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const insets = useSafeAreaInsets()

  useEffect(() => {
    loadHotel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadHotel = async () => {
    try {
      setLoading(true)
      const data = await fetchHotelById(id)
      setHotel(data)
    } catch (error) {
      console.error('Failed to load hotel:', error)
    } finally {
      setLoading(false)
    }
  }

  // const hotelRooms = rooms.filter((r) => r.hotelId === id) // unused

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!hotel) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Hotel not found</Text>
      </View>
    )
  }

  const isFav = isFavorite(hotel.id, 'hotel')
  const toggleFavorite = () => {
    if (isFav) removeFavorite(hotel.id, 'hotel')
    else addFavorite(hotel.id, 'hotel')
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: hotel.name,
          headerLeft: () => <BackButton fallbackHref="/hotels" />,
          headerRight: () => (
            <IconSymbol
              name={isFav ? 'heart.fill' : 'heart'}
              size={24}
              color={isFav ? colors.error ?? 'red' : colors.primary}
              style={{ marginRight: 16 }}
              onPress={toggleFavorite}
            />
          ),
        }}
      />

      {/* Overlay back button in case header isn't visible on some platforms */}
      <View style={{ position: 'absolute', top: insets.top + 8, left: 8, zIndex: 20 }}>
        <BackButton fallbackHref="/hotels" />
      </View>

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}> 
        <Image
          source={typeof hotel.image === 'string' ? { uri: hotel.image } : hotel.image}
          style={styles.image}
        />

        <View style={[styles.content, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>{hotel.name}</Text>
            <RatingStars rating={hotel.rating} />
          </View>

          <View style={styles.locationRow}>
            <IconSymbol name="mappin.and.ellipse" size={16} color={colors.subtext} />
            <Text style={[styles.location, { color: colors.subtext }]}>{hotel.location}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
          <View style={styles.amenities}>
            {hotel.amenities.map((amenity, index) => (
              <View
                key={index}
                style={[
                  styles.amenityTag,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.amenityText, { color: colors.text }]}>{amenity}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.subtext }]}>{hotel.description}</Text>

          <View style={styles.reviewsPreview}>
            <View style={styles.reviewHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
              <Text
                style={[styles.seeAll, { color: colors.primary }]}
                onPress={() =>
                  router.push({ pathname: '/reviews', params: { targetId: hotel.id } })
                }
              >
                See All
              </Text>
            </View>

            <View style={styles.ratingSummary}>
              <Text style={[styles.ratingParams, { color: colors.text }]}>{hotel.rating} / 5</Text>
              <Text style={[styles.reviewCount, { color: colors.subtext }]}>
                ({hotel.reviews} reviews)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.subtext }]}>Start from</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${hotel.pricePerNight}
            <Text style={[styles.perNight, { color: colors.subtext }]}>/night</Text>
          </Text>
        </View>

        <Button
          title="Select Details"
          onPress={() => router.push(`/hotels/${hotel.id}/rooms`)}
          style={styles.bookBtn}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  amenityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  amenityText: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  reviewsPreview: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAll: {
    fontWeight: '600',
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ratingParams: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  perNight: {
    fontSize: 14,
    fontWeight: '400',
  },
  bookBtn: {
    width: 150,
  },
})
