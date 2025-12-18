import { fetchHotels, fetchHotelsByDestinationId } from '@/utils/api'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useColorScheme } from 'react-native'

import { Hotel } from '@/types/models'
import { SafeAreaView } from 'react-native-safe-area-context'
import { HotelCard } from '../../components/cards/HotelCard'
import { BackButton } from '../../components/ui/BackButton'
import { Chip } from '../../components/ui/Chip'
import { SearchBar } from '../../components/ui/SearchBar'
import { Colors } from '../../constants/Colors'

export default function HotelListScreen() {
  const router = useRouter()
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = Colors[colorScheme]

  const { destinationId, title } = useLocalSearchParams<{ destinationId?: string; title?: string }>()

  const [searchQuery, setSearchQuery] = useState('')
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const displayTitle = title || (destinationId ? 'Local Hotels' : 'Find Hotels')

  useEffect(() => {
    loadHotels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationId])

  const loadHotels = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = destinationId ? await fetchHotelsByDestinationId(destinationId) : await fetchHotels()
      setHotels(data)
    } catch (err) {
      setError('Failed to load hotels. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredHotels = hotels.filter((h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const headerOptions = {
    headerShown: true,
    title: displayTitle,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: themeColors.background },
    headerTintColor: themeColors.text,
    headerLeft: () => <BackButton fallbackHref="/explore" />,
  } as const

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center, { backgroundColor: themeColors.background }]} edges={['top']}>
        <Stack.Screen options={{ ...headerOptions, title: 'Find Hotels' }} />
        <ActivityIndicator size="large" color={themeColors.primary} />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center, { backgroundColor: themeColors.background }]} edges={['top']}>
        <Stack.Screen options={{ ...headerOptions, title: 'Find Hotels' }} />
        <Text style={[styles.errorText, { color: themeColors.error || themeColors.primary }]}>{error}</Text>
        <Chip label="Retry" selected={true} onPress={loadHotels} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <Stack.Screen options={headerOptions} />

      <View style={styles.searchContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search hotels..." />
      </View>

      <FlatList
        data={filteredHotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HotelCard hotel={item} onPress={() => router.push(`/hotels/${item.id}`)} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: themeColors.subtext }]}>No hotels found.</Text>}
        refreshing={loading}
        onRefresh={loadHotels}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
})
