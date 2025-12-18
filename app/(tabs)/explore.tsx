import { Stack, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme,
    useWindowDimensions,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import { DestinationCard } from '../../components/cards/DestinationCard'
import { Chip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/ui/EmptyState'
import { SearchBar } from '../../components/ui/SearchBar'
import { Colors } from '../../constants/Colors'
import { Destination } from '../../types/models'
import { fetchDestinations } from '../../utils/api'

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Culture'] as const

// Simple breakpoints for Expo web + mobile
const BREAKPOINTS = {
  sm: 600,  // phones
  md: 900,  // tablets / small web
  lg: 1200, // desktop
}

export default function ExploreScreen() {
  const router = useRouter()
  const colorScheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const themeColors = Colors[colorScheme]

  const { width } = useWindowDimensions()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof CATEGORIES)[number]>('All')

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const themed = useMemo(
    () => ({
      bg: themeColors.background,
      text: themeColors.text,
      subtext: themeColors.subtext,
      primary: themeColors.primary,
      error: themeColors.error,
    }),
    [themeColors]
  )

  // Layout rules by screen width
  const layout = useMemo(() => {
    const isSmall = width < BREAKPOINTS.sm
    const isMedium = width >= BREAKPOINTS.sm && width < BREAKPOINTS.md
    const isLarge = width >= BREAKPOINTS.md

    const numColumns = isLarge ? 3 : isMedium ? 2 : 1

    // Keep a nice max width on web/desktop
    const maxContentWidth = isLarge ? 1100 : isMedium ? 900 : undefined

    const horizontalPadding = isSmall ? 16 : 20
    const cardGap = isSmall ? 10 : 14

    return { isSmall, isMedium, isLarge, numColumns, maxContentWidth, horizontalPadding, cardGap }
  }, [width])

  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchDestinations()
      setDestinations(data)
    } catch (err) {
      setError('Failed to load destinations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory =
      selectedCategory === 'All' || dest.category === selectedCategory
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      dest.name.toLowerCase().includes(q) ||
      dest.location.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  // Card width inside a row (so 2/3 columns fit)
  const cardStyle = useMemo(() => {
    if (layout.numColumns === 1) return { width: '100%' as const }
    // Use flex basis so it behaves well on web too
    return {
      flex: 1,
      minWidth: 260,
    }
  }, [layout.numColumns])

  const renderItem = ({ item }: { item: Destination }) => (
    <View
      style={[
        styles.cardWrapper,
        {
          flex: layout.numColumns === 1 ? undefined : 1,
          paddingHorizontal: layout.numColumns === 1 ? 0 : layout.cardGap / 2,
          marginBottom: layout.cardGap,
        },
      ]}
    >
      <DestinationCard
        destination={item}
        width="100%"
        onPress={() => router.push(`/explore/${item.id}`)}
      />
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, styles.center, { backgroundColor: themed.bg }]}
        edges={['top']}
      >
        <ActivityIndicator size="large" color={themed.primary} />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, styles.center, { backgroundColor: themed.bg }]}
        edges={['top']}
      >
        <Text style={[styles.errorText, { color: themed.error }]}>{error}</Text>
        <Chip label="Retry" selected={true} onPress={loadDestinations} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themed.bg }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Centered content wrapper for web/large screens */}
      <View
        style={[
          styles.contentWrapper,
          {
            paddingHorizontal: layout.horizontalPadding,
            maxWidth: layout.maxContentWidth,
          },
        ]}
      >
        <View style={[styles.header, { marginBottom: layout.isSmall ? 14 : 20 }]}>
          <Text style={[styles.title, { color: themed.subtext }]}>Explore the</Text>
          <Text style={[styles.subtitle, { color: themed.primary }]}>
            Beautiful World!
          </Text>
        </View>

        <View style={[styles.searchContainer, { marginBottom: layout.isSmall ? 14 : 20 }]}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search destinations..."
          />
        </View>

        <View style={styles.categories}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoriesContent, { paddingBottom: layout.isSmall ? 8 : 10 }]}
          >
            {CATEGORIES.map(cat => (
              <Chip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* FlatList outside wrapper so it can scroll full height, but padding matches wrapper */}
      <FlatList
        // IMPORTANT: changing numColumns needs a different key to recalc layout
        key={layout.numColumns}
        data={filteredDestinations}
        numColumns={layout.numColumns}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: layout.horizontalPadding,
            maxWidth: layout.maxContentWidth,
            alignSelf: 'center',
            paddingBottom: 80,
          },
        ]}
        columnWrapperStyle={
          layout.numColumns > 1
            ? { marginHorizontal: -(layout.cardGap / 2) } // cancels cardWrapper paddingHorizontal
            : undefined
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState title="No destinations found" message="" />}
        refreshing={loading}
        onRefresh={loadDestinations}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Centers the top content and limits width on web/desktop
  contentWrapper: {
    alignSelf: 'center',
    width: '100%',
  },

  header: { marginTop: 10 },
  title: { fontSize: 24 },
  subtitle: { fontSize: 28, fontWeight: 'bold' },

  searchContainer: {},

  categories: { marginBottom: 10 },
  categoriesContent: { paddingTop: 2 },

  listContent: {
    width: '100%',
    alignSelf: 'center',
  },

  cardWrapper: {},

  emptyText: { textAlign: 'center', marginTop: 20 },

  center: { justifyContent: 'center', alignItems: 'center' },

  errorText: { fontSize: 16, marginBottom: 20 },
})
