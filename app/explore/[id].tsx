import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native'
import { Destination, Hotel, Tour } from '../../types/models'
import { fetchDestinationById, fetchHotelsByDestinationId, fetchToursByDestinationId } from '../../utils/api'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HotelCard } from '../../components/cards/HotelCard'
import { TourCard } from '../../components/cards/TourCard'
import { IconSymbol } from '../../components/IconSymbol'
import { BackButton } from '../../components/ui/BackButton'
import { Button } from '../../components/ui/Button'
import { Colors } from '../../constants/Colors'
import { useFavorites } from '../../context/FavoritesContext'

const BREAKPOINTS = { sm: 600, md: 900, lg: 1200 }

export default function DestinationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const themeColors = Colors[colorScheme]

  const { width } = useWindowDimensions()

  const insets = useSafeAreaInsets()

  const layout = useMemo(() => {
    const isSmall = width < BREAKPOINTS.sm
    const isWide = width >= BREAKPOINTS.md

    return {
      isSmall,
      isWide,
      horizontalPadding: isSmall ? 16 : 20,
      contentMaxWidth: isWide ? 1100 : undefined, // nice centered web
      imageHeight: isWide ? 360 : 250,
      gutter: isSmall ? 12 : 16,
      // two-column section layout on web/tablet
      sectionColumns: isWide ? 2 : 1,
    }
  }, [width])

  const [destination, setDestination] = useState<Destination | null>(null)
  const [tours, setTours] = useState<Tour[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  useEffect(() => {
    loadDestinationData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadDestinationData = async () => {
    try {
      setLoading(true)
      const [destData, toursData, hotelsData] = await Promise.all([
        fetchDestinationById(id),
        fetchToursByDestinationId(id),
        fetchHotelsByDestinationId(id),
      ])
      setDestination(destData)
      setTours(toursData || [])
      setHotels(hotelsData || [])
    } catch (error) {
      console.error('Failed to load destination:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    )
  }

  if (!destination) {
    return (
      <View style={[styles.center, { backgroundColor: themeColors.background }]}>
        <Text style={{ color: themeColors.text }}>Destination not found</Text>
      </View>
    )
  }

  const destinationHotels = hotels
  const destinationTours = tours

  const isFav = isFavorite(destination.id, 'destination')

  const toggleFavorite = () => {
    if (isFav) removeFavorite(destination.id, 'destination')
    else addFavorite(destination.id, 'destination')
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: destination.name,
          headerStyle: { backgroundColor: themeColors.background },
          headerTintColor: themeColors.text,
          headerLeft: () => <BackButton fallbackHref='/(tabs)/explore' />,
          headerRight: () => (
            <IconSymbol
              name={isFav ? 'heart.fill' : 'heart'}
              size={24}
              color={isFav ? 'red' : themeColors.primary}
              style={{ marginRight: 16 }}
              onPress={toggleFavorite}
            />
          ),
        }}
      />

      <View style={{ position: 'absolute', top: insets.top + 8, left: 8, zIndex: 20 }}>
        <BackButton fallbackHref='/(tabs)/explore' />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image: full-bleed on small screens, centered card on wide screens */}
        {!layout.isWide && (
          <Image
            source={typeof destination.image === 'string' ? { uri: destination.image } : destination.image}
            style={[styles.fullBleedImage, { height: layout.imageHeight, width }]} 
          />
        )}

        {/* Centered wrapper so web doesn't stretch too wide */}
        <View
          style={[
            styles.page,
            {
              paddingHorizontal: layout.horizontalPadding,
              maxWidth: layout.contentMaxWidth,
            },
          ]}
        >
          {layout.isWide && (
            <Image
              source={typeof destination.image === 'string' ? { uri: destination.image } : destination.image}
              style={[styles.image, { height: layout.imageHeight, borderRadius: layout.isWide ? 20 : 0 }]}
            />
          )}

          <View
            style={[
              styles.content,
              {
                backgroundColor: themeColors.background,
                borderTopColor: themeColors.border,
                padding: layout.isSmall ? 16 : 20,
                marginTop: layout.isWide ? 16 : -20, // overlap content onto image on mobile
                borderRadius: layout.isWide ? 20 : 24,
              },
            ]}
          >
            <View style={styles.header}>
              <Text
                style={[
                  styles.name,
                  { color: themeColors.text, fontSize: layout.isSmall ? 22 : 26 },
                ]}
              >
                {destination.name}
              </Text>

              <View style={[styles.ratingBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <IconSymbol name="star.fill" size={16} color="#FFD700" />
                <Text style={[styles.ratingText, { color: themeColors.text }]}>{destination.rating}</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <IconSymbol name="mappin.and.ellipse" size={16} color={themeColors.subtext} />
              <Text style={[styles.location, { color: themeColors.subtext }]}>{destination.location}</Text>
            </View>

            <Text style={[styles.description, { color: themeColors.subtext }]}>
              {destination.description}
            </Text>

            {/* On wide screens, show Hotels and Tours side-by-side */}
            <View
              style={[
                styles.sectionsRow,
                layout.sectionColumns === 2 && { flexDirection: 'row', gap: layout.gutter },
              ]}
            >
              {/* Hotels */}
              <View style={[styles.sectionCol, layout.sectionColumns === 2 && { flex: 1 }]}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Popular Hotels</Text>
                  <Button
                    title="See All"
                    variant="outline"
                    onPress={() =>
                      router.push({
                        pathname: '/hotels',
                        params: { destinationId: id, title: `Hotels in ${destination.name}` },
                      })
                    }
                    style={styles.seeAllBtn}
                  />
                </View>

                {destinationHotels.length > 0 ? (
                  destinationHotels.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} onPress={() => router.push(`/hotels/${hotel.id}`)} />
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
                    No hotels found in this area.
                  </Text>
                )}
              </View>

              {/* Tours */}
              <View style={[styles.sectionCol, layout.sectionColumns === 2 && { flex: 1 }]}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Top Tours</Text>
                  <Button
                    title="See All"
                    variant="outline"
                    onPress={() =>
                      router.push({
                        pathname: '/tours',
                        params: { destinationId: id, title: `Tours in ${destination.name}` },
                      })
                    }
                    style={styles.seeAllBtn}
                  />
                </View>

                {destinationTours.length > 0 ? (
                  destinationTours.map(tour => (
                    <TourCard key={tour.id} tour={tour} onPress={() => router.push(`/tours/${tour.id}`)} />
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: themeColors.subtext }]}>
                    No tours found in this area.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  page: {
    width: '100%',
    alignSelf: 'center',
  },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  image: {
    width: '100%',
    resizeMode: 'cover',
  },

  fullBleedImage: {
    resizeMode: 'cover',
  },

  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },

  name: { fontWeight: 'bold', flexShrink: 1 },

  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },

  ratingText: { marginLeft: 4, fontWeight: '600' },

  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },

  location: { fontSize: 16, marginLeft: 6 },

  description: { fontSize: 16, lineHeight: 24, marginBottom: 12 },

  sectionsRow: {
    marginTop: 6,
  },

  sectionCol: {
    minWidth: 0, // helps flex layout on web
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },

  sectionTitle: { fontSize: 20, fontWeight: 'bold' },

  seeAllBtn: { paddingVertical: 4, paddingHorizontal: 12 },

  emptyText: { fontStyle: 'italic', marginBottom: 16 },
})
