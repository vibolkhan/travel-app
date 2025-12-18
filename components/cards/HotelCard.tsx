import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'

import React from 'react'
import { useAppColors } from '../../hooks/useAppColors'
import { Hotel } from '../../types/models'
import { IconSymbol } from '../IconSymbol'
import { RatingStars } from '../ui/RatingStars'

interface HotelCardProps {
  hotel: Hotel
  onPress: () => void
}

export function HotelCard({ hotel, onPress }: HotelCardProps) {
  const colors = useAppColors()
  const scheme = useColorScheme() ?? 'light'

  const shadowStyle =
    scheme === 'dark'
      ? {
        shadowColor: colors.border,
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }
      : {
        shadowColor: colors.border,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }

    return (
    <TouchableOpacity
      style={[
        styles.container,
        shadowStyle,
        { backgroundColor: colors.text, borderColor: colors.card },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={typeof hotel.image === 'string' ? { uri: hotel.image } : hotel.image}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.name, { color: colors.card }]} numberOfLines={1}>
            {hotel.name}
          </Text>
          <RatingStars rating={hotel.rating} />
        </View>

        <View style={styles.locationRow}>
          <IconSymbol name="mappin.and.ellipse" size={14} color={colors.card} />
          <Text style={[styles.location, { color: colors.card }]} numberOfLines={1}>
            {hotel.location}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>
            ${hotel.pricePerNight}
            <Text style={[styles.perNight, { color: colors.subtext }]}>/night</Text>
          </Text>

          <View style={[styles.badge, { backgroundColor: colors.card, borderColor: colors.card }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{hotel.reviews} reviews</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    height: 100,
    borderWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  perNight: {
    fontSize: 12,
    fontWeight: '400',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeText: {
    fontSize: 12,
  },
})
