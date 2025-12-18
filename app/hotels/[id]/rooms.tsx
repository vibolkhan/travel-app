import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'

import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RoomCard } from '../../../components/cards/RoomCard'
import { BackButton } from '../../../components/ui/BackButton'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useThemeColors } from '../../../hooks/useThemeColors'
import { Room } from '../../../types/models'
import { fetchRoomsByHotelId } from '../../../utils/api'

export default function RoomSelectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const colors = useThemeColors()
  const insets = useSafeAreaInsets()

  const headerTopPadding = (insets.top ?? 0) + 12

  const [hotelRooms, setHotelRooms] = React.useState<Room[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    loadRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadRooms = async () => {
    try {
      setLoading(true)
      const data = await fetchRoomsByHotelId(id)
      setHotelRooms(data)
    } catch (error) {
      console.error('Failed to load rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Stack.Screen options={{ title: 'Select Room', headerLeft: () => <BackButton fallbackHref='/hotels' /> }} />

      <View style={[styles.headerRow, { paddingTop: headerTopPadding }]}>
        <BackButton fallbackHref="/explore" />
        <Text style={[styles.listTitle, { color: colors.text }]}>List Rooms</Text>
      </View>

      <FlatList
        data={hotelRooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard
            room={item}
            onSelect={() =>
              router.push({
                pathname: '/booking/dates',
                params: { type: 'Hotel', targetId: id, detailId: item.id },
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState title="No rooms available" message="Please check back later." />}
      />
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
  },
  listContent: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
})
