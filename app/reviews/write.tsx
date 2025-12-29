import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { IconSymbol } from '../../components/IconSymbol'
import { Button } from '../../components/ui/Button'
import { reviews } from '../../data/reviews'
import { useThemeColors } from '../../hooks/useThemeColors'

export default function WriteReviewScreen() {
  const { targetId } = useLocalSearchParams<{ targetId: string }>()
  const router = useRouter()
  const colors = useThemeColors()

  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const submitReview = () => {
    reviews.unshift({
      id: `new-${Date.now()}`,
      targetId: targetId!,
      authorName: 'You',
      authorAvatar: 'https://via.placeholder.com/150',
      rating,
      date: new Date().toISOString().split('T')[0],
      text,
    })
    router.back()
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Write Review' }} />

      <Text style={[styles.label, { color: colors.text }]}>Rate your experience</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <IconSymbol
              name={star <= rating ? 'star.fill' : 'star'}
              size={32}
              color="#FFD700"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Share your thoughts</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        multiline
        placeholder="Tell us about your trip..."
        placeholderTextColor={colors.subtext}
        value={text}
        onChangeText={setText}
        textAlignVertical="top"
      />

      <Button
        title="Submit Review"
        onPress={submitReview}
        style={styles.submitBtn}
        disabled={!text}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  star: {
    marginRight: 8,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
    height: 150,
    marginBottom: 24,
    fontSize: 16,
  },
  submitBtn: {
    marginTop: 'auto',
  },
})
