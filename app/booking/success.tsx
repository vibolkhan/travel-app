import { Stack, useRouter } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import React from 'react'
import { IconSymbol } from '../../components/IconSymbol'
import { Button } from '../../components/ui/Button'
import { useAppColors } from '../../hooks/useAppColors'

export default function BookingSuccessScreen() {
  const router = useRouter()
  const colors = useAppColors()

  const handleHome = () => {
    router.replace('/(tabs)/explore')
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <IconSymbol name="checkmark.circle.fill" size={80} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed!</Text>

        <Text style={[styles.message, { color: colors.subtext }]}>
          Your trip has been successfully booked. You can view details in your trips history.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Back to Home" onPress={handleHome} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  footer: {
    paddingBottom: 20,
  },
})
