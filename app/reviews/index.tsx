import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'

import { ReviewItem } from '../../components/cards/ReviewItem'
import { Button } from '../../components/ui/Button'
import { useAppColors } from '../../hooks/useAppColors'
import { Review } from '../../types/models'
import { fetchReviews } from '../../utils/api'

export default function ReviewsScreen() {
  const { targetId } = useLocalSearchParams<{ targetId: string }>()
  const router = useRouter()
  const colors = useAppColors()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const data = await fetchReviews(targetId)
      setReviews(data)
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = targetId ? reviews.filter((r) => r.targetId === targetId) : reviews

  const averageRating =
    filteredReviews.length > 0
      ? (filteredReviews.reduce((acc, r) => acc + r.rating, 0) / filteredReviews.length).toFixed(1)
      : 'New'

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Reviews' }} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.rating, { color: colors.text }]}>{averageRating}</Text>
          <Text style={[styles.count, { color: colors.subtext }]}>{filteredReviews.length} reviews</Text>
        </View>

        <Button
          title="Write Review"
          onPress={() => router.push({ pathname: '/reviews/write', params: { targetId } })}
          style={styles.btn}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredReviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewItem review={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.subtext }]}>
              No reviews yet. Be the first!
            </Text>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rating: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
})
